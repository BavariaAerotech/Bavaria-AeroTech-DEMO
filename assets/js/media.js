(()=>{
  const root=document.body.dataset.root||"";
  const lang=()=>localStorage.getItem('bat-lang')||'de';
  const updateDebug=(img,item)=>{
    const debug=img.closest('.media-frame,.media-placeholder')?.querySelector('.media-debug');
    if(debug)debug.textContent=`${img.dataset.media} · ${img.dataset.expected} · ${item.format} · ${img.dataset.status}`;
  };
  const ensureHangarGallery=()=>{
    if(document.body.dataset.page!=='hub')return;
    const primary=document.querySelector('img[data-media="greenHub"]');
    const figure=primary?.closest('.media-frame');
    if(!primary||!figure)return;
    figure.classList.add('hangar-gallery');
    if(!figure.querySelector('[data-media="greenHubAerial"]')){
      const aerial=document.createElement('img');
      aerial.dataset.media='greenHubAerial';
      aerial.src=`${root}assets/images/placeholders/green-hub-placeholder.svg`;
      aerial.width=1200;
      aerial.height=675;
      primary.after(aerial);
    }
    const captions={
      de:'Geplanter Haupt-Hangar · Konzeptvisualisierung · kein bestehendes Objekt',
      en:'Planned main hangar · concept visualization · not an existing facility',
      uk:'Запланований основний ангар · концептуальна візуалізація · об’єкт ще не існує'
    };
    const caption=figure.querySelector('.media-caption');
    if(caption)caption.textContent=captions[lang()]||captions.de;
  };
  const refresh=()=>{
    ensureHangarGallery();
    document.querySelectorAll('[data-media]').forEach(async img=>{
      const item=window.MEDIA_MANIFEST?.[img.dataset.media];
      if(!item)return;
      const resolve=path=>path.startsWith('http')?path:root+path;
      const finalSrc=resolve(item.src);
      const fallbackSrc=resolve(item.fallback);
      img.alt=item.alt[lang()]||item.alt.de;
      if(img.dataset.media==='hydroProduct'){
        const captions={de:'Reale Referenzaufnahme · hydroponisches Grünfutter',en:'Real reference image · hydroponic green fodder',uk:'Реальне референсне фото · гідропонічний зелений корм'};
        const caption=img.closest('.media-frame')?.querySelector('.media-caption');
        if(caption)caption.textContent=captions[lang()]||captions.de;
      }
      if(img.dataset.media==='inspection'){
        const captions={de:'Referenzdarstellung · Inspektions- und Kartierungsanwendung',en:'Reference image · inspection and mapping application',uk:'Референсне зображення · інспекція та картографування'};
        const caption=img.closest('.media-frame')?.querySelector('.media-caption');
        if(caption)caption.textContent=captions[lang()]||captions.de;
      }
      if(img.dataset.media==='droneService'){
        const captions={de:'Referenzaufnahme · professioneller Agrardrohneneinsatz',en:'Reference image · professional agricultural drone operation',uk:'Референсне фото · професійна робота агродрона'};
        const caption=img.closest('.media-frame')?.querySelector('.media-caption');
        if(caption)caption.textContent=captions[lang()]||captions.de;
      }
      img.dataset.expected=finalSrc;
      img.dataset.status='placeholder';
      if(img.getAttribute('src')!==fallbackSrc)img.src=fallbackSrc;
      updateDebug(img,item);
      if(item.useFinal!==true)return;
      try{
        const response=await fetch(finalSrc,{method:'HEAD',cache:'no-store'});
        if(response.ok){
          img.src=finalSrc;
          img.dataset.status='final image loaded';
          updateDebug(img,item);
        }
      }catch(error){/* Missing or offline final media intentionally keeps the local fallback. */}
    });
  };
  if(new URLSearchParams(location.search).get('showPlaceholders')==='1')document.documentElement.classList.add('show-placeholders');
  document.addEventListener('DOMContentLoaded',refresh);
  document.addEventListener('bat:languagechange',refresh);
})();
