(function () {
  'use strict';
  const engine = window.ArrayArchitectsEngine;
  const MOTION_FAST = 200, MOTION_NORMAL = 340, MOTION_MATH = 800, STAGGER_SHORT = 300;
  const JOIN_HOLD = 600, EQUATION_HOLD = 400, IDLE_CUE = 2500;
  // One grammar: soft attention, legible math, restrained completion.
  const CUE_DURATION = 900, MATH_REVEAL = 420, RESULT_HOLD = 550, EQUATION_REVEAL = 550;
  const TOKEN_LIFT = 120, TOKEN_TRAVEL = 620, TOKEN_SETTLE = 180;
  const MOTION_EASE = 'cubic-bezier(.22,.61,.36,1)';
  const styles = `
    :host { display:block; --aa-ink:#203c37; --aa-muted:#687a75; --aa-accent:#287762; --aa-mint:#eaf5ef; --aa-line:#e3ebe6; color:var(--aa-ink); font-family:inherit; }
    * { box-sizing:border-box; }
    button,input { font:inherit; }
    button { cursor:pointer; touch-action:manipulation; }
    button:disabled { cursor:default; opacity:.38; }
    button:focus-visible,input:focus-visible { outline:3px solid #479f88; outline-offset:4px; }
    .card { background:white; border:1px solid var(--aa-line); border-radius:24px; box-shadow:0 10px 40px #203c3706; overflow:hidden; }
    .top { padding:25px 32px; display:flex; justify-content:space-between; align-items:center; gap:20px; border-bottom:1px solid var(--aa-line); }
    .identity { display:flex; gap:13px; align-items:center; }
    .symbol { width:38px; height:38px; display:grid; grid-template-columns:repeat(3,5px); gap:4px; place-content:center; background:var(--aa-mint); border-radius:11px; }
    .symbol i { width:5px; height:5px; background:var(--aa-accent); border-radius:50%; }
    h1 { font-size:17px; margin:0 0 4px; letter-spacing:-.4px; font-weight:650; }
    .sub { font-size:12px; color:var(--aa-muted); }
    .progress { display:flex; align-items:center; gap:14px; font-size:12px; color:var(--aa-muted); }
    .track { display:flex; gap:5px; }
    .track i { width:18px; height:4px; border-radius:4px; background:#e7eeea; }
    .track i.done { background:var(--aa-accent); }
    .track i.current { background:#8ebdac; }
    .content { padding:30px 36px 28px; }
    .eyebrow { color:var(--aa-accent); font-size:11px; letter-spacing:1.5px; font-weight:700; text-transform:uppercase; margin:0 0 12px; }
    h2 { font-size:clamp(23px,2.4vw,29px); line-height:1.2; font-weight:550; letter-spacing:-.7px; margin:0 0 12px; }
    p { line-height:1.65; }
    .intro-copy { max-width:550px; color:var(--aa-muted); margin:0 auto 10px; font-size:15px; }
    .center { text-align:center; }
    .lead { margin:0; color:var(--aa-muted); font-size:15px; }
    .heading { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; }
    .pill { font-size:11px; white-space:nowrap; padding:8px 12px; border:1px solid var(--aa-line); border-radius:20px; color:var(--aa-muted); }
    .playground { min-height:286px; margin:22px 0; background:#f8faf8; border:1px solid #edf1ed; border-radius:18px; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:22px 20px; position:relative; overflow:hidden; }
    .playground-label { align-self:flex-start; font-size:10px; letter-spacing:1.6px; text-transform:uppercase; color:#7b8c85; position:absolute; top:16px; left:20px; }
    .array { position:relative; flex:none; margin:17px auto 10px; transition:width ${MOTION_NORMAL}ms ease,height ${MOTION_NORMAL}ms ease; }
    .dot { position:absolute; left:0; top:0; width:21px; height:21px; border-radius:50%; background:var(--aa-accent); box-shadow:inset 0 -2px 0 #153f3415; transition:transform ${MOTION_NORMAL}ms cubic-bezier(.2,.8,.2,1),background ${MOTION_NORMAL}ms; }
    .dot.second { background:#5c81a6; }
    .dot.new { animation:appear ${MOTION_FAST}ms both; animation-delay:var(--delay,0ms); }
    .divider { position:absolute; left:-13px; right:-13px; height:1px; border-top:1px dashed #97b9ac; opacity:0; transition:top ${MOTION_NORMAL}ms,opacity ${MOTION_FAST}ms; }
    .divider.visible { opacity:1; }
    .pulse { animation:settle ${MOTION_NORMAL}ms ${MOTION_EASE}; }
    .array-caption { min-height:24px; font-size:13px; color:var(--aa-muted); margin-top:8px; text-align:center; }
    .relation { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:12px; min-height:44px; font-variant-numeric:tabular-nums; }
    .relation strong { font-size:25px; font-weight:550; letter-spacing:-.6px; }
    .relation .part { padding:9px 14px; background:var(--aa-mint); border-radius:10px; font-size:18px; }
    .relation .part.blue { background:#edf2f8; color:#3e6081; }
    .relation .result { animation:mathReveal ${MATH_REVEAL}ms ${MOTION_EASE} both; color:var(--aa-accent); }
    .relation .arrow { color:#8a9c93; }
    .controls { display:flex; justify-content:center; flex-wrap:wrap; gap:20px; margin:18px 0; }
    .control { border:1px solid var(--aa-line); border-radius:14px; padding:12px 15px; display:flex; align-items:center; gap:18px; background:white; }
    .control-label { font-size:13px; color:var(--aa-muted); min-width:60px; }
    .stepper { display:flex; align-items:center; gap:14px; }
    .stepper button { background:#f2f6f3; color:var(--aa-ink); border:0; border-radius:8px; width:38px; height:38px; font-size:21px; }
    output { min-width:20px; text-align:center; font-weight:650; font-size:19px; }
    .guide-target { border-color:#b2c9bc; }
    .actions { border-top:1px solid var(--aa-line); margin-top:24px; padding-top:20px; display:flex; justify-content:space-between; align-items:center; gap:18px; }
    .primary,.secondary,.choice { border-radius:10px; padding:13px 22px; min-height:46px; font-size:14px; font-weight:550; }
    .primary { background:var(--aa-accent); border:1px solid var(--aa-accent); color:white; }
    .primary:hover:not(:disabled) { background:#205e4e; }
    .secondary,.choice { background:white; border:1px solid var(--aa-line); color:var(--aa-ink); }
    .secondary:hover,.choice:hover { background:#f2f7f3; }
    .text-button { color:var(--aa-muted); border:0; background:none; font-size:13px; padding:12px 0; text-decoration:underline; text-underline-offset:4px; }
    .message { min-height:26px; font-size:14px; margin:10px 0 0; color:var(--aa-muted); text-align:center; }
    .feedback { padding:14px 18px; background:var(--aa-mint); border-radius:12px; font-size:14px; color:#28634e; margin:16px 0 0; }
    .answer { display:flex; align-items:center; justify-content:center; gap:12px; margin-top:14px; font-size:14px; }
    input { width:84px; height:46px; text-align:center; border:1px solid #b7cbc0; border-radius:9px; font-size:21px; color:var(--aa-ink); background:white; }
    .quiet { font-size:12px; color:var(--aa-muted); }
    .summary { max-width:480px; margin:0 auto; padding:12px 0; }
    .check-list { list-style:none; padding:0; margin:26px 0; text-align:left; }
    .check-list li { padding:15px 0; border-bottom:1px solid var(--aa-line); font-size:15px; }
    .check-list li::before { content:'✓'; color:var(--aa-accent); margin-right:14px; }
    .summary-mark { width:62px; height:62px; border-radius:50%; background:var(--aa-mint); color:var(--aa-accent); display:grid; place-items:center; margin:5px auto 24px; font-size:25px; }
    .intro .playground { min-height:228px; margin:24px auto 14px; max-width:660px; }
    .intro .actions { justify-content:center; }
    .intro .relation { margin:10px 0; }
    @keyframes appear { from { opacity:0; scale:.94; } to { opacity:1; scale:1; } }
    @keyframes settle { from { opacity:.8; scale:.985; } to { opacity:1; scale:1; } }
    @media(max-width:700px) { .top { padding:20px; } .content { padding:24px 20px; } .track { display:none; } .control { gap:10px; padding:10px; } .controls { gap:10px; } .playground { padding:25px 10px 18px; } .actions { flex-wrap:wrap; } .heading .pill { display:none; } }
    @media(max-width:430px) { .control { width:100%; justify-content:space-between; } .actions .primary { flex:1; } .relation .part { font-size:15px; padding:8px; } h2 { letter-spacing:-.7px; } .top { gap:8px; } .progress { white-space:nowrap; } }
    .subfacts { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:20px; }
    .subfact { padding:18px; background:#f6f9f7; border:1px solid var(--aa-line); border-radius:14px; }
    .subfact.blue { background:#f4f7fa; }
    .subfact label { display:flex; align-items:center; justify-content:center; gap:12px; font-size:20px; }
    .part-chip { white-space:nowrap; }
    .field-feedback { font-size:13px; line-height:1.55; margin:10px 0 0; padding:10px 12px; border-radius:8px; }
    .warning { background:#fff4df; color:#78511a; border:1px solid #ebd4a7; }
    .positive { background:var(--aa-mint); color:#28634e; border:1px solid #b5d8c5; }
    .feedback-slot:empty { display:none; }
    .dot { border:0; padding:0; z-index:2; }
    .dot:disabled { opacity:1; }
    .dot.pooled { background:#a3b7ac; }
    .dot:not(:disabled)[data-action="return"]:hover { outline:3px solid #c5d6cc; }
    .lane-add { position:absolute; top:0; left:0; width:24px; height:24px; padding:0; border:1px dashed #a3b7ac; border-radius:50%; background:white; color:#586d64; z-index:3; line-height:20px; }
    .lane-label { position:absolute; left:-26px; font-size:11px; color:var(--aa-muted); }
    .pool-label { position:absolute; left:0; font-size:10px; color:var(--aa-muted); }
    .row-tally { position:absolute; right:-47px; font-size:12px; color:#78511a; background:#fff4df; padding:2px 6px; border-radius:5px; }
    .cut { position:absolute; left:-20px; right:-55px; height:16px; border:0; border-top:1px dashed #b8c9bf; background:transparent; z-index:4; padding:0; color:#64776c; }
    .cut span { position:absolute; right:-30px; top:-10px; padding:3px 6px; border-radius:6px; font-size:10px; background:#f8faf8; opacity:0; }
    .cut:hover,.cut:focus-visible { border-color:#516d60; background:#d9e8df70; }
    .cut:hover span,.cut:focus-visible span,.cut.recommended span { opacity:1; }
    .cut.recommended { border-top:2px dashed #8a9c75; }
    .debug { padding:14px 6px; color:var(--aa-muted); font-size:12px; }
    .debug summary { cursor:pointer; }
    .playground { min-height:290px; }
    .array { margin-top:24px; }
    @media(max-width:600px) { .subfacts { grid-template-columns:1fr; } .cut { right:-16px; } .cut span { right:-16px; } }
    .math-token { animation:mathReveal ${MATH_REVEAL}ms ${MOTION_EASE} both; transition:opacity ${MOTION_FAST}ms, translate ${MOTION_NORMAL}ms; }
    .math-hidden { opacity:0; visibility:hidden; animation:none; }
    .math-combine { gap:5px; transition:gap ${MOTION_NORMAL}ms; }
    .attention { animation:attention ${CUE_DURATION}ms ease-in-out both; }
    .lane-add { width:28px; height:28px; border:1.5px solid #809b8c; background:#fff; font-size:20px; box-shadow:0 2px 5px #203c3710; transition:scale ${MOTION_FAST}ms,box-shadow ${MOTION_FAST}ms; }
    .lane-add:hover:not(:disabled) { scale:1.04; box-shadow:0 0 0 2px #b7ccbe30; }
    .lane-add:active:not(:disabled) { scale:.97; }
    .dot.placed { animation:settle ${MOTION_NORMAL}ms ${MOTION_EASE}; }
    .cut { border-top:1.5px dashed #9aafa2; }
    .cut::before { content:'↕'; position:absolute; left:-6px; top:-10px; width:19px; height:19px; line-height:17px; border:1px solid #a3b7ac; border-radius:5px; background:white; color:#526c5d; font-size:13px; }
    .cut.recommended { border-top:2px dashed #72897b; }
    .cut.recommended::before { background:#edf2ed; border-color:#6b8374; }
    .cut.recommended span { border:1px solid #c2d0c7; background:white; padding:4px 7px; top:-14px; }
    .cut:active { background:#d6e1d9; }
    [data-action="deal"] { border:1.5px solid #839c8d; background:#f1f5f2; box-shadow:0 2px 5px #203c3710; }
    [data-action="deal"]:active { scale:.98; }
    .share-plus { position:absolute; color:#4e6659; font-size:13px; font-weight:650; animation:sharePlus ${MOTION_MATH}ms both; }
    .support-link { margin:8px auto 0; display:block; color:#52687b; padding:8px 12px; border:1px solid #ccd7df; border-radius:8px; background:white; font-size:12px; }
    .support-link:hover { background:#edf2f6; }
    .support-live { text-align:center; font-size:16px; color:#485f72; min-height:0; }
    .support-live:not(:empty) { padding:12px 4px 4px; }
    .dot.count-active { outline:4px solid #c3ced8; background:#476b88; scale:1.025; }
    @keyframes mathReveal { from { opacity:0; translate:0 3px; } to { opacity:1; translate:0 0; } }
    @keyframes attention { 0%,100% { scale:1; box-shadow:0 0 0 0 #8ca89a00; } 50% { scale:1.035; box-shadow:0 0 0 3px #8ca89a20; } }
    @keyframes sharePlus { 0% { opacity:0; translate:0 6px; } 30%,70% { opacity:1; translate:0 0; } 100% { opacity:0; translate:0 -5px; } }
    .join-equation { display:inline-flex; align-items:baseline; gap:9px; font-size:25px; font-weight:550; letter-spacing:-.6px; font-variant-numeric:tabular-nums; }
    .join-prefix { display:grid; }
    .join-prefix > span { grid-area:1 / 1; text-align:right; white-space:nowrap; transition:opacity ${EQUATION_REVEAL}ms ${MOTION_EASE},translate ${EQUATION_REVEAL}ms ${MOTION_EASE}; }
    .fact-prefix { opacity:0; translate:-3px 0; }
    .join-equation.is-final .sum-prefix { opacity:0; translate:0 -2px; }
    .join-equation.is-final .fact-prefix { opacity:1; translate:0 0; }
    .sum-result { color:var(--aa-accent); animation:mathReveal ${MATH_REVEAL}ms ${MOTION_EASE} both; }
    .attention-dismissed { animation:none!important; }

    /* Quiet workshop system: a single field, clay bodies and independent contact shadows. */
    :host { --aa-accent:#315e51; --aa-ink:#263e35; --aa-muted:#687265; --aa-line:#d8dccf; --aa-mint:#e6ede1; --bead-size:32px; }
    .card { background:#fafaf5; border:1px solid #d6d9cb; border-radius:28px; box-shadow:0 24px 70px #263e3512,0 2px 3px #263e3508; }
    .top { background:#294b40; color:#f7f7eb; border:0; padding:21px 32px; }
    .top .sub,.top .progress { color:#cfdbcb; }
    .symbol { background:#ffffff0d; border:1px solid #e6eddf22; border-radius:13px 11px 15px 7px; }
    .symbol i { background:#d4dfbd; }
    .track i { height:6px; width:19px; background:#ffffff20; transition:background 700ms,scale 700ms; }
    .track i.done { background:#d4dfbd; }.track i.current { background:#8ca68e; }
    .content { padding:30px 30px 22px; }
    .content > .eyebrow,.content > h2,.content > .lead { text-align:center; }
    .content > .eyebrow { margin:0 auto 12px; color:#64705b; letter-spacing:1.9px; font-size:10px; font-weight:650; }
    h2 { font-size:clamp(24px,2.7vw,31px); font-weight:520; letter-spacing:-1px; max-width:650px; margin:0 auto 10px; }
    .lead { font-size:14px; max-width:590px; margin:auto; }
    .playground { padding:48px 20px 22px; margin:24px -10px 0; min-height:360px; border-radius:24px 24px 0 0; background:linear-gradient(165deg,#edf0e6,#e3e7da); border:1px solid #d8ddcf; box-shadow:inset 0 2px 4px #45513c0a,inset 0 -1px 0 #ffffff90; overflow:visible; }
    .relation:empty { display:none; }
    .playground:has(+ .relation:empty) { border-radius:24px; border-bottom:1px solid #d8ddcf; }
    .playground:has(.stage-tools .controls) { min-height:300px; }
    .playground { border-bottom:0; }
    .playground::before,.playground::after { content:''; position:absolute; top:19px; width:5px; height:5px; border-radius:50%; background:#84927a55; box-shadow:inset 0 1px 1px #43513b20; }
    .playground::before { left:19px; }.playground::after { right:19px; }
    .playground-label { position:absolute; top:17px; left:34px; font-size:9px; letter-spacing:2px; color:#66745e; }
    .playground.helper-present::after { content:'··'; width:28px; height:30px; top:10px; right:15px; display:grid; place-items:center; font-size:18px; letter-spacing:3px; padding-left:3px; color:#4d5940; background:#e5ddbf; border-radius:12px 10px 14px 6px; box-shadow:0 2px 0 #cbc5ab; animation:mathReveal 420ms ease both; }
    .field-scroll { width:100%; overflow-x:auto; overflow-y:hidden; padding:14px 38px 12px; scrollbar-width:thin; }
    .array { margin:0 auto; transition:width 620ms ${MOTION_EASE},height 620ms ${MOTION_EASE}; }
    .dot { width:40px; height:40px; background:none!important; box-shadow:none!important; border:0; border-radius:50%; isolation:isolate; padding:4px; overflow:visible; transition:transform ${TOKEN_TRAVEL}ms ${MOTION_EASE}; }
    .dot::before { content:''; position:absolute; z-index:-1; left:8px; right:6px; top:29px; height:10px; border-radius:50%; background:radial-gradient(ellipse,#263c3240 0%,#263c3219 45%,transparent 73%); transform:scale(1); transition:transform 180ms,opacity 180ms; }
    .bead { display:block; position:relative; width:100%; height:100%; border-radius:47% 50% 46% 49%; background:linear-gradient(145deg,#81a28b 0%,#628770 45%,#4b735e 100%); box-shadow:inset 0 1px 1px #edf3d950,inset -1px -2px 2px #1b3d3328; transition:translate 180ms ${MOTION_EASE},scale 180ms,background 300ms; }
    .bead::before { content:''; position:absolute; left:5px; top:3px; width:14px; height:7px; background:linear-gradient(155deg,#f1f5dc32,transparent); border-radius:50%; rotate:-28deg; }
    .bead::after { content:''; position:absolute; inset:1px; border-radius:inherit; border:1px solid #ffffff0c; border-bottom-color:#183b3315; }
    .dot.second .bead { background:linear-gradient(145deg,#9daeb7,#8098a5 45%,#677f8c); }
    .dot.pooled .bead { background:linear-gradient(145deg,#d0c3a2,#b8a983 50%,#a3936f); }
    .dot.in-flight { z-index:7; }.dot.in-flight .bead { translate:0 -3px; scale:1.025; }
    .dot.in-flight::before { transform:scale(1.28); opacity:.5; }
    .dot.landing .bead { animation:claySettle ${TOKEN_SETTLE}ms ease-out; }
    .dot.landing::before { animation:contactSettle ${TOKEN_SETTLE}ms ease-out; }
    .dot.new { animation:appear 260ms ease-out both; }
    .dot.placed { animation:none; }
    .dot:not(:disabled)[data-action="return"]:hover { outline:none; }
    .dot:not(:disabled)[data-action="return"]:hover .bead { translate:0 -2px; }
    .dot:not(:disabled)[data-action="return"]:hover::before { transform:scale(1.15); opacity:.65; }
    .dot:focus-visible { outline:2px solid #315e51; outline-offset:1px; }
    .dot.count-active { outline:2px solid #4f6c7a; outline-offset:2px; background:none; scale:1; }
    .dot.count-active .bead { translate:0 -2px; }
    @keyframes claySettle { 0% { translate:0 -2px; scale:1.015; } 65% { translate:0 1px; scale:1.01 .97; } 100% { translate:0 0; scale:1; } }
    @keyframes contactSettle { 0% { transform:scale(1.2); opacity:.5; } 65% { transform:scale(.9); opacity:1; } 100% { transform:scale(1); opacity:1; } }
    .lane-bed { position:absolute; pointer-events:none; border:0; border-bottom:1px solid #bcc7b366; background:linear-gradient(180deg,#ffffff00,#f9faf12e); border-radius:12px; }
    .pool-bed { position:absolute; pointer-events:none; border:1px solid #c7c2ac; background:#d8d2bc; box-shadow:inset 0 3px 6px #5c594812,inset 0 -1px 0 #fffff780; border-radius:32px 27px 35px 19px; }
    .pool-label,.field-label { position:absolute; color:#64705a; font-size:9px; letter-spacing:1.6px; text-transform:uppercase; white-space:nowrap; }
    .lane-label { position:absolute; color:#5f6c55; font-size:11px; line-height:40px; font-variant-numeric:tabular-nums; }
    .lane-add { width:40px; height:40px; border:1px solid #a4b098; border-radius:15px 15px 17px 10px; background:#f5f5e8; color:#4f6348; box-shadow:inset 0 1px 0 #fff,0 2px 1px #53674c1a; font-size:23px; line-height:36px; }
    .lane-add:hover:not(:disabled) { scale:1.035; box-shadow:0 0 0 3px #9eb19520; }
    .lane-add:active:not(:disabled) { scale:.98; }
    .array-caption { font-size:12px; color:#5b6b55; letter-spacing:.2px; margin:7px 0 0; }
    .array-caption .count-chip { display:inline-flex; align-items:center; justify-content:center; min-width:27px; padding:4px 7px; margin:0 3px; background:#f8f8ed90; border-radius:8px; font-variant-numeric:tabular-nums; }
    .stage-tools { display:flex; justify-content:center; margin-top:16px; min-height:0; }
    .stage-tools:empty { display:none; }
    .stage-tools .controls { margin:0; gap:10px; }
    .control { padding:9px 14px; background:#f6f5e9; border:1px solid #cbd0bd; border-radius:16px; gap:14px; box-shadow:0 3px 0 #bec7b438; }
    .control-label { font-size:12px; min-width:0; }.stepper button { width:40px; height:40px; background:#e8ebdf; border-radius:11px; }
    .stage-tool,[data-action="deal"] { display:flex; align-items:center; gap:15px; min-height:54px; border:1px solid #b6bea7; border-radius:19px 19px 21px 10px; padding:9px 20px 9px 12px; background:#f5f3e5; color:#304f3c; box-shadow:inset 0 1px 0 #fff,0 4px 0 #bdc6ad,0 6px 8px #43553912; font-size:13px; font-weight:600; transition:translate 160ms,box-shadow 160ms; }
    .tool-teeth { display:grid; grid-template-columns:repeat(4,4px); gap:3px; padding:8px; border-right:1px solid #d1d6c3; }.tool-teeth i { width:4px; height:12px; background:#6d8361; border-radius:3px; }
    .stage-tool:hover:not(:disabled) { translate:0 -1px; }.stage-tool:active:not(:disabled) { translate:0 3px; box-shadow:inset 0 1px 2px #65764e15,0 1px 0 #bdc6ad; }
    .stage-tool:disabled { opacity:.6; }
    .relation { position:relative; min-height:72px; margin:0 -10px; padding:16px 20px; border:1px solid #d8ddcf; border-top:0; background:#e3e7da; border-radius:0 0 24px 24px; gap:14px; }
    .relation strong { font-size:30px; font-weight:540; letter-spacing:-.9px; }.relation .part { padding:7px 14px; background:#f3f6eb; border:1px solid #cbd5c2; border-radius:13px 12px 15px 8px; box-shadow:0 2px 0 #c7d0bb70; font-size:19px; }
    .relation .part.blue { background:#edf1f2; border-color:#c5d1d6; box-shadow:0 2px 0 #c2cdd070; }
    .part-tag strong { display:block; font-size:23px; font-weight:550; padding-top:3px; }
    .part-moving { position:relative; z-index:8; }
    .sum-prefix { display:inline-flex; gap:8px; align-items:baseline; justify-content:flex-end; }
    .join-prefix { min-width:175px; }
    .joining .array-caption { opacity:0; transition:opacity 200ms; }
    .joining .subfacts { opacity:.45; transition:opacity 250ms; }
    .join-equation { font-size:30px; }.sum-result { min-width:1.3em; text-align:left; }
    .join-gather { gap:50px; transition:gap 620ms ${MOTION_EASE}; }.join-gather.math-combine { gap:12px; }
    .subfacts { max-width:700px; margin:22px auto 0; gap:20px; }
    .subfact { padding:12px 16px; background:none; border:0; border-left:3px solid #8da78c; border-radius:0; box-shadow:none; }
    .subfact.blue { background:none; border-left-color:#9dafba; }
    .subfact label { gap:10px; font-size:19px; }
    input { width:72px; height:48px; background:#eeefe5; border:1px solid #d5dbca; border-bottom:2px solid #91a385; border-radius:12px 12px 15px 8px; box-shadow:inset 0 2px 3px #34463109; font-size:24px; }
    input:disabled { opacity:1; color:#365941; background:#e4eadb; }
    .support-link { border:0; background:none; color:#4e6671; font-size:12px; border-bottom:1px solid #bbc8cc; border-radius:0; padding:6px 0; }
    .support-link:hover { background:none; color:#273f4a; }
    .actions { max-width:none; background:none; border:0; border-top:1px solid #dce1d3; border-radius:0; padding:17px 0 0; margin:20px 0 0; }
    .primary { border-radius:16px 16px 18px 9px; padding:12px 23px; background:#315e51; border:1px solid #315e51; box-shadow:inset 0 1px 0 #ffffff20,0 3px 0 #23463b; transition:translate 160ms,box-shadow 160ms; }
    .primary:hover:not(:disabled) { background:#284e43; translate:0 -1px; }.primary:active:not(:disabled) { translate:0 2px; box-shadow:0 1px 0 #23463b; }
    .secondary { border-radius:16px 16px 18px 9px; background:#f1f1e6; }
    .text-button { font-size:12px; text-decoration:none; color:#5d6d56; }
    .text-button::before { content:'··'; display:inline-grid; place-items:center; width:24px; height:25px; margin-right:8px; letter-spacing:3px; padding-left:3px; border-radius:10px 9px 12px 5px; background:#e5ddbf; color:#596346; box-shadow:inset 0 1px 0 #ffffff90; font-weight:900; }
    .guide-mark { display:inline-grid; place-items:center; width:31px; height:32px; margin-right:9px; vertical-align:middle; background:#e5ddbf; border:1px solid #cbc4a5; border-radius:13px 11px 15px 6px; color:#49523d; box-shadow:inset 0 1px 0 #fff8,0 2px 2px #53562f12; rotate:-4deg; }
    .guide-mark::after { content:'··'; letter-spacing:4px; padding-left:4px; font-size:16px; font-weight:900; translate:0 -2px; }
    .field-feedback { border-radius:16px 16px 19px 7px; text-align:left; }.warning { background:#f4eddb; border-color:#dfd1b3; color:#6b531e; }
    .feedback { max-width:700px; margin:18px auto 0; padding:12px 15px; background:#edf2e6; text-align:center; border:0; border-radius:17px 17px 20px 8px; font-size:13px; animation:mathReveal 420ms ease both; }
    .feedback::before { content:'✓'; display:inline-grid; place-items:center; width:28px; height:29px; border-radius:12px 10px 14px 6px; background:#d4e1c9; margin-right:9px; }
    .summary-mark { width:76px; height:78px; border-radius:31px 27px 35px 15px; background:#e5ddbf; border:1px solid #cbc4a5; color:#46553b; rotate:-5deg; box-shadow:inset 0 1px 0 #fff8,0 5px 0 #cec7aa; }
    .cut { left:-26px; right:-32px; height:40px; border:0; background:transparent; color:#64745b; opacity:0; animation:boundaryReveal 400ms ease 650ms forwards; }
    .cut::after { content:''; position:absolute; left:2px; right:0; top:19px; border-top:1px dashed #9daa90; pointer-events:none; }
    .cut::before { content:'⋮'; position:absolute; left:auto; right:-23px; top:0; width:25px; height:26px; line-height:24px; translate:0 6px; border:1px solid #bdc5af; border-radius:14px 12px 16px 7px; background:#f6f4e7; font-size:18px; color:#586b4b; box-shadow:0 2px 1px #9fad9125; }
    .cut span { top:6px; right:21px; padding:5px 8px; font-size:10px; border-radius:12px 12px 14px 5px; z-index:1; }
    .cut.recommended { border:0; }.cut.recommended::before { width:36px; height:38px; line-height:36px; translate:0 0; content:'··'; font-size:19px; font-weight:900; letter-spacing:3px; background:#e4dcbf; border-color:#bdb79a; }
    .cut.recommended span { top:6px; padding:5px 8px; background:#faf8ed; border:1px solid #cdd3be; color:#536348; }
    .cut:hover,.cut:focus-visible { background:#ecf2e050; border-radius:12px; }
    .cut.attention,.cut.attention-dismissed { opacity:1; }
    @keyframes boundaryReveal { to { opacity:1; } }
    .divider { left:-20px; right:-20px; border-color:#85947b; }.divider.visible { animation:dividerRest 1300ms ease forwards; }
    @keyframes dividerRest { 0%,45% { opacity:.8; } 100% { opacity:.18; } }
    .part-tag { position:absolute; right:-86px; color:#4f6650; font-size:12px; white-space:nowrap; padding:6px 8px; border-left:1px solid #9aae90; animation:mathReveal 420ms ease both; }
    .part-tag.blue { color:#4f6470; border-color:#a6b8c2; }
    .resolved .playground { box-shadow:inset 0 2px 4px #45513c0a,0 0 0 2px #9fb69130; transition:box-shadow 700ms; }
    .resolved .array { animation:settle 600ms ease-out; }.resolved .part-tag { opacity:0; }
    .intro .playground { max-width:none; min-height:290px; margin:24px -10px 0; }.intro .relation { margin:0 -10px; }
    .intro .actions { border:0; margin-top:20px; }.intro-copy { font-size:14px; }
    .anticipate .lead { animation:mathReveal 450ms 450ms both; }.anticipate h2 { animation:mathReveal 450ms 250ms both; }
    @media(max-width:700px) { .content { padding:24px 20px 18px; }.top { padding:19px 22px; }.track { display:flex; }.track i { width:10px; }.playground { padding:40px 8px 18px; }.field-scroll { padding:14px 32px 12px; }.subfacts { gap:10px; }.part-tag { right:-70px; font-size:11px; }.playground-label { font-size:8px; } }
    @media(max-width:480px) { .content { padding:24px 14px 18px; }.top { padding:16px; }.sub { font-size:10px; }.symbol { display:none; }.track { display:none; }.playground { margin-left:-4px; margin-right:-4px; }.relation { margin-left:-4px; margin-right:-4px; }.field-scroll { padding-left:23px; padding-right:23px; }.part-tag { position:static; display:none; }.subfacts { grid-template-columns:1fr; }.control { width:auto; padding:8px; }.controls { gap:8px; }.control-label { font-size:11px; }.stepper { gap:8px; }.cut { left:0; right:0; }.cut::before { right:-21px; }.cut span { right:20px; }.relation strong,.join-equation { font-size:26px; } }
    @media(prefers-reduced-motion:reduce) { .cut { opacity:1; } *,*::before,*::after { animation:none!important; transition:none!important; }.dot.in-flight .bead { translate:0 0; scale:1; } }

  `;

  const snapshotKeys = ['stage','history','learnerState','rows','columns','split','guideStep','mode','challenge','allocations','pool','answers','partialReady','joined','attempts','errors','hintCount','highestScaffoldLevel','feedbackState','fieldErrors','selfCorrected','subfactChecks','subfactCorrect','startedAt','lastStrategy','guideJoined','attentionCues','partialAttempts','partialOutcomes','strategySupport'];

  class ArrayArchitects extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode:'open' });
      this.motionTimers = new Set();
      this.activityVersion = 0;
      let storage;
      try { storage = window.localStorage; } catch (_) { storage = null; }
      this.telemetry = new window.ArrayArchitectsTelemetry.Telemetry(storage);
      this.reset(false);
      if (this.telemetry.session.snapshot) Object.assign(this, this.telemetry.session.snapshot);
      this.onClick = event => {
        const button = event.target.closest('button[data-action]');
        if (!button || button.disabled || this.joining) return;
        this.dismissAttention();
        this.action(button.dataset.action, button);
        this.save();
      };
      this.onSubmit = event => { event.preventDefault(); this.dismissAttention(); this.check(); this.save(); };
      this.onInput = event => {
        const field = event.target.name;
        if (!['partA','partB'].includes(field)) return;
        this.dismissAttention();
        this.cancelSupport();
        this.answers[field] = event.target.value;
        this.clearFeedback(field);
        this.save();
      };
    }

    connectedCallback() {
      this.shadowRoot.addEventListener('click', this.onClick);
      this.shadowRoot.addEventListener('submit', this.onSubmit);
      this.shadowRoot.addEventListener('input', this.onInput);
      this.render();
      this.resizeObserver=new ResizeObserver(()=>{
        const width=Math.round(this.getBoundingClientRect().width);
        if(width!==this.lastWidth&&!this.joining){this.lastWidth=width;this.drawArray();}
      });this.resizeObserver.observe(this);
      this.save();
    }
    disconnectedCallback() {
      this.shadowRoot.removeEventListener('click', this.onClick);
      this.shadowRoot.removeEventListener('submit', this.onSubmit);
      this.shadowRoot.removeEventListener('input', this.onInput);
      this.cancelMotion();
      this.cancelSupport();
      this.resizeObserver?.disconnect();
      clearTimeout(this.cueTimer);
      this.joining = false;
    }
    reset(newSession = true) {
      this.cancelMotion();
      this.cancelSupport();
      clearTimeout(this.cueTimer);
      this.attentionCues = {};
      this.partialAttempts = {partA:0,partB:0};
      this.partialOutcomes = {};
      this.strategySupport = {};
      if (newSession) this.telemetry.start();
      Object.assign(this, { stage:'INTRO', history:[], learnerState:engine.createLearnerState(), rows:3, columns:4, split:0, guideStep:1, mode:'build', challenge:null, allocations:[], pool:[], answers:{partA:'',partB:''}, partialReady:false, joined:false, attempts:0, errors:0, hintCount:0, highestScaffoldLevel:0, feedbackState:{}, fieldErrors:{}, selfCorrected:false, subfactChecks:0, subfactCorrect:0, startedAt:0, lastStrategy:null, guideJoined:false });
    }
    log(eventName, payload = {}) {
      this.telemetry.logEvent(eventName, payload, { challengeId:this.stage === 'GUIDE' ? 'guide' : this.challenge?.id, challengeType:this.stage === 'GUIDE' ? (this.guideStep < 4 ? 'guided-build' : 'guided-split') : this.challenge?.type, skill:this.stage === 'GUIDE' ? (this.guideStep < 4 ? 'equalGroups' : 'decomposition') : this.challenge?.skill, attemptNumber:this.attempts });
    }
    save() {
      if (this.joining) return;
      this.telemetry.saveSnapshot(Object.fromEntries(snapshotKeys.map(key => [key,this[key]])));
      const status = this.shadowRoot.querySelector('[data-storage]');
      if (status) status.textContent = this.telemetry.persistent ? 'Saved on this device. No data is sent.' : 'Storage unavailable. Export before closing this page.';
    }
    getSession() { return JSON.parse(JSON.stringify({ ...this.telemetry.session, learnerState:this.learnerState, history:this.history, evidenceStatus:engine.evidenceStatus })); }
    button(action, text, kind = 'primary', extra = '') { return `<button type="button" class="${kind}" data-action="${action}" ${action==='hint'?'aria-label="Show a hint"':''} ${extra}>${text}</button>`; }
    control(key, label, value, active, disabled) {
      return `<div class="control ${active ? 'guide-target' : ''}"><span class="control-label">${label}</span><div class="stepper">${this.button(key+'-down','−','',`aria-label="Decrease ${label.toLowerCase()}" ${disabled || value <= 1 ? 'disabled' : ''}`)}<output>${value}</output>${this.button(key+'-up','+','',`aria-label="Increase ${label.toLowerCase()}" ${disabled || value >= 6 ? 'disabled' : ''}`)}</div></div>`;
    }
    playground() { return `<div class="playground"><span class="playground-label">${this.mode==='split'||(this.stage==='GUIDE'&&this.guideStep>=4)?'Split field':'Counting table'} / ${this.stage==='GUIDE'?'Practice':'Array Architects'}</span><div class="field-scroll"><div class="array" role="group" aria-label="Interactive array"><div class="divider"></div></div></div><div class="array-caption" aria-live="polite"></div><div class="stage-tools">${this.stageTools()}</div></div>`; }
    stageTools() {
      if(this.stage==='GUIDE'&&this.guideStep<4)return `<div class="controls">${this.control('rows','Rows',this.rows,this.guideStep===1,this.guideStep!==1)}${this.control('columns','In each row',this.columns,this.guideStep===2,this.guideStep!==2)}</div>`;
      if(this.stage==='PLAY'&&this.challenge?.type==='inverse')return this.button('deal','<span class="tool-teeth" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Add one to each group</span>','stage-tool',this.pool.length===0?'disabled':'');
      return '';
    }
    render(focus = false) {
      const count = this.history.length;
      const label = this.stage === 'INTRO' ? 'Discover' : this.stage === 'GUIDE' ? 'Guided practice' : this.stage === 'SUMMARY' ? 'Complete' : `${Math.min(6, count + (this.stage === 'FEEDBACK' ? 0 : 1))} / 6`;
      this.shadowRoot.innerHTML = `<style>${styles}</style><section class="card" aria-label="Array Architects game"><header class="top"><div class="identity"><span class="symbol" aria-hidden="true">${'<i></i>'.repeat(9)}</span><div><h1>Array Architects</h1><div class="sub">Equal groups. New possibilities.</div></div></div><div class="progress"><div class="track" aria-hidden="true">${Array.from({length:6},(_,i)=>`<i class="${i<count?'done':i===count?'current':''}"></i>`).join('')}</div><span>${label}</span></div></header><div class="content ${this.stage==='INTRO'?'intro center':this.mode==='split'&&!this.split?'anticipate':''}">${this.body()}</div></section><details class="debug"><summary>Session tools</summary><p data-storage class="quiet"></p>${this.button('export','Export session data','secondary')}<span class="quiet"> CSV · events and challenge summaries</span></details>`;
      this.drawArray();
      this.armAttention();
      this.save();
      if (focus) this.shadowRoot.querySelector('h2')?.focus({preventScroll:true});
    }
    body() {
      if (this.stage === 'INTRO') return `<p class="eyebrow">A different way to see numbers</p><h2 tabindex="-1">Make multiplication visible</h2><p class="intro-copy">Multiplication represents equal groups.<br>Break a difficult array into smaller, familiar parts<br>to see how the numbers fit together.</p>${this.playground()}<div class="relation"><span>3 groups of 4</span><span class="arrow">→</span><strong>3 × 4 = 12</strong></div><div class="actions">${this.button('guide','Show me how →')}</div>`;
      if (this.stage === 'SUMMARY') {
        const frequencies = this.history.filter(h=>h.selectedSplitStrategy).reduce((m,h)=>{const k=h.selectedSplitStrategy.join(' + ');m[k]=(m[k]||0)+1;return m;},{});
        const strategy = Object.keys(frequencies).sort((a,b)=>frequencies[b]-frequencies[a])[0];
        return `<div class="summary center"><div class="summary-mark">✓</div><p class="eyebrow">Six explorations, connected</p><h2 tabindex="-1">Blueprint complete</h2><p class="lead">You made the mathematics move.</p><ul class="check-list"><li>Building equal groups</li><li>Breaking apart multiplication facts</li><li>Connecting multiplication and division</li></ul>${strategy?`<p class="quiet">Strategy used most</p><div class="relation"><strong>Split into ${strategy}</strong></div>`:''}<div class="actions">${this.button('intro','Back to introduction','secondary')}${this.button('again','Play again')}</div></div>`;
      }
      let title, subtitle, eyebrow;
      if (this.stage === 'GUIDE') {
        title = this.guideStep===1?'Make 3 rows.':this.guideStep===2?'Put 4 in each row.':this.guideStep===3?'You built an array.':this.guideStep===4?'Split after 5 rows.':this.guideJoined?'One array, two easier facts.':'See the two smaller parts.';
        subtitle = this.guideStep<3?'Use the + and − buttons. Watch the dots move.':this.guideStep===3?'3 equal groups of 4 make 12.':'Some facts are easier to see in smaller parts.';
        eyebrow = this.guideStep<4?'Try it together · Build 3 × 4':'Try it together · Split 6 × 4';
      } else {
        const c=this.challenge;
        title=c.type==='inverse'?'Share 24 into 4 equal groups':this.mode==='split'?'Can you make this easier?':`Make ${c.total} with ${c.rows} equal rows.`;
        subtitle=c.type==='inverse'?'How many will be in each group?':this.mode==='split'?`${c.rows} × ${c.columns} · Choose a boundary between rows.`:'Move the dots into the rows. Tap a placed dot to return it.';
        eyebrow=c.type==='inverse'?'Share · equal groups':this.mode==='split'?'Split → Solve the parts → Join':'Build · find the missing group size';
      }
      return `<p class="eyebrow">${this.stage==='GUIDE'?'<span class="guide-mark" aria-hidden="true"></span>':''}${eyebrow}</p><h2 tabindex="-1">${title}</h2><p class="lead">${subtitle}</p>${this.playground()}<div class="relation" data-relation>${this.relationship()}</div><div data-work>${this.work()}</div>`;
    }
    work() {
      if (this.stage==='GUIDE') {
        if (this.guideStep<4) return `<div class="actions"><span class="quiet">Next: learn to split an array.</span>${this.button('split-guide','Try splitting →','primary',this.guideStep<3?'disabled':'')}</div>`;
        return `<div class="actions"><span class="quiet">${this.guideStep===4?'Tap the highlighted boundary in the array.':'The total stays the same.'}</span>${this.guideStep===4?'':this.guideJoined?this.button('start','Start →'):this.button('guide-join','Join the parts')}</div>`;
      }
      if (this.stage==='FEEDBACK') return `<div class="feedback">${this.mode==='split'?'You joined both parts.':this.challenge.type==='inverse'?'Every group has 6. Sharing and multiplication describe the same array.':'All the objects fit into equal rows.'}</div><div class="actions"><span class="quiet">One array. Connected facts.</span>${this.button('continue',this.history.length===6?'See your blueprint →':'Continue →')}</div>`;
      if (this.mode==='split') {
        if (!this.split) return `<p class="quiet center">Tap any dotted boundary to split the array.${this.challenge.support?' Try the marked five-row anchor.':''}</p><div class="feedback-slot" data-feedback="split">${this.feedbackHTML('split')}</div><div class="actions">${this.button('hint','Show a hint','text-button')}</div>`;
        const a=this.split, b=this.rows-this.split;
        return `<form novalidate><div class="subfacts"><div class="subfact"><label for="partA"><span class="part-chip">${a} × ${this.columns}</span> = <input id="partA" name="partA" aria-label="First part product" inputmode="numeric" type="number" value="${this.safeAnswer('partA')}" ${this.partialReady?'disabled':''} aria-describedby="feedback-partA"></label><div id="feedback-partA" class="feedback-slot" data-feedback="partA">${this.feedbackHTML('partA')}</div>${this.supportControl('partA')}</div><div class="subfact blue"><label for="partB"><span class="part-chip">${b} × ${this.columns}</span> = <input id="partB" name="partB" aria-label="Second part product" inputmode="numeric" type="number" value="${this.safeAnswer('partB')}" ${this.partialReady?'disabled':''} aria-describedby="feedback-partB"></label><div id="feedback-partB" class="feedback-slot" data-feedback="partB">${this.feedbackHTML('partB')}</div>${this.supportControl('partB')}</div></div><div class="actions">${this.button('hint','Show a hint','text-button')}${this.partialReady?this.button('join','Join the parts'):'<button type="submit" class="primary">Check the two parts →</button>'}</div></form>`;
      }
      return `<div class="feedback-slot" data-feedback="array">${this.feedbackHTML('array')}</div><div class="actions">${this.button('hint','Show a hint','text-button')}${this.button('check','Check equal groups →')}</div>`;
    }
    safeAnswer(field) { return /^\d{0,3}$/.test(this.answers[field])?this.answers[field]:''; }
    relationship() {
      if (this.stage==='GUIDE') {
        if (this.guideStep<4) return this.guideStep===3?'<strong>3 × 4 = 12</strong>':'';
        if (this.guideJoined) return this.joinEquation(20,4,true);
        return this.split?'<span class="part">5 × 4 = 20</span><span>+</span><span class="part blue">1 × 4 = 4</span>':'<strong>6 × 4</strong>';
      }
      const c=this.challenge;
      if (!c) return '';
      if(this.mode==='split'&&this.joined) return this.joinEquation(this.lastStrategy[0]*this.columns,this.lastStrategy[1]*this.columns,true);
      if (this.joined || this.stage==='FEEDBACK') return `${this.mode==='split'?`<span>${this.lastStrategy[0]*this.columns} + ${this.lastStrategy[1]*this.columns}</span><span class="arrow">→</span>`:''}<strong class="result">${c.rows} × ${c.columns} = ${c.rows*c.columns}</strong>${c.type==='inverse'?'<span class="arrow">↔</span><strong>24 ÷ 4 = 6</strong>':''}`;
      if (this.mode==='split') return this.split?`<span class="part">${this.split} × ${this.columns}</span><span>+</span><span class="part blue">${this.rows-this.split} × ${this.columns}</span>`:'<span class="quiet">Choose the two parts in the array.</span>';
      return `<span>Total: ${c.total}</span><span class="arrow">·</span><strong>${this.pool.length} remaining</strong>`;
    }
    feedbackHTML(field) {
      const f=this.feedbackState[field];
      return f?`<p class="field-feedback ${f.type==='success'?'positive':'warning'}" role="status">${f.type.includes('hint')?'<span class="guide-mark" aria-hidden="true"></span>':''}${f.message}</p>`:'';
    }
    refreshWork(preserveRelation = false) {
      const stageTools=this.shadowRoot.querySelector('.stage-tools');
      if(stageTools)stageTools.innerHTML=this.stageTools();
      const work=this.shadowRoot.querySelector('[data-work]');
      if(work) work.innerHTML=this.work();
      const relation=this.shadowRoot.querySelector('[data-relation]');
      if(relation && !preserveRelation) relation.innerHTML=this.relationship();
      if(this.stage==='GUIDE'&&this.guideStep>=4) this.shadowRoot.querySelector('h2').textContent=this.guideJoined?'One array, two easier facts.':this.split?'See the two smaller parts.':'Split after 5 rows.';
    }
    drawArray(confirm = true) {
      const array=this.shadowRoot.querySelector('.array');
      if(!array)return;
      const sharing=['PLAY','FEEDBACK'].includes(this.stage)&&this.mode!=='split';
      const available=this.shadowRoot.querySelector('.playground').clientWidth-100;
      const wide=sharing&&available>=550;
      const gap=available<340?36:40,rowGap=52;
      this.fieldGeometry={gap,rowGap,wide};
      const coords=[];
      array.querySelectorAll('.cut,.lane-add,.lane-label,.pool-label,.field-label,.row-tally,.lane-bed,.pool-bed,.part-tag').forEach(el=>el.remove());
      const label=(className,text,x,y)=>{const el=document.createElement('span');el.className=className;el.textContent=text;el.style.cssText=`left:${x}px;top:${y}px`;array.append(el);return el;};
      if(sharing){
        const maxCols=Math.max(7,...this.allocations.map(group=>group.length+1));
        const trayCols=wide?4:6,trayRows=Math.ceil(this.challenge.total/trayCols);
        const groupX=wide?trayCols*gap+78:0,groupY=24;
        const poolX=0,poolY=wide?24:this.rows*rowGap+86;
        this.fieldGeometry={gap,rowGap,wide,groupX,groupY,poolX,poolY};
        const tray=document.createElement('div');tray.className='pool-bed';tray.style.cssText=`left:${poolX-12}px;top:${poolY-12}px;width:${trayCols*gap+24}px;height:${trayRows*gap+24}px`;array.append(tray);
        label('pool-label',this.pool.length||!confirm?'Token tray':'Tray empty',poolX,poolY-34);
        label('field-label','Equal groups',groupX,groupY-34);
        this.allocations.forEach((group,r)=>{
          const bed=document.createElement('div');bed.className='lane-bed';bed.style.cssText=`left:${groupX-4}px;top:${groupY+r*rowGap-2}px;width:${maxCols*gap+8}px;height:44px`;array.append(bed);
          label('lane-label',String(r+1).padStart(2,'0'),groupX-25,groupY+r*rowGap);
          group.forEach((id,c)=>coords.push({id:`object-${id}`,x:groupX+c*gap,y:groupY+r*rowGap,row:r,objectId:id}));
          if(this.stage==='PLAY'&&this.challenge.type==='build'){
            const add=document.createElement('button');add.type='button';add.className='lane-add';add.dataset.action='place';add.dataset.row=r;add.style.transform=`translate(${groupX+group.length*gap}px,${groupY+r*rowGap}px)`;add.textContent='+';add.setAttribute('aria-label',`Add a dot to row ${r+1}`);add.disabled=this.pool.length===0||this.joining;array.append(add);
          }
        });
        this.pool.forEach((id,i)=>coords.push({id:`object-${id}`,x:poolX+(i%trayCols)*gap,y:poolY+Math.floor(i/trayCols)*gap,pool:true,objectId:id}));
        array.style.width=`${wide?groupX+maxCols*gap:Math.max(maxCols,trayCols)*gap}px`;
        array.style.height=`${Math.max(groupY+this.rows*rowGap,poolY+trayRows*gap)+16}px`;
        if(confirm)array.setAttribute('aria-label',`${this.challenge.total} objects, ${this.rows} rows, ${this.pool.length} remaining`);
      }else{
        for(let r=0;r<this.rows;r++)for(let c=0;c<this.columns;c++){
          const second=Boolean(this.split&&r>=this.split);
          coords.push({id:`dot-${r}-${c}`,x:c*gap+(this.split?(second?5:-5):0),y:r*gap+8+(this.split?(second?8:-8):0),second});
        }
        array.style.width=`${this.columns*gap}px`;
        array.style.height=`${this.rows*gap+16}px`;
        array.setAttribute('aria-label',`${this.rows} rows of ${this.columns}${this.split?`, split into ${this.split} and ${this.rows-this.split} rows`:''}`);
        if(this.split){
          const a=label('part-tag',`${this.split} × ${this.columns}`,this.columns*gap+21,Math.max(0,(this.split*gap)/2-10));
          const b=label('part-tag blue',`${this.rows-this.split} × ${this.columns}`,this.columns*gap+21,this.split*gap+(this.rows-this.split)*gap/2+8);
          a.dataset.part='partA';b.dataset.part='partB';
          a.hidden=b.hidden=!(this.partialReady||(this.stage==='GUIDE'&&this.guideStep===5));
          if(this.partialReady||(this.stage==='GUIDE'&&this.guideStep===5)){
            [a,b].forEach((el,i)=>{const result=document.createElement('strong');result.dataset.partValue=i?'right':'left';result.textContent=String((i?this.rows-this.split:this.split)*this.columns);el.append(document.createTextNode(' = '),result);});
          }
          for(let r=0;r<this.rows;r++){
            const field=r<this.split?'partA':'partB';
            if(this.feedbackState[field]?.scaffoldLevel>=3)label('row-tally',String((r<this.split?r+1:r-this.split+1)*this.columns),this.columns*gap+12,r*gap+(r>=this.split?16:0));
          }
        }
        const canCut=(this.stage==='PLAY'&&this.mode==='split'&&!this.partialReady&&!this.joined)||(this.stage==='GUIDE'&&this.guideStep===4);
        if(canCut)for(let r=1;r<this.rows;r++){
          if(this.stage==='GUIDE'&&r!==5)continue;
          const cut=document.createElement('button');cut.type='button';cut.className='cut';cut.dataset.action='cut';cut.dataset.row=r;cut.style.top=`${r*gap-12+(this.split?(r>this.split?8:r<this.split?-8:0):0)}px`;cut.setAttribute('aria-label',`Split after ${r} rows`);cut.innerHTML='<span>Split here</span>';
          if(!this.split&&r===(this.challenge?.anchor||5))cut.classList.add('recommended');
          array.append(cut);
        }
      }
      const existing=new Map([...array.querySelectorAll('.dot')].map(el=>[el.dataset.key,el]));
      const keep=new Set();
      coords.forEach((point,i)=>{
        keep.add(point.id);let dot=existing.get(point.id);
        if(!dot){dot=document.createElement(sharing?'button':'span');dot.className='dot new';dot.dataset.key=point.id;dot.innerHTML='<span class="bead" aria-hidden="true"></span>';dot.style.setProperty('--delay',`${Math.min(180,i*10)}ms`);array.append(dot);}
        dot.style.transform=`translate(${point.x}px,${point.y}px)`;
        dot.classList.toggle('second',Boolean(point.second));dot.classList.toggle('pooled',Boolean(point.pool));
        if(sharing){dot.type='button';dot.dataset.action='return';dot.dataset.object=point.objectId;dot.dataset.row=point.row;dot.disabled=point.pool||this.challenge.type==='inverse'||this.stage!=='PLAY'||this.joining;dot.setAttribute('aria-label',point.pool?'Unshared dot':`Return a dot from row ${point.row+1}`);}
        else dot.setAttribute('aria-hidden','true');
      });
      existing.forEach((el,key)=>{if(!keep.has(key))el.remove();});
      const divider=array.querySelector('.divider');divider.classList.toggle('visible',Boolean(this.split));divider.style.top=`${this.split*gap+7}px`;
      if(confirm)this.updateCaption();
    }
    updateCaption(){
      const caption=this.shadowRoot.querySelector('.array-caption');
      if(!caption)return;
      const sharing=['PLAY','FEEDBACK'].includes(this.stage)&&this.mode!=='split';
      if(sharing)caption.innerHTML=`In each group ${this.allocations.map(group=>`<span class="count-chip">${group.length}</span>`).join('')}`;
      else caption.textContent=this.split?`${this.split} rows + ${this.rows-this.split} rows`:`${this.rows} ${this.rows===1?'group':'groups'} of ${this.columns}`;
    }
    moveObjects(action,row){
      if(this.joining)return;
      const ids=action==='deal'?this.pool.slice(0,this.rows):action==='place'?this.pool.slice(0,1):[this.returnObject];
      if(!ids.length||(action==='deal'&&ids.length<this.rows))return;
      this.clearFeedback('array');this.save();this.joining=true;
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lift=reduced?0:TOKEN_LIFT,travel=reduced?0:TOKEN_TRAVEL,settle=reduced?0:TOKEN_SETTLE;
      const dots=ids.map(id=>this.shadowRoot.querySelector(`[data-key="object-${id}"]`)).filter(Boolean);
      dots.forEach(dot=>dot.classList.add('in-flight'));
      this.shadowRoot.querySelectorAll('.stage-tools button,[data-work] button,.lane-add,.dot[data-action]').forEach(el=>el.disabled=true);
      this.shadowRoot.querySelector('.playground').setAttribute('aria-busy','true');
      const nextGroups=this.allocations.map(group=>group.slice()),nextPool=this.pool.slice();
      if(action==='place')nextGroups[row].push(nextPool.shift());
      if(action==='deal')nextGroups.forEach(group=>group.push(nextPool.shift()));
      if(action==='return'){const index=nextGroups[row].indexOf(ids[0]);if(index>=0)nextPool.push(nextGroups[row].splice(index,1)[0]);}
      this.later(lift,()=>{
        // Preview destinations only. Commit the conserved objects and telemetry at landing.
        const currentGroups=this.allocations,currentPool=this.pool;
        this.allocations=nextGroups;this.pool=nextPool;this.drawArray(false);
        this.allocations=currentGroups;this.pool=currentPool;
        this.later(travel,()=>{
          dots.forEach(dot=>{dot.classList.remove('in-flight');dot.classList.add('landing');});
          this.later(settle,()=>{
            dots.forEach(dot=>dot.classList.remove('landing'));
            this.allocations=nextGroups;this.pool=nextPool;
            this.joining=false;this.drawArray();this.refreshWork();
            this.shadowRoot.querySelector('.playground').removeAttribute('aria-busy');
            this.log('control_changed',{control:action,row:Number.isFinite(row)?row:null,groups:this.allocations.map(g=>g.length),remaining:this.pool.length});
            if(action==='deal')this.flashSharing();
            const target=action==='deal'?'[data-action="deal"]':`.lane-add[data-row="${row}"]`;
            this.shadowRoot.querySelector(target)?.focus({preventScroll:true});this.save();
          });
        });
      });
    }
    action(action,button) {
      if(action==='show-how'){this.showSupport(button.dataset.field);return;}
      if(action==='export') {const blob=new Blob([this.telemetry.exportCSV()],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='array-architects-sessions.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
      if(action==='guide'){this.log('principle_completed');this.stage='GUIDE';this.rows=1;this.columns=2;this.guideStep=1;this.render(true);return;}
      if(action==='intro'||action==='again'){this.reset();this.render(true);return;}
      if(action==='split-guide'&&this.guideStep===3){this.guideStep=4;this.rows=6;this.columns=4;this.render(true);return;}
      if(action==='guide-join'&&this.guideStep===5){this.join(true);return;}
      if(action==='start'&&this.stage==='GUIDE'&&this.guideJoined){this.log('guide_step_completed',{step:'split-recombined'});this.next();return;}
      if(action==='continue'&&this.stage==='FEEDBACK'){this.next();return;}
      if(action==='check'){this.check();return;}
      if(action==='hint'){this.hint();return;}
      if(action==='join'){this.join(false);return;}
      if(action==='cut') {
        if(this.partialReady||this.joined)return;
        this.cancelSupport();
        const cut=Number(button.dataset.row);
        if(cut<1||cut>=this.rows)return;
        this.clearFeedback('split');this.clearFeedback('partA');this.clearFeedback('partB');
        this.split=cut;this.answers={partA:'',partB:''};this.feedbackState={};this.fieldErrors={};
        this.log('split_selected',{split:[cut,this.rows-cut],target:[this.rows,this.columns]});
        if(this.stage==='GUIDE'){this.guideStep=5;this.log('guide_step_completed',{step:'split-selected',split:[5,1]});}
        this.drawArray();this.refreshWork();
        if(this.stage==='GUIDE')this.revealGuideParts();
        return;
      }
      if(['place','return','deal'].includes(action)&&this.stage==='PLAY'&&this.mode!=='split') {
        this.returnObject=Number(button.dataset.object);
        this.moveObjects(action,Number(button.dataset.row));return;
      }
      if(this.stage==='GUIDE'&&this.guideStep<3) {
        const [key,direction]=action.split('-');if(!['rows','columns'].includes(key))return;
        this[key]=Math.max(1,Math.min(6,this[key]+(direction==='up'?1:-1)));
        this.log('control_changed',{control:key,value:this[key]});
        if(this.guideStep===1&&this.rows===3){this.log('guide_step_completed',{step:'three-rows'});this.guideStep=2;}
        if(this.guideStep===2&&this.columns===4){this.log('guide_step_completed',{step:'build-3-by-4'});this.guideStep=3;}
        this.drawArray();this.refreshWork();
        this.shadowRoot.querySelector('h2').textContent=this.guideStep===1?'Make 3 rows.':this.guideStep===2?'Put 4 in each row.':'You built an array.';
        const target=this.guideStep===3?'split-guide':this.guideStep===2?'columns-up':action;
        this.shadowRoot.querySelector(`[data-action="${target}"]`)?.focus({preventScroll:true});
      }
    }
    next() {
      this.cancelMotion();this.cancelSupport();clearTimeout(this.cueTimer);
      this.attentionCues={};this.partialAttempts={partA:0,partB:0};this.partialOutcomes={};this.strategySupport={};
      const next=engine.selectNextChallenge(this.learnerState,this.history);
      if(!next){this.stage='SUMMARY';this.log('session_completed',{challengeCount:this.history.length,learnerState:this.learnerState});this.render(true);this.dispatchEvent(new CustomEvent('session-complete',{detail:this.getSession(),bubbles:true,composed:true}));return;}
      this.challenge=next;this.stage='PLAY';this.mode=['split','mixed'].includes(next.type)?'split':'share';
      Object.assign(this,{rows:next.rows,columns:next.columns,split:0,answers:{partA:'',partB:''},partialReady:false,joined:false,attempts:0,errors:0,hintCount:0,highestScaffoldLevel:0,feedbackState:{},fieldErrors:{},selfCorrected:false,subfactChecks:0,subfactCorrect:0,startedAt:Date.now(),lastStrategy:null});
      this.allocations=Array.from({length:next.rows},()=>[]);this.pool=Array.from({length:next.total||next.rows*next.columns},(_,i)=>i);
      this.log('adaptive_decision',{policy:next.policy,support:next.support,learnerState:this.learnerState});
      this.log('challenge_started',{target:[next.rows,next.columns],total:next.total||next.rows*next.columns});
      this.render(true);
      if(next.support)this.showFeedback(this.mode==='split'?'split':'array','hint',1,this.mode==='split'?'Try a boundary after five rows. Then count each part.':'Share a few dots into every row before adding more.');
    }
    clearFeedback(field) {
      const old=this.feedbackState[field];
      if(!old)return;
      if(old.type!=='success'){
        this.selfCorrected=true;
        this.log('answer_changed_after_feedback',{relatedField:field,previousFeedbackType:old.type,scaffoldLevel:old.scaffoldLevel});
      }
      delete this.feedbackState[field];
      const slot=this.shadowRoot.querySelector(`[data-feedback="${field}"]`);if(slot)slot.innerHTML='';
      const input=this.shadowRoot.querySelector(`[name="${field}"]`);input?.removeAttribute('aria-invalid');
      this.drawArray();
    }
    showFeedback(field,type,level,message) {
      const f={type,feedbackType:type,attemptNumber:this.attempts,scaffoldLevel:level,relatedField:field,message,timestamp:new Date().toISOString()};
      this.feedbackState[field]=f;this.highestScaffoldLevel=Math.max(this.highestScaffoldLevel,level);
      this.log('feedback_shown',f);
      const slot=this.shadowRoot.querySelector(`[data-feedback="${field}"]`);if(slot)slot.innerHTML=this.feedbackHTML(field);
      const input=this.shadowRoot.querySelector(`[name="${field}"]`);if(input)input.setAttribute('aria-invalid',String(type.startsWith('wrong')));
      const region=field==='partA'||field==='partB'?input?.closest('.subfact'):this.shadowRoot.querySelector('.array');
      if(region){region.classList.remove('pulse');void region.offsetWidth;region.classList.add('pulse');}
      this.drawArray();
    }
    hint() {
      if(this.stage!=='PLAY')return;
      this.hintCount++;this.log('hint_requested',{split:this.split?[this.split,this.rows-this.split]:null});
      if(this.mode==='split'&&!this.split){this.showFeedback('split','hint',1,'Tap a boundary in the array. Five rows can make a useful first part.');return;}
      if(this.mode==='split'){
        for(const [field,rows] of [['partA',this.split],['partB',this.rows-this.split]]){
          this.showFeedback(field,'hint',2,`Count ${rows} rows of ${this.columns}: ${Array(rows).fill(this.columns).join(' + ')}.`);
        }
      }else this.showFeedback('array','hint',1,this.challenge.type==='inverse'?'Each press shares one dot into every group. Keep sharing until none remain.':'Add dots to the shorter rows. Every row needs the same number, with none left over.');
    }
    check() {
      if(this.stage!=='PLAY'||this.partialReady||this.joining||this.supportPlaying)return;
      if(this.mode==='split'&&!this.split)return;
      this.attempts++;
      if(this.mode==='split') {
        const targets={partA:this.split*this.columns,partB:(this.rows-this.split)*this.columns};
        let allCorrect=true;
        for(const field of ['partA','partB']){
          const raw=this.shadowRoot.querySelector(`[name="${field}"]`)?.value??this.answers[field];this.answers[field]=raw;
          const correct=raw.trim()!==''&&Number(raw)===targets[field];
          this.partialAttempts[field]=(this.partialAttempts[field]||0)+1;
          const supportedHere=this.strategySupport[field]?.used && this.strategySupport[field].split===this.split;
          const outcome=correct?(supportedHere?'correct_after_support':this.fieldErrors[field]?'correct_after_retry':'independent'):'incorrect';
          this.partialOutcomes[field]=outcome;
          this.subfactChecks++;this.subfactCorrect+=Number(correct);
          this.log('subfact_submitted',{partialOutcome:outcome,partialAttemptNumber:this.partialAttempts[field],supportUsed:Boolean(this.strategySupport[field]?.used),supportType:this.strategySupport[field]?.type||null,relatedField:field,value:raw===''?null:Number(raw),correct,split:[this.split,this.rows-this.split]});
          if(correct)this.showFeedback(field,'success',0,'This part matches its rows.');
          else{
            allCorrect=false;this.fieldErrors[field]=(this.fieldErrors[field]||0)+1;
            const level=Math.min(3,this.fieldErrors[field]);const rows=field==='partA'?this.split:this.rows-this.split;
            const message=level===1?`Look at this part: ${rows} rows of ${this.columns}. Use Show how if you need a method.`:level===2?`Try counting the rows by ${this.columns}s. Show how will highlight each row: ${Array(rows).fill(this.columns).join(' + ')}.`:`Follow the row totals: ${Array.from({length:rows},(_,i)=>(i+1)*this.columns).join(' → ')}. Enter the last total.`;
            this.showFeedback(field,'wrong_subfact',level,message);
          }
        }
        if(!allCorrect){this.errors++;return;}
        this.partialReady=true;this.refreshWork();this.drawArray();this.shadowRoot.querySelector('[data-action="join"]')?.focus({preventScroll:true});return;
      }
      const groups=this.allocations.map(g=>g.length);
      const correct=this.pool.length===0&&groups.every(size=>size===this.challenge.columns);
      this.log('answer_submitted',{groups,remaining:this.pool.length,correct});
      if(correct){if(this.challenge.type==='inverse')this.revealInverse();else{this.showFeedback('array','success',0,'Every row is equal. All the dots are shared.');this.complete();}}
      else{
        this.errors++;const level=Math.min(3,this.errors);
        const message=level===1?'Look at the rows. Are they equal, with no dots left over?':level===2?`Your rows hold ${groups.join(', ')}. Share the remaining dots, or move dots from longer rows to shorter rows.`:`Share one dot into each row at a time. ${this.challenge.total} objects shared across ${this.rows} rows makes ${this.challenge.columns} in each.`;
        this.showFeedback('array','wrong_equal_groups',level,message);
      }
    }
    join(guide) {
      if(this.joining||(!guide&&(!this.partialReady||!this.split))||(guide&&this.guideStep!==5))return;
      this.cancelSupport();this.save();this.joining=true;
      const parts=guide?[5,1]:[this.split,this.rows-this.split];this.lastStrategy=parts;
      const a=parts[0]*this.columns,b=parts[1]*this.columns,total=a+b;
      this.log('control_changed',{control:'join',split:parts});
      this.shadowRoot.querySelectorAll('[data-work] button').forEach(button=>{button.disabled=true;});
      const relation=this.shadowRoot.querySelector('[data-relation]');
      relation.setAttribute('aria-live','polite');
      const sources=['left','right'].map(side=>this.shadowRoot.querySelector(`[data-part-value="${side}"]`));
      const origins=sources.map(el=>el?.getBoundingClientRect());
      this.shadowRoot.querySelector('.content').classList.add('joining');
      relation.classList.add('join-gather');
      relation.innerHTML=this.joinEquation(a,b,false);
      const sum=relation.querySelector('.sum-prefix');
      sum.innerHTML='<span data-math-slot="left"></span><span class="math-token math-hidden" data-math="plus">+</span><span data-math-slot="right"></span><span class="math-token math-hidden" data-math="equals">=</span>';
      const totalNode=relation.querySelector('[data-math="total"]');
      totalNode.dataset.math='pending-total';totalNode.classList.remove('sum-result');totalNode.classList.add('math-hidden');
      sources.forEach((source,i)=>{
        const side=i?'right':'left',number=source||document.createElement('strong');
        number.textContent=String(i?b:a);number.dataset.math=side;number.className='part-moving';
        relation.querySelector(`[data-math-slot="${side}"]`).replaceWith(number);
        this.moveMathNumber(number,origins[i],i*STAGGER_SHORT);
      });
      this.later(STAGGER_SHORT*2,()=>relation.querySelector('[data-math="plus"]').classList.remove('math-hidden'));
      this.later(STAGGER_SHORT*3,()=>{relation.classList.add('math-combine');this.split=0;this.drawArray();});
      const totalAt=STAGGER_SHORT*3+Math.max(JOIN_HOLD,TOKEN_TRAVEL+100);
      const equationAt=totalAt+MATH_REVEAL+RESULT_HOLD;
      this.later(totalAt,()=>{
        relation.querySelector('[data-math="equals"]').classList.remove('math-hidden');
        totalNode.dataset.math='total';totalNode.classList.remove('math-hidden');totalNode.classList.add('sum-result');
      });
      this.later(equationAt,()=>{
        const equation=relation.querySelector('.join-equation');
        equation.classList.add('is-final');
        equation.querySelector('.sum-prefix').setAttribute('aria-hidden','true');
        equation.querySelector('.fact-prefix').removeAttribute('aria-hidden');
      });
      this.later(equationAt+EQUATION_REVEAL,()=>{
        this.joining=false;
        relation.classList.remove('join-gather','math-combine');this.shadowRoot.querySelector('.content').classList.remove('joining');
        if(guide){this.guideJoined=true;this.refreshWork(true);this.drawArray();this.shadowRoot.querySelector('[data-action="start"]')?.focus({preventScroll:true});}
        else{this.joined=true;this.log('feedback_shown',{feedbackType:'success_join',scaffoldLevel:0,relatedField:'array',attemptNumber:this.attempts,timestamp:new Date().toISOString()});this.complete(true);}
        this.save();
      });
    }
    moveMathNumber(number,origin,delay=0){
      if(!origin||!origin.width||!origin.height||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      const destination=number.getBoundingClientRect();
      number.animate([{transform:`translate(${origin.left-destination.left}px,${origin.top-destination.top}px) scale(${origin.height/destination.height})`,transformOrigin:'top left',opacity:1},{transform:'translate(0,0) scale(1)',transformOrigin:'top left',opacity:1}],{duration:700,delay,easing:MOTION_EASE,fill:'backwards'});
    }
    joinEquation(a,b,final) {
      return `<div class="join-equation ${final?'is-final':''}"><span class="join-prefix"><span class="sum-prefix" ${final?'aria-hidden="true"':''}>${a} + ${b} =</span><span class="fact-prefix" ${final?'':'aria-hidden="true"'}>${this.rows} × ${this.columns} =</span></span><strong class="sum-result" data-math="total">${a+b}</strong></div>`;
    }

    later(delay, callback) {
      const timer=setTimeout(()=>{this.motionTimers.delete(timer);if(this.isConnected)callback();},delay);
      this.motionTimers.add(timer);return timer;
    }
    cancelMotion() { this.motionTimers?.forEach(clearTimeout);this.motionTimers?.clear();this.joining=false; }
    dismissAttention() {
      this.activityVersion++;
      this.shadowRoot.querySelector('.playground')?.classList.remove('helper-present');
      clearTimeout(this.cueTimer);
      this.shadowRoot.querySelectorAll('.attention').forEach(el=>{el.classList.remove('attention');el.classList.add('attention-dismissed');});
    }
    armAttention() {
      clearTimeout(this.cueTimer);
      let selector,name;
      if((this.stage==='GUIDE'&&this.guideStep===4)||(this.stage==='PLAY'&&this.mode==='split'&&!this.split)){selector='.cut.recommended';name='splitCueShown';}
      else if(this.stage==='PLAY'&&this.challenge?.type==='inverse'&&this.pool.length){selector='[data-action="deal"]';name='addOneCueShown';}
      else if(this.stage==='PLAY'&&this.challenge?.type==='build'&&this.pool.length){selector='.lane-add:not(:disabled)';name='plusDotCueShown';}
      if(!selector)return;
      const version=this.activityVersion;
      if(name==='splitCueShown')this.later(700,()=>{if(version===this.activityVersion)this.showAttention(selector,name,'entry');});
      else this.showAttention(selector,name,'entry');
      this.cueTimer=setTimeout(()=>{if(version===this.activityVersion&&this.isConnected)this.showAttention(selector,name,'idle');},IDLE_CUE);
    }
    showAttention(selector,name,trigger) {
      const key=name+':'+trigger;
      if(this.attentionCues[key])return;
      const target=this.shadowRoot.querySelector(selector);if(!target||target.disabled)return;
      this.attentionCues[key]=true;
      target.classList.remove('attention-dismissed','attention');void target.offsetWidth;target.classList.add('attention');
      if(trigger==='idle'){const field=this.shadowRoot.querySelector('.playground');field?.classList.add('helper-present');this.later(1800,()=>field?.classList.remove('helper-present'));}
      this.log('attention_cue_shown',{attentionCueShown:true,cueType:name,[name]:true,trigger});this.save();
    }
    flashSharing() {
      const array=this.shadowRoot.querySelector('.array');
      array.querySelectorAll('.share-plus').forEach(el=>el.remove());
      this.allocations.forEach((group,r)=>{const el=document.createElement('span');el.className='share-plus';el.textContent='+1';el.style.left=`${this.fieldGeometry.groupX+group.length*this.fieldGeometry.gap+8}px`;el.style.top=`${this.fieldGeometry.groupY+r*this.fieldGeometry.rowGap+12}px`;array.append(el);});
      this.later(MOTION_MATH,()=>array.querySelectorAll('.share-plus').forEach(el=>el.remove()));
      const remaining=this.shadowRoot.querySelector('[data-relation] strong');remaining?.classList.add('math-token');
    }
    revealGuideParts() {
      this.save();this.joining=true;
      const relation=this.shadowRoot.querySelector('[data-relation]');
      relation.innerHTML='<span class="part math-token">5 × 4 = 20</span>';
      const join=this.shadowRoot.querySelector('[data-action="guide-join"]');join.disabled=true;
      this.later(STAGGER_SHORT,()=>relation.insertAdjacentHTML('beforeend','<span class="math-token">+</span>'));
      this.later(STAGGER_SHORT*2,()=>relation.insertAdjacentHTML('beforeend','<span class="part blue math-token">1 × 4 = 4</span>'));
      this.later(STAGGER_SHORT*3,()=>{this.joining=false;join.disabled=false;this.save();});
    }
    revealInverse() {
      this.save();this.joining=true;
      const relation=this.shadowRoot.querySelector('[data-relation]');relation.setAttribute('aria-live','polite');
      this.shadowRoot.querySelectorAll('[data-work] button').forEach(b=>{b.disabled=true;});
      relation.innerHTML='<strong class="math-token">4 × 6 = 24</strong>';
      this.later(450,()=>relation.insertAdjacentHTML('beforeend','<span class="math-token">↔</span>'));
      this.later(450+350,()=>relation.insertAdjacentHTML('beforeend','<strong class="math-token">24 ÷ 4 = 6</strong>'));
      this.later(450+350+EQUATION_HOLD,()=>{this.joining=false;this.log('feedback_shown',{feedbackType:'success_inverse',scaffoldLevel:0,relatedField:'array'});this.complete();this.save();});
    }
    supportControl(field) {
      if(this.partialReady)return '';
      return `${this.button('show-how','Show how · count the rows','support-link',`data-field="${field}" aria-label="Show how for the ${field==='partA'?'first':'second'} part"`)}<div class="support-live" data-support="${field}" role="status" aria-live="polite"></div>`;
    }
    cancelSupport() {
      this.supportToken=(this.supportToken||0)+1;
      this.supportTimers?.forEach(clearTimeout);this.supportTimers=[];this.supportPlaying=false;
      this.shadowRoot?.querySelectorAll('.count-active').forEach(el=>el.classList.remove('count-active'));
      this.shadowRoot?.querySelectorAll('.support-live').forEach(el=>{el.textContent='';});
      this.shadowRoot?.querySelectorAll('[type="submit"]').forEach(el=>{el.disabled=false;});
    }
    showSupport(field) {
      if(this.stage!=='PLAY'||this.mode!=='split'||!this.split||this.partialReady||!['partA','partB'].includes(field))return;
      this.cancelSupport();this.clearFeedback(field);
      this.hintCount++;this.highestScaffoldLevel=Math.max(this.highestScaffoldLevel,2);
      this.strategySupport[field]={used:true,type:'skip_count',completed:false,split:this.split};
      this.log('support_opened',{supportOpened:true,supportType:'skip_count',relatedField:field,strategySupportUsed:true});
      this.log('hint_requested',{supportType:'skip_count',relatedField:field});
      this.save();this.supportPlaying=true;
      const token=this.supportToken;
      const start=field==='partA'?0:this.split,rows=field==='partA'?this.split:this.rows-this.split;
      const live=this.shadowRoot.querySelector(`[data-support="${field}"]`);
      this.shadowRoot.querySelector('[type="submit"]').disabled=true;
      let totals=[];
      const step=index=>{
        if(token!==this.supportToken||!this.isConnected)return;
        this.shadowRoot.querySelectorAll('.count-active').forEach(el=>el.classList.remove('count-active'));
        for(let c=0;c<this.columns;c++)this.shadowRoot.querySelector(`[data-key="dot-${start+index}-${c}"]`)?.classList.add('count-active');
        totals.push((index+1)*this.columns);live.textContent=totals.join(' → ');
        if(index+1<rows)this.supportTimers.push(setTimeout(()=>step(index+1),MOTION_NORMAL+STAGGER_SHORT));
        else this.supportTimers.push(setTimeout(()=>{
          if(token!==this.supportToken)return;
          this.supportPlaying=false;this.strategySupport[field].completed=true;
          this.log('support_completed',{supportCompleted:true,supportType:'skip_count',relatedField:field,rowTotals:totals});
          this.shadowRoot.querySelector('[type="submit"]').disabled=false;
          this.shadowRoot.querySelectorAll('.count-active').forEach(el=>el.classList.remove('count-active'));
          this.shadowRoot.querySelector(`[name="${field}"]`)?.focus({preventScroll:true});this.save();
        },MOTION_NORMAL+STAGGER_SHORT));
      };
      step(0);
    }
    complete(preserveRelation = false) {
      if(this.stage!=='PLAY'||(this.mode==='split'&&!this.joined))return;
      const independent=this.errors===0&&this.hintCount===0&&this.highestScaffoldLevel===0;
      const supportUsed=Object.values(this.strategySupport).some(s=>s.used);
      const summary={attentionCueShown:Object.keys(this.attentionCues).length>0,splitCueShown:Object.keys(this.attentionCues).some(k=>k.startsWith('splitCueShown')),addOneCueShown:Object.keys(this.attentionCues).some(k=>k.startsWith('addOneCueShown')),plusDotCueShown:Object.keys(this.attentionCues).some(k=>k.startsWith('plusDotCueShown')),strategySupportUsed:supportUsed,strategySupportType:supportUsed?'skip_count':null,supportUsed,supportType:supportUsed?'skip_count':null,supportCompleted:Object.values(this.strategySupport).some(s=>s.completed),partial1Attempts:this.partialAttempts.partA,partial2Attempts:this.partialAttempts.partB,partial1Outcome:this.partialOutcomes.partA||null,partial2Outcome:this.partialOutcomes.partB||null,selectedSplit:this.mode==='split'?this.lastStrategy:null,challengeId:this.challenge.id,challengeType:this.challenge.type,skill:this.challenge.skill,factors:[this.rows,this.columns],firstTryCorrect:this.errors===0,independentSuccess:independent,finalSuccess:true,attemptCount:this.attempts,hintCount:this.hintCount,highestScaffoldLevel:this.highestScaffoldLevel,selfCorrected:this.selfCorrected&&this.errors>0,selectedSplitStrategy:this.mode==='split'?this.lastStrategy:null,subfactAccuracy:this.subfactChecks?this.subfactCorrect/this.subfactChecks:null,completionTimeMs:Date.now()-this.startedAt,completedAt:new Date().toISOString(),incorrectAttempts:this.errors,policy:this.challenge.policy};
      this.history.push(summary);this.learnerState=engine.recordCompletion(this.learnerState,summary);this.log('challenge_completed',summary);this.stage='FEEDBACK';
      this.refreshWork(preserveRelation);this.drawArray();
      this.shadowRoot.querySelector('.content').classList.add('resolved');
      this.shadowRoot.querySelectorAll('.track i').forEach((el,i)=>{el.classList.toggle('done',i<this.history.length);el.classList.remove('current');});
      const next=this.shadowRoot.querySelector('[data-action="continue"]');
      if(next){next.disabled=true;this.later(750,()=>{next.disabled=false;next.focus({preventScroll:true});});}
      this.dispatchEvent(new CustomEvent('challenge-complete',{detail:summary,bubbles:true,composed:true}));
    }
  }

  if (!customElements.get('array-architects')) customElements.define('array-architects', ArrayArchitects);
})();
