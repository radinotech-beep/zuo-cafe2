<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#1D9E75">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="In my cafe">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<title>In my cafe</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;max-width:480px;margin:0 auto;min-height:100vh}
:root{--green:#1D9E75;--gl:#E1F5EE;--gm:#5DCAA5;--gd:#0F6E56;--red:#E24B4A;--amb:#EF9F27;--al:#FAEEDA;--ad:#854F0B;--bd:#e5e5e5;--t1:#1a1a1a;--t2:#666;--t3:#999}
#splash{position:fixed;inset:0;background:var(--green);z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.6s}
#splash.hide{opacity:0;pointer-events:none}
.splash-icon{font-size:72px;margin-bottom:16px;animation:sbounce 1s ease infinite alternate}
.splash-title{font-size:30px;font-weight:700;color:#fff;margin-bottom:6px;letter-spacing:-0.5px}
.splash-title b{color:#FAEEDA}
.splash-sub{font-size:14px;color:rgba(255,255,255,0.8);margin-bottom:48px}
.splash-dots{display:flex;gap:8px}
.splash-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.4);animation:sdot 1.2s ease infinite}
.splash-dot:nth-child(2){animation-delay:.2s}
.splash-dot:nth-child(3){animation-delay:.4s}
@keyframes sbounce{from{transform:translateY(0)}to{transform:translateY(-12px)}}
@keyframes sdot{0%,80%,100%{background:rgba(255,255,255,0.4)}40%{background:#fff}}
.screen{display:none;min-height:100vh;background:#f5f5f5}
.screen.active{display:block}
.hdr{position:sticky;top:0;z-index:10;background:var(--green);padding:14px 16px 10px;display:flex;align-items:center;justify-content:space-between}
.hdr-title{font-size:17px;font-weight:700;color:#fff}
.hdr-sub{font-size:11px;color:rgba(255,255,255,0.75)}
.back-btn{background:none;border:none;color:rgba(255,255,255,0.9);font-size:13px;font-weight:500;cursor:pointer;padding:4px 0}
/* 카페 선택 */
.welcome{padding:28px 16px 12px;text-align:center}
.welcome-title{font-size:22px;font-weight:700;color:var(--t1);margin-bottom:6px}
.welcome-sub{font-size:13px;color:var(--t3);margin-bottom:24px}
.cafe-list{padding:0 16px}
.cafe-card{background:#fff;border-radius:14px;border:1px solid var(--bd);padding:16px;margin-bottom:10px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all 0.15s}
.cafe-card:active{opacity:0.7}
.cafe-card-left{display:flex;align-items:center;gap:12px}
.cafe-icon{width:44px;height:44px;border-radius:12px;background:var(--gl);display:flex;align-items:center;justify-content:center;font-size:22px}
.cafe-name{font-size:15px;font-weight:600}
.cafe-desc{font-size:11px;color:var(--t3);margin-top:2px}
.admin-btn{margin:20px 16px 0;padding:13px;border-radius:12px;border:1px dashed var(--bd);background:none;width:calc(100%-32px);font-size:13px;color:var(--t3);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;width:calc(100% - 32px)}
/* 비번 */
.pw-wrap{padding:36px 24px}
.pw-title{font-size:20px;font-weight:700;color:var(--t1);margin-bottom:6px}
.pw-sub{font-size:13px;color:var(--t3);margin-bottom:24px}
.pw-input{width:100%;border:1.5px solid var(--bd);border-radius:12px;padding:13px 16px;font-size:16px;color:var(--t1);background:#fff;outline:none;letter-spacing:4px;text-align:center;margin-bottom:14px}
.pw-input:focus{border-color:var(--green)}
.pw-btn{width:100%;padding:13px;border-radius:12px;border:none;background:var(--green);color:#fff;font-size:15px;font-weight:600;cursor:pointer}
.pw-error{color:var(--red);font-size:12px;text-align:center;margin-top:8px;display:none}
/* 서비스 선택 */
.svc-wrap{padding:20px 16px}
.svc-title{font-size:18px;font-weight:700;color:var(--t1);margin-bottom:4px}
.svc-sub{font-size:13px;color:var(--t3);margin-bottom:18px}
.svc-card{background:#fff;border-radius:14px;border:1px solid var(--bd);padding:18px;margin-bottom:12px;cursor:pointer;display:flex;align-items:center;gap:14px;transition:all 0.15s}
.svc-card:active{opacity:0.7}
.svc-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0}
.svc-name{font-size:16px;font-weight:700;color:var(--t1)}
.svc-desc{font-size:12px;color:var(--t3);margin-top:3px}
/* 대타 앱 */
.tabs{display:flex;margin:10px 14px;background:#e8e8e8;border-radius:10px;padding:3px;gap:2px}
.tab{flex:1;padding:8px;font-size:13px;font-weight:500;border:none;border-radius:8px;cursor:pointer;background:none;color:var(--t2)}
.tab.on{background:#fff;color:var(--green);box-shadow:0 1px 4px rgba(0,0,0,.1)}
.cwrap{padding:0 14px}
.cnav{display:flex;align-items:center;justify-content:space-between;padding:8px 0}
.ctitle{font-size:15px;font-weight:600;color:var(--t1)}
.nbtn{background:#fff;border:1px solid var(--bd);border-radius:8px;padding:5px 12px;font-size:13px;color:var(--t1);cursor:pointer}
.lgd{display:flex;gap:10px;padding:2px 0 8px;flex-wrap:wrap}
.li{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--t2)}
.lb{width:10px;height:10px;border-radius:3px}
.cgrid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.dhdr{text-align:center;font-size:11px;font-weight:500;color:var(--t3);padding:4px 0}
.cc{min-height:64px;border-radius:8px;padding:4px 4px;cursor:pointer;background:#fff;border:1px solid #efefef;overflow:hidden;transition:all 0.15s}
.cc.emp{background:none;border-color:transparent;cursor:default}
.cc.tod{border:2px solid var(--green)}
.cc.ong{background:var(--al);border-color:var(--amb)}
.cc.don{background:var(--gl);border-color:var(--gm)}
.cc.selected{border:2.5px solid #185FA5;background:#E6F1FB}
.cc:not(.emp):active{opacity:0.7}
.cd{font-size:11px;font-weight:600;color:var(--t2);margin-bottom:2px}
.cc.tod .cd{color:var(--gd)}
.cc.ong .cd{color:var(--ad)}
.cc.don .cd{color:var(--gd)}
.cc.selected .cd{color:#185FA5;font-weight:700}
.sun .cd{color:var(--red)!important}
.sat .cd{color:#185FA5!important}
.cpill{font-size:8px;font-weight:600;padding:1px 4px;border-radius:4px;display:inline-block;margin-bottom:1px}
.p-ong{background:var(--amb);color:#fff}
.p-don{background:var(--green);color:#fff}
.cn{font-size:8px;line-height:1.4;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.nr{color:#993C1D;font-weight:600}
.nt{color:var(--gd);font-weight:600}
.panel{margin:10px 14px 14px;border:1px solid var(--bd);border-radius:12px;overflow:hidden;background:#fff}
.ph{padding:12px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--bd)}
.pt{font-size:13px;font-weight:600;color:var(--t1)}
.abtn{background:var(--green);border:none;color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:500;cursor:pointer}
.fw{padding:12px 14px;border-bottom:1px solid var(--bd)}
.fl{font-size:11px;font-weight:500;color:var(--t2);margin-bottom:4px;display:block}
.fr{margin-bottom:10px}
input[type=text],input[type=password],input[type=tel],input[type=number]{width:100%;border:1px solid var(--bd);border-radius:8px;padding:9px 12px;font-size:14px;color:var(--t1);background:#fff;outline:none}
input:focus{border-color:var(--green)}
.tg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tlbl{font-size:10px;color:var(--t3);margin-bottom:3px}
.fbtns{display:flex;gap:8px;margin-top:6px}
.fcnl{flex:1;padding:10px;border-radius:8px;border:1px solid var(--bd);background:#fff;color:var(--t2);font-size:13px;cursor:pointer}
.fok{flex:1;padding:10px;border-radius:8px;border:none;background:var(--green);color:#fff;font-size:13px;font-weight:500;cursor:pointer}
.slist{padding:6px 14px 14px}
.emsg{text-align:center;padding:24px 0;font-size:12px;color:var(--t3)}
.si{padding:10px 0;border-bottom:1px solid #f0f0f0}
.si:last-child{border-bottom:none}
.sr{display:flex;align-items:flex-start;gap:8px}
.snum{width:20px;height:20px;border-radius:50%;background:var(--gl);color:var(--gd);font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.sb{flex:1;min-width:0}
.sn{font-size:14px;font-weight:600;color:var(--t1);display:flex;align-items:center;gap:5px;flex-wrap:wrap}
.aw{color:var(--green)}
.tk{color:var(--gd);font-weight:600}
.stm{font-size:11px;color:var(--t2);margin-top:2px}
.snt{font-size:10px;color:var(--t3);margin-top:2px}
.sbtns{display:flex;gap:5px;margin-top:6px;flex-wrap:wrap}
.b-take{background:var(--green);border:none;color:#fff;padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer}
.b-edit{background:#fff;border:1px solid var(--bd);color:var(--t2);padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer}
.b-ctk{background:#fff;border:1px solid #fca5a5;color:var(--red);padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer}
.b-crq{background:#fff;border:1px solid var(--bd);color:var(--t3);padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer}
.sbdg{flex-shrink:0;min-width:48px;padding:5px 4px;border-radius:7px;font-size:12px;font-weight:700;text-align:center}
.bd-don{background:var(--gl);color:var(--gd)}
.bd-ong{background:var(--al);color:var(--ad)}
.hint{text-align:center;padding:24px 16px;font-size:12px;color:var(--t3);line-height:1.7}
.awrap{padding:6px 14px 14px}
.ai{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f0f0f0}
.ai:last-child{border-bottom:none}
.adt{flex-shrink:0;min-width:52px}
.adm{font-size:13px;font-weight:700;color:var(--t1)}
.add{font-size:10px;color:var(--t3);margin-top:1px}
.anum{width:18px;height:18px;border-radius:50%;background:var(--gl);color:var(--gd);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.abody{flex:1;min-width:0}
.anames{font-size:13px;font-weight:600;color:var(--t1);display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.atm{font-size:11px;color:var(--t2);margin-top:2px}
.stag{font-size:10px;font-weight:600;padding:2px 6px;border-radius:10px;flex-shrink:0}
.st-ong{background:var(--al);color:var(--ad)}
.st-don{background:var(--gl);color:var(--gd)}
/* 시간 선택 */
.ampm-row{display:flex;gap:8px;margin-bottom:10px}
.ampm-btn{flex:1;padding:9px;border-radius:8px;border:1px solid var(--bd);background:#fff;color:var(--t2);font-size:14px;font-weight:500;cursor:pointer}
.ampm-btn.on{border:none;color:#fff;font-weight:600}
.hour-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px}
.min-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:12px}
.hbtn{padding:9px 4px;border-radius:8px;border:1px solid var(--bd);background:#fff;color:var(--t1);font-size:13px;font-weight:500;cursor:pointer;text-align:center}
.hbtn.on{border:none;color:#fff;font-weight:600}
.tdisp{border-radius:12px;padding:12px;text-align:center;margin-bottom:14px}
/* 모달 */
.mbg{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:100;display:none;align-items:flex-end;justify-content:center}
.mbg.open{display:flex}
.modal{background:#fff;border-radius:20px 20px 0 0;padding:18px 18px 36px;width:100%;max-width:480px}
.mh{width:36px;height:4px;background:#ddd;border-radius:2px;margin:0 auto 14px}
.mt{font-size:15px;font-weight:600;color:var(--t1);margin-bottom:14px}
.mbtns{display:flex;gap:8px;margin-top:14px}
.mcnl{flex:1;padding:11px;border-radius:10px;border:1px solid var(--bd);background:#fff;color:var(--t2);font-size:13px;cursor:pointer}
.mok{flex:1;padding:11px;border-radius:10px;border:none;background:var(--green);color:#fff;font-size:13px;font-weight:500;cursor:pointer}
/* 카카오 공유 */
.shbanner{position:fixed;bottom:0;left:0;right:0;max-width:480px;margin:0 auto;background:#fff;border-top:1px solid var(--bd);padding:14px;z-index:200;display:none}
.shtxt{font-size:11px;color:var(--t2);background:#f5f5f5;border-radius:8px;padding:10px;margin:8px 0 10px;line-height:1.6;white-space:pre-line}
.shbtns{display:flex;gap:8px}
.bkakao{flex:1;padding:10px;border-radius:8px;background:#FEE500;border:none;color:#3C1E1E;font-size:13px;font-weight:600;cursor:pointer}
.bclose{padding:10px 12px;border-radius:8px;background:none;border:1px solid var(--bd);color:var(--t2);font-size:13px;cursor:pointer}
/* 관리자 */
.admin-wrap{padding:14px}
.admin-section{background:#fff;border-radius:12px;border:1px solid var(--bd);margin-bottom:14px;overflow:hidden}
.admin-section-title{padding:12px 14px;font-size:13px;font-weight:600;color:var(--t1);border-bottom:1px solid var(--bd);background:#fafafa}
.admin-cafe-item{display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid #f0f0f0}
.admin-cafe-item:last-child{border-bottom:none}
.admin-cafe-name{flex:1;font-size:13px;font-weight:500;color:var(--t1)}
.admin-cafe-pw{font-size:10px;color:var(--t3);margin-top:2px}
.admin-edit-btn{background:none;border:1px solid var(--bd);border-radius:7px;padding:4px 9px;font-size:11px;color:var(--t2);cursor:pointer;margin-right:5px}
.admin-del-btn{background:none;border:1px solid #fca5a5;border-radius:7px;padding:4px 9px;font-size:11px;color:var(--red);cursor:pointer}
.add-cafe-btn{width:100%;padding:12px;border-radius:8px;border:none;background:var(--green);color:#fff;font-size:13px;font-weight:500;cursor:pointer}
/* 색상 */
.color-picker{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}
.color-dot{width:30px;height:30px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all 0.15s}
.color-dot.selected{border-color:#1a1a1a;transform:scale(1.15)}
/* 근로관리 */
.labor-tabs{display:flex;margin:10px 14px;background:#e8e8e8;border-radius:10px;padding:3px;gap:2px}
.labor-body{padding:12px 14px;overflow-y:auto}
.emp-list-item{background:#fff;border-radius:10px;border:1px solid var(--bd);padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;cursor:pointer}
.emp-avatar{width:40px;height:40px;border-radius:50%;background:var(--gl);color:var(--gd);font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.emp-nm{font-size:14px;font-weight:600;color:var(--t1)}
.emp-info{font-size:11px;color:var(--t3);margin-top:2px}
.btn-primary{background:var(--green);border:none;color:#fff;padding:11px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;width:100%;display:block;margin-bottom:8px}
.btn-blue{background:#185FA5;border:none;color:#fff;padding:11px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;width:100%;display:block;margin-bottom:8px}
.btn-purple{background:#534AB7;border:none;color:#fff;padding:11px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;width:100%;display:block;margin-bottom:8px}
.btn-outline-s{background:#fff;border:1px solid var(--bd);color:var(--t2);padding:8px 14px;border-radius:8px;font-size:12px;cursor:pointer}
.btn-sm-g{background:var(--green);border:none;color:#fff;padding:5px 10px;border-radius:6px;font-size:11px;cursor:pointer}
/* 근무 그리드 */
.wk-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:8px}
.wk-hdr{text-align:center;font-size:10px;color:var(--t3);padding:3px 0}
.wk-cell{border-radius:6px;border:1px solid #f0f0f0;background:#fff;text-align:center;padding:4px 2px;cursor:pointer;transition:all 0.12s;min-height:46px}
.wk-cell.filled{background:var(--gl);border-color:var(--gm)}
.wk-cell.today{border:2px solid var(--green)}
.wk-cell.selected{border:2px solid #185FA5;background:#EBF4FF}
.wk-cell.filled.selected{border:2px solid #185FA5;background:#c5e0f5}
.wk-cell.has-note::after{content:'';width:5px;height:5px;border-radius:50%;background:var(--amb);display:block;margin:0 auto}
.wk-date{font-size:9px;color:var(--t3);margin-bottom:1px}
.wk-cell.selected .wk-date{color:#185FA5;font-weight:700}
.wk-hrs{font-size:10px;font-weight:600;color:var(--gd)}
.wk-cell.selected .wk-hrs{color:#185FA5}
.sel-panel{background:#fff;border-radius:12px;border:2px solid #185FA5;padding:14px;margin-top:8px}
.sel-panel-title{font-size:13px;font-weight:700;color:#185FA5;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e0ecff}
.hrs-ctrl{display:flex;align-items:center;gap:8px}
.hc-btn{width:30px;height:30px;border-radius:8px;border:1px solid var(--bd);background:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.hc-val{width:52px;text-align:center;border:1px solid var(--green);border-radius:8px;padding:5px;font-size:15px;font-weight:700;color:var(--green);background:#f0fdf8}
/* 급여 명세서 */
.payslip{background:#fff;border-radius:12px;border:1px solid var(--bd);overflow:hidden;margin-bottom:10px}
.ps-hdr{background:var(--green);padding:14px 16px}
.ps-name{font-size:16px;font-weight:700;color:#fff}
.ps-period{font-size:11px;color:rgba(255,255,255,0.8);margin-top:2px}
.ps-body{padding:12px 14px}
.ps-row{padding:7px 0;border-bottom:1px solid #f5f5f5}
.ps-row:last-child{border-bottom:none}
.ps-rt{display:flex;justify-content:space-between;align-items:center}
.ps-label{font-size:13px;color:var(--t2)}
.ps-val{font-size:13px;font-weight:500;color:var(--t1)}
.ps-memo{width:100%;border:1px solid var(--bd);border-radius:6px;padding:5px 8px;font-size:11px;color:var(--t2);background:#fafafa;outline:none;margin-top:5px}
.ps-memo:focus{border-color:var(--green)}
.amt-input{width:110px;border:1px solid var(--bd);border-radius:6px;padding:5px 8px;font-size:13px;text-align:right;outline:none}
.amt-input:focus{border-color:var(--green)}
.ps-total{background:var(--gl);padding:12px 14px;display:flex;justify-content:space-between;align-items:center}
.hrs-ctrl-sm{display:flex;align-items:center;gap:4px}
.hc-btn-sm{width:24px;height:24px;border-radius:6px;border:1px solid var(--bd);background:#fff;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.hc-val-sm{width:28px;text-align:center;border:1px solid var(--green);border-radius:5px;padding:2px;font-size:12px;font-weight:700;color:var(--green);background:#f0fdf8}
/* 월급여 테이블 */
.pay-tbl-wrap{overflow-x:auto;margin-bottom:12px;border-radius:8px;border:1px solid var(--bd)}
.pay-tbl{border-collapse:collapse;width:100%;min-width:520px;font-size:11px}
.pay-tbl th{background:var(--green);color:#fff;padding:8px 6px;text-align:center;font-weight:600;white-space:nowrap;border:1px solid var(--gm)}
.pay-tbl td{padding:6px 5px;text-align:center;border:1px solid #eee;background:#fff;white-space:nowrap}
.pay-tbl tr:last-child td{background:var(--gl);font-weight:700;color:var(--gd)}
.pay-tbl td.nm{text-align:left;font-weight:600;color:var(--t1);padding-left:10px}
.pay-tbl td.tot{font-weight:700;color:var(--gd)}
.info-box{border-radius:10px;padding:10px 12px;font-size:12px;line-height:1.6;margin-bottom:12px}
</style>
</head>
<body>

<div id="splash">
  <div class="splash-icon" style="font-size:0;margin-bottom:12px"><img src="icons/logo.png" style="width:120px;height:120px;object-fit:contain;animation:sbounce 1s ease infinite alternate" alt="ZUO"></div>
  <div class="splash-title" style="font-size:42px;font-weight:900;letter-spacing:-2px"><b>ZUO</b></div>
  <div class="splash-sub" style="font-size:15px;color:rgba(255,255,255,0.9);font-weight:500;margin-bottom:48px">한 손안에 매장관리</div>
  <div class="splash-dots">
    <div class="splash-dot"></div>
    <div class="splash-dot"></div>
    <div class="splash-dot"></div>
  </div>
</div>

<!-- 화면1: 카페 선택 -->
<div class="screen active" id="scHome">
  <div class="hdr">
    <div class="hdr-title">☕ In my cafe</div>
    <div class="hdr-sub" id="homeDateLbl"></div>
  </div>
  <div class="welcome">
    <div class="welcome-title">어느 카페인가요?</div>
    <div class="welcome-sub">입장할 카페를 선택해주세요</div>
  </div>
  <div class="cafe-list" id="cafeList"></div>
  <button class="admin-btn" onclick="goAdmin()">⚙️ 관리자 설정</button>
</div>

<!-- 화면2: 카페 비밀번호 -->
<div class="screen" id="scPw">
  <div class="hdr" id="pwHdr">
    <button class="back-btn" onclick="goHome()">← 뒤로</button>
    <div class="hdr-title" id="pwCafeName">카페 입장</div>
    <div style="width:40px"></div>
  </div>
  <div class="pw-wrap">
    <div class="pw-title" id="pwTitle">입장</div>
    <div class="pw-sub">입장 비밀번호를 입력해주세요</div>
    <input type="password" class="pw-input" id="pwInput" placeholder="비밀번호" maxlength="10">
    <button class="pw-btn" id="pwBtn" onclick="checkCafePw()">입장하기</button>
    <div class="pw-error" id="pwError">비밀번호가 틀렸어요 ❌</div>
  </div>
</div>

<!-- 화면3: 서비스 선택 -->
<div class="screen" id="scSvc">
  <div class="hdr" id="svcHdr">
    <button class="back-btn" onclick="goHome()">← 나가기</button>
    <div class="hdr-title" id="svcCafeName">카페</div>
    <div style="width:40px"></div>
  </div>
  <div class="svc-wrap">
    <div class="svc-title">서비스를 선택해주세요</div>
    <div class="svc-sub">이용할 서비스를 탭하세요</div>
    <div class="svc-card" onclick="enterSvc('sub')">
      <div class="svc-icon" id="svcIcon1" style="background:var(--gl)">🔄</div>
      <div>
        <div class="svc-name">대타해ZUO</div>
        <div class="svc-desc">대타 요청 · 신청 · 스케줄 관리</div>
      </div>
    </div>
    <div class="svc-card" onclick="enterSvc('labor')">
      <div class="svc-icon" style="background:#E6F1FB">📋</div>
      <div>
        <div class="svc-name">근로 관리</div>
        <div class="svc-desc">근무시간 · 급여 계산 · 명세서</div>
      </div>
    </div>
  </div>
</div>

<!-- 화면4: 대타 앱 -->
<div class="screen" id="scApp">
  <div class="hdr" id="appHdr">
    <button class="back-btn" onclick="showScreen('scSvc')">← 뒤로</button>
    <div>
      <div class="hdr-title" id="appCafeName">카페</div>
      <div class="hdr-sub">대타해ZUO</div>
    </div>
    <div class="hdr-sub" id="appDateLbl"></div>
  </div>
  <div class="tabs">
    <button class="tab on" id="t1" onclick="switchTab('sub')">대타 구해요</button>
    <button class="tab" id="t2" onclick="switchTab('all')">전체 목록</button>
  </div>
  <div id="subTab">
    <div class="cwrap">
      <div class="cnav">
        <button class="nbtn" onclick="changeMonth(-1)">◀</button>
        <div class="ctitle" id="ctitle"></div>
        <button class="nbtn" onclick="changeMonth(1)">▶</button>
      </div>
      <div class="lgd">
        <div class="li"><div class="lb" style="background:var(--al);border:1px solid var(--amb)"></div>진행중</div>
        <div class="li"><div class="lb" style="background:var(--gl);border:1px solid var(--gm)"></div>완료</div>
        <div class="li"><span style="color:#993C1D;font-weight:600;font-size:11px">↑</span>요청자</div>
        <div class="li"><span style="color:var(--gd);font-weight:600;font-size:11px">↓</span>대타</div>
      </div>
      <div class="cgrid" id="cgrid"></div>
    </div>
    <div class="panel" id="panel" style="display:none">
      <div class="ph">
        <div class="pt" id="ptitle"></div>
        <button class="abtn" onclick="showForm()">+ 등록</button>
      </div>
      <div id="addForm" style="display:none">
        <div class="fw">
          <div class="fr"><label class="fl">이름</label><input type="text" id="rName" placeholder="이름 입력"></div>
          <div class="fr">
            <label class="fl">대타 시간</label>
            <div class="tg">
              <div><div class="tlbl">시작</div><div class="time-display-box" id="tSBox" onclick="openTimePicker('start')" style="border:1px solid var(--bd);border-radius:8px;padding:9px 12px;background:#fff;cursor:pointer;text-align:center;font-size:14px;font-weight:600;color:var(--green)">오전 9:00</div></div>
              <div><div class="tlbl">종료</div><div class="time-display-box" id="tEBox" onclick="openTimePicker('end')" style="border:1px solid var(--bd);border-radius:8px;padding:9px 12px;background:#fff;cursor:pointer;text-align:center;font-size:14px;font-weight:600;color:var(--green)">오후 3:00</div></div>
            </div>
          </div>
          <div class="fr"><label class="fl">메모 (선택)</label><input type="text" id="rNote" placeholder="예: 오픈 담당, 음료만 가능 등"></div>
          <div class="fr"><label class="fl">비밀번호 (수정/삭제용)</label><input type="password" id="rPw" placeholder="숫자 4자리 권장" maxlength="10"></div>
          <div class="fbtns">
            <button class="fcnl" onclick="hideForm()">취소</button>
            <button class="fok" onclick="submitSub()">등록</button>
          </div>
        </div>
      </div>
      <div class="slist" id="slist"></div>
    </div>
    <div class="hint" id="hint">날짜를 선택하면<br>대타 현황을 확인할 수 있어요</div>
  </div>
  <div id="allTab" style="display:none">
    <div class="awrap" id="alist"></div>
  </div>
</div>

<!-- 화면5: 근로관리 -->
<div class="screen" id="scLabor">
  <div class="hdr" id="laborHdr">
    <button class="back-btn" onclick="showScreen('scSvc')">← 뒤로</button>
    <div>
      <div class="hdr-title" id="laborCafeName">카페</div>
      <div class="hdr-sub">근로 관리</div>
    </div>
    <div style="width:40px"></div>
  </div>
  <div class="labor-tabs tabs">
    <button class="tab on" id="lt1" onclick="switchLaborTab('worker')">근무시간 입력</button>
    <button class="tab" id="lt2" onclick="switchLaborTab('master')">관리자 메뉴</button>
  </div>
  <div id="laborWorkerTab" style="padding:12px 14px;overflow-y:auto">
    <div style="font-size:12px;color:var(--t3);margin-bottom:12px">본인 이름을 선택하고 근무시간을 입력하세요</div>
    <div id="empListForWorker"></div>
  </div>
  <div id="laborMasterTab" style="display:none;padding:12px 14px">
    <div class="info-box" style="background:var(--al);color:var(--ad)">🔐 마스터 번호로 접근하는 관리자 메뉴예요</div>
    <button class="btn-primary" onclick="openMasterMenu('emp')">👥 직원 관리</button>
    <button class="btn-blue" onclick="openMasterMenu('pay')">💰 급여 관리 · 명세서</button>
    <button class="btn-purple" onclick="openMasterMenu('table')">📊 월 급여 현황 테이블</button>
  </div>
</div>

<!-- 화면6: 직원 근무시간 입력 -->
<div class="screen" id="scWorkerInput">
  <div class="hdr" id="workerInputHdr">
    <button class="back-btn" onclick="showScreen('scLabor')">← 나가기</button>
    <div>
      <div class="hdr-title" id="workerInputName">이름</div>
      <div class="hdr-sub">근무시간 입력</div>
    </div>
    <div style="width:40px"></div>
  </div>
  <div style="padding:8px 14px;background:#fff;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between">
    <button class="btn-outline-s" onclick="changeWorkMonth(-1)">◀</button>
    <div style="font-size:14px;font-weight:600;color:var(--t1)" id="workMonthTitle">2026년 4월</div>
    <button class="btn-outline-s" onclick="changeWorkMonth(1)">▶</button>
  </div>
  <div style="flex:1;padding:12px 14px;overflow-y:auto">
    <div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap">
      <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--t2)"><div style="width:10px;height:10px;border-radius:3px;background:var(--gl);border:1px solid var(--gm)"></div>입력됨</div>
      <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--t2)"><div style="width:10px;height:10px;border-radius:3px;background:#EBF4FF;border:2px solid #185FA5"></div>선택중</div>
      <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--t2)"><div style="width:8px;height:8px;border-radius:50%;background:var(--amb)"></div>비고있음</div>
    </div>
    <div class="wk-grid" id="wkGrid"></div>
    <div style="background:#fff;border-radius:10px;border:1px solid var(--bd);padding:12px;margin-top:4px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;color:var(--t2)">이번달 총 근무시간</span>
        <span style="font-size:18px;font-weight:700;color:var(--green)" id="wkTotal">0.0시간</span>
      </div>
    </div>
    <div style="background:#fff;border-radius:12px;border:2px solid #185FA5;padding:14px;margin-top:8px;display:none" id="wkPanel">
      <div style="font-size:13px;font-weight:700;color:#185FA5;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e0ecff" id="wkPanelTitle">날짜 선택</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <div>
          <span style="font-size:12px;font-weight:500;color:var(--t2)">근무시간</span>
          <div style="font-size:10px;color:var(--t3);margin-top:2px">0.5 단위 · 직접 입력도 가능</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="hc-btn" onclick="changeWkHours(-0.5)">−</button>
          <input
            type="number"
            id="wkHoursVal"
            value="4.5"
            min="0" max="24" step="0.5"
            oninput="syncWkHoursFromInput()"
            onblur="roundWkHours()"
            style="width:58px;text-align:center;border:2px solid #185FA5;border-radius:8px;padding:6px 4px;font-size:16px;font-weight:700;color:#185FA5;background:#EBF4FF;outline:none"
          >
          <button class="hc-btn" onclick="changeWkHours(0.5)">+</button>
        </div>
      </div>
      <div style="font-size:10px;color:var(--t3);margin-bottom:4px" id="wkLastHint"></div>
      <div style="font-size:12px;font-weight:500;color:var(--t2);margin-bottom:4px">비고 (선택)</div>
      <input type="text" id="wkNote" placeholder="예: 계약4.5h/실근무5h, 조기퇴근 등" style="margin-bottom:10px">
      <div style="display:flex;gap:8px">
        <button class="fcnl" onclick="cancelWkInput()">취소</button>
        <button class="fok" style="background:#185FA5" onclick="saveWkHours()">저장</button>
      </div>
    </div>
  </div>
</div>

<!-- 화면7: 직원 관리 (마스터) -->
<div class="screen" id="scEmpManage">
  <div class="hdr">
    <button class="back-btn" onclick="showScreen('scLabor')">← 뒤로</button>
    <div class="hdr-title">직원 관리</div>
    <div class="hdr-sub">관리자</div>
  </div>
  <div style="padding:12px 14px;overflow-y:auto">
    <button class="btn-primary" onclick="showScreen('scEmpAdd');setupEmpAdd()">+ 직원 추가</button>
    <div id="empManageList"></div>
  </div>
</div>

<!-- 화면8: 직원 추가/수정 -->
<div class="screen" id="scEmpAdd">
  <div class="hdr">
    <button class="back-btn" onclick="showScreen('scEmpManage')">← 뒤로</button>
    <div class="hdr-title" id="empAddTitle">직원 등록</div>
    <div style="width:40px"></div>
  </div>
  <div class="body" style="padding:14px">
    <div class="fr"><label class="fl">이름</label><input type="text" id="empName" placeholder="이름 입력"></div>
    <div class="fr"><label class="fl">연락처</label><input type="tel" id="empPhone" placeholder="010-0000-0000"></div>
    <div class="fr"><label class="fl">주소</label><input type="text" id="empAddr" placeholder="주소 입력"></div>
    <div class="fr">
      <label class="fl">계좌 정보</label>
      <div style="display:grid;grid-template-columns:1fr 1.6fr;gap:8px">
        <input type="text" id="empBank" placeholder="은행명 (예: 국민)">
        <input type="text" id="empAcct" placeholder="계좌번호 (- 없이)">
      </div>
    </div>
    <div class="fr"><label class="fl">시급 (원)</label><input type="number" id="empRate" placeholder="10320" value="10320"></div>
    <div class="fr">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <label class="fl" style="margin:0">주휴수당 단가 (원)</label>
        <button type="button" onclick="openHoliCalc()" style="background:var(--amb);border:none;color:#fff;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer">🧮 주휴수당 계산기</button>
      </div>
      <input type="number" id="empHoliRate" placeholder="주휴 미적용시 0 또는 빈칸">
    </div>
    <div style="background:var(--al);border-radius:8px;padding:10px;margin-bottom:4px;font-size:11px;color:var(--ad);line-height:1.6">⚠️ 주휴수당 미적용 직원은 <b>0</b> 또는 <b>빈칸</b>으로 두세요</div>
    </div>
    <div style="background:var(--gl);border-radius:8px;padding:10px;margin-bottom:12px;font-size:11px;color:var(--gd);line-height:1.6">💡 주휴수당 단가 × 급여명세서 횟수 = 주휴수당 합계</div>
    <div class="fr"><label class="fl">초기 비밀번호</label><input type="password" id="empPw" placeholder="직원이 사용할 초기 비밀번호"></div>
    <div class="fbtns">
      <button class="fcnl" onclick="showScreen('scEmpManage')">취소</button>
      <button class="fok" onclick="saveEmp()">저장</button>
    </div>
  </div>
</div>

<!-- 화면9: 급여 관리 목록 -->
<div class="screen" id="scPayManage">
  <div class="hdr">
    <button class="back-btn" onclick="showScreen('scLabor')">← 뒤로</button>
    <div class="hdr-title">급여 관리</div>
    <div class="hdr-sub" id="payManagePeriod">2026년 4월</div>
  </div>
  <div style="padding:12px 14px;overflow-y:auto">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <button class="btn-outline-s" onclick="changePayMonth(-1)">◀</button>
      <div style="font-size:14px;font-weight:600;color:var(--t1)" id="payMonthTitle">2026년 4월</div>
      <button class="btn-outline-s" onclick="changePayMonth(1)">▶</button>
    </div>
    <div id="payEmpList"></div>
  </div>
</div>

<!-- 화면10: 급여 명세서 -->
<div class="screen" id="scPayslip">
  <div class="hdr" id="psHdrBar">
    <button class="back-btn" onclick="showScreen('scPayManage')">← 뒤로</button>
    <div class="hdr-title">급여 명세서</div>
    <div style="width:40px"></div>
  </div>
  <div style="padding:12px 14px 24px;overflow-y:auto">

    <!-- ★ 캡처 대상 카드 -->
    <div id="payslipCard" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.10);margin-bottom:14px">

      <!-- 카드 헤더 -->
      <div id="psCardHdr" style="background:var(--green);padding:20px 18px 16px;position:relative">
        <div style="font-size:11px;color:rgba(255,255,255,0.75);margin-bottom:4px" id="psCafeName">☕ 카페 · 급여 명세서</div>
        <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:2px" id="psName">이름</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.85)" id="psPeriod">2026년 4월 급여 명세서</div>
        <div style="position:absolute;right:18px;top:50%;transform:translateY(-50%);font-size:44px;opacity:0.18">💰</div>
      </div>

      <!-- 근무 요약 띠 -->
      <div style="background:var(--gl);padding:10px 18px;display:flex;gap:0;border-bottom:1px solid var(--bd)">
        <div style="flex:1;text-align:center;border-right:1px solid var(--gm)">
          <div style="font-size:10px;color:var(--gd);margin-bottom:2px">총 근무시간</div>
          <div style="font-size:17px;font-weight:700;color:var(--gd)" id="psHours">0시간</div>
        </div>
        <div style="flex:1;text-align:center;border-right:1px solid var(--gm)">
          <div style="font-size:10px;color:var(--gd);margin-bottom:2px">시급</div>
          <div style="font-size:17px;font-weight:700;color:var(--gd)" id="psRate">₩0</div>
        </div>
        <div style="flex:1;text-align:center">
          <div style="font-size:10px;color:var(--gd);margin-bottom:2px">시급 합계</div>
          <div style="font-size:17px;font-weight:700;color:var(--gd)" id="psBase">₩0</div>
        </div>
      </div>

      <!-- 항목 상세 -->
      <div style="padding:4px 0">

        <!-- 주휴수당 -->
        <div style="padding:11px 18px;border-bottom:1px solid #f5f5f5">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div>
              <div style="font-size:13px;font-weight:600;color:var(--t1)">주휴수당</div>
              <div style="font-size:10px;color:var(--t3);margin-top:2px">단가 <span id="psHoliRate">₩0</span> × <span id="psWeekCntDisp">4</span>주</div>
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <!-- 횟수 조작 (캡처 제외용 클래스) -->
              <div class="no-capture" style="display:flex;align-items:center;gap:4px">
                <button class="hc-btn-sm" onclick="changePayWeeks(-1)">−</button>
                <div class="hc-val-sm" id="psWeekCnt">4</div>
                <button class="hc-btn-sm" onclick="changePayWeeks(1)">+</button>
                <span style="font-size:11px;color:var(--t2)">주</span>
              </div>
              <div style="font-size:15px;font-weight:700;color:var(--t1);min-width:70px;text-align:right" id="psHoliTotal">₩0</div>
            </div>
          </div>
        </div>

        <!-- 상여 -->
        <div style="padding:11px 18px;border-bottom:1px solid #f5f5f5">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
            <div style="font-size:13px;font-weight:600;color:var(--t1)">상여</div>
            <div style="display:flex;align-items:center;gap:6px">
              <div class="no-capture"><input class="amt-input" id="psBonus" value="0" oninput="calcPayTotal()" style="width:100px"></div>
              <div style="font-size:15px;font-weight:700;color:var(--t1);min-width:70px;text-align:right;display:none" id="psBonusDisp">₩0</div>
            </div>
          </div>
          <div class="no-capture"><input class="ps-memo" id="psBonusMemo" placeholder="예: 명절 상여, 성과급 등"></div>
          <div style="font-size:11px;color:var(--t2);display:none" id="psBonusMemoDisp"></div>
        </div>

        <!-- 기타 -->
        <div style="padding:11px 18px;border-bottom:1px solid #f5f5f5">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
            <div style="font-size:13px;font-weight:600;color:var(--t1)">기타</div>
            <div style="display:flex;align-items:center;gap:6px">
              <div class="no-capture"><input class="amt-input" id="psEtc" value="0" oninput="calcPayTotal()" style="width:100px"></div>
              <div style="font-size:15px;font-weight:700;color:var(--t1);min-width:70px;text-align:right;display:none" id="psEtcDisp">₩0</div>
            </div>
          </div>
          <div class="no-capture"><input class="ps-memo" id="psEtcMemo" placeholder="예: 교통비, 식대 등"></div>
          <div style="font-size:11px;color:var(--t2);display:none" id="psEtcMemoDisp"></div>
        </div>

      </div>

      <!-- 최종 합계 -->
      <div style="background:var(--green);padding:16px 18px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.9)">💳 최종 합계</span>
        <span style="font-size:24px;font-weight:800;color:#fff" id="psTotal">₩0</span>
      </div>

      <!-- 카드 푸터 -->
      <div style="padding:10px 18px;background:#fafafa;border-top:1px solid var(--bd);display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:10px;color:var(--t3)">☕ ZUO · 한 손안에 매장관리</div>
        <div style="font-size:10px;color:var(--t3)" id="psIssuedAt"></div>
      </div>
    </div>
    <!-- 캡처 대상 카드 끝 -->

    <!-- 버튼들 -->
    <div style="display:flex;gap:8px;margin-bottom:6px">
      <button class="fcnl" style="flex:1" onclick="savePayslip()">💾 저장</button>
      <button style="flex:2;padding:11px;border-radius:8px;border:none;background:var(--green);color:#fff;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px" onclick="captureAndShare()">
        📥 급여명세서 이미지 저장
      </button>
    </div>
    <div style="text-align:center;font-size:11px;color:var(--t3);line-height:1.6">이미지 저장 후 카카오톡 파일첨부(+)로 전송하세요</div>
  </div>
</div>

<!-- 화면11: 월 급여 현황 테이블 -->
<div class="screen" id="scPayTable">
  <div class="hdr">
    <button class="back-btn" onclick="showScreen('scLabor')">← 뒤로</button>
    <div class="hdr-title">월 급여 현황</div>
    <div class="hdr-sub" id="payTablePeriod">2026년 4월</div>
  </div>
  <div style="padding:12px 14px;overflow-y:auto">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <button class="btn-outline-s" onclick="changePayMonth(-1)">◀</button>
      <div style="font-size:14px;font-weight:600;color:var(--t1)" id="payTableMonth">2026년 4월</div>
      <button class="btn-outline-s" onclick="changePayMonth(1)">▶</button>
    </div>
    <div class="pay-tbl-wrap">
      <table class="pay-tbl" id="payTable"></table>
    </div>
    <div style="background:var(--gl);border-radius:10px;padding:12px;margin-bottom:10px">
      <div style="font-size:12px;color:var(--gd);font-weight:600;margin-bottom:4px">총 인건비</div>
      <div style="font-size:22px;font-weight:700;color:var(--gd)" id="payTableTotal">₩0</div>
    </div>
    <button class="btn-primary" onclick="exportExcel()">📊 엑셀로 내보내기</button>
    <button style="width:100%;padding:11px;border-radius:8px;border:none;background:#FEE500;color:#3C1E1E;font-size:13px;font-weight:600;cursor:pointer;margin-top:6px" onclick="alert('카톡으로 공유할 내용이 복사됐어요!')">📋 카톡으로 공유</button>
  </div>
</div>

<!-- 화면12: 관리자 -->
<div class="screen" id="scAdmin">
  <div class="hdr">
    <button class="back-btn" onclick="goHome()">← 뒤로</button>
    <div class="hdr-title">⚙️ 관리자 설정</div>
    <div style="width:40px"></div>
  </div>
  <div class="admin-wrap">
    <div class="admin-section">
      <div class="admin-section-title">카페 목록 관리</div>
      <div id="adminCafeList"></div>
    </div>
    <button class="add-cafe-btn" onclick="openAddCafe()">+ 카페 추가</button>
  </div>
</div>

<!-- 시간 선택 모달 -->
<div class="mbg" id="timePickModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt" id="timePickTitle">시작 시간 선택</div>
    <div class="ampm-row">
      <button class="ampm-btn on" id="btnAm" onclick="setAmpm('am')">오전 AM</button>
      <button class="ampm-btn" id="btnPm" onclick="setAmpm('pm')">오후 PM</button>
    </div>
    <div style="font-size:11px;font-weight:500;color:var(--t2);margin-bottom:6px">시 선택</div>
    <div class="hour-grid" id="hourGrid"></div>
    <div style="font-size:11px;font-weight:500;color:var(--t2);margin-bottom:6px">분 선택 (10분 단위)</div>
    <div class="min-grid" id="minGrid"></div>
    <div class="tdisp" id="tdisp" style="background:var(--gl)">
      <div style="font-size:11px;color:var(--gd);margin-bottom:3px">선택된 시간</div>
      <div style="font-size:26px;font-weight:700;color:var(--gd)" id="tDispVal">오전 9:00</div>
    </div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeTimePicker()">취소</button>
      <button class="mok" onclick="confirmTime()">확인</button>
    </div>
  </div>
</div>

<!-- 수정 모달 -->
<div class="mbg" id="editModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt" id="editModalTitle">내용 수정</div>
    <div class="fr"><label class="fl">비밀번호 확인</label><input type="password" id="editPwCheck" placeholder="본인 비밀번호를 입력하세요" style="width:100%"></div>
    <div style="font-size:11px;color:var(--t3);margin-bottom:10px">비밀번호를 잊으셨다면 중간관리자에게 문의하세요</div>
    <div id="editFields">
      <div class="fr"><label class="fl">이름</label><input type="text" id="eName" style="width:100%"></div>
      <div class="fr">
        <label class="fl">대타 시간</label>
        <div class="tg">
          <div><div class="tlbl">시작</div><input type="text" id="eS" style="width:100%"></div>
          <div><div class="tlbl">종료</div><input type="text" id="eE" style="width:100%"></div>
        </div>
      </div>
      <div class="fr"><label class="fl">메모</label><input type="text" id="eNote" style="width:100%"></div>
    </div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeEdit()">취소</button>
      <button class="mok" onclick="confirmEdit()">수정 완료</button>
    </div>
  </div>
</div>

<!-- 삭제 모달 -->
<div class="mbg" id="delModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt">요청 취소</div>
    <div class="fr"><label class="fl">비밀번호 확인</label><input type="password" id="delPwCheck" placeholder="본인 비밀번호를 입력하세요" style="width:100%"></div>
    <div style="font-size:11px;color:var(--t3);margin-bottom:10px">비밀번호를 잊으셨다면 중간관리자에게 문의하세요</div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeDelModal()">취소</button>
      <button class="mok" style="background:var(--red)" onclick="confirmDel()">취소 확인</button>
    </div>
  </div>
</div>

<!-- 대타신청 모달 -->
<div class="mbg" id="takeModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt">대타 신청</div>
    <div class="fr"><label class="fl">신청자 이름</label><input type="text" id="tkName" placeholder="이름 입력" style="width:100%"></div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeTake()">취소</button>
      <button class="mok" onclick="confirmTake()">신청 완료</button>
    </div>
  </div>
</div>

<!-- 관리자 비밀번호 모달 -->
<div class="mbg" id="adminPwModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt">관리자 로그인</div>
    <div class="fr"><label class="fl">관리자 비밀번호</label><input type="password" id="adminPwInput" placeholder="비밀번호 입력" style="width:100%"></div>
    <div class="pw-error" id="adminPwError" style="margin-bottom:8px">비밀번호가 틀렸어요 ❌</div>
    <button onclick="openRecover()" style="background:none;border:none;color:var(--t3);font-size:12px;cursor:pointer;padding:4px 0;margin-bottom:8px">비밀번호를 잊으셨나요?</button>
    <div class="mbtns">
      <button class="mcnl" onclick="closeAdminPw()">취소</button>
      <button class="mok" onclick="checkAdminPw()">확인</button>
    </div>
  </div>
</div>

<!-- 마스터 비밀번호 모달 (근로관리) -->
<div class="mbg" id="masterPwModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt">관리자 확인</div>
    <div style="background:var(--al);border-radius:8px;padding:10px;margin-bottom:12px;font-size:12px;color:var(--ad);line-height:1.6">⚡ 관리자 메뉴입니다. 마스터 번호를 입력해주세요.</div>
    <div class="fr"><label class="fl">마스터 번호</label><input type="password" id="masterPwInput" placeholder="마스터 번호 입력" style="width:100%"></div>
    <div class="pw-error" id="masterPwError" style="margin-bottom:8px">마스터 번호가 틀렸어요 ❌</div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeMasterPw()">취소</button>
      <button class="mok" onclick="checkMasterPw()">확인</button>
    </div>
  </div>
</div>

<!-- 직원 비밀번호 모달 (근무시간 입력) -->
<div class="mbg" id="workerPwModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt" id="workerPwModalTitle">비밀번호 확인</div>
    <div class="fr"><label class="fl">비밀번호</label><input type="password" id="workerPwInput" placeholder="본인 비밀번호 입력" style="width:100%"></div>
    <div style="font-size:11px;color:var(--t3);margin-bottom:8px">비밀번호를 잊으셨다면 중간관리자에게 문의하세요</div>
    <div class="pw-error" id="workerPwError" style="margin-bottom:8px">비밀번호가 틀렸어요 ❌</div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeWorkerPw()">취소</button>
      <button class="mok" onclick="checkWorkerPw()">확인</button>
    </div>
  </div>
</div>

<!-- 복구 모달 -->
<div class="mbg" id="adminRecoverModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt">관리자 비밀번호 찾기</div>
    <div style="font-size:12px;color:var(--t3);margin-bottom:14px;line-height:1.6">복구 코드를 입력하면 비밀번호를 재설정할 수 있어요.</div>
    <div class="fr"><label class="fl">복구 코드</label><input type="text" id="recoverCode" placeholder="복구 코드 입력" style="width:100%"></div>
    <div class="fr"><label class="fl">새 비밀번호</label><input type="password" id="newAdminPw" placeholder="새 비밀번호" style="width:100%"></div>
    <div class="pw-error" id="recoverError" style="margin-bottom:8px">복구 코드가 틀렸어요 ❌</div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeRecover()">취소</button>
      <button class="mok" onclick="confirmRecover()">재설정</button>
    </div>
  </div>
</div>

<!-- 카페 추가/수정 모달 -->
<div class="mbg" id="cafeEditModal">
  <div class="modal">
    <div class="mh"></div>
    <div class="mt" id="cafeEditTitle">카페 추가</div>
    <div class="fr"><label class="fl">카페 이름</label><input type="text" id="cafeNameInput" placeholder="카페 이름" style="width:100%"></div>
    <div class="fr"><label class="fl">입장 비밀번호</label><input type="password" id="cafePwInput" placeholder="직원들이 입장할 비밀번호" style="width:100%"></div>
    <div class="fr">
      <label class="fl">카페 색상 테마</label>
      <div class="color-picker" id="colorPicker">
        <div class="color-dot selected" data-color="green" style="background:#1D9E75" onclick="selectColor('green',this)"></div>
        <div class="color-dot" data-color="blue" style="background:#185FA5" onclick="selectColor('blue',this)"></div>
        <div class="color-dot" data-color="purple" style="background:#534AB7" onclick="selectColor('purple',this)"></div>
        <div class="color-dot" data-color="pink" style="background:#993556" onclick="selectColor('pink',this)"></div>
        <div class="color-dot" data-color="orange" style="background:#BA7517" onclick="selectColor('orange',this)"></div>
        <div class="color-dot" data-color="red" style="background:#A32D2D" onclick="selectColor('red',this)"></div>
        <div class="color-dot" data-color="yellow" style="background:#8a7200" onclick="selectColor('yellow',this)"></div>
      </div>
    </div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeCafeEdit()">취소</button>
      <button class="mok" onclick="saveCafe()">저장</button>
    </div>
  </div>
</div>

<!-- 주휴수당 계산기 모달 -->
<div class="mbg" id="holiCalcModal">
  <div class="modal" style="padding-bottom:28px">
    <div class="mh"></div>
    <div class="mt">🧮 주휴수당 단가 계산기</div>
    <div style="background:var(--al);border-radius:8px;padding:10px 12px;margin-bottom:14px;font-size:11px;color:var(--ad);line-height:1.7">
      주휴수당 단가 = 1주 소정근로시간 ÷ 40 × 8 × 시급<br>
      <span style="color:var(--ad);font-weight:600">예) 주 15시간 · 시급 10,030원 → 단가 30,090원</span>
    </div>
    <div class="fr" style="margin-bottom:10px">
      <label class="fl">1주 소정근로시간 (시간)</label>
      <input type="number" id="hcWeekHrs" placeholder="예: 20" oninput="calcHoli()" style="width:100%">
    </div>
    <div class="fr" style="margin-bottom:10px">
      <label class="fl">시급 (원)</label>
      <input type="number" id="hcRate" placeholder="예: 10030" oninput="calcHoli()" style="width:100%">
    </div>
    <div style="background:var(--gl);border-radius:10px;padding:12px 14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:13px;color:var(--gd);font-weight:500">계산된 주휴수당 단가</span>
      <span style="font-size:20px;font-weight:700;color:var(--gd)" id="hcResult">₩0</span>
    </div>
    <div style="font-size:10px;color:var(--t3);margin-bottom:12px;line-height:1.6">※ 주 15시간 미만 근로자는 주휴수당 미적용<br>※ 계산값을 단가에 자동입력하려면 아래 버튼을 누르세요</div>
    <div class="mbtns">
      <button class="mcnl" onclick="closeHoliCalc()">닫기</button>
      <button class="mok" onclick="applyHoliCalc()">단가에 적용</button>
    </div>
  </div>
</div>

<!-- 카카오 공유 배너 -->
<div class="shbanner" id="shBanner">
  <div style="font-size:13px;font-weight:600;color:var(--t1)">📢 카카오톡 단체방에 알리기</div>
  <div class="shtxt" id="shTxt"></div>
  <div class="shbtns">
    <button class="bkakao" onclick="doCopy()">복사 → 카톡에 붙여넣기</button>
    <button class="bclose" onclick="closeShare()">닫기</button>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script>
firebase.initializeApp({
  apiKey:"AIzaSyDnoP28JeC1jMsXRAQ0p8dDzcSYabgxEiw",
  authDomain:"cafe-schdule.firebaseapp.com",
  projectId:"cafe-schdule",
  storageBucket:"cafe-schdule.firebasestorage.app",
  messagingSenderId:"973762999217",
  appId:"1:973762999217:web:d4a2c4c5556b3a8f014390"
});
const db=firebase.firestore();

const DAYS=["일","월","화","수","목","금","토"];
const MONTHS=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
const RECOVER_CODE="duo1234";
const APP_URL="https://radinotech-beep.github.io/zuo-cafe";
const MASTER_PW="0000";

let ADMIN_PW=localStorage.getItem('adminPw')||"admin1234";
let cY=new Date().getFullYear(),cM=new Date().getMonth();
let selDate=null,allSubs={},pendTake=null,pendEdit=null,pendDel=null;
let currentCafe=null,cafes=[],editingCafeId=null,unsubscribe=null;
let pickingFor='start',isAm=true,selH=9,selM=0;
let tStartAm=true,tStartH=9,tStartM=0,tEndAm=false,tEndH=3,tEndM=0;
let employees=[],empUnsubscribe=null;
let workData={},wkY=new Date().getFullYear(),wkM=new Date().getMonth(),wkSelDay=null,wkHours=4.5,lastSavedHours=undefined;
let currentWorkerEmp=null,masterMenuDest='emp';
let payY=new Date().getFullYear(),payM=new Date().getMonth();
let psHoliRateVal=41280,psWeekCntVal=4;

const colorMap={
  green:{main:'#1D9E75',light:'#E1F5EE',dark:'#0F6E56'},
  blue:{main:'#185FA5',light:'#E6F1FB',dark:'#0C447C'},
  purple:{main:'#534AB7',light:'#EEEDFE',dark:'#3C3489'},
  pink:{main:'#993556',light:'#FBEAF0',dark:'#72243E'},
  orange:{main:'#BA7517',light:'#FAEEDA',dark:'#854F0B'},
  red:{main:'#A32D2D',light:'#FCEBEB',dark:'#791F1F'},
  yellow:{main:'#8a7200',light:'#FFFBE6',dark:'#5a4a00'}
};

// 스플래시
setTimeout(()=>{
  document.getElementById('splash').classList.add('hide');
  setTimeout(()=>document.getElementById('splash').style.display='none',600);
},2000);

const now=new Date();
const dateStr=`${now.getMonth()+1}월 ${now.getDate()}일`;
document.getElementById('homeDateLbl').textContent=dateStr;
document.getElementById('appDateLbl').textContent=dateStr;

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

function applyTheme(color){
  const t=colorMap[color]||colorMap.green;
  document.documentElement.style.setProperty('--green',t.main);
  document.documentElement.style.setProperty('--gl',t.light);
  document.documentElement.style.setProperty('--gm',t.light);
  document.documentElement.style.setProperty('--gd',t.dark);
  document.querySelector('meta[name="theme-color"]').setAttribute('content',t.main);
}

function goHome(){
  if(unsubscribe){unsubscribe();unsubscribe=null;}
  if(empUnsubscribe){empUnsubscribe();empUnsubscribe=null;}
  currentCafe=null;selDate=null;
  showScreen('scHome');loadCafes();
}

function loadCafes(){
  db.collection('cafes').onSnapshot(snap=>{
    cafes=[];
    snap.forEach(d=>cafes.push({id:d.id,...d.data()}));
    cafes.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
    renderCafeList();renderAdminCafeList();
  });
}

function renderCafeList(){
  const list=document.getElementById('cafeList');
  if(!cafes.length){list.innerHTML=`<div style="text-align:center;padding:28px;font-size:13px;color:var(--t3)">등록된 카페가 없어요<br>관리자에게 문의해주세요</div>`;return;}
  list.innerHTML=cafes.map(c=>{
    const cm=colorMap[c.color||'green']||colorMap.green;
    return `<div class="cafe-card" onclick="selectCafe('${c.id}')">
      <div class="cafe-card-left">
        <div class="cafe-icon" style="background:${cm.light};color:${cm.dark}">☕</div>
        <div><div class="cafe-name" style="color:${cm.dark}">${c.name}</div><div class="cafe-desc">탭하여 입장하기</div></div>
      </div>
      <div style="color:${cm.main};font-size:18px">›</div>
    </div>`;
  }).join('');
}

function selectCafe(id){
  currentCafe=cafes.find(c=>c.id===id);
  const cm=colorMap[currentCafe.color||'green']||colorMap.green;
  document.getElementById('pwHdr').style.background=cm.main;
  document.getElementById('pwCafeName').textContent=currentCafe.name;
  document.getElementById('pwTitle').textContent=`${currentCafe.name} 입장`;
  document.getElementById('pwBtn').style.background=cm.main;
  document.getElementById('pwInput').value='';
  document.getElementById('pwError').style.display='none';
  showScreen('scPw');
}

function checkCafePw(){
  const pw=document.getElementById('pwInput').value;
  if(pw===currentCafe.password){
    applyTheme(currentCafe.color||'green');
    const cm=colorMap[currentCafe.color||'green']||colorMap.green;
    document.getElementById('svcHdr').style.background=cm.main;
    document.getElementById('svcCafeName').textContent=currentCafe.name;
    document.getElementById('svcIcon1').style.background=cm.light;
    showScreen('scSvc');
  } else {
    document.getElementById('pwError').style.display='block';
    document.getElementById('pwInput').value='';
  }
}

function enterSvc(type){
  const cm=colorMap[currentCafe.color||'green']||colorMap.green;
  if(type==='sub'){
    document.getElementById('appHdr').style.background=cm.main;
    document.getElementById('appCafeName').textContent=currentCafe.name;
    showScreen('scApp');
    initApp();
  } else {
    document.getElementById('laborHdr').style.background=cm.main;
    document.getElementById('laborCafeName').textContent=currentCafe.name;
    showScreen('scLabor');
    loadEmployees();
  }
}

// ===== 대타 =====
function initApp(){
  selDate=null;cY=new Date().getFullYear();cM=new Date().getMonth();
  document.getElementById('panel').style.display='none';
  document.getElementById('hint').style.display='block';
  document.getElementById('addForm').style.display='none';
  switchTab('sub');renderCal();
  if(unsubscribe)unsubscribe();
  unsubscribe=db.collection('subs').where('cafeId','==',currentCafe.id).onSnapshot(snap=>{
    allSubs={};
    snap.forEach(d=>{const data=d.data();if(!allSubs[data.date])allSubs[data.date]=[];allSubs[data.date].push({...data,fid:d.id});});
    renderCal();if(selDate)renderSubList();renderAllList();
  });
}

function formatTime(ampm,h,m){return `${ampm?'오전':'오후'} ${h}:${String(m).padStart(2,'0')}`;}
function getStatus(dk){const l=allSubs[dk]||[];if(!l.length)return null;return l.every(s=>s.takenBy)?'don':'ong';}

function changeMonth(dir){cM+=dir;if(cM>11){cM=0;cY++;}if(cM<0){cM=11;cY--;}selDate=null;document.getElementById('panel').style.display='none';document.getElementById('hint').style.display='block';renderCal();}

function renderCal(){
  document.getElementById('ctitle').textContent=`${cY}년 ${MONTHS[cM]}`;
  const g=document.getElementById('cgrid');
  g.innerHTML=DAYS.map((d,i)=>`<div class="dhdr" style="${i===0?'color:var(--red)':i===6?'color:#185FA5':''}">${d}</div>`).join('');
  const first=new Date(cY,cM,1).getDay();
  const days=new Date(cY,cM+1,0).getDate();
  const today=new Date();
  for(let i=0;i<first;i++)g.innerHTML+=`<div class="cc emp"></div>`;
  for(let d=1;d<=days;d++){
    const dk=`${cY}-${String(cM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const st=getStatus(dk);
    const isTod=today.getFullYear()===cY&&today.getMonth()===cM&&today.getDate()===d;
    const isSel=selDate===dk;
    const dow=(first+d-1)%7;
    const list=allSubs[dk]||[];
    let cls=`cc${st?' '+st:''}${isTod?' tod':''}${isSel?' selected':''}${dow===0?' sun':dow===6?' sat':''}`;
    let inner=`<div class="cd">${d}</div>`;
    if(st){inner+=`<div class="cpill ${st==='ong'?'p-ong':'p-don'}">${st==='ong'?'진행중':'완료'}</div>`;list.forEach(s=>{inner+=`<div class="cn"><span class="nr">↑${s.name}</span>${s.takenBy?` <span class="nt">↓${s.takenBy}</span>`:''}</div>`;});}
    g.innerHTML+=`<div class="${cls}" onclick="selectDate('${dk}',${d})">${inner}</div>`;
  }
}

function selectDate(dk,d){
  selDate=dk;
  const dow=new Date(dk).getDay();
  document.getElementById('ptitle').textContent=`${cM+1}월 ${d}일 (${DAYS[dow]})`;
  document.getElementById('panel').style.display='block';
  document.getElementById('hint').style.display='none';
  document.getElementById('addForm').style.display='none';
  document.getElementById('panel').scrollIntoView({behavior:'smooth',block:'nearest'});
  renderCal();renderSubList();
}

function showForm(){
  document.getElementById('rName').value='';
  document.getElementById('rNote').value='';
  document.getElementById('rPw').value='';
  tStartAm=true;tStartH=9;tStartM=0;
  tEndAm=false;tEndH=3;tEndM=0;
  document.getElementById('tSBox').textContent=formatTime(tStartAm,tStartH,tStartM);
  document.getElementById('tEBox').textContent=formatTime(tEndAm,tEndH,tEndM);
  document.getElementById('addForm').style.display='block';
}
function hideForm(){document.getElementById('addForm').style.display='none';}

async function submitSub(){
  const name=document.getElementById('rName').value.trim();
  if(!name){alert('이름을 입력해 주세요');return;}
  const pw=document.getElementById('rPw').value.trim();
  if(!pw){alert('비밀번호를 입력해 주세요');return;}
  const note=document.getElementById('rNote').value.trim();
  const ts=formatTime(tStartAm,tStartH,tStartM);
  const te=formatTime(tEndAm,tEndH,tEndM);
  await db.collection('subs').add({cafeId:currentCafe.id,cafeName:currentCafe.name,name,date:selDate,timeStart:ts,timeEnd:te,note,password:pw,takenBy:null,createdAt:Date.now()});
  hideForm();
  const d=new Date(selDate);
  const ds=`${d.getMonth()+1}/${d.getDate()}(${DAYS[d.getDay()]})`;
  showShare(`🙋 대타 구해요! [${currentCafe.name}]\n📅 ${ds} ${ts}~${te}\n👤 요청자: ${name}${note?' ('+note+')':''}\n\n👉 앱: ${APP_URL}`);
}

function renderSubList(){
  const list=allSubs[selDate]||[];
  const w=document.getElementById('slist');
  if(!list.length){w.innerHTML=`<div class="emsg">등록된 대타 요청이 없어요</div>`;return;}
  w.innerHTML=list.map((s,i)=>{
    const done=!!s.takenBy;
    const bdg=done?`<div class="sbdg bd-don">완료</div>`:`<div class="sbdg bd-ong">진행중</div>`;
    const names=done?`<span>${s.name}</span><span class="aw">⇄</span><span class="tk">${s.takenBy}</span>`:`<span>${s.name}</span>`;
    const btns=done
      ?`<button class="b-ctk" onclick="cancelTake('${s.fid}')">대타신청 취소</button><button class="b-edit" onclick="openEdit('${s.fid}')">수정</button><button class="b-crq" onclick="openDel('${s.fid}')">요청 취소</button>`
      :`<button class="b-take" onclick="openTake('${s.fid}')">대타 할게요</button><button class="b-edit" onclick="openEdit('${s.fid}')">수정</button><button class="b-crq" onclick="openDel('${s.fid}')">요청 취소</button>`;
    return `<div class="si"><div class="sr"><div class="snum">${i+1}</div><div class="sb"><div class="sn">${names}</div><div class="stm">${s.timeStart} – ${s.timeEnd}</div>${s.note?`<div class="snt">${s.note}</div>`:''}<div class="sbtns">${btns}</div></div>${bdg}</div></div>`;
  }).join('');
}

async function cancelTake(fid){if(!confirm('대타 신청을 취소할까요?'))return;await db.collection('subs').doc(fid).update({takenBy:null});}
function openTake(fid){pendTake=fid;document.getElementById('tkName').value='';document.getElementById('takeModal').classList.add('open');}
function closeTake(){document.getElementById('takeModal').classList.remove('open');pendTake=null;}
async function confirmTake(){
  const name=document.getElementById('tkName').value.trim();
  if(!name){alert('이름을 입력해 주세요');return;}
  let sub=null;Object.values(allSubs).forEach(l=>l.forEach(s=>{if(s.fid===pendTake)sub=s;}));
  await db.collection('subs').doc(pendTake).update({takenBy:name});
  closeTake();
  if(sub){const d=new Date(sub.date);const ds=`${d.getMonth()+1}/${d.getDate()}(${DAYS[d.getDay()]})`;showShare(`✅ 대타 확정! [${currentCafe.name}]\n📅 ${ds} ${sub.timeStart}~${sub.timeEnd}\n🔄 ${sub.name} → ${name}\n\n👉 앱: ${APP_URL}`);}
}

function openEdit(fid){
  let sub=null;Object.values(allSubs).forEach(l=>l.forEach(s=>{if(s.fid===fid)sub=s;}));
  if(!sub)return;pendEdit=fid;
  document.getElementById('editPwCheck').value='';
  document.getElementById('eName').value=sub.name;
  document.getElementById('eS').value=sub.timeStart;
  document.getElementById('eE').value=sub.timeEnd;
  document.getElementById('eNote').value=sub.note||'';
  document.getElementById('editModal').classList.add('open');
}
function closeEdit(){document.getElementById('editModal').classList.remove('open');pendEdit=null;}
async function confirmEdit(){
  const pw=document.getElementById('editPwCheck').value.trim();
  let sub=null;Object.values(allSubs).forEach(l=>l.forEach(s=>{if(s.fid===pendEdit)sub=s;}));
  if(!sub)return;
  if(pw!==sub.password&&pw!==MASTER_PW){alert('비밀번호가 틀렸어요 ❌');return;}
  const name=document.getElementById('eName').value.trim();
  if(!name){alert('이름을 입력해 주세요');return;}
  await db.collection('subs').doc(pendEdit).update({name,timeStart:document.getElementById('eS').value,timeEnd:document.getElementById('eE').value,note:document.getElementById('eNote').value.trim()});
  closeEdit();
}

function openDel(fid){pendDel=fid;document.getElementById('delPwCheck').value='';document.getElementById('delModal').classList.add('open');}
function closeDelModal(){document.getElementById('delModal').classList.remove('open');pendDel=null;}
async function confirmDel(){
  const pw=document.getElementById('delPwCheck').value.trim();
  let sub=null;Object.values(allSubs).forEach(l=>l.forEach(s=>{if(s.fid===pendDel)sub=s;}));
  if(!sub)return;
  if(pw!==sub.password&&pw!==MASTER_PW){alert('비밀번호가 틀렸어요 ❌');return;}
  await db.collection('subs').doc(pendDel).delete();
  closeDelModal();
}

function renderAllList(){
  const all=[];Object.entries(allSubs).forEach(([dk,list])=>list.forEach((s,i)=>all.push({...s,date:dk,num:i+1})));
  all.sort((a,b)=>a.date.localeCompare(b.date));
  const w=document.getElementById('alist');
  if(!all.length){w.innerHTML=`<div class="emsg" style="padding:36px 0">등록된 대타 요청이 없어요</div>`;return;}
  w.innerHTML=all.map(s=>{
    const d=new Date(s.date);const done=!!s.takenBy;
    const names=done?`<span>${s.name}</span><span class="aw" style="font-size:11px">⇄</span><span class="tk" style="font-size:11px">${s.takenBy}</span>`:`<span>${s.name}</span>`;
    return `<div class="ai"><div class="adt"><div class="adm">${d.getMonth()+1}/${d.getDate()}</div><div class="add">${DAYS[d.getDay()]}요일</div></div><div class="anum">${s.num}</div><div class="abody"><div class="anames">${names}</div><div class="atm">${s.timeStart}–${s.timeEnd}${s.note?' · '+s.note:''}</div></div><div class="stag ${done?'st-don':'st-ong'}">${done?'완료':'구함'}</div></div>`;
  }).join('');
}

function switchTab(tab){
  document.getElementById('t1').classList.toggle('on',tab==='sub');
  document.getElementById('t2').classList.toggle('on',tab==='all');
  document.getElementById('subTab').style.display=tab==='sub'?'block':'none';
  document.getElementById('allTab').style.display=tab==='all'?'block':'none';
  if(tab==='all')renderAllList();
}

// 시간 선택
function openTimePicker(type){
  pickingFor=type;
  document.getElementById('timePickTitle').textContent=type==='start'?'시작 시간 선택':'종료 시간 선택';
  if(type==='start'){isAm=tStartAm;selH=tStartH;selM=tStartM;}
  else{isAm=tEndAm;selH=tEndH;selM=tEndM;}
  renderTimePicker();
  document.getElementById('timePickModal').classList.add('open');
}
function closeTimePicker(){document.getElementById('timePickModal').classList.remove('open');}
function setAmpm(v){isAm=v==='am';renderTimePicker();}
function renderTimePicker(){
  const hg=document.getElementById('hourGrid');
  const mg=document.getElementById('minGrid');
  document.getElementById('btnAm').classList.toggle('on',isAm);
  document.getElementById('btnPm').classList.toggle('on',!isAm);
  document.getElementById('btnAm').style.background=isAm?'var(--green)':'#fff';
  document.getElementById('btnAm').style.color=isAm?'#fff':'var(--t2)';
  document.getElementById('btnAm').style.border=isAm?'none':'1px solid var(--bd)';
  document.getElementById('btnPm').style.background=!isAm?'var(--green)':'#fff';
  document.getElementById('btnPm').style.color=!isAm?'#fff':'var(--t2)';
  document.getElementById('btnPm').style.border=!isAm?'none':'1px solid var(--bd)';
  hg.innerHTML='';
  for(let h=1;h<=12;h++){
    const on=h===selH;
    hg.innerHTML+=`<button class="hbtn${on?' on':''}" style="background:${on?'var(--green)':'#fff'};color:${on?'#fff':'var(--t1)'};border:${on?'none':'1px solid var(--bd)'}" onclick="selHour(${h})">${h}시</button>`;
  }
  mg.innerHTML='';
  for(let m=0;m<60;m+=10){
    const on=m===selM;
    mg.innerHTML+=`<button class="hbtn${on?' on':''}" style="background:${on?'var(--green)':'#fff'};color:${on?'#fff':'var(--t1)'};border:${on?'none':'1px solid var(--bd)'}" onclick="selMin(${m})">${String(m).padStart(2,'0')}</button>`;
  }
  const txt=formatTime(isAm,selH,selM);
  document.getElementById('tDispVal').textContent=txt;
  document.getElementById('tdisp').style.background='var(--gl)';
  document.getElementById('tDispVal').style.color='var(--gd)';
}
function selHour(h){selH=h;renderTimePicker();}
function selMin(m){selM=m;renderTimePicker();}
function confirmTime(){
  const txt=formatTime(isAm,selH,selM);
  if(pickingFor==='start'){tStartAm=isAm;tStartH=selH;tStartM=selM;document.getElementById('tSBox').textContent=txt;}
  else{tEndAm=isAm;tEndH=selH;tEndM=selM;document.getElementById('tEBox').textContent=txt;}
  closeTimePicker();
}

// 공유
function showToast(msg){
  let t=document.getElementById('toastMsg');
  if(!t){t=document.createElement('div');t.id='toastMsg';t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.78);color:#fff;padding:10px 20px;border-radius:20px;font-size:13px;z-index:999;white-space:nowrap;pointer-events:none;transition:opacity 0.4s';document.body.appendChild(t);}
  t.textContent=msg;t.style.opacity='1';
  clearTimeout(t._timer);t._timer=setTimeout(()=>t.style.opacity='0',2500);
}
function showShare(txt){document.getElementById('shTxt').textContent=txt;document.getElementById('shBanner').style.display='block';}
function closeShare(){document.getElementById('shBanner').style.display='none';}
async function doCopy(){
  const txt=document.getElementById('shTxt').textContent;
  try{await navigator.clipboard.writeText(txt);}
  catch(e){const el=document.createElement('textarea');el.value=txt;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.focus();el.select();document.execCommand('copy');document.body.removeChild(el);}
  alert('복사됐어요! 카카오톡 단체방에서 길게 누르기 → 붙여넣기 해주세요 😊');closeShare();
}

// 관리자
function goAdmin(){document.getElementById('adminPwInput').value='';document.getElementById('adminPwError').style.display='none';document.getElementById('adminPwModal').classList.add('open');}
function closeAdminPw(){document.getElementById('adminPwModal').classList.remove('open');}
function checkAdminPw(){if(document.getElementById('adminPwInput').value===ADMIN_PW){closeAdminPw();showScreen('scAdmin');}else{document.getElementById('adminPwError').style.display='block';}}
function openRecover(){closeAdminPw();document.getElementById('recoverCode').value='';document.getElementById('newAdminPw').value='';document.getElementById('recoverError').style.display='none';document.getElementById('adminRecoverModal').classList.add('open');}
function closeRecover(){document.getElementById('adminRecoverModal').classList.remove('open');}
function confirmRecover(){
  if(document.getElementById('recoverCode').value.trim()!==RECOVER_CODE){document.getElementById('recoverError').style.display='block';return;}
  const np=document.getElementById('newAdminPw').value.trim();
  if(!np){alert('새 비밀번호를 입력해주세요');return;}
  ADMIN_PW=np;localStorage.setItem('adminPw',np);closeRecover();alert('✅ 비밀번호가 재설정됐어요!');
}

function renderAdminCafeList(){
  const list=document.getElementById('adminCafeList');
  if(!cafes.length){list.innerHTML=`<div style="padding:14px;font-size:12px;color:var(--t3);text-align:center">등록된 카페가 없어요</div>`;return;}
  list.innerHTML=cafes.map(c=>`<div class="admin-cafe-item"><div style="flex:1"><div class="admin-cafe-name">${c.name}</div><div class="admin-cafe-pw">비밀번호: ${c.password}</div></div><button class="admin-edit-btn" onclick="openEditCafe('${c.id}')">수정</button><button class="admin-del-btn" onclick="deleteCafe('${c.id}')">삭제</button></div>`).join('');
}

let selectedColor='green';
function selectColor(color,el){selectedColor=color;document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('selected'));el.classList.add('selected');}
function openAddCafe(){editingCafeId=null;selectedColor='green';document.getElementById('cafeEditTitle').textContent='카페 추가';document.getElementById('cafeNameInput').value='';document.getElementById('cafePwInput').value='';document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('selected'));document.querySelector('.color-dot[data-color="green"]').classList.add('selected');document.getElementById('cafeEditModal').classList.add('open');}
function openEditCafe(id){const cafe=cafes.find(c=>c.id===id);if(!cafe)return;editingCafeId=id;selectedColor=cafe.color||'green';document.getElementById('cafeEditTitle').textContent='카페 수정';document.getElementById('cafeNameInput').value=cafe.name;document.getElementById('cafePwInput').value=cafe.password;document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('selected'));const dot=document.querySelector(`.color-dot[data-color="${selectedColor}"]`);if(dot)dot.classList.add('selected');document.getElementById('cafeEditModal').classList.add('open');}
function closeCafeEdit(){document.getElementById('cafeEditModal').classList.remove('open');editingCafeId=null;}
async function saveCafe(){const name=document.getElementById('cafeNameInput').value.trim();const pw=document.getElementById('cafePwInput').value.trim();if(!name){alert('카페 이름을 입력해 주세요');return;}if(!pw){alert('입장 비밀번호를 입력해 주세요');return;}if(editingCafeId){await db.collection('cafes').doc(editingCafeId).update({name,password:pw,color:selectedColor});}else{await db.collection('cafes').add({name,password:pw,color:selectedColor,createdAt:Date.now()});}closeCafeEdit();}
async function deleteCafe(id){if(!confirm('카페를 삭제할까요?'))return;await db.collection('cafes').doc(id).delete();}

// ===== 근로관리 =====
function switchLaborTab(tab){
  document.getElementById('lt1').classList.toggle('on',tab==='worker');
  document.getElementById('lt2').classList.toggle('on',tab==='master');
  document.getElementById('laborWorkerTab').style.display=tab==='worker'?'block':'none';
  document.getElementById('laborMasterTab').style.display=tab==='master'?'block':'none';
}

function loadEmployees(){
  if(empUnsubscribe)empUnsubscribe();
  empUnsubscribe=db.collection('employees').where('cafeId','==',currentCafe.id).onSnapshot(snap=>{
    employees=[];snap.forEach(d=>employees.push({id:d.id,...d.data()}));
    employees.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
    renderEmpListForWorker();renderEmpManageList();renderPayEmpList();
  });
}

function renderEmpListForWorker(){
  const w=document.getElementById('empListForWorker');
  if(!employees.length){w.innerHTML=`<div style="text-align:center;padding:28px;font-size:12px;color:var(--t3)">등록된 직원이 없어요</div>`;return;}
  const colors=['var(--gl)','#EEEDFE','#FBEAF0','#E6F1FB','var(--al)'];
  const tcolors=['var(--gd)','#3C3489','#72243E','#0C447C','var(--ad)'];
  w.innerHTML=employees.map((e,i)=>`
    <div class="emp-list-item" onclick="openWorkerPw('${e.id}')">
      <div class="emp-avatar" style="background:${colors[i%5]};color:${tcolors[i%5]}">${e.name.substring(0,2)}</div>
      <div style="flex:1"><div class="emp-nm">${e.name}</div><div class="emp-info">시급 ₩${(e.rate||0).toLocaleString()}</div></div>
    </div>`).join('');
}

function openWorkerPw(empId){
  const emp=employees.find(e=>e.id===empId);if(!emp)return;
  currentWorkerEmp=emp;
  document.getElementById('workerPwModalTitle').textContent=`${emp.name}님 비밀번호 확인`;
  document.getElementById('workerPwInput').value='';
  document.getElementById('workerPwError').style.display='none';
  document.getElementById('workerPwModal').classList.add('open');
}
function closeWorkerPw(){document.getElementById('workerPwModal').classList.remove('open');}
function checkWorkerPw(){
  const pw=document.getElementById('workerPwInput').value.trim();
  if(pw===currentWorkerEmp.password||pw===MASTER_PW){
    closeWorkerPw();enterWorkerInput();
  } else {
    document.getElementById('workerPwError').style.display='block';
  }
}
function enterWorkerInput(){
  workData={};wkY=new Date().getFullYear();wkM=new Date().getMonth();wkSelDay=null;
  lastSavedHours=undefined; // 새 직원 진입 시 기본값 초기화
  document.getElementById('workerInputName').textContent=currentWorkerEmp.name;
  document.getElementById('workerInputHdr').style.background=getComputedStyle(document.documentElement).getPropertyValue('--green').trim()||'#1D9E75';
  loadWorkHours();showScreen('scWorkerInput');
}

function loadWorkHours(){
  const period=`${wkY}-${String(wkM+1).padStart(2,'0')}`;
  db.collection('workHours').where('empId','==',currentWorkerEmp.id).where('period','==',period).get().then(snap=>{
    workData={};
    snap.forEach(d=>{const dat=d.data();workData[dat.day]={hours:dat.hours,note:dat.note||'',docId:d.id};});
    renderWkGrid();
  });
}

function changeWorkMonth(dir){wkM+=dir;if(wkM>11){wkM=0;wkY++;}if(wkM<0){wkM=11;wkY--;}document.getElementById('workMonthTitle').textContent=`${wkY}년 ${MONTHS[wkM]}`;wkSelDay=null;document.getElementById('wkPanel').style.display='none';loadWorkHours();}

function renderWkGrid(){
  const g=document.getElementById('wkGrid');
  g.innerHTML=DAYS.map((d,i)=>`<div class="wk-hdr" style="${i===0?'color:var(--red)':i===6?'color:#185FA5':''}">${d}</div>`).join('');
  const first=new Date(wkY,wkM,1).getDay();
  const days=new Date(wkY,wkM+1,0).getDate();
  const today=new Date();
  for(let i=0;i<first;i++)g.innerHTML+=`<div></div>`;
  let total=0;
  for(let d=1;d<=days;d++){
    const wd=workData[d];const h=wd?wd.hours:0;total+=h;
    const filled=h>0;const isToday=today.getFullYear()===wkY&&today.getMonth()===wkM&&today.getDate()===d;
    const isSel=wkSelDay===d;const hasNote=wd&&wd.note;
    let cls=`wk-cell${filled?' filled':''}${isToday?' today':''}${isSel?' selected':''}${hasNote?' has-note':''}`;
    g.innerHTML+=`<div class="${cls}" onclick="openWkInput(${d})">
      <div class="wk-date">${d}</div>
      <div class="wk-hrs">${filled?h.toFixed(1):''}</div>
    </div>`;
  }
  document.getElementById('wkTotal').textContent=total.toFixed(1)+'시간';
  document.getElementById('workMonthTitle').textContent=`${wkY}년 ${MONTHS[wkM]}`;
}

function openWkInput(d){
  wkSelDay=d;
  const wd=workData[d];

  // ★ 기본값 결정: 이미 입력된 값 > 직전 저장값 > 4.5
  if(wd){
    // 해당 날 이미 데이터 있으면 그 값
    wkHours=wd.hours;
  } else {
    // 직전 저장된 시간을 기본값으로 (lastSavedHours 변수 활용)
    wkHours = (typeof lastSavedHours !== 'undefined') ? lastSavedHours : 4.5;
  }

  document.getElementById('wkPanelTitle').textContent=`${wkM+1}월 ${d}일 근무시간 입력`;
  document.getElementById('wkHoursVal').value=wkHours.toFixed(1);
  document.getElementById('wkNote').value=wd?wd.note||'':'';

  // 힌트 표시
  const hint=document.getElementById('wkLastHint');
  if(!wd && typeof lastSavedHours !== 'undefined'){
    hint.textContent=`💡 이전 입력값 ${lastSavedHours.toFixed(1)}h 기본 적용 — 바로 저장 가능`;
    hint.style.color='#185FA5';
  } else if(wd){
    hint.textContent=`✏️ 기존 입력값 ${wd.hours.toFixed(1)}h`;
    hint.style.color='var(--t3)';
  } else {
    hint.textContent='';
  }

  document.getElementById('wkPanel').style.display='block';
  document.getElementById('wkPanel').scrollIntoView({behavior:'smooth',block:'nearest'});
  renderWkGrid();
}
function syncWkHoursFromInput(){
  // 직접 입력 시 wkHours 동기화 (입력 중에는 반올림 안 함)
  const v=parseFloat(document.getElementById('wkHoursVal').value);
  if(!isNaN(v)) wkHours=Math.max(0,Math.min(24,v));
}
function roundWkHours(){
  // blur 시 0.5 단위로 반올림 + 표시 정리
  wkHours=Math.round(wkHours*2)/2;
  wkHours=Math.max(0,Math.min(24,wkHours));
  document.getElementById('wkHoursVal').value=wkHours.toFixed(1);
}
function cancelWkInput(){wkSelDay=null;document.getElementById('wkPanel').style.display='none';renderWkGrid();}
function changeWkHours(v){
  wkHours=Math.round((wkHours+v)*2)/2;
  wkHours=Math.max(0,Math.min(24,wkHours));
  document.getElementById('wkHoursVal').value=wkHours.toFixed(1);
}
async function saveWkHours(){
  if(!wkSelDay)return;
  // blur로 반올림 처리 후 저장
  roundWkHours();
  const period=`${wkY}-${String(wkM+1).padStart(2,'0')}`;
  const note=document.getElementById('wkNote').value.trim();
  const wd=workData[wkSelDay];
  const data={empId:currentWorkerEmp.id,cafeId:currentCafe.id,period,day:wkSelDay,hours:wkHours,note};
  if(wd&&wd.docId){await db.collection('workHours').doc(wd.docId).update(data);}
  else{await db.collection('workHours').add(data);}
  // ★ 저장된 시간을 다음 입력의 기본값으로 보존
  lastSavedHours=wkHours;
  wkSelDay=null;
  document.getElementById('wkPanel').style.display='none';
  loadWorkHours();
}

// 직원 관리 (마스터)
function openMasterMenu(dest){
  masterMenuDest=dest;
  document.getElementById('masterPwInput').value='';
  document.getElementById('masterPwError').style.display='none';
  document.getElementById('masterPwModal').classList.add('open');
}
function closeMasterPw(){document.getElementById('masterPwModal').classList.remove('open');}
function checkMasterPw(){
  if(document.getElementById('masterPwInput').value===MASTER_PW){
    closeMasterPw();
    if(masterMenuDest==='emp'){showScreen('scEmpManage');renderEmpManageList();}
    else if(masterMenuDest==='pay'){showScreen('scPayManage');renderPayEmpList();}
    else{showScreen('scPayTable');renderPayTable();}
  } else {
    document.getElementById('masterPwError').style.display='block';
  }
}

function renderEmpManageList(){
  const w=document.getElementById('empManageList');
  if(!employees.length){w.innerHTML=`<div style="text-align:center;padding:24px;font-size:12px;color:var(--t3)">등록된 직원이 없어요</div>`;return;}
  const colors=['var(--gl)','#EEEDFE','#FBEAF0','#E6F1FB','var(--al)'];
  const tcolors=['var(--gd)','#3C3489','#72243E','#0C447C','var(--ad)'];
  w.innerHTML=employees.map((e,i)=>`
    <div class="emp-list-item">
      <div class="emp-avatar" style="background:${colors[i%5]};color:${tcolors[i%5]}">${e.name.substring(0,2)}</div>
      <div style="flex:1"><div class="emp-nm">${e.name}</div><div class="emp-info">시급 ₩${(e.rate||0).toLocaleString()} · 주휴단가 ₩${(e.holidayRate||0).toLocaleString()}</div></div>
      <button class="btn-sm-g" onclick="setupEmpEdit('${e.id}')">수정</button>
    </div>`).join('');
}

let editingEmpId=null;
function setupEmpAdd(){
  editingEmpId=null;
  document.getElementById('empAddTitle').textContent='직원 등록';
  ['empName','empPhone','empAddr','empBank','empAcct','empPw'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('empRate').value='10320';
  document.getElementById('empHoliRate').value='';
}
function setupEmpEdit(id){
  const emp=employees.find(e=>e.id===id);if(!emp)return;
  editingEmpId=id;
  document.getElementById('empAddTitle').textContent='직원 수정';
  document.getElementById('empName').value=emp.name||'';
  document.getElementById('empPhone').value=emp.phone||'';
  document.getElementById('empAddr').value=emp.addr||'';
  document.getElementById('empBank').value=emp.bank||'';
  document.getElementById('empAcct').value=emp.acct||'';
  document.getElementById('empRate').value=emp.rate||10320;
  document.getElementById('empHoliRate').value=(emp.holidayRate!==undefined&&emp.holidayRate!==null)?emp.holidayRate:41280;
  document.getElementById('empPw').value='';
  showScreen('scEmpAdd');
}
async function saveEmp(){
  const name=document.getElementById('empName').value.trim();
  if(!name){alert('이름을 입력해주세요');return;}
  const holiRateRaw = document.getElementById('empHoliRate').value;
  const holiRate = holiRateRaw === '' ? null : parseInt(holiRateRaw);
  const data={cafeId:currentCafe.id,name,phone:document.getElementById('empPhone').value.trim(),addr:document.getElementById('empAddr').value.trim(),bank:document.getElementById('empBank').value.trim(),acct:document.getElementById('empAcct').value.trim(),rate:parseInt(document.getElementById('empRate').value)||10320,holidayRate:holiRate};
  const pw=document.getElementById('empPw').value.trim();
  if(pw)data.password=pw;
  if(editingEmpId){await db.collection('employees').doc(editingEmpId).update(data);}
  else{data.createdAt=Date.now();if(!pw){alert('초기 비밀번호를 입력해주세요');return;}await db.collection('employees').add(data);}
  showScreen('scEmpManage');
}

// 급여 관리
function changePayMonth(dir){payM+=dir;if(payM>11){payM=0;payY++;}if(payM<0){payM=11;payY++;}const lbl=`${payY}년 ${MONTHS[payM]}`;['payManagePeriod','payMonthTitle','payTablePeriod','payTableMonth'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=lbl;});renderPayEmpList();if(document.getElementById('scPayTable').classList.contains('active'))renderPayTable();}

function renderPayEmpList(){
  const w=document.getElementById('payEmpList');
  if(!employees.length){w.innerHTML=`<div style="text-align:center;padding:24px;font-size:12px;color:var(--t3)">등록된 직원이 없어요</div>`;return;}
  const colors=['var(--gl)','#EEEDFE','#FBEAF0','#E6F1FB','var(--al)'];
  const tcolors=['var(--gd)','#3C3489','#72243E','#0C447C','var(--ad)'];
  w.innerHTML=employees.map((e,i)=>`
    <div class="emp-list-item" onclick="openPayslip('${e.id}')">
      <div class="emp-avatar" style="background:${colors[i%5]};color:${tcolors[i%5]}">${e.name.substring(0,2)}</div>
      <div style="flex:1"><div class="emp-nm">${e.name}</div><div class="emp-info">시급 ₩${(e.rate||0).toLocaleString()} · 주휴단가 ₩${(e.holidayRate||0).toLocaleString()}</div></div>
      <button class="btn-sm-g">명세서</button>
    </div>`).join('');
}

async function openPayslip(empId){
  const emp=employees.find(e=>e.id===empId);if(!emp)return;
  const period=`${payY}-${String(payM+1).padStart(2,'0')}`;
  const snap=await db.collection('workHours').where('empId','==',empId).where('period','==',period).get();
  let total=0;snap.forEach(d=>total+=d.data().hours||0);
  const base=Math.round(total*(emp.rate||0));
  psHoliRateVal=(emp.holidayRate!==null&&emp.holidayRate!==undefined)?emp.holidayRate:0;psWeekCntVal=4;
  document.getElementById('psCafeName').textContent=`☕ ${currentCafe.name} · 급여 명세서`;
  document.getElementById('psName').textContent=emp.name;
  document.getElementById('psPeriod').textContent=`${payY}년 ${payM+1}월 급여 명세서`;
  document.getElementById('psHours').textContent=total.toFixed(1)+'시간';
  document.getElementById('psRate').textContent='₩'+(emp.rate||0).toLocaleString();
  document.getElementById('psBase').textContent='₩'+base.toLocaleString();
  document.getElementById('psHoliRate').textContent='₩'+psHoliRateVal.toLocaleString();
  document.getElementById('psWeekCnt').textContent=psWeekCntVal;
  document.getElementById('psBonus').value='0';document.getElementById('psBonusMemo').value='';
  document.getElementById('psEtc').value='0';document.getElementById('psEtcMemo').value='';
  calcPayTotal();showScreen('scPayslip');
}
function changePayWeeks(v){psWeekCntVal=Math.max(0,Math.min(6,psWeekCntVal+v));document.getElementById('psWeekCnt').textContent=psWeekCntVal;document.getElementById('psWeekCntDisp').textContent=psWeekCntVal;calcPayTotal();}
function calcPayTotal(){
  const base=parseFloat((document.getElementById('psBase').textContent||'0').replace(/[₩,]/g,''))||0;
  const holi=psHoliRateVal*psWeekCntVal;
  document.getElementById('psHoliTotal').textContent='₩'+holi.toLocaleString();
  const bonus=parseFloat(document.getElementById('psBonus').value)||0;
  const etc=parseFloat(document.getElementById('psEtc').value)||0;
  document.getElementById('psTotal').textContent='₩'+Math.round(base+holi+bonus+etc).toLocaleString();
}
function savePayslip(){ alert('저장됐어요 😊'); }

// 캡처 전: 입력 UI 숨기고 표시용 값 보이게
function prepareCapture(){
  // 상여
  const bonus=parseInt(document.getElementById('psBonus').value)||0;
  const bonusMemo=document.getElementById('psBonusMemo').value.trim();
  document.getElementById('psBonusDisp').textContent='₩'+bonus.toLocaleString();
  document.getElementById('psBonusDisp').style.display='block';
  document.getElementById('psBonusMemoDisp').textContent=bonusMemo||'';
  document.getElementById('psBonusMemoDisp').style.display=bonusMemo?'block':'none';
  // 기타
  const etc=parseInt(document.getElementById('psEtc').value)||0;
  const etcMemo=document.getElementById('psEtcMemo').value.trim();
  document.getElementById('psEtcDisp').textContent='₩'+etc.toLocaleString();
  document.getElementById('psEtcDisp').style.display='block';
  document.getElementById('psEtcMemoDisp').textContent=etcMemo||'';
  document.getElementById('psEtcMemoDisp').style.display=etcMemo?'block':'none';
  // 주휴횟수 표시
  document.getElementById('psWeekCntDisp').textContent=psWeekCntVal;
  // 발행일
  const now=new Date();
  document.getElementById('psIssuedAt').textContent=`발행일 ${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
  // 입력 UI 숨기기
  document.querySelectorAll('.no-capture').forEach(el=>el.style.visibility='hidden');
}
// 캡처 후: 원상복구
function restoreCapture(){
  document.querySelectorAll('.no-capture').forEach(el=>el.style.visibility='visible');
  document.getElementById('psBonusDisp').style.display='none';
  document.getElementById('psEtcDisp').style.display='none';
  document.getElementById('psBonusMemoDisp').style.display='none';
  document.getElementById('psEtcMemoDisp').style.display='none';
}

async function captureAndShare(){
  const btn=event.currentTarget;
  btn.disabled=true;btn.textContent='📸 캡처 중...';
  prepareCapture();
  await new Promise(r=>setTimeout(r,80)); // 렌더 대기
  try{
    const card=document.getElementById('payslipCard');
    const canvas=await html2canvas(card,{
      scale:2.5,
      useCORS:true,
      backgroundColor:'#ffffff',
      logging:false,
      width:card.offsetWidth,
      height:card.offsetHeight
    });
    restoreCapture();
    // 이미지 다운로드
    const link=document.createElement('a');
    const name=document.getElementById('psName').textContent;
    const period=document.getElementById('psPeriod').textContent;
    link.download=`급여명세서_${name}_${period.replace(/\s/g,'')}.png`;
    link.href=canvas.toDataURL('image/png');
    link.click();
    // 안내 배너
    setTimeout(()=>{
      setTimeout(()=>{ showToast('📥 급여명세서 이미지가 저장됐어요!'); },200);
    },200);
  } catch(e){
    restoreCapture();
    alert('캡처에 실패했어요. 다시 시도해주세요.');
    console.error(e);
  }
  btn.disabled=false;btn.innerHTML='📥 급여명세서 이미지 저장';
}

// 월 급여 테이블
async function renderPayTable(){
  const period=`${payY}-${String(payM+1).padStart(2,'0')}`;
  const tbl=document.getElementById('payTable');
  tbl.innerHTML=`<tr><th>이름</th><th>근무시간</th><th>시급합계</th><th>주휴수당</th><th>상여</th><th>기타</th><th>최종합계</th></tr>`;
  let sumH=0,sumB=0,sumHoli=0,sumBonus=0,sumEtc=0,sumTotal=0;
  for(const emp of employees){
    const snap=await db.collection('workHours').where('empId','==',emp.id).where('period','==',period).get();
    let h=0;snap.forEach(d=>h+=d.data().hours||0);
    const base=Math.round(h*(emp.rate||0));
    const holi=Math.round(((emp.holidayRate!==null&&emp.holidayRate!==undefined)?emp.holidayRate:0)*4);
    const total=base+holi;
    sumH+=h;sumB+=base;sumHoli+=holi;sumTotal+=total;
    tbl.innerHTML+=`<tr><td class="nm">${emp.name}</td><td>${h.toFixed(1)}h</td><td>${base.toLocaleString()}</td><td>${holi.toLocaleString()}</td><td>0</td><td>0</td><td class="tot">${total.toLocaleString()}</td></tr>`;
  }
  tbl.innerHTML+=`<tr><td class="nm">합계</td><td>${sumH.toFixed(1)}h</td><td>${sumB.toLocaleString()}</td><td>${sumHoli.toLocaleString()}</td><td>${sumBonus.toLocaleString()}</td><td>${sumEtc.toLocaleString()}</td><td class="tot">${sumTotal.toLocaleString()}</td></tr>`;
  document.getElementById('payTableTotal').textContent='₩'+sumTotal.toLocaleString();
}

async function exportExcel(){
  // 해당 월 근무데이터 전체 조회
  const period=`${payY}-${String(payM+1).padStart(2,'0')}`;
  const daysInMonth=new Date(payY,payM+1,0).getDate();

  // 직원별 근무데이터 수집
  const empDataMap={};
  for(const emp of employees){
    const snap=await db.collection('workHours').where('empId','==',emp.id).where('period','==',period).get();
    const days={};
    snap.forEach(d=>{const dat=d.data();days[dat.day]={hours:dat.hours,note:dat.note||''};});
    empDataMap[emp.id]={emp,days};
  }

  const wb=XLSX.utils.book_new();
  const ws={};
  const range={s:{r:0,c:0},e:{r:0,c:0}};

  // ── 색상 정의 ──
  const GREEN_HDR ={fgColor:{rgb:'1D9E75'}};
  const YELLOW_HDR={fgColor:{rgb:'FFF2CC'}};
  const BLUE_HDR  ={fgColor:{rgb:'BDD7EE'}};
  const PINK_HDR  ={fgColor:{rgb:'FCE4D6'}};
  const GREEN_SUM ={fgColor:{rgb:'E1F5EE'}};
  const ORANGE_SUM={fgColor:{rgb:'FAEEDA'}};
  const WHITE     ={fgColor:{rgb:'FFFFFF'}};
  const GRAY_ALT  ={fgColor:{rgb:'F5F5F5'}};

  const thinBorder={style:'thin',color:{rgb:'CCCCCC'}};
  const border={top:thinBorder,bottom:thinBorder,left:thinBorder,right:thinBorder};
  const thickBorder={style:'medium',color:{rgb:'1D9E75'}};
  const hdrBorder={top:thickBorder,bottom:thickBorder,left:thinBorder,right:thinBorder};

  function cell(v,{bold=false,color=null,fill=null,align='center',fmt=null,border:b=border,wrap=false}={}){
    const c={v,t:typeof v==='number'?'n':'s'};
    const font={name:'맑은 고딕',sz:9};
    if(bold)font.bold=true;
    if(color)font.color={rgb:color};
    c.s={font,alignment:{horizontal:align,vertical:'center',wrapText:wrap},border:b};
    if(fill)c.s.fill={patternType:'solid',...fill};
    if(fmt)c.z=fmt;
    return c;
  }
  function setCell(ws,r,c,cellObj){
    const addr=XLSX.utils.encode_cell({r,c});
    ws[addr]=cellObj;
    if(r>range.e.r)range.e.r=r;
    if(c>range.e.c)range.e.c=c;
  }

  // ── 행 0: 타이틀 ──
  const totalCols=7+daysInMonth+7; // 고정7 + 날짜 + 합계7
  const titleCell={v:`${payY}년 ${payM+1}월 급여 현황`,t:'s',s:{
    font:{name:'맑은 고딕',sz:13,bold:true,color:{rgb:'FFFFFF'}},
    fill:{patternType:'solid',...GREEN_HDR},
    alignment:{horizontal:'center',vertical:'center'},
    border:{top:thickBorder,bottom:thickBorder,left:thickBorder,right:thickBorder}
  }};
  setCell(ws,0,0,titleCell);
  for(let c=1;c<totalCols;c++){
    setCell(ws,0,c,{v:'',t:'s',s:{fill:{patternType:'solid',...GREEN_HDR},border:{top:thickBorder,bottom:thickBorder,left:thinBorder,right:c===totalCols-1?thickBorder:thinBorder}}});
  }
  ws['!merges']=[{s:{r:0,c:0},e:{r:0,c:totalCols-1}}];

  // ── 행 1: 헤더 ──
  const fixedHdrs=['이름','연락처','주소','은행','계좌번호','시급','메모'];
  const tailHdrs=['일근무\n시간','시급','시급\n합계','주휴\n단가','주휴\n횟수','주휴\n합계','기타','합계'];
  let col=0;
  fixedHdrs.forEach(h=>setCell(ws,1,col++,cell(h,{bold:true,fill:GREEN_HDR,color:'FFFFFF',border:hdrBorder,wrap:true})));
  for(let d=1;d<=daysInMonth;d++){
    const dow=new Date(payY,payM,d).getDay();
    const isSun=dow===0,isSat=dow===6;
    const dayFill=isSun?{fgColor:{rgb:'FCE4D6'}}:isSat?{fgColor:{rgb:'BDD7EE'}}:{fgColor:{rgb:'E2EFDA'}};
    const dayColor=isSun?'C00000':isSat?'1F497D':'375623';
    setCell(ws,1,col++,cell(d,{bold:true,fill:dayFill,color:dayColor,border:hdrBorder}));
  }
  tailHdrs.forEach(h=>setCell(ws,1,col++,cell(h,{bold:true,fill:ORANGE_SUM,color:'854F0B',border:hdrBorder,wrap:true})));

  // ── 행 2~: 직원별 데이터 ──
  let row=2;
  const dayTotals=new Array(daysInMonth).fill(0);
  let grandTotal=0,grandBase=0,grandHoli=0,grandEtc=0;

  for(let ei=0;ei<employees.length;ei++){
    const emp=employees[ei];
    const {days}=empDataMap[emp.id]||{days:{}};
    const rowFill=ei%2===0?WHITE:GRAY_ALT;

    let totalHrs=0;
    for(let d=1;d<=daysInMonth;d++)totalHrs+=(days[d]?.hours||0);

    const base=Math.round(totalHrs*(emp.rate||0));
    const holiTotal=Math.round(((emp.holidayRate!==null&&emp.holidayRate!==undefined)?emp.holidayRate:0)*4);
    const etc=0;
    const grandSum=base+holiTotal+etc;
    grandBase+=base;grandHoli+=holiTotal;grandTotal+=grandSum;

    col=0;
    setCell(ws,row,col++,cell(emp.name,{bold:true,fill:{fgColor:{rgb:'D9EAD3'}},align:'center',border}));
    setCell(ws,row,col++,cell(emp.phone||'',{fill:rowFill,align:'center',border}));
    setCell(ws,row,col++,cell(emp.addr||'',{fill:rowFill,align:'left',border,wrap:true}));
    setCell(ws,row,col++,cell(emp.bank||'',{fill:rowFill,align:'center',border}));
    setCell(ws,row,col++,cell(emp.acct||'',{fill:rowFill,align:'center',border}));
    setCell(ws,row,col++,cell(emp.rate||0,{fill:rowFill,align:'center',border,fmt:'#,##0'}));
    setCell(ws,row,col++,cell('',{fill:rowFill,border}));

    for(let d=1;d<=daysInMonth;d++){
      const h=days[d]?.hours||0;
      const note=days[d]?.note||'';
      const dow=new Date(payY,payM,d).getDay();
      const isSun=dow===0,isSat=dow===6;
      let dayFill=h>0?{fgColor:{rgb:'E2EFDA'}}:rowFill;
      if(isSun&&h>0)dayFill={fgColor:{rgb:'FCE4D6'}};
      if(isSat&&h>0)dayFill={fgColor:{rgb:'BDD7EE'}};
      const isRed=note.includes('지각')||note.includes('조퇴')||note.includes('결근');
      setCell(ws,row,col++,{
        v:h||'',t:h?'n':'s',
        s:{
          font:{name:'맑은 고딕',sz:9,bold:h>0,color:{rgb:isRed?'C00000':h>0?'375623':'999999'}},
          fill:{patternType:'solid',...dayFill},
          alignment:{horizontal:'center',vertical:'center'},
          border
        }
      });
      if(h>0)dayTotals[d-1]+=h;
    }

    // 합계 컬럼들
    setCell(ws,row,col++,cell(totalHrs,{bold:true,fill:GREEN_SUM,color:'0F6E56',border,fmt:'0.0'}));
    setCell(ws,row,col++,cell(emp.rate||0,{fill:GREEN_SUM,color:'0F6E56',border,fmt:'#,##0'}));
    setCell(ws,row,col++,cell(base,{bold:true,fill:GREEN_SUM,color:'0F6E56',border,fmt:'#,##0'}));
    setCell(ws,row,col++,cell((emp.holidayRate!==null&&emp.holidayRate!==undefined)?emp.holidayRate:0,{fill:ORANGE_SUM,color:'854F0B',border,fmt:'#,##0'}));
    setCell(ws,row,col++,cell(4,{fill:ORANGE_SUM,color:'854F0B',border}));
    setCell(ws,row,col++,cell(holiTotal,{bold:true,fill:ORANGE_SUM,color:'854F0B',border,fmt:'#,##0'}));
    setCell(ws,row,col++,cell(etc,{fill:PINK_HDR,color:'833C00',border,fmt:'#,##0'}));
    setCell(ws,row,col++,cell(grandSum,{bold:true,fill:{fgColor:{rgb:'FFF2CC'}},color:'7F6000',border,fmt:'#,##0'}));

    row++;
  }

  // ── 합계행 ──
  col=0;
  const sumFill={fgColor:{rgb:'1D9E75'}};
  const sumBorder={top:{style:'medium',color:{rgb:'1D9E75'}},bottom:{style:'medium',color:{rgb:'1D9E75'}},left:thinBorder,right:thinBorder};
  setCell(ws,row,col++,cell('합계',{bold:true,fill:sumFill,color:'FFFFFF',border:sumBorder}));
  for(let i=0;i<5;i++)setCell(ws,row,col++,cell('',{fill:sumFill,border:sumBorder}));
  setCell(ws,row,col++,cell('',{fill:sumFill,border:sumBorder}));
  for(let d=0;d<daysInMonth;d++){
    setCell(ws,row,col++,cell(dayTotals[d]||'',{bold:true,fill:sumFill,color:'FFFFFF',border:sumBorder,fmt:'0.0'}));
  }
  setCell(ws,row,col++,cell(dayTotals.reduce((a,b)=>a+b,0),{bold:true,fill:sumFill,color:'FFFFFF',border:sumBorder,fmt:'0.0'}));
  setCell(ws,row,col++,cell('',{fill:sumFill,border:sumBorder}));
  setCell(ws,row,col++,cell(grandBase,{bold:true,fill:sumFill,color:'FFFFFF',border:sumBorder,fmt:'#,##0'}));
  setCell(ws,row,col++,cell('',{fill:sumFill,border:sumBorder}));
  setCell(ws,row,col++,cell('',{fill:sumFill,border:sumBorder}));
  setCell(ws,row,col++,cell(grandHoli,{bold:true,fill:sumFill,color:'FFFFFF',border:sumBorder,fmt:'#,##0'}));
  setCell(ws,row,col++,cell(grandEtc,{fill:sumFill,color:'FFFFFF',border:sumBorder,fmt:'#,##0'}));
  setCell(ws,row,col++,cell(grandTotal,{bold:true,fill:sumFill,color:'FFFFFF',border:sumBorder,fmt:'#,##0'}));

  // ── 열 너비 설정 ──
  const colWidths=[
    {wch:8},{wch:13},{wch:28},{wch:6},{wch:16},{wch:8},{wch:10},
    ...Array(daysInMonth).fill({wch:4.5}),
    {wch:6},{wch:8},{wch:10},{wch:8},{wch:4},{wch:10},{wch:8},{wch:11}
  ];
  ws['!cols']=colWidths;

  // ── 행 높이 ──
  ws['!rows']=[{hpt:22},{hpt:36},...Array(employees.length).fill({hpt:18}),{hpt:20}];

  ws['!ref']=XLSX.utils.encode_range(range);
  XLSX.utils.book_append_sheet(wb,ws,`${payY}년 ${payM+1}월`);
  XLSX.writeFile(wb,`급여현황_${payY}년${payM+1}월.xlsx`);
}

// 주휴수당 계산기
function openHoliCalc(){
  const curRate=document.getElementById('empRate').value||'';
  document.getElementById('hcRate').value=curRate;
  document.getElementById('hcWeekHrs').value='';
  document.getElementById('hcResult').textContent='₩0';
  document.getElementById('holiCalcModal').classList.add('open');
}
function closeHoliCalc(){document.getElementById('holiCalcModal').classList.remove('open');}
function calcHoli(){
  const hrs=parseFloat(document.getElementById('hcWeekHrs').value)||0;
  const rate=parseFloat(document.getElementById('hcRate').value)||0;
  const result=Math.round(hrs/40*8*rate);
  document.getElementById('hcResult').textContent='₩'+result.toLocaleString();
}
function applyHoliCalc(){
  const hrs=parseFloat(document.getElementById('hcWeekHrs').value)||0;
  const rate=parseFloat(document.getElementById('hcRate').value)||0;
  if(!hrs||!rate){alert('시간과 시급을 모두 입력해주세요');return;}
  const result=Math.round(hrs/40*8*rate);
  document.getElementById('empHoliRate').value=result;
  closeHoliCalc();
}

// 모달 닫기
['takeModal','editModal','delModal','adminPwModal','cafeEditModal','adminRecoverModal','masterPwModal','workerPwModal','timePickModal','holiCalcModal'].forEach(id=>{
  const el=document.getElementById(id);
  if(el)el.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');});
});
document.getElementById('pwInput').addEventListener('keyup',e=>{if(e.key==='Enter')checkCafePw();});
document.getElementById('adminPwInput').addEventListener('keyup',e=>{if(e.key==='Enter')checkAdminPw();});

loadCafes();
</script>
<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});</script>
</body>
</html>
