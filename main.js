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

/* Figma cover -> per-character terminal command -> existing clickable tree. */
(function(){
  'use strict';
  const section=document.getElementById('portfolio-entry');
  if(!section)return;
  const root=document.documentElement;
  const prompt=section.querySelector('.entry-prompt');
  const typed=section.querySelector('#entry-typed');
  const lines=[...section.querySelectorAll('.entry-result')];
  const newPrompt=section.querySelector('.entry-newprompt');
  const explore=section.querySelector('#entry-explore');
  const continueLink=section.querySelector('.entry-continue');
  const target=document.getElementById('directory');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const command='tree ~/portfolio';
  const delays=[78,68,82,74,92,96,73,77,85,69,86,72,82,76,89,80];
  const clamp=n=>Math.min(1,Math.max(0,n));
  const ease=t=>t*t*(3-2*t);
  let state='idle',chars=0,timer=null,raf=false;
  function reset(){
    if(timer!==null)clearTimeout(timer);
    timer=null;state='idle';chars=0;typed.textContent='';
    prompt.classList.remove('is-typing','is-complete');
    lines.forEach(line=>line.classList.remove('is-visible'));
    newPrompt.classList.remove('is-visible');
    continueLink.style.display='none';
    explore.style.display='';
  }
  function printLine(index){
    if(index>=lines.length){
      state='done';
      newPrompt.classList.add('is-visible');
      continueLink.style.display='inline-flex';
      explore.style.display='none';
      return;
    }
    lines[index].classList.add('is-visible');
    timer=setTimeout(()=>printLine(index+1),index===0?180:105);
  }
  function typeOne(){
    if(state!=='typing')return;
    typed.textContent+=command.charAt(chars++);
    if(chars<command.length){
      timer=setTimeout(typeOne,delays[chars%delays.length]);
    }else{
      timer=setTimeout(()=>{
        if(state!=='typing')return;
        state='printing';
        prompt.classList.remove('is-typing');
        prompt.classList.add('is-complete');
        printLine(0);
      },230);
    }
  }
  function start(){
    if(state!=='idle'||reduce.matches)return;
    state='typing';
    prompt.classList.add('is-typing');
    timer=setTimeout(typeOne,170);
  }
  function draw(){
    raf=false;
    if(reduce.matches)return;
    const max=Math.max(1,section.offsetHeight-window.innerHeight);
    const p=clamp(-section.getBoundingClientRect().top/max);
    const h=ease(clamp((p-.04)/.41));
    root.style.setProperty('--entry-hero-opacity',String(1-h));
    root.style.setProperty('--entry-hero-shift',Math.round(-105*h)+'px');
    const t=ease(clamp((p-.19)/.22));
    root.style.setProperty('--entry-term-opacity',String(t));
    root.style.setProperty('--entry-term-shift',Math.round(36*(1-t))+'px');
    root.style.setProperty('--entry-progress',String(p));
    explore.style.opacity=String(1-ease(clamp((p-.08)/.22)));
    explore.style.pointerEvents=p>.31?'none':'auto';
    if(p>=.33)start();
  }
  function tick(){if(!raf){raf=true;requestAnimationFrame(draw)}}
  window.addEventListener('scroll',tick,{passive:true});
  window.addEventListener('resize',tick,{passive:true});
  reduce.addEventListener?.('change',()=>{
    if(reduce.matches)reset();
    tick();
  });
  explore.addEventListener('click',()=>{
    if(reduce.matches){target.scrollIntoView({behavior:'auto'});return}
    const travel=Math.max(0,section.offsetHeight-window.innerHeight);
    const top=section.getBoundingClientRect().top+window.scrollY+travel*.48;
    window.scrollTo({top,behavior:'smooth'});
  });
  draw();
})();
