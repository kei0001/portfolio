document.querySelectorAll('[data-year]').forEach(el=>{el.textContent=String(new Date().getFullYear())});
document.querySelectorAll('.key').forEach(k=>{
 if(k.closest('.km-window'))return;
 k.tabIndex=0;k.setAttribute('role','button');k.setAttribute('aria-label','キー '+k.textContent.trim()+' を選択');
 const select=()=>{const parent=k.closest('.km-crop');if(!parent)return;parent.querySelectorAll('.key').forEach(x=>x.classList.remove('accent'));k.classList.add('accent')};
 k.addEventListener('click',select);k.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}})
});
/* Show once per tab session. Never delay subsequent page transitions. */
(function () {
  const root=document.documentElement;
  const loader=document.getElementById('site-loader');
  if(!root.classList.contains('intro-active')||!loader)return;
  const status=loader.querySelector('[data-loader-status]');
  let finished=false;
  const reveal=function(){
    if(finished)return;
    finished=true;
    const elapsed=performance.now()-(window.__portfolioLoaderStart||performance.now());
    window.setTimeout(function(){
      if(status)status.textContent='ready';
      root.classList.add('intro-exit');
      window.setTimeout(function(){
        root.classList.remove('intro-active','intro-exit');
        loader.remove();
      },210);
    },Math.max(0,390-elapsed));
  };
  if(document.readyState==='complete')reveal();
  else window.addEventListener('load',reveal,{once:true});
  window.setTimeout(reveal,1100);
})();

/* Figma cover -> one interactive linked Tree with terminal typing. */
(function () {
  'use strict';
  const section=document.getElementById('portfolio-entry');
  if(!section)return;
  const root=document.documentElement;
  const terminal=section.querySelector('.entry-terminal');
  const nav=terminal.querySelector('.tree-nav');
  const prompt=terminal.querySelector('.entry-prompt');
  const typed=terminal.querySelector('#entry-typed');
  const newPrompt=terminal.querySelector('.entry-newprompt');
  const explore=section.querySelector('#entry-explore');
  const skip=section.querySelector('#entry-skip');
  const continueLink=section.querySelector('.entry-continue');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const command='tree -L 3';
  const delays=[78,68,82,74,92,96,73,77,85,69,86,72,82,76,89,80];
  const clamp=n=>Math.min(1,Math.max(0,n));
  const ease=t=>t*t*(3-2*t);
  let rows=[],state='idle',charIndex=0,timer=null,raf=false;

  // Re-use every existing hyperlink: animate its parent row, never a copy.
  const fragment=document.createDocumentFragment();
  nav.innerHTML.trimEnd().split('\n').forEach(line=>{
    const row=document.createElement('span');
    row.className='entry-tree-line';
    row.innerHTML=line||'&nbsp;';
    fragment.appendChild(row);
    rows.push(row);
  });
  nav.replaceChildren(fragment);

  function clearTimer(){if(timer!==null)window.clearTimeout(timer);timer=null}
  function revealRow(i){
    if(state!=='printing')return;
    if(i>=rows.length){
      state='done';
      newPrompt.classList.add('is-visible');
      continueLink.style.display='inline-flex';
      explore.style.display='none';
      return;
    }
    rows[i].classList.add('is-visible');
    timer=window.setTimeout(()=>revealRow(i+1),i===0?170:62);
  }
  function typeCharacter(){
    if(state!=='typing')return;
    typed.textContent+=command.charAt(charIndex++);
    if(charIndex<command.length){
      timer=window.setTimeout(typeCharacter,delays[charIndex%delays.length]);
    }else{
      timer=window.setTimeout(()=>{
        if(state!=='typing')return;
        state='printing';
        prompt.classList.remove('is-typing');
        prompt.classList.add('is-complete');
        revealRow(0);
      },210);
    }
  }
  function start(){
    if(state!=='idle'||reduce.matches)return;
    state='typing';
    terminal.classList.add('nav-ready');
    prompt.classList.add('is-typing');
    timer=window.setTimeout(typeCharacter,140);
  }
  function finishNow(){
    clearTimer();state='done';
    typed.textContent=command;
    prompt.classList.remove('is-typing');
    prompt.classList.add('is-complete');
    rows.forEach(row=>row.classList.add('is-visible'));
    terminal.classList.add('nav-ready');
    newPrompt.classList.add('is-visible');
    continueLink.style.display='inline-flex';
    explore.style.display='none';
  }
  function draw(){
    raf=false;
    if(reduce.matches)return;
    const max=Math.max(1,section.offsetHeight-window.innerHeight);
    const p=clamp(-section.getBoundingClientRect().top/max);
    const heroP=ease(clamp((p-.03)/.36));
    root.style.setProperty('--entry-hero-opacity',String(1-heroP));
    root.style.setProperty('--entry-hero-shift',Math.round(-90*heroP)+'px');
    const termP=ease(clamp((p-.14)/.18));
    root.style.setProperty('--entry-term-opacity',String(termP));
    root.style.setProperty('--entry-term-shift',Math.round(36*(1-termP))+'px');
    root.style.setProperty('--entry-progress',String(p));
    explore.style.opacity=String(1-ease(clamp((p-.07)/.19)));
    explore.style.pointerEvents=p>.26?'none':'auto';
    if(p>=.27)start();
    if(p>=.88&&state!=='done')finishNow();
  }
  function tick(){if(!raf){raf=true;window.requestAnimationFrame(draw)}}
  window.addEventListener('scroll',tick,{passive:true});
  window.addEventListener('resize',tick,{passive:true});
  reduce.addEventListener?.('change',()=>{if(reduce.matches)finishNow();tick()});
  explore.addEventListener('click',()=>{
    if(reduce.matches){terminal.scrollIntoView({behavior:'auto',block:'start'});return}
    const range=Math.max(0,section.offsetHeight-window.innerHeight);
    const top=section.getBoundingClientRect().top+window.scrollY+range*.46;
    window.scrollTo({top,behavior:'smooth'});
  });
  skip.addEventListener('click',event=>{
    event.preventDefault();
    finishNow();
    if(reduce.matches)terminal.scrollIntoView({behavior:'auto',block:'start'});
    else{
      const range=Math.max(0,section.offsetHeight-window.innerHeight);
      const top=section.getBoundingClientRect().top+window.scrollY+range*.57;
      window.scrollTo({top,behavior:'smooth'});
    }
  });
  if(reduce.matches)finishNow();
  draw();
})();
