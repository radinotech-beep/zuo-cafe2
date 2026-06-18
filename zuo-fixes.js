﻿﻿// Runtime fixes for reviewed issues, worktime edit/delete, pay table style, and profit fixed items.
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

