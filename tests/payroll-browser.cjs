const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const http=require('node:http');
let playwright;
try{playwright=require(process.env.ZUO_PLAYWRIGHT||'playwright');}
catch{playwright=require(path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const {chromium}=playwright;
const root=path.resolve(__dirname,'..');
const fixtures={
  cafes:[{id:'cafe',name:'Test',color:'green'}],
  employees:[{id:'target',cafeId:'cafe',name:'Test',rate:10320,holidayRate:0,empType:'기타'}],
  payslips:[{id:'slip',cafeId:'cafe',empId:'target',period:'2026-10',holiRateVal:50568,weekCntVal:4,confirmed:true}],
  workConfirm:[],workHours:[
    {id:'prev',cafeId:'cafe',empId:'target',period:'2026-09',day:28,workMin:600},
    {id:'first',cafeId:'cafe',empId:'target',period:'2026-10',day:1,workMin:300},
    {id:'short',cafeId:'cafe',empId:'target',period:'2026-10',day:5,workMin:899},
    {id:'full',cafeId:'cafe',empId:'target',period:'2026-10',day:12,workMin:900}
  ]
};

(async()=>{
  const version=JSON.parse(fs.readFileSync(path.join(root,'version.json'),'utf8')).version;
  let publishedVersion=version,manifestUnavailable=false;
  const server=http.createServer((req,res)=>{
    const pathname=new URL(req.url,'http://localhost').pathname;
    if(pathname==='/version.json'){
      res.writeHead(manifestUnavailable?503:200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({version:publishedVersion}));return;
    }
    const filename=path.resolve(root,pathname==='/'?'index.html':pathname.slice(1));
    if(!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    try{
      const body=fs.readFileSync(filename);
      const type=filename.endsWith('.js')?'text/javascript':filename.endsWith('.json')?'application/json':filename.endsWith('.png')?'image/png':'text/html';
      res.writeHead(200,{'Content-Type':type});res.end(body);
    }catch{res.writeHead(404);res.end();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  const artifactDir=process.env.ZUO_QA_DIR||path.join(os.tmpdir(),'zuo-payroll-browser');
  fs.mkdirSync(artifactDir,{recursive:true});
  try{
    browser=await chromium.launch({headless:true,args:['--log-file='+path.join(artifactDir,'browser-debug.log')],...(process.env.ZUO_BROWSER_BIN?{executablePath:process.env.ZUO_BROWSER_BIN}:{channel:'msedge'})});
    const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
    await context.addInitScript(data=>{
      window.__fixtures=data;
      const snapshot=rows=>{
        const docs=rows.map(row=>({id:row.id,data:()=>({...row}),ref:{id:row.id}}));
        return {empty:!docs.length,docs,forEach:callback=>docs.forEach(callback)};
      };
      const db={collection(name){
        const filters=[];
        const q={where(key,op,value){filters.push([key,value]);return q;},limit(){return q;},orderBy(){return q;},
          async get(){return snapshot((window.__fixtures[name]||[]).filter(row=>filters.every(([k,v])=>row[k]===v)));},
          onSnapshot(callback){setTimeout(async()=>callback(await q.get()),0);return ()=>{};},
          doc(){throw new Error('No writes permitted in browser test');},add(){throw new Error('No writes permitted in browser test');}};
        return q;
      },batch(){throw new Error('No writes permitted in browser test');}};
      window.firebase={initializeApp(){},firestore:()=>db};
      window.firebase.firestore.FieldValue={serverTimestamp:()=>123};
    },fixtures);
    await context.route('**/*',async route=>{
      if(route.request().url().startsWith('http://127.0.0.1:'))return route.continue();
      if(route.request().resourceType()==='script')return route.fulfill({contentType:'text/javascript',body:''});
      return route.abort();
    });
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(()=>window.__zuoTask52OpenPayslipPatched&&typeof window.ZuoPayroll!=='undefined');
    await page.waitForFunction(()=>typeof window.ZuoVersion!=='undefined');
    await page.waitForFunction(()=>getComputedStyle(document.getElementById('splash')).display==='none');
    await page.evaluate(()=>ZuoVersion.check());
    assert.match(await page.locator('#scHome .app-version-bar').innerText(),new RegExp(version.replaceAll('.','\\.')));
    await page.evaluate(async()=>{
      currentCafe={...window.__fixtures.cafes[0]};
      employees=window.__fixtures.employees;
      isAdminMode=true;payY=2026;payM=9;
      await openPayslip('target');
    });
    assert.equal(await page.locator('#psHoliTotal').innerText(),'₩0');
    assert.equal(await page.locator('#psWeekCnt').innerText(),'0');
    assert.equal(await page.locator('#psHoliRateInput').isDisabled(),true);
    assert.equal(await page.locator('#payslipCard [data-zuo-version]').innerText(),'ZUO v'+version);
    await page.screenshot({path:path.join(artifactDir,'zero-rate-mobile.png'),fullPage:true});
    await page.evaluate(async()=>{
      window.__fixtures.employees[0].holidayRate=1000;
      window.__fixtures.payslips=[];
      await openPayslip('target');
    });
    assert.equal(await page.locator('#psWeekCnt').innerText(),'2');
    assert.equal(await page.locator('#psHoliTotal').innerText(),'₩2,000');
    assert.match(await page.locator('#psHolidayNotes').innerText(),/14시간 59분/);
    await page.locator('#scPayslip button[onclick="changePayWeeks(1)"]').click();
    assert.equal(await page.locator('#psWeekCnt').innerText(),'2');
    await page.locator('#psHoliRateInput').fill('30960');
    await page.locator('#psBonus').fill('100000');
    await page.locator('#psEtc').fill('12500');
    await page.locator('#psBonusMemo').fill('우수근로 포상');
    await page.locator('#psEtcMemo').fill('교통비 및 식대 지원');
    assert.equal(await page.locator('#psHoliRateInput').inputValue(),'30,960');
    assert.equal(await page.locator('#psBonus').inputValue(),'100,000');
    assert.equal(await page.locator('#psEtc').inputValue(),'12,500');
    const savedAmounts=await page.evaluate(()=>getPayslipSaveData());
    assert.equal(savedAmounts.holiRateVal,30960);
    assert.equal(savedAmounts.bonus,100000);
    assert.equal(savedAmounts.etc,12500);
    const fonts=await page.evaluate(()=>['psHoliRateInput','psBonus','psEtc','psHoliTotal'].map(id=>{
      const style=getComputedStyle(document.getElementById(id));
      return {family:style.fontFamily,size:style.fontSize,weight:style.fontWeight};
    }));
    assert.ok(fonts.every(font=>JSON.stringify(font)===JSON.stringify(fonts[0])));
    const amountColors=await page.evaluate(()=>({
      paid:['psBase','psHoliTotal','psGross','psTotal','psBonusDisp','psEtcDisp'].map(id=>getComputedStyle(document.getElementById(id)).color),
      inputs:['psHoliRateInput','psBonus','psEtc'].map(id=>getComputedStyle(document.getElementById(id)).color)
    }));
    assert.ok(amountColors.paid.every(color=>color==='rgb(15, 110, 86)'));
    assert.ok(amountColors.inputs.every(color=>color==='rgb(26, 26, 26)'));
    await page.locator('#psEtc').fill('-1250');
    assert.equal((await page.evaluate(()=>getPayslipSaveData())).etc,-1250);
    await page.locator('#psEtc').fill('12500');
    await page.evaluate(()=>window.scrollTo(0,0));
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    assert.equal(overflow,false,'Mobile page must not overflow');
    await page.screenshot({path:path.join(artifactDir,'weekly-notes-mobile.png'),fullPage:true});
    await page.evaluate(()=>prepareCapture());
    assert.equal(await page.locator('#psBonusDisp').innerText(),'₩100,000');
    assert.equal(await page.locator('#psEtcDisp').innerText(),'₩12,500');
    assert.equal(await page.locator('#psHoliRate').innerText(),'₩30,960');
    assert.equal(await page.locator('#psWeekCntDisp').innerText(),'2회');
    assert.equal(await page.locator('#psBonusMemoDisp').innerText(),'우수근로 포상');
    await page.locator('#payslipCard').screenshot({path:path.join(artifactDir,'payslip-capture-mobile.png')});
    await page.evaluate(()=>restoreCapture());
    await page.setViewportSize({width:320,height:740});
    await page.waitForFunction(()=>['psBonusMemo','psEtcMemo'].every(id=>{
      const node=document.getElementById(id);return node.scrollHeight<=node.clientHeight+2;
    }));
    const narrow=await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth>innerWidth,
      rowTops:[...document.querySelectorAll('.ps-holiday-grid .ps-payment-field')].map(el=>el.getBoundingClientRect().top),
      extras:[...document.querySelectorAll('.ps-extra-row')].map(row=>[...row.children].map(node=>{
        const r=node.getBoundingClientRect();return {center:r.top+r.height/2,left:r.left,right:r.right};
      }))
    }));
    assert.equal(narrow.overflow,false);
    assert.ok(Math.max(...narrow.rowTops)-Math.min(...narrow.rowTops)<2,'Holiday fields must share one row');
    for(const row of narrow.extras){
      assert.ok(Math.max(...row.map(r=>r.center))-Math.min(...row.map(r=>r.center))<2,'Label, memo and amount must share one row');
      assert.ok(row[0].right<=row[1].left&&row[1].right<=row[2].left,'Allowance columns must not overlap');
    }
    await page.screenshot({path:path.join(artifactDir,'payslip-narrow-mobile.png'),fullPage:true});
    await page.setViewportSize({width:1280,height:900});
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:path.join(artifactDir,'weekly-notes-desktop.png'),fullPage:true});
    publishedVersion='9999.12.31.1';
    await page.evaluate(()=>ZuoVersion.check());
    assert.equal(await page.locator('#scPayslip .app-version-update').innerText(),'업데이트 적용');
    await page.locator('#psBonus').fill('777');
    const before=page.url();
    page.once('dialog',dialog=>dialog.dismiss());
    await page.locator('#scPayslip .app-version-update').click();
    assert.equal(page.url(),before);
    assert.equal(await page.locator('#psBonus').inputValue(),'777');
    manifestUnavailable=true;
    await page.evaluate(()=>ZuoVersion.check());
    assert.match(await page.locator('#scPayslip .app-version-status').innerText(),/확인 실패/);
    await page.evaluate(async()=>{
      const data=window.__fixtures;
      data.employees[0].holidayRate=0;
      data.employees[0].resigned=true;
      data.workHours=[];
      data.payslips=[{id:'slip',cafeId:'cafe',empId:'target',period:'2026-10',holiRateVal:50568,weekCntVal:1,bonus:0,etc:0,confirmed:true}];
      currentWorkerEmp=employees[0];
      await renderPayTable();
      await openWorkerPayslipList53();
    });
    assert.equal((await page.locator('#payTable').innerText()).includes('Test'),false);
    assert.equal(await page.locator('#workerPayslipList .worker-pay-row').count(),0);
    assert.match(await page.locator('#workerPayslipList').innerText(),/표시할 급여명세서가 없어요/);
    await page.evaluate(async()=>{
      window.__fixtures.payslips[0].bonus=500;
      await renderPayTable();
      await openWorkerPayslipList53();
    });
    assert.equal((await page.locator('#payTable').innerText()).includes('Test'),true);
    assert.equal(await page.locator('#workerPayslipList .worker-pay-row').count(),1);
    assert.match(await page.locator('#workerPayslipList .worker-pay-row').innerText(),/500/);
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({result:'PASS',checks:['real app script chain','zero-rate legacy saved slip','weekly exclusions','320px/390px one-row layout','desktop rendering','uniform monetary fonts','comma-formatted numeric saving','signed amounts','image-capture amounts and memo','visible build version','update detection','unsaved-input cancellation','offline update status','empty legacy history hidden in administrator and worker lists','bonus-only history preserved'],artifactDir}));
  }finally{
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
