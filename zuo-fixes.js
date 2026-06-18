// Runtime fixes for issues found during review.
(function(){
  var originalOpenWkInput=null;

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
          <button class="${isFixed?'on':''}" onclick="toggleFixed('${key}',this)" style="flex-shrink:0;font-size:10px;padding:2px 5px;border-radius:4px;border:1px solid ${isFixed?'var(--amb)':'var(--bd)'};background:${isFixed?'var(--amb)':'#fff'};color:${isFixed?'#fff':'var(--t3)'};cursor:pointer;white-space:nowrap">📌 ${isFixed?'고정항목':''}</button>
          <input type="text" inputmode="numeric" id="pi_${key}" placeholder="0" oninput="formatCurrencyInput(this);calcProfitTotals()" style="width:85px;border:1px solid var(--bd);border-radius:6px;padding:4px 6px;font-size:12px;text-align:right;outline:none;flex-shrink:0">
        </div>`;
      }).join('');
      PROFIT_EXPENSE_ITEMS.forEach(item=>{
        const key=item.key;
        const hasSaved=profitData[key]!==undefined;
        const val=hasSaved?profitData[key]:(profitFixed[key+'_fixed']?profitFixed[key+'_val']||0:0);
        setCurrencyValue('pi_'+key,val||0);
      });
      const hasSavedRev=profitData.revenue!==undefined;
      const rev=hasSavedRev?profitData.revenue:(profitFixed.revenue_fixed?profitFixed.revenue_val||0:0);
      if(document.getElementById('pi_revenue'))setCurrencyValue('pi_revenue',rev||0);
      calcProfitTotals();
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

  function isCurrentWorkMonthConfirmed(){
    return typeof wkIsConfirmed!=='undefined'&&wkIsConfirmed&&!isAdminMode;
  }

  function updateWorkPanelActions(){
    const panel=document.getElementById('wkPanel');
    if(!panel)return;
    const actionRow=panel.querySelector('div[style*="display:flex"][style*="gap:8px"]');
    if(!actionRow)return;
    const firstBtn=actionRow.querySelector('button');
    if(!firstBtn)return;
    const hasSaved=!!(workData&&wkSelDay&&workData[wkSelDay]);
    firstBtn.textContent=hasSaved?'삭제':'비우기';
    firstBtn.onclick=hasSaved?deleteWkHours:resetWkInput;
    firstBtn.style.color=hasSaved?'var(--red)':'var(--t2)';
    firstBtn.style.borderColor=hasSaved?'#fca5a5':'var(--bd)';

    const saveBtn=actionRow.querySelector('.fok');
    if(saveBtn)saveBtn.innerHTML=hasSaved?'💾 수정 저장':'💾 저장';
  }

  function patchWorkInputUi(){
    if(typeof openWkInput!=='function')return false;
    if(!originalOpenWkInput)originalOpenWkInput=openWkInput;
    window.openWkInput=function(d){
      originalOpenWkInput(d);
      updateWorkPanelActions();
    };
    window.deleteWkHours=async function(){
      if(!wkSelDay||!currentWorkerEmp)return;
      const saved=workData&&workData[wkSelDay];
      if(!saved){resetWkInput();return;}
      if(isCurrentWorkMonthConfirmed()){
        showToast('🔒 확정된 데이터는 삭제할 수 없어요. 관리자에게 문의하세요.');return;
      }
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
      if(!confirmSnap.empty&&confirmSnap.docs[0].data().confirmed&&!isAdminMode){
        showToast('🔒 확정된 데이터는 수정할 수 없어요. 관리자에게 문의하세요.');return;
      }
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
    patchProfitRows();
    patchProfitExcel();
    patchWorkInputUi();
    patchWorkHourSave();
  }

  applyPatches();
  document.addEventListener('DOMContentLoaded',applyPatches);
})();
