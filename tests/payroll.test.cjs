const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const payroll=require('../zuo-payroll.js');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const fixes=fs.readFileSync(path.join(__dirname,'../zuo-fixes.js'),'utf8');
const source=fs.readFileSync(path.join(__dirname,'../zuo-payroll.js'),'utf8');
const part=(text,start,end)=>{
  const offset=text.indexOf(start),limit=text.indexOf(end,offset);
  assert.ok(offset>=0&&limit>offset,`Missing source section: ${start}`);
  return text.slice(offset,limit);
};
const emp={id:'employee',name:'Test',rate:10320,holidayRate:1000,empType:'기타'};
const minutes=workMin=>({workMin});
const current={1:minutes(300),5:minutes(899),12:minutes(900),26:minutes(6000)};
const previous={28:minutes(300),29:minutes(300)};

test('October retains four Sunday-based candidates and excludes only weeks below 900 minutes',()=>{
  const result=payroll.calculate(emp,'2026-10',current,previous);
  assert.equal(result.candidateCount,4);
  assert.equal(result.eligibleCount,2);
  assert.deepEqual(result.excluded.map(w=>[w.start,w.end,w.minutes]),[
    ['2026-10-05','2026-10-11',899],['2026-10-19','2026-10-25',0]
  ]);
  assert.ok(payroll.notes(result,2).some(note=>note.includes('14시간 59분')&&note.includes('15시간 미만')));
});

test('previous-month hours count, while the last unfinished week belongs to the next payroll month',()=>{
  assert.equal(payroll.calculate(emp,'2026-10',{1:minutes(300)},previous).eligibleCount,1);
  assert.equal(payroll.calculate(emp,'2026-10',{26:minutes(900)}).eligibleCount,0);
  assert.equal(payroll.calculate(emp,'2026-11',{}, {26:minutes(900)}).eligibleCount,1);
});

test('December-to-January boundary and leap-year/five-Sunday calendars',()=>{
  const january=payroll.calculate(emp,'2027-01',{}, {28:minutes(900)});
  assert.equal(january.eligibleCount,1);
  assert.equal(january.candidateCount,5);
  assert.equal(payroll.calculate(emp,'2032-02',{}).candidateCount,5);
});

test('zero, null, blank, missing and negative configured rates suppress even saved confirmed allowances',()=>{
  for(const rate of [0,null,'',undefined,-1]){
    const employee={...emp,holidayRate:rate};
    const result=payroll.calculate(employee,'2026-10',current,previous);
    assert.deepEqual(payroll.values(employee,{confirmed:true,holiRateVal:50568,weekCntVal:4},result),{rate:0,count:0});
    assert.match(payroll.notes(result,0)[0],/미적용/);
  }
});

test('saved zero/manual reductions persist and excess saved counts cannot restore excluded weeks',()=>{
  const result=payroll.calculate(emp,'2026-10',current,previous);
  assert.deepEqual(payroll.values(emp,null,result),{rate:1000,count:2});
  assert.equal(payroll.values(emp,{weekCntVal:4,confirmed:true},result).count,2);
  assert.equal(payroll.values(emp,{weekCntVal:0},result).count,0);
  assert.equal(payroll.values(emp,{weekCntVal:1},result).count,1);
  assert.ok(payroll.notes(result,1).some(note=>note.includes('관리자 조정')));
});

test('invalid or missing work-minute values cannot create eligible weeks',()=>{
  assert.equal(payroll.calculate(emp,'2026-10',{5:{hours:15}}).eligibleCount,1);
  assert.equal(payroll.calculate(emp,'2026-10',{5:{workMin:0,hours:20}}).eligibleCount,0);
  assert.equal(payroll.calculate(emp,'2026-10',{5:{workMin:-900},6:{hours:Infinity}}).eligibleCount,0);
  assert.throws(()=>payroll.calculate(emp,'2026-13',{}));
});

function environment(employee={...emp},saved=null){
  const fields={},requests=[],writes=[];
  const buttons=[{style:{}}];
  const element=id=>fields[id]||(fields[id]={value:'',textContent:'',style:{}});
  const records={employees:[],workHours:[],payslips:[],workConfirm:[]};
  for(const [period,days] of [['2026-10',current],['2026-09',previous]]){
    for(const [day,data] of Object.entries(days))records.workHours.push({id:`${period}-${day}`,cafeId:'cafe',empId:employee.id,period,day:Number(day),...data});
  }
  if(saved)records.payslips.push({id:'slip',cafeId:'cafe',empId:employee.id,period:'2026-10',bonus:500,bonusMemo:'Bonus',etc:200,etcMemo:'Other',...saved});
  let sequence=0,fail=false;
  const context={console,payY:2026,payM:9,employees:[employee],currentCafe:{id:'cafe',name:'Test'},
    psCurrentEmp:null,psHolidayAssessment:null,psHoliRateVal:0,psWeekCntVal:0,loadedPayslip52:saved,
    currentWorkerEmp:null,isAdminMode:true,isWorkerViewMode:false,
    document:{getElementById:element,querySelectorAll:()=>buttons,querySelector:()=>null},
    getCurrencyValue:id=>Number(String(element(id).value).replaceAll(',',''))||0,
    setCurrencyValue:(id,value)=>{element(id).value=String(value);},
    showScreen:()=>{},showToast:()=>{},confirm:()=>true,renderPayEmpList:()=>{},
    payPeriod52:()=>'2026-10',ensurePayslipControls52:()=>{},
    payPeriod54:()=>'2026-10',
    calcTax:()=>({deductions:[],totalDeduct:0}),
    firebase:{firestore:{FieldValue:{serverTimestamp:()=>123}}},
    db:{collection(name){
      const filters=[];
      const query={where(key,op,value){assert.equal(op,'==');filters.push([key,value]);return query;},limit(){return query;},
        doc(id){return {name,id:id||`new-${++sequence}`};},
        async get(){
          requests.push({name,filters:[...filters]});
          const docs=records[name].filter(row=>filters.every(([key,value])=>row[key]===value)).map(row=>({id:row.id,ref:{name,id:row.id},data:()=>({...row})}));
          return {docs,empty:!docs.length,forEach:callback=>docs.forEach(callback)};
        }};
      return query;
    },batch(){
      const pending=[];
      return {set:(ref,data)=>pending.push({ref,data}),update:(ref,data)=>pending.push({ref,data}),async commit(){
        if(fail)throw new Error('offline');
        for(const {ref,data} of pending){
          const existing=records[ref.name].find(row=>row.id===ref.id);
          if(existing)Object.assign(existing,data);else records[ref.name].push({id:ref.id,...data});
          writes.push({ref,data});
        }
      }};
    }}
  };
  context.window=context;
  vm.createContext(context);
  vm.runInContext(source,context);
  vm.runInContext(part(html,'function getWorkDaysFromSnapshot(','function getTimeMinutes('),context);
  vm.runInContext(part(html,'function calcPayTotal(','async function savePayslip('),context);
  vm.runInContext(part(html,'function changePayWeeks(','function calcTax('),context);
  vm.runInContext(part(html,'async function calcEmpPay(','async function renderPayTable('),context);
  vm.runInContext(part(fixes,'    window.openPayslip=async function(empId){','    window.__zuoTask50PayslipPatched=true;'),context);
  vm.runInContext(part(fixes,'  async function findPayslipDoc52(','  function setPayslipReadOnly52('),context);
  vm.runInContext(part(fixes,'  function setPayslipReadOnly52(','  async function refreshPayslipConfirmUi52('),context);
  vm.runInContext(part(fixes,'  async function confirmPayslip52(','  function openEmpWorkStatus52('),context);
  vm.runInContext(part(fixes,'function hasPayslipEdits(','/* Task #54:'),context);
  vm.runInContext(part(fixes,'  async function defaultPayslipData54(','  async function confirmPayFromCard54('),context);
  vm.runInContext(part(fixes,'  async function findPayslipDoc54(','  async function defaultPayslipData54('),context);
  vm.runInContext(part(fixes,'  async function confirmPayFromCard54(','  function installPayCardConfirm54('),context);
  return {context,element,buttons,requests,records,writes,setFailure:value=>{fail=value;}};
}

test('payslip, list totals and direct-confirm data agree and carry exclusion notes',async()=>{
  const {context:c,element,requests}=environment();
  await c.openPayslip(emp.id);
  assert.equal(c.psWeekCntVal,2);
  assert.equal(element('psHoliTotal').textContent,'₩2,000');
  assert.match(element('psHolidayNotes').textContent,/26.10.05~26.10.11 14시간 59분/);
  const pay=await c.calcEmpPay(emp,'2026-10');
  const data=await c.defaultPayslipData54(emp,'2026-10');
  assert.equal(pay.holi,2000);
  assert.equal(data.weekCntVal,2);
  assert.equal(data.holidayExclusions.length,2);
  for(const request of requests){
    assert.ok(request.filters.some(([key,value])=>key==='cafeId'&&value==='cafe'));
    assert.ok(request.filters.some(([key,value])=>key==='empId'&&value===emp.id));
  }
});

test('confirm/reopen keeps allowance, notes and bonuses; controls cannot add an excluded week',async()=>{
  const {context:c,element,records}=environment();
  await c.openPayslip(emp.id);
  c.changePayWeeks(1);assert.equal(c.psWeekCntVal,2);
  element('psBonus').value='500';element('psEtc').value='200';
  await c.confirmPayslip52();
  assert.equal(records.payslips[0].confirmed,true);
  assert.equal(records.workConfirm[0].confirmed,true);
  assert.equal(records.payslips[0].holidayExclusions.length,2);
  const note=element('psHolidayNotes').textContent;
  await c.openPayslip(emp.id);
  assert.equal(c.psWeekCntVal,2);
  assert.equal(element('psHolidayNotes').textContent,note);
  assert.equal(Number(element('psBonus').value),500);
  assert.equal(Number(element('psEtc').value),200);
});

test('zero-rate legacy confirmed payslip cannot leak allowance through any calculation or save path',async()=>{
  const employee={...emp,holidayRate:0};
  const {context:c,element}=environment(employee,{confirmed:true,holiRateVal:50568,weekCntVal:4});
  await c.openPayslip(emp.id);
  assert.equal(c.psWeekCntVal,0);
  assert.equal((await c.calcEmpPay(employee,'2026-10')).holi,0);
  element('psHoliRateInput').value='50568';c.psHoliRateVal=50568;c.psWeekCntVal=4;
  const data=c.getPayslipSaveData();
  assert.equal(data.holiRateVal,0);assert.equal(data.weekCntVal,0);
  assert.match(data.holidayNotes[0],/미적용/);
});

test('direct confirmation recalculates an existing draft and preserves unrelated payroll fields',async()=>{
  const {context:c,records}=environment({...emp},{holiRateVal:1000,weekCntVal:4,confirmed:false});
  await c.confirmPayFromCard54(emp.id);
  const slip=records.payslips[0];
  assert.equal(slip.confirmed,true);
  assert.equal(slip.weekCntVal,2);
  assert.equal(slip.bonus,500);
  assert.equal(slip.etc,200);
  assert.equal(slip.holidayExclusions.length,2);
  assert.equal(records.workConfirm[0].confirmed,true);
});

test('zero-rate inputs stay disabled when returning from worker view to administrator view',async()=>{
  const {context:c,element,buttons}=environment({...emp,holidayRate:0});
  await c.openPayslip(emp.id);
  c.setPayslipReadOnly52(true);
  assert.equal(element('psBonus').disabled,true);
  c.setPayslipReadOnly52(false);
  assert.equal(element('psBonus').disabled,false);
  assert.equal(element('psHoliRateInput').disabled,true);
  assert.equal(buttons[0].disabled,true);
});

test('latest daily record wins and extra hours at month end cannot qualify earlier weeks',async()=>{
  const {context:c,records}=environment();
  records.workHours.push({id:'replacement',cafeId:'cafe',empId:emp.id,period:'2026-10',day:12,workMin:0,updatedAt:999});
  await c.openPayslip(emp.id);
  assert.equal(c.psWeekCntVal,1);
});

test('a previous-month-only qualifying week appears consistently in summary and payslip',async()=>{
  const {context:c,records}=environment();
  records.workHours=records.workHours.filter(row=>row.period==='2026-09');
  records.workHours[0].workMin=900;
  await c.openPayslip(emp.id);
  assert.equal(c.psWeekCntVal,1);
  assert.equal((await c.calcEmpPay(emp,'2026-10')).holi,1000);
});

test('failed batch writes neither payroll confirmation nor exclusion metadata',async()=>{
  const {context:c,records,setFailure}=environment();
  await c.openPayslip(emp.id);
  setFailure(true);
  c.console={error:()=>{}};
  await c.confirmPayslip52();
  assert.equal(records.payslips.length,0);
  assert.equal(records.workConfirm.length,0);
});

test('inline scripts parse and service worker precaches both versioned payroll scripts',()=>{
  for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))if(match[1].trim())new vm.Script(match[1]);
  const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
  for(const name of ['zuo-payroll.js','zuo-fixes.js']){
    const version=html.match(new RegExp(name.replace('.','\\.')+'\\?v=([^"\\s]+)'))[1];
    assert.ok(sw.includes(`${name}?v=${version}`));
  }
});
