(()=>{
  const map=document.querySelector('[data-company-map]');
  if(!map)return;

  const loadButton=map.querySelector('[data-company-map-load]');
  const frame=map.querySelector('[data-company-map-frame]');
  const address='Am Steig 2F, 91183 Abenberg, Mittelfranken, Bayern, Deutschland';
  const source=`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  let iframe;

  const updateTitle=()=>{
    if(iframe)iframe.title=loadButton?.getAttribute('aria-label')||'Google Maps';
  };
  const loadMap=()=>{
    if(iframe||!frame)return;
    iframe=document.createElement('iframe');
    iframe.src=source;
    iframe.loading='lazy';
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    updateTitle();
    frame.replaceChildren(iframe);
    loadButton.hidden=true;
  };

  loadButton?.addEventListener('click',loadMap,{once:true});
  document.addEventListener('bat:languagechange',updateTitle);
})();
