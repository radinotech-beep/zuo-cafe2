// Runtime fixes for reviewed issues, worktime edit/delete, pay table style, and profit fixed items.
(function(){
  var originalOpenWkInput=null;

  function injectPayTableStyle(){
    if(document.getElementById('zuoPayTableStyleFix'))return;
    const style=document.createElement('style');
    style.id='zuoPayTableStyleFix';
    style.textContent=`
      .pay-tbl-wrap{border-color:#e5e5e5;background:#fff}
      .pay-tbl{font-size:10px;background:#fff}
      .pay-tbl th{background:#fff!important;color:#111!important;font-weight:600!important;border:1px solid #e5e5e5!important;padding:7px 2px!important;line-height:1.2!important}
      .pay-tbl td{background:#fff!important;color:#111!important;font-weight:500!important;border:1px solid #ececec!important;padding:7px 2px!important}
      .pay-tbl td.nm{background:#F7FAFF!important;color:#111!important;font-weight:600!important}
      .pay-tbl td.pay-time{background:#F0F7FF!important;color:#111!important;font-weight:600!important}
      .pay-tbl td.pay-net{background:#EEF9F3!important;color:#111!important;font-weight:600!important}
      .pay-tbl td.pay-deduct{color:#111!important}
      .pay-tbl td.pay-money{font-size:9.5px!important;color:#111!important}
      .pay-tbl .unit-h{color:#111!important;font-weight:500!important}
      .pay-tbl tr:last-child td{background:#fff!important;color:#111!important;font-weight:600!important;border-top:1px solid #d8d8d8!important}
      .pay-tbl tr:last-child td.nm{background:#F7FAFF!important}
      .pay-tbl tr:last-child td.pay-time{background:#F0F7FF!important}
      .pay-tbl tr:last-child td.pay-net{background:#EEF9F3!important}
    `;
    document.head.appendChild(style);
  }

  function profitFixedValue(key){
    if(profitData&&profitData[key]!==undefined)return profitData[key]||0;
    if(profitFixed&&profitFixed[key+'_fixed'])return profitFixed[key+'_val']||0;
    return 0;
  }

  function renderFixedButton(key,isFixed){
    return `<button class="profit-pin ${isFixed?'on':''}" data-fixed-key="${key}" onclick="toggleFixed('${key}',this)" style="flex-shrink:0;font-size:10px;padding:2px 5px;border-radius:4px;border:1px solid ${isFixed?'var(--amb)':'var(--bd)'};background:${isFixed?'var(--amb)':'#fff'};color:${isFixed?'#fff':'var(--t3)'};cursor:pointer;white-space:nowrap">📌${isFixed?' 고정항목':''}</button>`;
  }

  function patchProfitRows(){
    if(typeof PROFIT_EXPENSE_ITEMS==='undefined'||typeof profitData==='undefined'||typeof profitFixed==='undefined')return false;
    window.renderProfitRows=function(){
      const w=document.getElementById('profitExpenseRows');
      if(!w)return;
      w.innerHTML=PROFIT_EXPENSE_ITEMS.map(item=>{
        const key=item.key;
        const isFixed=!!profitFixed[key+'_fixed'];
        const isSalary=key==='salary';
        return `<div style="display:flex;align-items:center;gap:5px;padding:6px 0;border-bottom:1px solid #f5f5f5">
          <span style="font-size:12px;color:var(--t1);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.label}</span>
          ${isSalary?`<button onclick="loadSalaryFromLabor()" style="flex-shrink:0;font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid var(--green);background:#fff;color:var(--green);cursor:pointer;white-space:nowrap">📂 불러오기</button>`:''}
          <span style="font-size:10px;color:var(--t3);flex-shrink:0;min-width:32px;text-align:right" id="pct_${key}">0%</span>
          ${renderFixedButton(key,isFixed)}
          <input type="text" inputmode="numeric" id="pi_${key}" placeholder="0" oninput="formatCurrencyInput(this);calcProfitTotals()" style="width:85px;border:1px solid var(--bd);border-radius:6px;padding:4px 6px;font-size:12px;text-align:right;outline:none;flex-shrink:0">
        </div>`;
      }).join('');
      PROFIT_EXPENSE_ITEMS.forEach(item=>setCurrencyValue('pi_'+item.key,profitFixedValue(item.key)));
      const rev=profitFixedValue('revenue');
      if(document.getElementById('pi_revenue'))setCurrencyValue('pi_revenue',rev||0);
      calcProfitTotals();
    };
    return true;
  }

  function patchProfitFixedToggle(){
    if(typeof profitFixed==='undefined')return false;
    window.toggleFixed=function(key,btn){
      const nowFixed=!(profitFixed[key+'_fixed']===true);
      const value=getCurrencyValue('pi_'+key);
      profitFixed[key+'_fixed']=nowFixed;
      profitFixed[key+'_val']=value;
      if(btn){
        btn.classList.toggle('on',nowFixed);
        btn.dataset.fixedKey=key;
        btn.innerHTML=nowFixed?'📌 고정항목':'📌';
        btn.style.border=`1px solid ${nowFixed?'var(--amb)':'var(--bd)'}`;
        btn.style.background=nowFixed?'var(--amb)':'#fff';
        btn.style.color=nowFixed?'#fff':'var(--t3)';
      }
      saveProfitFixed();
      showToast(nowFixed?'📌 고정항목으로 저장했어요':'고정항목을 해제했어요');
    };
    return true;
  }

  function patchProfitFixedSave(){
    if(typeof db==='undefined'||typeof profitFixed==='undefined')return false;
    window.saveProfitFixed=async function(){
      const fixedSnap=await db.collection('profitFixed').where('cafeId','==',currentCafe.id).limit(1).get();
      const data={cafeId:currentCafe.id,...profitFixed};
      if(!fixedSnap.empty){await db.collection('profitFixed').doc(fixedSnap.docs[0].id).update(data);}
      else{await db.collection('profitFixed').add(data);}
    };
    return true;
  }

  function patchProfitSave(){
    if(typeof PROFIT_EXPENSE_ITEMS==='undefined'||typeof PROFIT_KEYS==='undefined')return false;
    window.saveProfit=async function(){
      const period=`${profitY}-${String(profitM+1).padStart(2,'0')}`;
      const data={cafeId:currentCafe.id,period,revenue:getVal('revenue')};
      PROFIT_EXPENSE_ITEMS.forEach(i=>data[i.key]=getVal(i.key));
      PROFIT_KEYS.forEach(k=>{
        if(profitFixed[k+'_fixed'])profitFixed[k+'_val']=getVal(k);
      });
      await saveProfitFixed();
      if(profitData.docId){await db.collection('profits').doc(profitData.docId).update(data);}
      else{const ref=await db.collection('profits').add(data);profitData.docId=ref.id;}
      showToast('✅ 저장됐어요!');
    };
    return true;
  }

  function patchProfitExcel(){
    if(typeof XLSX==='undefined'||typeof PROFIT_EXPENSE_ITEMS==='undefined')return false;
    window.exportProfitExcel=async function(){
      const income=getVal('revenue');
      const expense=PROFIT_EXPENSE_ITEMS.reduce((a,i)=>a+getVal(i.key),0);
      const net=income-expense;
      const wb=XLSX.utils.book_new();
      const data=[
        [`${profitY}년 ${profitM+1}월 수익 현황`,'',''],
        ['구분','항목','금액'],
        ['매출','매출액',income],
        ...PROFIT_EXPENSE_ITEMS.map(i=>['지출',i.label,getVal(i.key)]),
        ['','지출 합계',expense],
        ['영업이익','영업이익 (VAT포함)',net],
        ['영업이익률','',income>0?`${Math.round(net/income*1000)/10}%`:'0%']
      ];
      const ws=XLSX.utils.aoa_to_sheet(data);
      ws['!cols']=[{wch:10},{wch:20},{wch:15}];
      XLSX.utils.book_append_sheet(wb,ws,`${profitY}년 ${profitM+1}월`);
      XLSX.writeFile(wb,`수익현황_${profitY}년${profitM+1}월.xlsx`);
    };
    return true;
  }

  function patchWorkInputUi(){
    if(typeof openWkInput!=='function')return false;
    if(!originalOpenWkInput)originalOpenWkInput=openWkInput;
    window.openWkInput=function(d){
      originalOpenWkInput(d);
      const panel=document.getElementById('wkPanel');
      const actionRow=panel?.querySelector('div[style*="display:flex"][style*="gap:8px"]');
      const firstBtn=actionRow?.querySelector('button');
      const hasSaved=!!(workData&&wkSelDay&&workData[wkSelDay]);
      if(firstBtn){
        firstBtn.textContent=hasSaved?'삭제':'비우기';
        firstBtn.onclick=hasSaved?deleteWkHours:resetWkInput;
        firstBtn.style.color=hasSaved?'var(--red)':'var(--t2)';
        firstBtn.style.borderColor=hasSaved?'#fca5a5':'var(--bd)';
      }
      const saveBtn=actionRow?.querySelector('.fok');
      if(saveBtn)saveBtn.innerHTML=hasSaved?'💾 수정 저장':'💾 저장';
    };
    window.deleteWkHours=async function(){
      if(!wkSelDay||!currentWorkerEmp)return;
      if(!(workData&&workData[wkSelDay])){resetWkInput();return;}
      if(typeof wkIsConfirmed!=='undefined'&&wkIsConfirmed&&!isAdminMode){showToast('🔒 확정된 데이터는 삭제할 수 없어요. 관리자에게 문의하세요.');return;}
      if(!confirm(`${wkM+1}월 ${wkSelDay}일 근무시간을 삭제할까요?`))return;
      const period=`${wkY}-${String(wkM+1).padStart(2,'0')}`;
      const snap=await db.collection('workHours').where('empId','==',currentWorkerEmp.id).where('period','==',period).where('day','==',wkSelDay).get();
      await Promise.all(snap.docs.map(doc=>db.collection('workHours').doc(doc.id).delete()));
      wkSelDay=null;
      document.getElementById('wkPanel').style.display='none';
      loadWorkHours();
      showToast('삭제됐어요');
    };
    return true;
  }

  function patchWorkHourSave(){
    if(typeof db==='undefined')return false;
    window.saveWkHours=async function(){
      if(!wkSelDay)return;
      const period=`${wkY}-${String(wkM+1).padStart(2,'0')}`;
      const confirmSnap=await db.collection('workConfirm').where('empId','==',currentWorkerEmp.id).where('period','==',period).get();
      if(!confirmSnap.empty&&confirmSnap.docs[0].data().confirmed&&!isAdminMode){showToast('🔒 확정된 데이터는 수정할 수 없어요. 관리자에게 문의하세요.');return;}
      updateWkTimeUi();
      const note=document.getElementById('wkNote').value.trim();
      const workMin=calcCurrentWorkMin();
      const data={empId:currentWorkerEmp.id,cafeId:currentCafe.id,period,day:wkSelDay,startTime:wkStartTime,endTime:wkEndTime,breakMin:wkBreakMin,workMin,hours:workMin/60,note,updatedAt:Date.now()};
      const existing=await db.collection('workHours').where('empId','==',currentWorkerEmp.id).where('period','==',period).where('day','==',wkSelDay).get();
      if(!existing.empty){await Promise.all(existing.docs.map(doc=>db.collection('workHours').doc(doc.id).update(data)));}
      else{await db.collection('workHours').add(data);}
      lastSavedHours=workMin/60;
      lastSavedWorkPreset={startTime:wkStartTime,endTime:wkEndTime,breakMin:wkBreakMin};
      wkSelDay=null;
      document.getElementById('wkPanel').style.display='none';
      loadWorkHours();
      showToast(existing.empty?'✅ 저장됐어요!':'✅ 수정됐어요!');
    };
    return true;
  }

  function applyPatches(){
    injectPayTableStyle();
    patchProfitRows();
    patchProfitFixedToggle();
    patchProfitFixedSave();
    patchProfitSave();
    patchProfitExcel();
    patchWorkInputUi();
    patchWorkHourSave();
  }

  applyPatches();
  document.addEventListener('DOMContentLoaded',applyPatches);
})();

// Profit fixed-item policy v2: lock while pinned and apply from the pinned month forward only.
(function(){
  function profitPeriod(){return `${profitY}-${String(profitM+1).padStart(2,'0')}`;}
  function normalizeFixedHistory(key){
    const histKey=key+'_fixedHistory';
    let hist=Array.isArray(profitFixed?.[histKey])?[...profitFixed[histKey]]:[];
    if(!hist.length&&profitFixed?.[key+'_fixed']){
      const start=profitFixed[key+'_start']||'0000-00';
      hist.push({start,active:true,val:Number(profitFixed[key+'_val'])||0});
    }
    hist=hist
      .filter(x=>x&&x.start)
      .map(x=>({start:String(x.start),active:x.active!==false,val:Number(x.val)||0,updatedAt:x.updatedAt||0}))
      .sort((a,b)=>a.start.localeCompare(b.start)||(a.updatedAt||0)-(b.updatedAt||0));
    profitFixed[histKey]=hist;
    return hist;
  }
  function fixedStateFor(key,period=profitPeriod()){
    const hist=normalizeFixedHistory(key);
    let state={active:false,val:0,start:null};
    hist.forEach(ev=>{if(ev.start<=period)state={active:ev.active!==false,val:Number(ev.val)||0,start:ev.start};});
    return state;
  }
  function setFixedEvent(key,active,val,period=profitPeriod()){
    const hist=normalizeFixedHistory(key).filter(ev=>ev.start!==period);
    hist.push({start:period,active:!!active,val:Number(val)||0,updatedAt:Date.now()});
    hist.sort((a,b)=>a.start.localeCompare(b.start)||(a.updatedAt||0)-(b.updatedAt||0));
    profitFixed[key+'_fixedHistory']=hist;
    const current=fixedStateFor(key,'9999-12');
    profitFixed[key+'_fixed']=current.active;
    profitFixed[key+'_val']=current.val;
    profitFixed[key+'_start']=current.start;
  }
  function fixedBtnHtml(key,state){
    return `<button class="profit-pin ${state.active?'on':''}" data-fixed-key="${key}" onclick="toggleFixed('${key}',this)" style="flex-shrink:0;font-size:10px;padding:2px 5px;border-radius:4px;border:1px solid ${state.active?'var(--amb)':'var(--bd)'};background:${state.active?'var(--amb)':'#fff'};color:${state.active?'#fff':'var(--t3)'};cursor:pointer;white-space:nowrap">📌${state.active?' 고정중':''}</button>`;
  }
  function setProfitInputLock(key,state){
    const el=document.getElementById('pi_'+key);if(!el)return;
    el.disabled=!!state.active;
    el.title=state.active?'고정항목 해제 후 수정할 수 있어요':'';
    el.style.background=state.active?'#f7f7f7':'#fff';
    el.style.color=state.active?'#777':'var(--t1)';
  }
  function valueForProfitKey(key){
    if(profitData&&profitData[key]!==undefined)return Number(profitData[key])||0;
    const st=fixedStateFor(key);
    return st.active?st.val:0;
  }
  window.renderProfitRows=function(){
    const w=document.getElementById('profitExpenseRows');if(!w||typeof PROFIT_EXPENSE_ITEMS==='undefined')return;
    w.innerHTML=PROFIT_EXPENSE_ITEMS.map(item=>{
      const key=item.key;
      const state=fixedStateFor(key);
      const isSalary=key==='salary';
      return `<div style="display:flex;align-items:center;gap:5px;padding:6px 0;border-bottom:1px solid #f5f5f5">
        <span style="font-size:12px;color:var(--t1);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.label}</span>
        ${isSalary?`<button onclick="loadSalaryFromLabor()" style="flex-shrink:0;font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid var(--green);background:#fff;color:var(--green);cursor:pointer;white-space:nowrap">📂 불러오기</button>`:''}
        <span style="font-size:10px;color:var(--t3);flex-shrink:0;min-width:32px;text-align:right" id="pct_${key}">0%</span>
        ${fixedBtnHtml(key,state)}
        <input type="text" inputmode="numeric" id="pi_${key}" placeholder="0" oninput="formatCurrencyInput(this);calcProfitTotals()" style="width:85px;border:1px solid var(--bd);border-radius:6px;padding:4px 6px;font-size:12px;text-align:right;outline:none;flex-shrink:0">
      </div>`;
    }).join('');
    PROFIT_EXPENSE_ITEMS.forEach(item=>{
      const key=item.key,state=fixedStateFor(key);
      setCurrencyValue('pi_'+key,valueForProfitKey(key));
      setProfitInputLock(key,state);
    });
    const revState=fixedStateFor('revenue');
    if(document.getElementById('pi_revenue')){
      setCurrencyValue('pi_revenue',valueForProfitKey('revenue'));
      setProfitInputLock('revenue',revState);
    }
    calcProfitTotals();
  };
  window.toggleFixed=function(key,btn){
    const period=profitPeriod();
    const state=fixedStateFor(key,period);
    if(state.active){
      setFixedEvent(key,false,state.val,period);
      if(btn){btn.classList.remove('on');btn.innerHTML='📌';btn.style.border='1px solid var(--bd)';btn.style.background='#fff';btn.style.color='var(--t3)';}
      setProfitInputLock(key,{active:false});
      showToast('고정항목을 해제했어요. 이제 수정할 수 있어요.');
    }else{
      const val=getCurrencyValue('pi_'+key);
      setFixedEvent(key,true,val,period);
      if(btn){btn.classList.add('on');btn.innerHTML='📌 고정중';btn.style.border='1px solid var(--amb)';btn.style.background='var(--amb)';btn.style.color='#fff';}
      setProfitInputLock(key,{active:true});
      showToast(`📌 ${period}부터 고정항목으로 적용돼요`);
    }
    saveProfitFixed();
    calcProfitTotals();
  };
  window.saveProfitFixed=async function(){
    const fixedSnap=await db.collection('profitFixed').where('cafeId','==',currentCafe.id).limit(1).get();
    const data={cafeId:currentCafe.id,...profitFixed};
    if(!fixedSnap.empty)await db.collection('profitFixed').doc(fixedSnap.docs[0].id).update(data);
    else await db.collection('profitFixed').add(data);
  };
  window.saveProfit=async function(){
    const period=profitPeriod();
    const data={cafeId:currentCafe.id,period,revenue:getVal('revenue')};
    PROFIT_EXPENSE_ITEMS.forEach(i=>data[i.key]=getVal(i.key));
    await saveProfitFixed();
    if(profitData.docId)await db.collection('profits').doc(profitData.docId).update(data);
    else{const ref=await db.collection('profits').add(data);profitData.docId=ref.id;}
    showToast('✅ 저장됐어요!');
  };
})();


// Profit fixed-item policy v3: pinned values lock inputs and override saved 0 values from the effective month forward.
(function(){
  function ready(){return typeof window.PROFIT_EXPENSE_ITEMS!=='undefined'||typeof PROFIT_EXPENSE_ITEMS!=='undefined';}
  function expenseItems(){return typeof PROFIT_EXPENSE_ITEMS==='undefined'?[]:PROFIT_EXPENSE_ITEMS;}
  function keys(){return ['revenue',...expenseItems().map(i=>i.key)];}
  function padPeriod(p){
    const m=String(p||'').match(/^(\d{4})-(\d{1,2})$/);
    if(!m)return '';
    return `${m[1]}-${String(parseInt(m[2],10)).padStart(2,'0')}`;
  }
  function period(){return `${profitY}-${String(profitM+1).padStart(2,'0')}`;}
  function moneyNum(v){return Number(v)||0;}
  function fixedHistory(key){
    const histKey=key+'_fixedHistory';
    let hist=Array.isArray(profitFixed?.[histKey])?[...profitFixed[histKey]]:[];
    if(!hist.length&&profitFixed?.[key+'_fixed']){
      const start=padPeriod(profitFixed[key+'_start'])||padPeriod(profitFixed[key+'_fixedStart'])||period();
      hist.push({start,active:true,val:moneyNum(profitFixed[key+'_val']),updatedAt:profitFixed[key+'_updatedAt']||0});
    }
    hist=hist.map(ev=>({
      start:padPeriod(ev.start),
      active:ev.active!==false,
      val:moneyNum(ev.val),
      updatedAt:moneyNum(ev.updatedAt)
    })).filter(ev=>ev.start).sort((a,b)=>a.start.localeCompare(b.start)||a.updatedAt-b.updatedAt);
    profitFixed[histKey]=hist;
    return hist;
  }
  function fixedState(key,p=period()){
    p=padPeriod(p)||period();
    let state={active:false,val:0,start:null};
    fixedHistory(key).forEach(ev=>{if(ev.start<=p)state={active:ev.active!==false,val:moneyNum(ev.val),start:ev.start};});
    return state;
  }
  function setFixedEvent(key,active,val,p=period()){
    p=padPeriod(p)||period();
    const hist=fixedHistory(key).filter(ev=>ev.start!==p);
    hist.push({start:p,active:!!active,val:moneyNum(val),updatedAt:Date.now()});
    hist.sort((a,b)=>a.start.localeCompare(b.start)||a.updatedAt-b.updatedAt);
    profitFixed[key+'_fixedHistory']=hist;
    const latest=fixedState(key,'9999-12');
    profitFixed[key+'_fixed']=latest.active;
    profitFixed[key+'_val']=latest.val;
    profitFixed[key+'_start']=latest.start;
  }
  function displayValue(key){
    const st=fixedState(key);
    if(st.active)return st.val;
    return profitData&&profitData[key]!==undefined?moneyNum(profitData[key]):0;
  }
  function lockInput(key,active){
    const el=document.getElementById('pi_'+key);if(!el)return;
    el.disabled=!!active;
    el.readOnly=!!active;
    el.dataset.fixedLocked=active?'1':'0';
    el.title=active?'고정비용 해제 후 수정할 수 있어요':'';
    el.style.background=active?'#f3f4f6':'#fff';
    el.style.color=active?'#777':'var(--t1)';
    el.style.cursor=active?'not-allowed':'text';
  }
  function pinButton(key,st){
    return `<button class="profit-pin ${st.active?'on':''}" data-fixed-key="${key}" onclick="toggleFixed('${key}',this)" style="flex-shrink:0;font-size:10px;padding:2px 5px;border-radius:4px;border:1px solid ${st.active?'var(--amb)':'var(--bd)'};background:${st.active?'var(--amb)':'#fff'};color:${st.active?'#fff':'var(--t3)'};cursor:pointer;white-space:nowrap">📌${st.active?' 고정중':''}</button>`;
  }
  function applyRevenueLock(){
    const st=fixedState('revenue');
    const el=document.getElementById('pi_revenue');
    if(el){setCurrencyValue('pi_revenue',displayValue('revenue'));lockInput('revenue',st.active);}
  }
  function install(){
    if(!ready()||typeof db==='undefined')return false;
    window.renderProfitRows=function(){
      const w=document.getElementById('profitExpenseRows');if(!w)return;
      w.innerHTML=expenseItems().map(item=>{
        const key=item.key;
        const st=fixedState(key);
        const salaryLocked=key==='salary'&&st.active;
        return `<div style="display:flex;align-items:center;gap:5px;padding:6px 0;border-bottom:1px solid #f5f5f5">
          <span style="font-size:12px;color:var(--t1);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.label}</span>
          ${key==='salary'?`<button ${salaryLocked?'disabled':''} onclick="${salaryLocked?'showToast(\'고정비용 해제 후 불러올 수 있어요\')':'loadSalaryFromLabor()'}" style="flex-shrink:0;font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid var(--green);background:${salaryLocked?'#f3f4f6':'#fff'};color:${salaryLocked?'#999':'var(--green)'};cursor:${salaryLocked?'not-allowed':'pointer'};white-space:nowrap">📂 불러오기</button>`:''}
          <span style="font-size:10px;color:var(--t3);flex-shrink:0;min-width:32px;text-align:right" id="pct_${key}">0%</span>
          ${pinButton(key,st)}
          <input type="text" inputmode="numeric" id="pi_${key}" placeholder="0" oninput="if(this.dataset.fixedLocked==='1'){return;}formatCurrencyInput(this);calcProfitTotals()" style="width:85px;border:1px solid var(--bd);border-radius:6px;padding:4px 6px;font-size:12px;text-align:right;outline:none;flex-shrink:0">
        </div>`;
      }).join('');
      expenseItems().forEach(item=>{const st=fixedState(item.key);setCurrencyValue('pi_'+item.key,displayValue(item.key));lockInput(item.key,st.active);});
      applyRevenueLock();
      calcProfitTotals();
    };
    window.toggleFixed=function(key,btn){
      const p=period();
      const st=fixedState(key,p);
      if(st.active){
        setFixedEvent(key,false,st.val,p);
        lockInput(key,false);
        showToast('고정비용을 해제했어요. 이제 수정할 수 있어요.');
      }else{
        const val=getCurrencyValue('pi_'+key);
        setFixedEvent(key,true,val,p);
        setCurrencyValue('pi_'+key,val);
        lockInput(key,true);
        showToast(`📌 ${p}부터 고정비용으로 적용돼요`);
      }
      if(btn){const next=fixedState(key,p);btn.classList.toggle('on',next.active);btn.innerHTML=next.active?'📌 고정중':'📌';btn.style.border=`1px solid ${next.active?'var(--amb)':'var(--bd)'}`;btn.style.background=next.active?'var(--amb)':'#fff';btn.style.color=next.active?'#fff':'var(--t3)';}
      saveProfitFixed();
      if(typeof calcProfitTotals==='function')calcProfitTotals();
    };
    window.saveProfitFixed=async function(){
      const fixedSnap=await db.collection('profitFixed').where('cafeId','==',currentCafe.id).limit(1).get();
      const data={cafeId:currentCafe.id,...profitFixed};
      if(!fixedSnap.empty)await db.collection('profitFixed').doc(fixedSnap.docs[0].id).update(data);
      else await db.collection('profitFixed').add(data);
    };
    window.saveProfit=async function(){
      const p=period();
      const data={cafeId:currentCafe.id,period:p,revenue:getVal('revenue')};
      expenseItems().forEach(i=>data[i.key]=getVal(i.key));
      await saveProfitFixed();
      if(profitData.docId)await db.collection('profits').doc(profitData.docId).update(data);
      else{const ref=await db.collection('profits').add(data);profitData.docId=ref.id;}
      showToast('✅ 저장됐어요!');
    };
    const oldLoadSalary=window.loadSalaryFromLabor;
    if(typeof oldLoadSalary==='function')window.loadSalaryFromLabor=async function(){
      if(fixedState('salary').active){showToast('고정비용 해제 후 불러올 수 있어요');return;}
      return oldLoadSalary.apply(this,arguments);
    };
    if(document.getElementById('profitExpenseRows'))window.renderProfitRows();
    return true;
  }
  function boot(){if(!install())setTimeout(boot,200);}
  boot();
  document.addEventListener('DOMContentLoaded',boot);
})();
/* Supply simple final UI: status card + one history-add button + list */
(function(){
  function installSupplySimpleFinal(){
    if(typeof supplyStatus==='undefined'||typeof supplyList==='undefined')return false;
    if(!document.getElementById('zuoSupplySimpleFinalStyle')){
      const style=document.createElement('style');
      style.id='zuoSupplySimpleFinalStyle';
      style.textContent=`
        .supply-summary{display:none!important}
        .supply-card{border-radius:10px!important;margin-bottom:10px!important;box-shadow:none!important}
        .supply-simple-card{padding:12px;background:#fff}
        .supply-simple-head{display:flex;align-items:center;gap:8px;margin-bottom:10px}
        .supply-simple-name{font-size:17px;font-weight:900;color:#111;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
        .supply-simple-edit{border:none;background:transparent;color:#777;font-size:11px;padding:4px 2px;cursor:pointer;white-space:nowrap}
        .supply-simple-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-bottom:9px}
        .supply-simple-box{background:#fafafa;border:1px solid #ececec;border-radius:8px;padding:8px 9px;min-width:0}
        .supply-simple-box span{display:block;font-size:9px;color:#888;margin-bottom:4px;white-space:nowrap}
        .supply-simple-box b{display:block;font-size:12px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .supply-simple-add{width:100%;border:none;background:var(--green);color:#fff;border-radius:8px;padding:10px 8px;font-size:13px;font-weight:800;cursor:pointer;margin-bottom:9px}
        .supply-simple-history{border-top:1px solid #f0f0f0;padding-top:8px}
        .supply-simple-history-title{font-size:12px;font-weight:900;color:#111;margin-bottom:6px}
        .supply-simple-row{display:grid;grid-template-columns:78px 54px 72px 1fr;gap:6px;align-items:center;padding:8px 0;border-top:1px solid #f5f5f5;font-size:11px;color:#333;cursor:pointer}
        .supply-simple-row:first-of-type{border-top:none}
        .supply-simple-row.head{font-size:10px;color:#888;font-weight:800;cursor:default;padding-top:0}
        .supply-simple-row b{font-size:12px;color:#111}
        .supply-simple-sub{font-size:10px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .supply-simple-note{grid-column:1/-1;font-size:10px;color:#777;line-height:1.4;white-space:normal}
        .supply-simple-empty{font-size:12px;color:#999;text-align:center;padding:12px 6px;border:1px dashed #e5e5e5;border-radius:8px;background:#fff}
      `;
      document.head.appendChild(style);
    }
    window.renderSupply=function(){
      const w=document.getElementById('supplyList');if(!w)return;
      const summary=document.getElementById('supplySummary');if(summary)summary.innerHTML='';
      if(!supplyList.length){w.innerHTML=`<div class="supply-empty">등록된 소모품이 없어요<br><span style="font-size:11px">+ 추가로 소모품 이름과 관리주기를 먼저 등록하세요</span></div>`;return;}
      const list=[...supplyList].sort((a,b)=>{const da=supplyStatus(a).nextDate||'9999-99-99';const db=supplyStatus(b).nextDate||'9999-99-99';return da.localeCompare(db);});
      w.innerHTML=list.map(s=>{
        const st=supplyStatus(s);
        const latest=st.latest;
        const hist=st.hist||[];
        const history=hist.length?`<div class="supply-simple-history"><div class="supply-simple-history-title">교체 이력</div><div class="supply-simple-row head"><span>교체일</span><span>경과</span><span>비용</span><span>업체/연락처</span></div>${hist.slice().reverse().map((h,revIdx)=>{const idx=hist.length-1-revIdx;const prev=idx>0?hist[idx-1]:null;const elapsed=prev&&prev.date&&h.date?Math.max(0,Math.round((supplyParseDate(h.date)-supplyParseDate(prev.date))/86400000))+`일`:`첫 등록`;const contact=[h.vendor,h.tel].filter(Boolean).map(supplyEsc).join(' / ')||'-';const memo=h.memo?`<div class="supply-simple-note">${supplyEsc(h.memo)}</div>`:'';return `<div class="supply-simple-row" onclick="openSupplyHistoryView('${s.id}',${idx})"><b>${supplyDateLabel(h.date)}</b><span>${elapsed}</span><span>${supplyMoney(h.cost)}</span><div class="supply-simple-sub">${contact}</div>${memo}</div>`;}).join('')}</div>`:`<div class="supply-simple-empty">아직 교체 이력이 없어요</div>`;
        return `<div class="supply-card"><div class="supply-simple-card"><div class="supply-simple-head"><div class="supply-simple-name" title="${supplyEsc(s.name)}">${supplyEsc(s.name)}</div><button class="supply-simple-edit" onclick="openSupplyEdit('${s.id}')">수정</button>${supplyDdayBadge(st.diff)}</div><div class="supply-simple-grid"><div class="supply-simple-box"><span>교체주기</span><b>${supplyCycleText(s)}</b></div><div class="supply-simple-box"><span>최근 교체</span><b>${supplyDateLabel(st.lastDate)}</b></div><div class="supply-simple-box"><span>교체비용</span><b>${supplyMoney(latest?.cost)}</b></div><div class="supply-simple-box"><span>다음 교체</span><b>${supplyDateLabel(st.nextDate)}</b></div></div><button class="supply-simple-add" onclick="openSupplyHistoryModal('${s.id}')">+ 교체이력 추가</button>${history}</div></div>`;
      }).join('');
    };
    if(document.getElementById('supplyList'))window.renderSupply();
    return true;
  }
  function boot(){if(!installSupplySimpleFinal())setTimeout(boot,200);}
  boot();
  document.addEventListener('DOMContentLoaded',boot);
})();
/* Supply one-line final UI */
(function(){
  function installSupplyOneLine(){
    if(typeof supplyStatus==='undefined'||typeof supplyList==='undefined')return false;
    if(!document.getElementById('zuoSupplyOneLineStyle')){
      const style=document.createElement('style');
      style.id='zuoSupplyOneLineStyle';
      style.textContent=`
        .supply-summary{display:none!important}
        .supply-card-list{display:block!important}
        .supply-one-wrap{background:#fff;border:1px solid var(--bd);border-radius:8px;overflow:hidden;margin-bottom:10px}
        .supply-one-row{display:grid;grid-template-columns:minmax(86px,1.35fr) 66px 74px 68px 74px 54px 78px;gap:6px;align-items:center;padding:10px 10px;border-top:1px solid #f1f1f1;background:#fff}
        .supply-one-row:first-child{border-top:none}
        .supply-one-row.head{background:#fafafa;color:#777;font-size:10px;font-weight:800;padding:8px 10px}
        .supply-one-name{font-size:15px;font-weight:900;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
        .supply-one-cell{font-size:11px;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
        .supply-one-muted{color:#777;font-size:10px}
        .supply-one-dday{font-size:11px;font-weight:900;border-radius:999px;padding:4px 6px;text-align:center;white-space:nowrap}
        .supply-one-dday.ok{background:var(--gl);color:var(--gd)}
        .supply-one-dday.soon{background:var(--al);color:var(--ad)}
        .supply-one-dday.over{background:#FCEBEB;color:var(--red)}
        .supply-one-dday.neutral{background:#f4f4f4;color:#888}
        .supply-one-add{border:none;background:var(--green);color:#fff;border-radius:7px;padding:7px 5px;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap}
        .supply-one-tools{display:flex;gap:5px;margin-top:7px}
        .supply-one-tools button{border:1px solid var(--bd);background:#fff;border-radius:6px;padding:4px 7px;font-size:10px;color:#666}
        .supply-one-history{grid-column:1/-1;background:#fcfcfc;border-top:1px solid #f1f1f1;padding:8px 10px 10px}
        .supply-one-history-title{font-size:12px;font-weight:900;margin-bottom:6px;color:#111}
        .supply-one-history-row{display:grid;grid-template-columns:78px 54px 72px 1fr;gap:6px;align-items:center;padding:6px 0;border-top:1px solid #f1f1f1;font-size:11px;color:#333;cursor:pointer}
        .supply-one-history-row.head{color:#888;font-size:10px;font-weight:800;border-top:none;cursor:default;padding-top:0}
        .supply-one-history-row b{font-size:12px;color:#111}
        .supply-one-empty{font-size:12px;color:#999;text-align:center;padding:12px;border:1px dashed #e5e5e5;border-radius:8px;background:#fff}
        @media(max-width:430px){
          .supply-one-row{grid-template-columns:minmax(72px,1.2fr) 54px 64px 56px 64px 46px 58px;gap:4px;padding:9px 7px}
          .supply-one-row.head{font-size:9px;padding:7px}
          .supply-one-name{font-size:14px}.supply-one-cell{font-size:10px}.supply-one-add{font-size:10px;padding:7px 3px}.supply-one-dday{font-size:10px;padding:4px 4px}
        }
      `;
      document.head.appendChild(style);
    }
    function ddaySpan(diff){
      if(diff===null||diff===undefined)return '<span class="supply-one-dday neutral">-</span>';
      const label=diff<0?'D+'+Math.abs(diff):(diff===0?'D-day':'D-'+diff);
      const cls=diff<0?'over':diff<=3?'soon':'ok';
      return `<span class="supply-one-dday ${cls}">${label}</span>`;
    }
    function historyBlock(s,st){
      const hist=st.hist||[];
      if(!hist.length)return '<div class="supply-one-history"><div class="supply-one-empty">아직 교체 이력이 없어요</div></div>';
      return `<div class="supply-one-history"><div class="supply-one-history-title">교체 이력</div><div class="supply-one-history-row head"><span>교체일</span><span>경과</span><span>비용</span><span>업체/연락처</span></div>${hist.slice().reverse().map((h,revIdx)=>{const idx=hist.length-1-revIdx;const prev=idx>0?hist[idx-1]:null;const elapsed=prev&&prev.date&&h.date?Math.max(0,Math.round((supplyParseDate(h.date)-supplyParseDate(prev.date))/86400000))+'일':'첫 등록';const contact=[h.vendor,h.tel].filter(Boolean).map(supplyEsc).join(' / ')||'-';return `<div class="supply-one-history-row" onclick="openSupplyHistoryView('${s.id}',${idx})"><b>${supplyDateLabel(h.date)}</b><span>${elapsed}</span><span>${supplyMoney(h.cost)}</span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${contact}</span></div>`;}).join('')}</div>`;
    }
    window.renderSupply=function(){
      const w=document.getElementById('supplyList');if(!w)return;
      const summary=document.getElementById('supplySummary');if(summary)summary.innerHTML='';
      if(!supplyList.length){w.innerHTML=`<div class="supply-empty">등록된 소모품이 없어요<br><span style="font-size:11px">+ 추가로 소모품 이름과 관리주기를 먼저 등록하세요</span></div>`;return;}
      const list=[...supplyList].sort((a,b)=>{const da=supplyStatus(a).nextDate||'9999-99-99';const db=supplyStatus(b).nextDate||'9999-99-99';return da.localeCompare(db);});
      w.innerHTML=`<div class="supply-one-wrap"><div class="supply-one-row head"><span>항목</span><span>교체주기</span><span>최근교체</span><span>비용</span><span>다음교체</span><span>D-day</span><span></span></div>${list.map(s=>{const st=supplyStatus(s);const latest=st.latest;const open=supplyExpandedId===s.id;return `<div class="supply-one-row" onclick="supplyExpandedId=supplyExpandedId==='${s.id}'?null:'${s.id}';renderSupply()"><div><div class="supply-one-name" title="${supplyEsc(s.name)}">${supplyEsc(s.name)}</div><div class="supply-one-tools"><button onclick="event.stopPropagation();openSupplyEdit('${s.id}')">수정</button><button onclick="event.stopPropagation();deleteSupply('${s.id}')">삭제</button></div></div><span class="supply-one-cell">${supplyCycleText(s)}</span><span class="supply-one-cell">${supplyDateLabel(st.lastDate)}</span><span class="supply-one-cell">${supplyMoney(latest?.cost)}</span><span class="supply-one-cell">${supplyDateLabel(st.nextDate)}</span>${ddaySpan(st.diff)}<button class="supply-one-add" onclick="event.stopPropagation();openSupplyHistoryModal('${s.id}')">이력 추가</button>${open?historyBlock(s,st):''}</div>`;}).join('')}</div>`;
    };
    if(document.getElementById('supplyList'))window.renderSupply();
    return true;
  }
  function boot(){try{if(!installSupplyOneLine())setTimeout(boot,200);}catch(e){console.error('supply one-line ui:',e);}}
  boot();
  document.addEventListener('DOMContentLoaded',boot);
})();