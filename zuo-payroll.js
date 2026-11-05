(function(root){
  'use strict';
  const RULE_VERSION=1;
  const DAY_MS=86400000;

  function monthInfo(period){
    if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(period))throw new Error('Invalid payroll period');
    const [year,month]=period.split('-').map(Number);
    const first=new Date(Date.UTC(year,month-1,1));
    const sunday=new Date(first.getTime()+((7-first.getUTCDay())%7)*DAY_MS);
    const previous=new Date(Date.UTC(year,month-2,1)).toISOString().slice(0,7);
    return {year,month,sunday,previous};
  }

  function minutesOf(day){
    if(!day)return 0;
    const value=day.workMin!=null?Number(day.workMin):Number(day.hours)*60;
    return Number.isFinite(value)?Math.max(0,Math.round(value)):0;
  }

  function calculate(emp,period,currentDays,previousDays={}){
    const info=monthInfo(period);
    const configured=Number(emp.holidayRate);
    const rate=Number.isFinite(configured)?Math.max(0,configured):0;
    const weeks=[];
    for(let end=info.sunday;end.getUTCMonth()===info.month-1;end=new Date(end.getTime()+7*DAY_MS)){
      const start=new Date(end.getTime()-6*DAY_MS);
      let minutes=0;
      for(let offset=0;offset<7;offset++){
        const date=new Date(start.getTime()+offset*DAY_MS);
        const days=date.getUTCMonth()===info.month-1?currentDays:previousDays;
        minutes+=minutesOf(days[date.getUTCDate()]);
      }
      weeks.push({start:start.toISOString().slice(0,10),end:end.toISOString().slice(0,10),minutes,eligible:minutes>=900});
    }
    const excluded=rate>0?weeks.filter(week=>!week.eligible).map(week=>({
      start:week.start,end:week.end,minutes:week.minutes,reason:'주당 근무시간 15시간 미만'
    })):[];
    return {version:RULE_VERSION,period,basis:'mon-sun/sunday-month',rate,
      candidateCount:weeks.length,eligibleCount:rate>0?weeks.filter(week=>week.eligible).length:0,excluded};
  }

  function values(emp,saved,assessment){
    if(!(assessment.rate>0))return {rate:0,count:0};
    const empRate=emp.holidayRate==null?null:(Number(emp.holidayRate)||0);
    const employeeChanged=!saved?.confirmed&&saved?.empHolidayRateSnapshot!==undefined&&saved.empHolidayRateSnapshot!==empRate;
    const savedRate=Number(saved?.holiRateVal);
    const rate=saved?.holiRateVal!==undefined&&!employeeChanged&&Number.isFinite(savedRate)?Math.max(0,savedRate):assessment.rate;
    const savedCount=Number(saved?.weekCntVal);
    const count=saved?.weekCntVal!==undefined&&Number.isFinite(savedCount)?Math.max(0,Math.min(assessment.eligibleCount,Math.floor(savedCount))):assessment.eligibleCount;
    return {rate,count};
  }

  function notes(assessment,count){
    if(!(assessment.rate>0))return ['직원 주휴단가 미등록(0원/공란): 주휴수당 미적용'];
    const result=assessment.excluded.map(week=>{
      const hours=Math.floor(week.minutes/60),minutes=week.minutes%60;
      return `${week.start.slice(2).replaceAll('-','.')}~${week.end.slice(2).replaceAll('-','.')} ${hours}시간 ${minutes}분: 주 15시간 미만으로 주휴 1회 제외`;
    });
    if(count<assessment.eligibleCount)result.push(`주휴 지급 횟수 관리자 조정: ${assessment.eligibleCount}회 중 ${count}회 지급`);
    return result;
  }

  function metadata(assessment,count){
    return {holidayRuleVersion:RULE_VERSION,holidayWeekBasis:assessment.basis,
      holidayEligibleCount:assessment.eligibleCount,holidayExclusions:assessment.excluded,
      holidayNotes:notes(assessment,count)};
  }

  async function load(emp,period,currentDays){
    const info=monthInfo(period);
    const query=month=>db.collection('workHours').where('cafeId','==',currentCafe.id).where('empId','==',emp.id).where('period','==',month).get();
    if(!currentDays)currentDays=getWorkDaysFromSnapshot(await query(period));
    let previousDays={};
    if(Number(emp.holidayRate)>0&&info.sunday.getUTCDate()<7){
      previousDays=getWorkDaysFromSnapshot(await query(info.previous));
    }
    return calculate(emp,period,currentDays,previousDays);
  }

  const api={calculate,values,notes,metadata,load};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.ZuoPayroll=api;
})(typeof window!=='undefined'?window:globalThis);
