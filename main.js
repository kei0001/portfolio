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

/* The homepage Tree is the only navigation Tree: its own characters converge on scroll. */
(function(){
  'use strict';
  const section=document.getElementById('portfolio-entry');
  if(!section)return;
  const stage=document.getElementById('entry-stage');
  const wordmark=document.getElementById('entry-identity');
  const nav=section.querySelector('.tree-nav');
  const prompt=document.getElementById('entry-prompt');
  const typed=document.getElementById('entry-typed');
  const bar=document.getElementById('entry-progress-bar');
  const phase=document.getElementById('entry-phase');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const command='tree -L 3';
  const glyphs=[],animations=[];
  let raf=0,resizeRaf=0,currentProgress=-1;
  const hash=n=>{const v=Math.sin(n*127.1+13.7)*43758.5453;return v-Math.floor(v)};
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{const t=clamp(x);return t*t*(3-2*t)};

  // Split the ORIGINAL linked nav into lines, keeping each hyperlink in place.
  const original=nav.innerHTML.trimEnd().split('\n');
  const fragment=document.createDocumentFragment();
  original.forEach(line=>{
    const row=document.createElement('div');
    row.className='entry-tree-line';
    row.innerHTML=line||'&nbsp;';
    row.setAttribute('role','group');
    row.setAttribute('aria-label',row.textContent);
    row.querySelectorAll('a').forEach(link=>link.setAttribute('aria-label',link.textContent));
    fragment.appendChild(row);
  });
  nav.replaceChildren(fragment);
  const links=Array.from(nav.querySelectorAll('a'));
  const rows=Array.from(nav.querySelectorAll('.entry-tree-line'));
  rows.forEach(row=>{
    const walker=document.createTreeWalker(row,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const part=document.createDocumentFragment();
      Array.from(node.textContent).forEach(char=>{
        const el=document.createElement('span');
        el.className='entry-glyph'+(char===' '?' space':'');
        el.textContent=char===' '?String.fromCharCode(160):char;
        el.setAttribute('aria-hidden','true');
        part.appendChild(el);
        glyphs.push(el);
      });
      node.parentNode.replaceChild(part,node);
    });
  });
  function fraction(){
    const base=section.getBoundingClientRect().top+window.scrollY;
    return clamp((window.scrollY-base)/Math.max(1,window.innerHeight*1.04));
  }
  function buildAnimations(){
    animations.forEach(a=>a.cancel());
    animations.length=0;
    stage.classList.remove('is-ready');
    const bounds=stage.getBoundingClientRect();
    const width=bounds.width,height=bounds.height;
    glyphs.forEach((el,i)=>{
      const rect=el.getBoundingClientRect();
      const x=rect.left-bounds.left,y=rect.top-bounds.top;
      const startX=width*(.035+.93*hash(i+7));
      const startY=height*(.055+.88*hash(i+233));
      const dx=startX-x,dy=startY-y;
      const rotation=(hash(i+818)-.5)*48;
      const scale=.64+hash(i+11)*.45;
      const alpha=.12+hash(i+157)*.62;
      const delay=Math.floor(hash(i+38)*240);
      const a=el.animate([
        {transform:'translate3d('+dx.toFixed(2)+'px,'+dy.toFixed(2)+'px,0) rotate('+rotation.toFixed(2)+'deg) scale('+scale.toFixed(2)+')',opacity:el.classList.contains('space')?0:alpha},
        {transform:'translate3d(0,0,0) rotate(0deg) scale(1)',opacity:el.classList.contains('space')?0:1}
      ],{duration:1150,delay,fill:'both',easing:'cubic-bezier(.17,.81,.23,1)'});
      a.pause();a.currentTime=0;animations.push(a);
    });
    stage.classList.add('is-ready');
  }
  function draw(){
    raf=0;
    const p=reduce.matches?1:fraction();
    if(Math.abs(currentProgress-p)<.0005)return;
    currentProgress=p;
    const fade=ease((p-.08)/.40);
    wordmark.style.opacity=String(1-fade);
    wordmark.style.transform='translate3d(-50%,-50%,0) scale('+(1-.04*fade)+')';
    const assembled=ease((p-.17)/.76);
    animations.forEach(a=>a.currentTime=assembled*1390);
    prompt.style.opacity=String(ease((p-.58)/.26));
    typed.textContent=command.slice(0,Math.round(command.length*ease((p-.56)/.34)));
    bar.style.transform='scaleX('+p+')';
    const done=p>=.995;
    stage.classList.toggle('is-complete',done);
    nav.inert=!done;
    links.forEach(link=>{if(done)link.removeAttribute('tabindex');else link.tabIndex=-1});
    phase.textContent=done?'03 — NAVIGATION READY':p>.45?'02 — ALIGNING':'01 — FRAGMENTS';
  }
  function tick(){if(!raf)raf=requestAnimationFrame(draw)}
  function build(){
    currentProgress=-1;
    buildAnimations();
    tick();
  }
  function go(p){
    const base=section.getBoundingClientRect().top+window.scrollY;
    const travel=Math.min(window.innerHeight*1.04,section.offsetHeight-window.innerHeight);
    window.scrollTo({top:base+Math.max(0,travel)*p,behavior:reduce.matches?'auto':'smooth'});
  }
  section.querySelector('#entry-explore').addEventListener('click',()=>go(.98));
  section.querySelector('#entry-skip').addEventListener('click',e=>{e.preventDefault();go(1)});
  window.addEventListener('scroll',tick,{passive:true});
  window.addEventListener('resize',()=>{
    cancelAnimationFrame(resizeRaf);
    resizeRaf=requestAnimationFrame(build);
  },{passive:true});
  reduce.addEventListener?.('change',()=>{build()});
  if(document.fonts?.ready)document.fonts.ready.then(build);
  else build();
})();

/* Follow the active homepage directory as the user scrolls. */
(function(){
  'use strict';
  const pathLabel=document.getElementById('scroll-path');
  if(!pathLabel)return;
  const categories=Array.from(document.querySelectorAll('.category-section')).map(section=>({
    element:section,
    path:section.querySelector('.category-path')?.textContent.trim()
  })).filter(item=>item.path);
  const about=document.getElementById('about');
  const contact=document.getElementById('contact');
  let raf=0;
  let activePath=pathLabel.textContent.trim();
  let cleanupTimer=0;
  const slideMode=new URLSearchParams(window.location.search).get('breadcrumb')==='slide';
  if(slideMode)document.documentElement.classList.add('breadcrumb-slide');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function changePath(nextPath){
    if(nextPath===activePath)return;
    const previousPath=activePath;
    activePath=nextPath;
    window.clearTimeout(cleanupTimer);
    if(reduceMotion.matches){
      pathLabel.textContent=nextPath;
      pathLabel.style.width='';
      return;
    }
    // Keep both labels in the DOM so the old one can fade OUT as the new one fades IN.
    const outgoing=document.createElement('span');
    outgoing.className='scroll-path-outgoing';
    outgoing.textContent=previousPath;
    const incoming=document.createElement('span');
    incoming.className='scroll-path-incoming';
    incoming.textContent=nextPath;
    pathLabel.style.width=Math.max(previousPath.length,nextPath.length)+'ch';
    pathLabel.replaceChildren(outgoing,incoming);
    cleanupTimer=window.setTimeout(()=>{
      pathLabel.textContent=activePath;
      pathLabel.style.width='';
      cleanupTimer=0;
    },slideMode?260:400);
  }
  function update(){
    raf=0;
    const threshold=window.innerHeight*.25;
    let current='~/portfolio';
    categories.forEach(item=>{
      if(item.element.getBoundingClientRect().top<=threshold)current=item.path;
    });
    if(about&&about.getBoundingClientRect().top<=threshold)current='~/portfolio/about';
    // On desktop About and Contact share a row; on mobile they become separate stops.
    if(contact&&about&&contact.getBoundingClientRect().top-about.getBoundingClientRect().top>80&&contact.getBoundingClientRect().top<=threshold){
      current='~/portfolio/contact';
    }
    changePath(current);
  }
  function requestUpdate(){if(!raf)raf=requestAnimationFrame(update)}
  update();
  window.addEventListener('scroll',requestUpdate,{passive:true});
  window.addEventListener('resize',requestUpdate,{passive:true});
})();
