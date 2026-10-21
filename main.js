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
