(function(){
  'use strict';
  const current=document.querySelector('meta[name="zuo-version"]').content;
  let available=null;
  let checking=false;
  let status='';
  let runtimeError=false;

  function render(){
    document.querySelectorAll('[data-zuo-version]').forEach(node=>{node.textContent='ZUO v'+current;});
    document.querySelectorAll('.app-version-status').forEach(node=>{node.textContent=runtimeError?'필수 파일 로드 오류':status;});
    document.querySelectorAll('.app-version-update').forEach(button=>{
      button.disabled=checking;
      button.textContent=checking?'확인 중':runtimeError?'새로고침':available?'업데이트 적용':'업데이트 확인';
    });
  }

  async function refresh(){
    if(document.querySelector('.screen.active')?.id!=='scHome'&&!confirm('저장하지 않은 입력은 사라질 수 있어요. 업데이트할까요?'))return;
    try{await (await navigator.serviceWorker?.getRegistration())?.update();}catch{}
    const url=new URL(location.href);
    url.searchParams.set('v',available||current);
    location.replace(url.href);
  }

  async function check(silent=false){
    if(checking)return;
    checking=true;
    render();
    try{
      const url=new URL('version.json',location.href);
      url.searchParams.set('t',Date.now());
      const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error('Version check failed');
      const manifest=await response.json();
      if(typeof manifest.version!=='string'||!/^\d{4}\.\d{2}\.\d{2}\.\d+$/.test(manifest.version))throw new Error('Invalid version');
      available=manifest.version!==current?manifest.version:null;
      status=available?'새 버전 '+available:silent?'':'최신 버전';
    }catch{
      if(!silent)status='업데이트 확인 실패';
    }finally{
      checking=false;
      render();
    }
  }

  function boot(){
    document.querySelectorAll('.screen').forEach(screen=>{
      const header=screen.querySelector('.hdr');
      if(!header||screen.querySelector('.app-version-bar'))return;
      const bar=document.createElement('div');
      bar.className='app-version-bar no-capture';
      const label=document.createElement('span');
      label.setAttribute('data-zuo-version','');
      const message=document.createElement('span');
      message.className='app-version-status';
      message.setAttribute('aria-live','polite');
      const button=document.createElement('button');
      button.type='button';
      button.className='app-version-update';
      button.onclick=()=>{if(available||runtimeError)refresh();else check();};
      bar.append(label,message,button);
      header.after(bar);
    });
    runtimeError=typeof window.ZuoPayroll?.values!=='function'||!window.__zuoTask52OpenPayslipPatched;
    render();
    check(true);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)check(true);});
  }

  window.ZuoVersion={current,check,refresh};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
