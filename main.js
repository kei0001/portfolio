document.querySelectorAll('[data-year]').forEach(el=>{el.textContent=String(new Date().getFullYear())});
document.querySelectorAll('.key').forEach(k=>{
 if(k.closest('.km-window'))return;
 k.tabIndex=0;k.setAttribute('role','button');k.setAttribute('aria-label','キー '+k.textContent.trim()+' を選択');
 const select=()=>{const parent=k.closest('.km-crop');if(!parent)return;parent.querySelectorAll('.key').forEach(x=>x.classList.remove('accent'));k.classList.add('accent')};
 k.addEventListener('click',select);k.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}})
});