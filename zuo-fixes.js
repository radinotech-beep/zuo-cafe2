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
/* Supply clean list UI: compact rows, light type, explicit history add */
(function(){
  function installSupplyCleanList(){
    if(typeof supplyStatus==='undefined'||typeof supplyList==='undefined')return false;
    const addBtn=[...document.querySelectorAll('#scSupply button')].find(b=>(b.textContent||'').trim()==='+ 추가');
    if(addBtn) addBtn.textContent='+ 소모품 항목 추가';
    if(!document.getElementById('zuoSupplyCleanListStyle')){
      const style=document.createElement('style');
      style.id='zuoSupplyCleanListStyle';
      style.textContent=`
        .supply-summary{display:none!important}
        .supply-card,.supply-simple-card,.supply-one-wrap{box-shadow:none!important;border:none!important;background:transparent!important}
        .supply-clean-table{background:#fff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;margin:10px 0 14px}
        .supply-clean-row{display:grid;grid-template-columns:minmax(72px,1.25fr) 48px 56px 64px 56px 48px;gap:4px;align-items:center;padding:9px 8px;border-top:1px solid #ececec;background:#fff;color:#111}
        .supply-clean-row:nth-child(even){background:#fcfcfc}
        .supply-clean-row:first-child{border-top:none}
        .supply-clean-row.head{background:#f4f7f6;color:#4f5f5b;font-size:9.5px;font-weight:500;padding:7px 8px}
        .supply-clean-name{font-size:13.5px;font-weight:500;color:#111;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
        .supply-clean-cell{font-size:10.5px;font-weight:400;color:#222;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
        .supply-clean-cycle{cursor:pointer;color:#0f6e56;text-decoration:underline;text-underline-offset:2px}
        .supply-clean-dday{display:inline-block;font-size:10px;font-weight:500;border-radius:999px;padding:4px 5px;text-align:center;white-space:nowrap;min-width:38px}
        .supply-clean-dday.ok{background:#e8f5ef;color:#0f6e56}.supply-clean-dday.soon{background:#faeeda;color:#854f0b}.supply-clean-dday.over{background:#fcebeb;color:#c93434}.supply-clean-dday.neutral{background:#f1f1f1;color:#777}
        .supply-clean-detail{grid-column:1/-1;background:#fbfbfb;border-top:1px solid #e8e8e8;padding:9px 8px 10px}
        .supply-clean-add{width:100%;border:none;background:#ba7517;color:#fff;border-radius:7px;padding:8px;font-size:12px;font-weight:500;cursor:pointer;margin-bottom:8px}
        .supply-clean-history{border:1px solid #eeeeee;border-radius:7px;overflow:hidden;background:#fff}
        .supply-clean-history-row{display:grid;grid-template-columns:58px 48px 62px 1fr;gap:5px;align-items:center;padding:7px 8px;border-top:1px solid #f0f0f0;font-size:10.5px;font-weight:400;color:#222;cursor:pointer}
        .supply-clean-history-row:first-child{border-top:none}
        .supply-clean-history-row.head{background:#f8f8f8;color:#777;font-size:9.5px;font-weight:500;cursor:default}
        .supply-clean-history-row span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
        .supply-clean-empty{font-size:11px;color:#888;text-align:center;padding:10px;border:1px dashed #ddd;border-radius:7px;background:#fff}
        @media(max-width:390px){
          .supply-clean-row{grid-template-columns:minmax(64px,1.15fr) 42px 52px 56px 52px 43px;gap:3px;padding:8px 6px}
          .supply-clean-row.head{font-size:9px;padding:7px 6px}.supply-clean-name{font-size:13px}.supply-clean-cell{font-size:10px}.supply-clean-dday{font-size:9.5px;min-width:34px;padding:4px 4px}
        }
      `;
      document.head.appendChild(style);
    }
    function shortDate(v){
      if(!v)return '-';
      const s=String(v);
      const m=s.match(/^(\d{4})[-.](\d{1,2})[-.](\d{1,2})/);
      if(!m)return s;
      return `${m[1].slice(2)}.${String(m[2]).padStart(2,'0')}/${String(m[3]).padStart(2,'0')}`;
    }
    function shortCycle(s){
      const n=parseInt(s.cycleNum)||0;
      if(!n)return '-';
      const unit=s.cycleUnit==='month'?'개월':s.cycleUnit==='year'?'년':'일';
      return `${n}${unit}`;
    }
    function dday(diff){
      if(diff===null||diff===undefined)return '<span class="supply-clean-dday neutral">-</span>';
      const label=diff<0?'D+'+Math.abs(diff):(diff===0?'D-day':'D-'+diff);
      const cls=diff<0?'over':diff<=3?'soon':'ok';
      return `<span class="supply-clean-dday ${cls}">${label}</span>`;
    }
    function money(v){return supplyMoneyNum(v)?supplyMoney(v):'-';}
    function historyHtml(s,st){
      const hist=st.hist||[];
      const rows=hist.length?`<div class="supply-clean-history"><div class="supply-clean-history-row head"><span>교체일</span><span>경과</span><span>비용</span><span>업체/연락처</span></div>${hist.slice().reverse().map((h,revIdx)=>{const idx=hist.length-1-revIdx;const prev=idx>0?hist[idx-1]:null;const elapsed=prev&&prev.date&&h.date?Math.max(0,Math.round((supplyParseDate(h.date)-supplyParseDate(prev.date))/86400000))+'일':'첫 등록';const contact=[h.vendor,h.tel].filter(Boolean).map(supplyEsc).join(' / ')||'-';return `<div class="supply-clean-history-row" onclick="openSupplyHistoryView('${s.id}',${idx})"><span>${shortDate(h.date)}</span><span>${elapsed}</span><span>${money(h.cost)}</span><span>${contact}</span></div>`;}).join('')}</div>`:`<div class="supply-clean-empty">아직 교체 이력이 없어요</div>`;
      return `<div class="supply-clean-detail"><button class="supply-clean-add" onclick="event.stopPropagation();openSupplyHistoryModal('${s.id}')">+ 교체이력 추가</button>${rows}</div>`;
    }
    window.renderSupply=function(){
      const w=document.getElementById('supplyList');if(!w)return;
      const summary=document.getElementById('supplySummary');if(summary)summary.innerHTML='';
      if(!supplyList.length){w.innerHTML=`<div class="supply-empty">등록된 소모품이 없어요<br><span style="font-size:11px">+ 소모품 항목 추가로 먼저 등록하세요</span></div>`;return;}
      const list=[...supplyList].sort((a,b)=>{const da=supplyStatus(a).nextDate||'9999-99-99';const db=supplyStatus(b).nextDate||'9999-99-99';return da.localeCompare(db);});
      w.innerHTML=`<div class="supply-clean-table"><div class="supply-clean-row head"><span>항목</span><span>주기</span><span>최근</span><span>비용</span><span>다음</span><span>D-day</span></div>${list.map(s=>{const st=supplyStatus(s);const latest=st.latest;const open=supplyExpandedId===s.id;return `<div class="supply-clean-row" onclick="supplyExpandedId=supplyExpandedId==='${s.id}'?null:'${s.id}';renderSupply()"><div class="supply-clean-name" title="${supplyEsc(s.name)}">${supplyEsc(s.name)}</div><span class="supply-clean-cell supply-clean-cycle" onclick="event.stopPropagation();openSupplyEdit('${s.id}')">${shortCycle(s)}</span><span class="supply-clean-cell">${shortDate(st.lastDate)}</span><span class="supply-clean-cell">${money(latest?.cost)}</span><span class="supply-clean-cell">${shortDate(st.nextDate)}</span>${dday(st.diff)}${open?historyHtml(s,st):''}</div>`;}).join('')}</div>`;
    };
    if(document.getElementById('supplyList'))window.renderSupply();
    return true;
  }
  function boot(){try{if(!installSupplyCleanList())setTimeout(boot,200);}catch(e){console.error('supply clean list ui:',e);}}
  boot();
  document.addEventListener('DOMContentLoaded',boot);
})();
/* Supply clean list v2: clearer labels, serial numbers, edit history popup */
(function(){
  function installSupplyCleanListV2(){
    if(typeof supplyStatus==='undefined'||typeof supplyList==='undefined')return false;
    const addBtn=[...document.querySelectorAll('#scSupply button')].find(b=>/^\+\s*(추가|소모품 항목 추가)/.test((b.textContent||'').trim()));
    if(addBtn) addBtn.textContent='+ 소모품 항목 추가';
    if(!document.getElementById('zuoSupplyCleanListV2Style')){
      const style=document.createElement('style');
      style.id='zuoSupplyCleanListV2Style';
      style.textContent=`
        .supply-clean-row{grid-template-columns:minmax(86px,1.25fr) 48px 72px 64px 72px 48px!important}
        .supply-clean-row.head{font-size:9.3px!important;color:#40514d!important;background:#f3f7f5!important}
        .supply-clean-history-row{grid-template-columns:58px 70px 66px 1fr!important}
        .supply-clean-add{margin:8px 0 0!important;background:#ba7517!important;font-weight:500!important}
        .supply-clean-name{font-weight:500!important}
        .supply-clean-serial{color:#777;margin-right:4px;font-size:11px}
        @media(max-width:390px){.supply-clean-row{grid-template-columns:minmax(76px,1.2fr) 42px 62px 56px 62px 42px!important}}
      `;
      document.head.appendChild(style);
    }
    function shortDate(v){if(!v)return '-';const s=String(v);const m=s.match(/^(\d{4})[-.](\d{1,2})[-.](\d{1,2})/);if(!m)return s;return `${m[1].slice(2)}.${String(m[2]).padStart(2,'0')}/${String(m[3]).padStart(2,'0')}`;}
    function shortCycle(s){const n=parseInt(s.cycleNum)||0;if(!n)return '-';const unit=s.cycleUnit==='month'?'개월':s.cycleUnit==='year'?'년':'일';return `${n}${unit}`;}
    function dday(diff){if(diff===null||diff===undefined)return '<span class="supply-clean-dday neutral">-</span>';const label=diff<0?'D+'+Math.abs(diff):(diff===0?'D-day':'D-'+diff);const cls=diff<0?'over':diff<=3?'soon':'ok';return `<span class="supply-clean-dday ${cls}">${label}</span>`;}
    function money(v){return supplyMoneyNum(v)?supplyMoney(v):'-';}
    window.openSupplyHistoryView=function(id,idx){openSupplyHistoryModal(id,idx);};
    function historyHtml(s,st){
      const hist=st.hist||[];
      const rows=hist.length?`<div class="supply-clean-history"><div class="supply-clean-history-row head"><span>교체일</span><span>교체경과일</span><span>교체비용</span><span>업체/연락처</span></div>${hist.slice().reverse().map((h,revIdx)=>{const idx=hist.length-1-revIdx;const prev=idx>0?hist[idx-1]:null;const elapsed=prev&&prev.date&&h.date?Math.max(0,Math.round((supplyParseDate(h.date)-supplyParseDate(prev.date))/86400000))+'일':'첫 등록';const contact=[h.vendor,h.tel].filter(Boolean).map(supplyEsc).join(' / ')||'-';return `<div class="supply-clean-history-row" onclick="event.stopPropagation();openSupplyHistoryModal('${s.id}',${idx})"><span>${shortDate(h.date)}</span><span>${elapsed}</span><span>${money(h.cost)}</span><span>${contact}</span></div>`;}).join('')}</div>`:`<div class="supply-clean-empty">아직 교체 이력이 없어요</div>`;
      return `<div class="supply-clean-detail">${rows}<button class="supply-clean-add" onclick="event.stopPropagation();openSupplyHistoryModal('${s.id}')">+ 교체이력 추가</button></div>`;
    }
    window.renderSupply=function(){
      const w=document.getElementById('supplyList');if(!w)return;
      const summary=document.getElementById('supplySummary');if(summary)summary.innerHTML='';
      if(!supplyList.length){w.innerHTML=`<div class="supply-empty">등록된 소모품이 없어요<br><span style="font-size:11px">+ 소모품 항목 추가로 먼저 등록하세요</span></div>`;return;}
      const list=[...supplyList].sort((a,b)=>{const da=supplyStatus(a).nextDate||'9999-99-99';const db=supplyStatus(b).nextDate||'9999-99-99';return da.localeCompare(db);});
      w.innerHTML=`<div class="supply-clean-table"><div class="supply-clean-row head"><span>항목</span><span>주기</span><span>최근교체일</span><span>교체비용</span><span>다음교체일</span><span>D-day</span></div>${list.map((s,i)=>{const st=supplyStatus(s);const latest=st.latest;const open=supplyExpandedId===s.id;return `<div class="supply-clean-row" onclick="supplyExpandedId=supplyExpandedId==='${s.id}'?null:'${s.id}';renderSupply()"><div class="supply-clean-name" title="${supplyEsc(s.name)}"><span class="supply-clean-serial">${i+1}.</span>${supplyEsc(s.name)}</div><span class="supply-clean-cell supply-clean-cycle" onclick="event.stopPropagation();openSupplyEdit('${s.id}')">${shortCycle(s)}</span><span class="supply-clean-cell">${shortDate(st.lastDate)}</span><span class="supply-clean-cell">${money(latest?.cost)}</span><span class="supply-clean-cell">${shortDate(st.nextDate)}</span>${dday(st.diff)}${open?historyHtml(s,st):''}</div>`;}).join('')}</div>`;
    };
    if(document.getElementById('supplyList'))window.renderSupply();
    return true;
  }
  function boot(){try{if(!installSupplyCleanListV2())setTimeout(boot,200);}catch(e){console.error('supply clean list v2:',e);}}
  boot();
  document.addEventListener('DOMContentLoaded',boot);
})();
/* Supply mobile fit: keep all columns visible on phone */
(function(){
  function installSupplyMobileFit(){
    if(!document.getElementById('zuoSupplyMobileFitStyle')){
      const style=document.createElement('style');
      style.id='zuoSupplyMobileFitStyle';
      style.textContent=`
        #scSupply .supply-page{padding:10px 8px 18px!important;overflow-x:hidden!important}
        #scSupply .supply-clean-table{width:100%!important;max-width:100%!important;box-sizing:border-box!important;overflow:hidden!important}
        #scSupply .supply-clean-row{box-sizing:border-box!important;width:100%!important;grid-template-columns:minmax(58px,1.25fr) 38px 58px 56px 58px 42px!important;gap:3px!important;padding:8px 6px!important}
        #scSupply .supply-clean-row.head{font-size:8.5px!important;padding:7px 6px!important}
        #scSupply .supply-clean-name{font-size:12.5px!important;font-weight:500!important}
        #scSupply .supply-clean-serial{font-size:10px!important;margin-right:2px!important}
        #scSupply .supply-clean-cell{font-size:9.8px!important}
        #scSupply .supply-clean-dday{font-size:9px!important;min-width:34px!important;padding:3px 4px!important;box-sizing:border-box!important}
        #scSupply .supply-clean-history-row{grid-template-columns:54px 62px 58px minmax(0,1fr)!important;gap:4px!important;padding:7px 6px!important;font-size:9.8px!important}
        #scSupply .supply-clean-history-row.head{font-size:8.8px!important}
        #scSupply .supply-clean-detail{padding:8px 6px 9px!important}
        #scSupply .hdr button[onclick="openSupplyAdd()"]{font-size:10.5px!important;padding:6px 8px!important;white-space:nowrap!important}
        @media(max-width:360px){
          #scSupply .supply-clean-row{grid-template-columns:minmax(50px,1.2fr) 34px 52px 50px 52px 38px!important;gap:2px!important;padding:8px 5px!important}
          #scSupply .supply-clean-row.head{font-size:8px!important}
          #scSupply .supply-clean-name{font-size:12px!important}
          #scSupply .supply-clean-cell{font-size:9.2px!important}
          #scSupply .supply-clean-dday{font-size:8.8px!important;min-width:32px!important;padding:3px 3px!important}
        }
      `;
      document.head.appendChild(style);
    }
  }
  installSupplyMobileFit();
  document.addEventListener('DOMContentLoaded',installSupplyMobileFit);
})();

/* Task #50: admin worker-channel PIN bypass + payslip holiday-rate refresh */
(function(){
  function closeWorkerModals(){
    var pw=document.getElementById('workerPwModal');
    var sel=document.getElementById('workerSelectModal');
    if(pw)pw.classList.remove('open');
    if(sel)sel.classList.remove('open');
  }

  function enterWorkerAsAdmin(purpose){
    closeWorkerModals();
    if(purpose==='entry'){
      showScreen('scSvcWorker');
      showToast(`${currentWorkerEmp.name}님 채널 (관리자 입장)`);
    }else{
      enterWorkerInput();
    }
  }

  function patchWorkerAdminBypass(){
    if(window.__zuoTask50WorkerPatched)return true;
    if(typeof openWorkerPw!=='function'||typeof enterWorkerInput!=='function')return false;

    var originalOpenWorkerPw=openWorkerPw;
    window.openWorkerPw=function(empId){
      var emp=employees.find(function(e){return e.id===empId;});
      if(!emp)return;
      currentWorkerEmp=emp;
      if(isAdminMode){
        if(currentWorkerEmp.resigned){
          showToast('퇴사자는 입장할 수 없어요');
          return;
        }
        enterWorkerAsAdmin(workerAuthPurpose);
        return;
      }
      return originalOpenWorkerPw.apply(this,arguments);
    };

    var originalEnterWorkerInput=enterWorkerInput;
    window.enterWorkerInput=function(){
      if(isAdminMode&&currentWorkerEmp&&!currentWorkerEmp.resigned){
        var originalHasWorkerSession=window.hasWorkerSession;
        window.hasWorkerSession=function(){return true;};
        try{
          return originalEnterWorkerInput.apply(this,arguments);
        }finally{
          window.hasWorkerSession=originalHasWorkerSession;
        }
      }
      return originalEnterWorkerInput.apply(this,arguments);
    };

    if(typeof enterWorkerMenu==='function'){
      var originalEnterWorkerMenu=enterWorkerMenu;
      window.enterWorkerMenu=function(purpose){
        if(isAdminMode&&currentWorkerEmp&&!currentWorkerEmp.resigned){
          enterWorkerAsAdmin(purpose);
          return;
        }
        return originalEnterWorkerMenu.apply(this,arguments);
      };
    }

    window.__zuoTask50WorkerPatched=true;
    return true;
  }

  function patchPayslipHolidayRate(){
    if(window.__zuoTask50PayslipPatched)return true;
    if(typeof openPayslip!=='function'||typeof db==='undefined')return false;

    window.openPayslip=async function(empId){
      const emp=employees.find(e=>e.id===empId);if(!emp)return;
      psCurrentEmp=emp;
      const period=`${payY}-${String(payM+1).padStart(2,'0')}`;
      const snap=await db.collection('workHours').where('empId','==',empId).where('period','==',period).get();
      const workDays=getWorkDaysFromSnapshot(snap);
      const total=sumWorkDays(workDays);
      const base=Math.round(total*(emp.rate||0));
      const weeksInMonth=(()=>{
        let sundays=0;
        const daysInMonth=new Date(payY,payM+1,0).getDate();
        for(let d=1;d<=daysInMonth;d++){
          if(new Date(payY,payM,d).getDay()===0)sundays++;
        }
        return sundays;
      })();
      const weeklyHrs=weeksInMonth?total/weeksInMonth:0;

      if(emp.holidayRate!==null&&emp.holidayRate!==undefined){
        psHoliRateVal=Number(emp.holidayRate)||0;
      }else if(weeklyHrs>=15){
        psHoliRateVal=Math.round((weeklyHrs/40)*8*(emp.rate||0));
      }else{
        psHoliRateVal=0;
      }
      psWeekCntVal=weeksInMonth;

      const psSnap=await db.collection('payslips').where('empId','==',empId).where('period','==',period).get();
      let savedBonus=0,savedBonusMemo='',savedEtc=0,savedEtcMemo='';
      if(!psSnap.empty){
        const saved=psSnap.docs[0].data();
        const hasEmpRate=emp.holidayRate!==null&&emp.holidayRate!==undefined;
        const empHoliRate=hasEmpRate?(Number(emp.holidayRate)||0):0;
        if(hasEmpRate&&saved.holiRateVal!==undefined&&Number(saved.holiRateVal)!==empHoliRate){
          psHoliRateVal=empHoliRate;
          showToast('주휴단가가 변경됐어요. 저장하면 반영돼요.');
        }else if(saved.holiRateVal!==undefined){
          psHoliRateVal=Number(saved.holiRateVal)||0;
        }
        if(saved.weekCntVal!==undefined)psWeekCntVal=Number(saved.weekCntVal)||0;
        savedBonus=saved.bonus||0;
        savedBonusMemo=saved.bonusMemo||'';
        savedEtc=saved.etc||0;
        savedEtcMemo=saved.etcMemo||'';
      }

      const empType=emp.empType||'기타';
      const typeLabel={정규직:'정규직 (4대보험)',프리랜서:'프리랜서 (3.3%)',일용직:'일용직 (2.97%+고용보험)',기타:'기타 (공제없음)'};
      document.getElementById('psCafeName').textContent=`☕ ${currentCafe.name} · 급여 명세서`;
      document.getElementById('psName').textContent=emp.name;
      document.getElementById('psPeriod').textContent=`${payY}년 ${payM+1}월 급여 명세서`;
      document.getElementById('psEmpType').textContent=typeLabel[empType]||empType;
      document.getElementById('psHours').textContent=formatHours2(total)+'시간';
      document.getElementById('psRate').textContent='₩'+(emp.rate||0).toLocaleString();
      document.getElementById('psBase').textContent='₩'+base.toLocaleString();
      document.getElementById('psHoliRate').textContent='₩'+psHoliRateVal.toLocaleString();
      setCurrencyValue('psHoliRateInput',psHoliRateVal);
      document.getElementById('psWeekCnt').textContent=psWeekCntVal;
      document.getElementById('psWeekCntDisp').textContent=psWeekCntVal;
      document.getElementById('psBonus').value=savedBonus;
      document.getElementById('psBonusMemo').value=savedBonusMemo;
      document.getElementById('psEtc').value=savedEtc;
      document.getElementById('psEtcMemo').value=savedEtcMemo;
      calcPayTotal();showScreen('scPayslip');
    };

    window.__zuoTask50PayslipPatched=true;
    return true;
  }

  function bootTask50(){
    var okWorker=patchWorkerAdminBypass();
    var okPayslip=patchPayslipHolidayRate();
    if(!okWorker||!okPayslip)setTimeout(bootTask50,200);
  }

  bootTask50();
  document.addEventListener('DOMContentLoaded',bootTask50);
})();

/* Task #51: payslip confirmation and worker read-only payslip viewing */
(function(){
  let originalOpenPayslip51=null;
  let originalSavePayslip51=null;

  function payPeriod(){
    return `${payY}-${String(payM+1).padStart(2,'0')}`;
  }

  function ensurePayslipControls(){
    const saveBtn=document.querySelector('#scPayslip button[onclick="savePayslip()"]');
    const captureBtn=document.querySelector('#scPayslip button[onclick="captureAndShare()"]');
    if(saveBtn&&!saveBtn.id)saveBtn.id='psSaveBtn';
    if(captureBtn&&!captureBtn.id)captureBtn.id='psCaptureBtn';
    if(saveBtn&&captureBtn&&!document.getElementById('psConfirmBtn')){
      const btn=document.createElement('button');
      btn.id='psConfirmBtn';
      btn.type='button';
      btn.textContent='✅ 급여 확정';
      btn.onclick=confirmPayslip;
      btn.style.cssText='flex:1;padding:11px;border-radius:8px;border:none;background:#1D9E75;color:#fff;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap';
      captureBtn.parentNode.insertBefore(btn,captureBtn);
    }
    const card=document.getElementById('payslipCard');
    if(card&&!document.getElementById('psReadOnlyBadge')){
      const badge=document.createElement('div');
      badge.id='psReadOnlyBadge';
      badge.textContent='🔒 확정된 명세서 (열람 전용)';
      badge.style.cssText='display:none;margin:0 0 8px;padding:7px 10px;border-radius:8px;background:#EAF6F2;color:#0F6E56;font-size:12px;font-weight:700;text-align:center';
      card.parentNode.insertBefore(badge,card);
    }
  }

  async function findPayslipDoc(empId,period){
    const snap=await db.collection('payslips').where('empId','==',empId).where('period','==',period).limit(1).get();
    if(snap.empty)return null;
    return {id:snap.docs[0].id,data:snap.docs[0].data()};
  }

  function setPayslipReadOnly(readOnly){
    ['psHoliRateInput','psBonus','psBonusMemo','psEtc','psEtcMemo'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){el.disabled=!!readOnly;el.readOnly=!!readOnly;el.style.background=readOnly?'#f3f4f6':'';}
    });
    document.querySelectorAll('#scPayslip .hc-btn-sm').forEach(btn=>{
      btn.disabled=!!readOnly;
      btn.style.opacity=readOnly?'0.45':'';
      btn.style.pointerEvents=readOnly?'none':'';
    });
    const saveBtn=document.getElementById('psSaveBtn');
    const confirmBtn=document.getElementById('psConfirmBtn');
    const badge=document.getElementById('psReadOnlyBadge');
    if(saveBtn)saveBtn.style.display=readOnly?'none':'';
    if(confirmBtn)confirmBtn.style.display=readOnly?'none':'';
    if(badge)badge.style.display=readOnly?'block':'none';
    const back=document.querySelector('#psHdrBar .back-btn');
    if(back)back.setAttribute('onclick',readOnly?"showScreen('scSvcWorker')":"showScreen('scPayManage')");
  }

  function updateConfirmButton(confirmed){
    ensurePayslipControls();
    const btn=document.getElementById('psConfirmBtn');
    if(!btn)return;
    btn.disabled=!!confirmed;
    btn.textContent=confirmed?'🔒 확정됨':'✅ 급여 확정';
    btn.style.background=confirmed?'#9CA3AF':'#1D9E75';
    btn.style.cursor=confirmed?'not-allowed':'pointer';
  }

  async function applyPayslipMode(){
    if(!psCurrentEmp)return;
    const found=await findPayslipDoc(psCurrentEmp.id,payPeriod());
    updateConfirmButton(!!found?.data?.confirmed);
    setPayslipReadOnly(!!window.isWorkerViewMode);
  }

  async function confirmPayslip(){
    if(!psCurrentEmp)return;
    if(!confirm('확정하면 직원이 명세서를 열람할 수 있어요. 확정하시겠어요?'))return;
    const period=payPeriod();
    let found=await findPayslipDoc(psCurrentEmp.id,period);
    if(!found){
      await savePayslip();
      found=await findPayslipDoc(psCurrentEmp.id,period);
    }
    if(!found){showToast('명세서를 저장하지 못했어요');return;}
    const ts=(typeof firebase!=='undefined'&&firebase.firestore?.FieldValue?.serverTimestamp)?firebase.firestore.FieldValue.serverTimestamp():Date.now();
    await db.collection('payslips').doc(found.id).update({confirmed:true,confirmedAt:ts});
    updateConfirmButton(true);
    if(typeof renderPayEmpList==='function')renderPayEmpList();
    showToast('급여명세서를 확정했어요');
  }

  function openEmpWorkTime(empId){
    const emp=employees.find(e=>e.id===empId);
    if(!emp)return;
    currentWorkerEmp=emp;
    workerAuthPurpose='time';
    isAdminMode=true;
    enterWorkerInput();
  }

  function installPayListPatch(){
    if(typeof renderPayEmpList!=='function'||typeof db==='undefined')return false;
    window.renderPayEmpList=async function(){
      updatePayMonthLabels();
      const w=document.getElementById('payEmpList');
      if(!w)return;
      if(!employees.length){w.innerHTML=`<div style="text-align:center;padding:24px;font-size:12px;color:var(--t3)">등록된 직원이 없어요</div>`;return;}
      const period=payPeriod();
      const psSnap=await db.collection('payslips').where('cafeId','==',currentCafe.id).where('period','==',period).get();
      const confirmedMap={};
      psSnap.forEach(doc=>{const d=doc.data();if(d.confirmed)confirmedMap[d.empId]=true;});
      const colors=['var(--gl)','#EEEDFE','#FBEAF0','#E6F1FB','var(--al)'];
      const tcolors=['var(--gd)','#3C3489','#72243E','#0C447C','var(--ad)'];
      w.className='pay-compact-grid';
      w.innerHTML=employees.filter(e=>!e.resigned).map((e,i)=>`
        <div class="pay-compact-card" style="position:relative" onclick="openPayslip('${e.id}')">
          ${confirmedMap[e.id]?'<div class="pay-confirm-badge">🔒 확정</div>':''}
          <div class="emp-avatar" style="background:${colors[i%5]};color:${tcolors[i%5]}">${e.name.substring(0,2)}</div>
          <div style="flex:1;min-width:0"><div class="emp-nm">${e.name}</div><div class="emp-info">시급 ₩${(e.rate||0).toLocaleString()} · 주휴단가 ₩${(e.holidayRate||0).toLocaleString()}</div></div>
          <div class="pay-card-actions">
            <button class="pay-compact-action" onclick="event.stopPropagation();openPayslip('${e.id}')">명세서</button>
            <button class="pay-compact-action pay-time-action" onclick="event.stopPropagation();openEmpWorkTime('${e.id}')">근무시간</button>
          </div>
        </div>`).join('');
    };
    return true;
  }

  async function openWorkerConfirmedPayslip(){
    if(!currentWorkerEmp){showToast('직원 정보를 확인할 수 없어요');return;}
    const now=new Date();
    const oldY=payY,oldM=payM;
    payY=now.getFullYear();
    payM=now.getMonth();
    const found=await findPayslipDoc(currentWorkerEmp.id,payPeriod());
    if(!found||!found.data.confirmed){
      payY=oldY;payM=oldM;
      showToast('아직 이번달 급여가 확정되지 않았어요 🙏');
      return;
    }
    await openPayslip(currentWorkerEmp.id,{workerView:true});
  }

  function installWorkerPayslipCard(){
    const wrap=document.querySelector('#scSvcWorker .svc-wrap');
    if(!wrap||document.getElementById('workerPayslipCard'))return !!wrap;
    const card=document.createElement('div');
    card.className='svc-card';
    card.id='workerPayslipCard';
    card.onclick=openWorkerConfirmedPayslip;
    card.innerHTML=`
      <div class="svc-icon" style="background:#EAF6F2">💰</div>
      <div><div class="svc-name">이번달 급여명세서</div><div class="svc-desc">관리자가 확정한 명세서 열람</div></div>
    `;
    wrap.appendChild(card);
    return true;
  }

  function injectTask51Style(){
    if(document.getElementById('zuoTask51Style'))return;
    const style=document.createElement('style');
    style.id='zuoTask51Style';
    style.textContent=`
      .pay-card-actions{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:6px}
      .pay-time-action{background:#fff!important;color:#0F6E56!important;border:1px solid #B7DDCF!important}
      .pay-confirm-badge{position:absolute;right:8px;top:8px;background:#EAF6F2;color:#0F6E56;border:1px solid #B7DDCF;border-radius:999px;padding:3px 7px;font-size:10px;font-weight:700}
    `;
    document.head.appendChild(style);
  }

  function installTask51(){
    if(typeof db==='undefined'||typeof employees==='undefined')return false;
    injectTask51Style();
    ensurePayslipControls();
    window.confirmPayslip=confirmPayslip;
    window.openEmpWorkTime=openEmpWorkTime;
    window.openWorkerConfirmedPayslip=openWorkerConfirmedPayslip;
    installWorkerPayslipCard();
    if(!originalOpenPayslip51&&typeof openPayslip==='function')originalOpenPayslip51=openPayslip;
    if(originalOpenPayslip51&&!window.__zuoTask51OpenPayslipPatched){
      window.openPayslip=async function(empId,opts){
        window.isWorkerViewMode=!!(opts&&opts.workerView);
        await originalOpenPayslip51.call(this,empId);
        await applyPayslipMode();
      };
      window.__zuoTask51OpenPayslipPatched=true;
    }
    if(!originalSavePayslip51&&typeof savePayslip==='function')originalSavePayslip51=savePayslip;
    if(originalSavePayslip51&&!window.__zuoTask51SavePayslipPatched){
      window.savePayslip=async function(){
        await originalSavePayslip51.apply(this,arguments);
        await applyPayslipMode();
      };
      window.__zuoTask51SavePayslipPatched=true;
    }
    installPayListPatch();
    if(document.getElementById('payEmpList'))renderPayEmpList();
    return true;
  }

  function bootTask51(){
    try{if(!installTask51())setTimeout(bootTask51,250);}
    catch(e){console.error('task51 payslip confirmation:',e);}
  }

  bootTask51();
  document.addEventListener('DOMContentLoaded',bootTask51);
})();

/* Task #52: robust payslip confirm button + pay card button layout */
(function(){
  let originalOpenPayslip52=null;
  let originalSavePayslip52=null;
  let originalRenderPayEmpList52=null;

  function payPeriod52(){return `${payY}-${String(payM+1).padStart(2,'0')}`;}

  function qsPayslipButton(match){
    return [...document.querySelectorAll('#scPayslip button')].find(match)||null;
  }

  function ensurePayslipControls52(){
    const saveBtn=document.getElementById('psSaveBtn')||qsPayslipButton(b=>(b.getAttribute('onclick')||'').includes('savePayslip')||(b.textContent||'').includes('저장'));
    const captureBtn=document.getElementById('psCaptureBtn')||qsPayslipButton(b=>(b.getAttribute('onclick')||'').includes('captureAndShare')||(b.textContent||'').includes('급여명세서 이미지 저장'));
    if(saveBtn)saveBtn.id='psSaveBtn';
    if(captureBtn)captureBtn.id='psCaptureBtn';
    const row=(captureBtn&&captureBtn.parentElement)||(saveBtn&&saveBtn.parentElement);
    if(row){
      row.id='psActionRow';
      row.style.display='flex';
      row.style.gap='8px';
      row.style.alignItems='stretch';
    }
    let btn=document.getElementById('psConfirmBtn');
    if(!btn&&row){
      btn=document.createElement('button');
      btn.id='psConfirmBtn';
      btn.type='button';
      btn.onclick=confirmPayslip52;
      row.insertBefore(btn,captureBtn||null);
    }
    if(btn){
      btn.style.cssText='flex:1;padding:11px;border-radius:8px;border:none;background:#1D9E75;color:#fff;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap';
      if(!btn.textContent.trim())btn.textContent='✅ 급여 확정';
    }
    if(saveBtn)saveBtn.style.flex='1';
    if(captureBtn)captureBtn.style.flex='2';
    ensureReadOnlyBadge52();
    return !!btn;
  }

  function ensureReadOnlyBadge52(){
    const card=document.getElementById('payslipCard');
    if(!card||document.getElementById('psReadOnlyBadge'))return;
    const badge=document.createElement('div');
    badge.id='psReadOnlyBadge';
    badge.textContent='🔒 확정된 명세서 (열람 전용)';
    badge.style.cssText='display:none;margin:0 0 8px;padding:7px 10px;border-radius:8px;background:#EAF6F2;color:#0F6E56;font-size:12px;font-weight:700;text-align:center';
    card.parentNode.insertBefore(badge,card);
  }

  async function findPayslipDoc52(empId,period){
    const snap=await db.collection('payslips').where('empId','==',empId).where('period','==',period).limit(1).get();
    if(snap.empty)return null;
    return {id:snap.docs[0].id,data:snap.docs[0].data()};
  }

  function setConfirmState52(confirmed){
    ensurePayslipControls52();
    const btn=document.getElementById('psConfirmBtn');
    if(!btn)return;
    btn.disabled=!!confirmed;
    btn.textContent=confirmed?'🔒 확정됨':'✅ 급여 확정';
    btn.style.background=confirmed?'#9CA3AF':'#1D9E75';
    btn.style.cursor=confirmed?'not-allowed':'pointer';
    btn.style.display=window.isWorkerViewMode?'none':'flex';
  }

  function setPayslipReadOnly52(readOnly){
    ['psHoliRateInput','psBonus','psBonusMemo','psEtc','psEtcMemo'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){el.disabled=!!readOnly;el.readOnly=!!readOnly;el.style.background=readOnly?'#f3f4f6':'';}
    });
    document.querySelectorAll('#scPayslip .hc-btn-sm').forEach(btn=>{
      btn.disabled=!!readOnly;
      btn.style.opacity=readOnly?'0.45':'';
      btn.style.pointerEvents=readOnly?'none':'';
    });
    const saveBtn=document.getElementById('psSaveBtn');
    const confirmBtn=document.getElementById('psConfirmBtn');
    const badge=document.getElementById('psReadOnlyBadge');
    if(saveBtn)saveBtn.style.display=readOnly?'none':'';
    if(confirmBtn)confirmBtn.style.display=readOnly?'none':'flex';
    if(badge)badge.style.display=readOnly?'block':'none';
    const back=document.querySelector('#psHdrBar .back-btn');
    if(back)back.setAttribute('onclick',readOnly?"showScreen('scSvcWorker')":"showScreen('scPayManage')");
  }

  async function refreshPayslipConfirmUi52(){
    if(!psCurrentEmp)return;
    const found=await findPayslipDoc52(psCurrentEmp.id,payPeriod52());
    setConfirmState52(!!found?.data?.confirmed);
    setPayslipReadOnly52(!!window.isWorkerViewMode);
  }

  async function confirmPayslip52(){
    if(!psCurrentEmp)return;
    if(!confirm('확정하면 직원이 명세서를 열람할 수 있어요. 확정하시겠어요?'))return;
    const period=payPeriod52();
    let found=await findPayslipDoc52(psCurrentEmp.id,period);
    if(!found){
      await savePayslip();
      found=await findPayslipDoc52(psCurrentEmp.id,period);
    }
    if(!found){showToast('명세서를 저장하지 못했어요');return;}
    const ts=(typeof firebase!=='undefined'&&firebase.firestore?.FieldValue?.serverTimestamp)?firebase.firestore.FieldValue.serverTimestamp():Date.now();
    await db.collection('payslips').doc(found.id).update({confirmed:true,confirmedAt:ts});
    setConfirmState52(true);
    if(typeof renderPayEmpList==='function')renderPayEmpList();
    showToast('급여명세서를 확정했어요');
  }

  function openEmpWorkStatus52(empId){
    const emp=employees.find(e=>e.id===empId);
    if(!emp)return;
    currentWorkerEmp=emp;
    workerAuthPurpose='time';
    isAdminMode=true;
    enterWorkerInput();
  }

  function installPayListPatch52(){
    if(typeof renderPayEmpList!=='function'||typeof db==='undefined')return false;
    if(!originalRenderPayEmpList52)originalRenderPayEmpList52=renderPayEmpList;
    window.renderPayEmpList=async function(){
      updatePayMonthLabels();
      const w=document.getElementById('payEmpList');
      if(!w)return;
      if(!employees.length){w.innerHTML=`<div style="text-align:center;padding:24px;font-size:12px;color:var(--t3)">등록된 직원이 없어요</div>`;return;}
      const period=payPeriod52();
      const psSnap=await db.collection('payslips').where('cafeId','==',currentCafe.id).where('period','==',period).get();
      const confirmedMap={};
      psSnap.forEach(doc=>{const d=doc.data();if(d.confirmed)confirmedMap[d.empId]=true;});
      const colors=['var(--gl)','#EEEDFE','#FBEAF0','#E6F1FB','var(--al)'];
      const tcolors=['var(--gd)','#3C3489','#72243E','#0C447C','var(--ad)'];
      w.className='pay-compact-grid';
      w.innerHTML=employees.filter(e=>!e.resigned).map((e,i)=>`
        <div class="pay-compact-card" style="position:relative" onclick="openPayslip('${e.id}')">
          ${confirmedMap[e.id]?'<div class="pay-confirm-badge">🔒 확정</div>':''}
          <div class="emp-avatar" style="background:${colors[i%5]};color:${tcolors[i%5]}">${e.name.substring(0,2)}</div>
          <div style="flex:1;min-width:0"><div class="emp-nm">${e.name}</div><div class="emp-info">시급 ₩${(e.rate||0).toLocaleString()} · 주휴단가 ₩${(e.holidayRate||0).toLocaleString()}</div></div>
          <div class="pay-card-actions">
            <button class="pay-compact-action" onclick="event.stopPropagation();openPayslip('${e.id}')">명세서</button>
            <button class="pay-compact-action pay-time-action" onclick="event.stopPropagation();openEmpWorkStatus52('${e.id}')">근무현황</button>
          </div>
        </div>`).join('');
    };
    return true;
  }

  function injectTask52Style(){
    if(document.getElementById('zuoTask52Style'))return;
    const style=document.createElement('style');
    style.id='zuoTask52Style';
    style.textContent=`
      #psActionRow{display:flex!important;gap:8px!important;align-items:stretch!important}
      #psActionRow button{min-width:0!important}
      .pay-card-actions{grid-column:1/-1!important;display:flex!important;gap:8px!important;width:100%!important}
      .pay-card-actions .pay-compact-action{flex:1 1 0!important;width:auto!important;margin:0!important;min-width:0!important}
      .pay-time-action{background:#fff!important;color:#0F6E56!important;border:1px solid #B7DDCF!important}
      .pay-confirm-badge{position:absolute;right:8px;top:8px;background:#EAF6F2;color:#0F6E56;border:1px solid #B7DDCF;border-radius:999px;padding:3px 7px;font-size:10px;font-weight:700}
    `;
    document.head.appendChild(style);
  }

  function installTask52(){
    if(typeof db==='undefined'||typeof employees==='undefined')return false;
    injectTask52Style();
    ensurePayslipControls52();
    window.confirmPayslip=confirmPayslip52;
    window.openEmpWorkStatus52=openEmpWorkStatus52;
    if(!originalOpenPayslip52&&typeof openPayslip==='function')originalOpenPayslip52=openPayslip;
    if(originalOpenPayslip52&&!window.__zuoTask52OpenPayslipPatched){
      window.openPayslip=async function(empId,opts){
        window.isWorkerViewMode=!!(opts&&opts.workerView);
        await originalOpenPayslip52.call(this,empId,opts);
        ensurePayslipControls52();
        await refreshPayslipConfirmUi52();
      };
      window.__zuoTask52OpenPayslipPatched=true;
    }
    if(!originalSavePayslip52&&typeof savePayslip==='function')originalSavePayslip52=savePayslip;
    if(originalSavePayslip52&&!window.__zuoTask52SavePayslipPatched){
      window.savePayslip=async function(){
        await originalSavePayslip52.apply(this,arguments);
        await refreshPayslipConfirmUi52();
      };
      window.__zuoTask52SavePayslipPatched=true;
    }
    installPayListPatch52();
    if(document.getElementById('payEmpList'))renderPayEmpList();
    return true;
  }

  function bootTask52(){
    try{if(!installTask52())setTimeout(bootTask52,250);}
    catch(e){console.error('task52 payslip confirm button:',e);}
  }

  bootTask52();
  document.addEventListener('DOMContentLoaded',bootTask52);
})();

/* Task #53: worker confirmed payslip history list */
(function(){
  function normalizePeriod53(period){
    const s=String(period||'').trim();
    let m=s.match(/^(\d{4})-(\d{1,2})$/);
    if(m)return {key:`${m[1]}-${String(parseInt(m[2],10)).padStart(2,'0')}`,year:parseInt(m[1],10),month:parseInt(m[2],10)};
    m=s.match(/^(\d{4})\s*년\s*(\d{1,2})\s*월$/);
    if(m)return {key:`${m[1]}-${String(parseInt(m[2],10)).padStart(2,'0')}`,year:parseInt(m[1],10),month:parseInt(m[2],10)};
    return {key:s,year:null,month:null};
  }

  function periodLabel53(period){
    const p=normalizePeriod53(period);
    if(p.year&&p.month)return `${p.year}년 ${p.month}월`;
    return String(period||'-');
  }

  function money53(v){return '₩'+(Number(v)||0).toLocaleString();}

  function ensureWorkerPayslipListScreen53(){
    if(document.getElementById('scWorkerPayslips'))return true;
    const div=document.createElement('div');
    div.className='screen';
    div.id='scWorkerPayslips';
    div.innerHTML=`
      <div class="hdr" id="workerPayslipListHdr">
        <button class="back-btn" onclick="showScreen('scSvcWorker')">← 뒤로</button>
        <div class="hdr-title">💰 급여명세서</div>
        <div style="width:40px"></div>
      </div>
      <div class="worker-pay-list-wrap">
        <div id="workerPayslipList" class="worker-pay-list-empty">명세서를 불러오는 중이에요</div>
      </div>
    `;
    document.body.appendChild(div);
    return true;
  }

  function updateWorkerPayslipCard53(){
    const card=document.getElementById('workerPayslipCard');
    if(!card)return false;
    const name=card.querySelector('.svc-name');
    const desc=card.querySelector('.svc-desc');
    if(name)name.textContent='급여명세서';
    if(desc)desc.textContent='확정된 명세서 열람';
    card.onclick=openWorkerPayslipList53;
    return true;
  }

  async function getConfirmedPayslips53(){
    const snap=await db.collection('payslips')
      .where('cafeId','==',currentCafe.id)
      .where('empId','==',currentWorkerEmp.id)
      .where('confirmed','==',true)
      .get();
    const rows=[];
    snap.forEach(doc=>rows.push({id:doc.id,...doc.data()}));
    rows.sort((a,b)=>{
      const ak=normalizePeriod53(a.period).key;
      const bk=normalizePeriod53(b.period).key;
      if(ak!==bk)return bk.localeCompare(ak);
      const at=a.confirmedAt?.seconds||a.updatedAt||0;
      const bt=b.confirmedAt?.seconds||b.updatedAt||0;
      return bt-at;
    });
    return rows;
  }

  async function openWorkerPayslipList53(){
    if(!currentWorkerEmp){showToast('직원 정보를 확인할 수 없어요');return;}
    ensureWorkerPayslipListScreen53();
    const cm=colorMap[currentCafe.color||'green']||colorMap.green;
    const hdr=document.getElementById('workerPayslipListHdr');
    if(hdr)hdr.style.background=cm.main;
    showScreen('scWorkerPayslips');
    const listEl=document.getElementById('workerPayslipList');
    listEl.className='worker-pay-list-empty';
    listEl.innerHTML='명세서를 불러오는 중이에요';
    try{
      const rows=await getConfirmedPayslips53();
      if(!rows.length){
        listEl.className='worker-pay-list-empty';
        listEl.innerHTML='아직 확정된 급여명세서가 없어요 🙏';
        return;
      }
      const enriched=await Promise.all(rows.map(async row=>{
        let net=row.net||row.total||row.payTotal||0;
        if(typeof calcEmpPay==='function'){
          try{net=(await calcEmpPay(currentWorkerEmp,row.period)).net||net;}catch(e){console.log('worker payslip net:',e);}
        }
        return {...row,net};
      }));
      listEl.className='worker-pay-list';
      listEl.innerHTML=enriched.map(row=>`
        <button class="worker-pay-row" onclick="openWorkerPayslipPeriod53('${String(row.period||'').replace(/'/g,'\\\'')}')">
          <span>${periodLabel53(row.period)}</span>
          <b>${money53(row.net)}</b>
        </button>
      `).join('');
    }catch(e){
      console.error('worker payslip list:',e);
      listEl.className='worker-pay-list-empty';
      listEl.innerHTML='급여명세서를 불러오지 못했어요';
    }
  }

  async function openWorkerPayslipPeriod53(period){
    const p=normalizePeriod53(period);
    if(!p.year||!p.month){showToast('명세서 기간을 확인할 수 없어요');return;}
    payY=p.year;
    payM=p.month-1;
    window.isWorkerViewMode=true;
    await openPayslip(currentWorkerEmp.id,{workerView:true});
  }

  function injectTask53Style(){
    if(document.getElementById('zuoTask53Style'))return;
    const style=document.createElement('style');
    style.id='zuoTask53Style';
    style.textContent=`
      .worker-pay-list-wrap{padding:14px;overflow-y:auto}
      .worker-pay-list{display:flex;flex-direction:column;gap:8px}
      .worker-pay-row{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid var(--bd);background:#fff;border-radius:10px;padding:14px 13px;cursor:pointer;text-align:left}
      .worker-pay-row span{font-size:14px;font-weight:600;color:var(--t1);white-space:nowrap}
      .worker-pay-row b{font-size:15px;font-weight:800;color:var(--green);white-space:nowrap}
      .worker-pay-list-empty{background:#fff;border:1px dashed #ddd;border-radius:10px;padding:28px 12px;text-align:center;font-size:13px;color:var(--t3)}
    `;
    document.head.appendChild(style);
  }

  function installTask53(){
    if(typeof db==='undefined'||typeof currentCafe==='undefined')return false;
    injectTask53Style();
    ensureWorkerPayslipListScreen53();
    window.openWorkerPayslipList53=openWorkerPayslipList53;
    window.openWorkerPayslipPeriod53=openWorkerPayslipPeriod53;
    window.openWorkerConfirmedPayslip=openWorkerPayslipList53;
    updateWorkerPayslipCard53();
    return true;
  }

  function bootTask53(){
    try{
      const ok=installTask53();
      if(!updateWorkerPayslipCard53())setTimeout(bootTask53,250);
      else if(!ok)setTimeout(bootTask53,250);
    }catch(e){console.error('task53 worker payslip list:',e);}
  }

  bootTask53();
  document.addEventListener('DOMContentLoaded',bootTask53);
})();

/* Task #54: direct payslip confirmation from pay employee cards */
(function(){
  function payPeriod54(){return `${payY}-${String(payM+1).padStart(2,'0')}`;}

  async function findPayslipDoc54(empId,period){
    const snap=await db.collection('payslips').where('empId','==',empId).where('period','==',period).limit(1).get();
    if(snap.empty)return null;
    return {id:snap.docs[0].id,data:snap.docs[0].data()};
  }

  async function defaultPayslipData54(emp,period){
    const snap=await db.collection('workHours').where('empId','==',emp.id).where('period','==',period).get();
    const workDays=getWorkDaysFromSnapshot(snap);
    const total=sumWorkDays(workDays);
    const yr=parseInt(period.split('-')[0],10);
    const mo=parseInt(period.split('-')[1],10)-1;
    const weeksInMonth=(()=>{
      let sundays=0;
      const daysInMonth=new Date(yr,mo+1,0).getDate();
      for(let d=1;d<=daysInMonth;d++){
        if(new Date(yr,mo,d).getDay()===0)sundays++;
      }
      return sundays;
    })();
    const weeklyHrs=weeksInMonth?total/weeksInMonth:0;
    let holiRateVal=0;
    if(emp.holidayRate!==null&&emp.holidayRate!==undefined){
      holiRateVal=Number(emp.holidayRate)||0;
    }else if(weeklyHrs>=15){
      holiRateVal=Math.round((weeklyHrs/40)*8*(emp.rate||0));
    }
    return {
      empId:emp.id,
      cafeId:currentCafe.id,
      period,
      holiRateVal,
      weekCntVal:weeksInMonth,
      bonus:0,
      bonusMemo:'',
      etc:0,
      etcMemo:'',
      updatedAt:Date.now()
    };
  }

  async function confirmPayFromCard54(empId){
    const emp=employees.find(e=>e.id===empId);
    if(!emp)return;
    if(!confirm(`${emp.name}님의 ${payY}년 ${payM+1}월 급여명세서를 확정할까요?`))return;
    const period=payPeriod54();
    const ts=(typeof firebase!=='undefined'&&firebase.firestore?.FieldValue?.serverTimestamp)?firebase.firestore.FieldValue.serverTimestamp():Date.now();
    const found=await findPayslipDoc54(empId,period);
    if(found){
      await db.collection('payslips').doc(found.id).update({confirmed:true,confirmedAt:ts,updatedAt:Date.now()});
    }else{
      const data=await defaultPayslipData54(emp,period);
      data.confirmed=true;
      data.confirmedAt=ts;
      await db.collection('payslips').add(data);
    }
    showToast(`${emp.name}님 급여명세서를 확정했어요`);
    if(typeof renderPayEmpList==='function')renderPayEmpList();
  }

  function installPayCardConfirm54(){
    if(typeof renderPayEmpList!=='function'||typeof db==='undefined')return false;
    window.renderPayEmpList=async function(){
      updatePayMonthLabels();
      const w=document.getElementById('payEmpList');
      if(!w)return;
      if(!employees.length){w.innerHTML=`<div style="text-align:center;padding:24px;font-size:12px;color:var(--t3)">등록된 직원이 없어요</div>`;return;}
      const period=payPeriod54();
      const psSnap=await db.collection('payslips').where('cafeId','==',currentCafe.id).where('period','==',period).get();
      const confirmedMap={};
      psSnap.forEach(doc=>{const d=doc.data();if(d.confirmed)confirmedMap[d.empId]=true;});
      const colors=['var(--gl)','#EEEDFE','#FBEAF0','#E6F1FB','var(--al)'];
      const tcolors=['var(--gd)','#3C3489','#72243E','#0C447C','var(--ad)'];
      w.className='pay-compact-grid';
      w.innerHTML=employees.filter(e=>!e.resigned).map((e,i)=>{
        const confirmed=!!confirmedMap[e.id];
        return `<div class="pay-compact-card" style="position:relative" onclick="openPayslip('${e.id}')">
          ${confirmed?'<div class="pay-confirm-badge">🔒 확정</div>':''}
          <div class="emp-avatar" style="background:${colors[i%5]};color:${tcolors[i%5]}">${e.name.substring(0,2)}</div>
          <div style="flex:1;min-width:0"><div class="emp-nm">${e.name}</div><div class="emp-info">시급 ₩${(e.rate||0).toLocaleString()} · 주휴단가 ₩${(e.holidayRate||0).toLocaleString()}</div></div>
          <div class="pay-card-actions pay-card-actions-3">
            <button class="pay-compact-action" onclick="event.stopPropagation();openPayslip('${e.id}')">명세서</button>
            <button class="pay-compact-action pay-time-action" onclick="event.stopPropagation();openEmpWorkStatus52('${e.id}')">근무현황</button>
            <button class="pay-compact-action pay-confirm-action" ${confirmed?'disabled':''} onclick="event.stopPropagation();confirmPayFromCard54('${e.id}')">${confirmed?'확정됨':'급여확정'}</button>
          </div>
        </div>`;
      }).join('');
    };
    return true;
  }

  function injectTask54Style(){
    if(document.getElementById('zuoTask54Style'))return;
    const style=document.createElement('style');
    style.id='zuoTask54Style';
    style.textContent=`
      .pay-card-actions-3{display:flex!important;grid-template-columns:none!important;gap:6px!important}
      .pay-card-actions-3 .pay-compact-action{flex:1 1 0!important;padding:8px 4px!important;font-size:11px!important;white-space:nowrap!important}
      .pay-confirm-action{background:#1D9E75!important;color:#fff!important;border:1px solid #1D9E75!important}
      .pay-confirm-action:disabled{background:#E5E7EB!important;color:#6B7280!important;border-color:#E5E7EB!important;cursor:not-allowed!important}
    `;
    document.head.appendChild(style);
  }

  function installTask54(){
    if(typeof db==='undefined'||typeof employees==='undefined')return false;
    injectTask54Style();
    window.confirmPayFromCard54=confirmPayFromCard54;
    installPayCardConfirm54();
    if(document.getElementById('payEmpList'))renderPayEmpList();
    return true;
  }

  function bootTask54(){
    try{if(!installTask54())setTimeout(bootTask54,250);}
    catch(e){console.error('task54 pay card confirm:',e);}
  }

  bootTask54();
  document.addEventListener('DOMContentLoaded',bootTask54);
})();
