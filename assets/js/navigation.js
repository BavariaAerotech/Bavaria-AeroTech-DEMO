(()=>{
  const body=document.body;
  const root=body.dataset.root||"";
  if(!document.querySelector('.skip-link')){const skip=document.createElement('a');skip.className='skip-link';skip.href='#main';skip.textContent='Zum Inhalt springen';body.prepend(skip)}
  if(!document.querySelector('link[data-bat-theme]')){
    const theme=document.createElement('link');
    theme.rel='stylesheet';
    theme.href=`${root}assets/css/site-theme.css?v=20260801-1115`;
    theme.dataset.batTheme='';
    document.head.append(theme);
  }
  const current=body.dataset.page||"home";
  const path=value=>root+value;
  const items=[['agritech','Agrartechnologie','agrartechnologie.html'],['souveraen-ai','SOUVERÄN-AI','souveraen-ai.html'],['company','Unternehmen','unternehmen.html'],['contact','Kontakt','kontakt.html']];
  const navI18nKey={'souveraen-ai':'souveraenAi'};
  const links=items.map(([key,label,url])=>`<a href="${path(url)}" ${current===key?'aria-current="page"':''} data-nav="${key}" data-i18n="nav.${navI18nKey[key]||key}">${label}</a>`).join('');
  const mobileLink=(key,label,url,i18n=`nav.${key}`)=>`<a href="${path(url)}" ${current===key?'aria-current="page"':''} data-nav="${key}" data-i18n="${i18n}">${label}</a>`;
  const mobileLinks=`
    <section class="mobile-nav-group"><span class="mobile-nav-heading" data-i18n="nav.overview">Übersicht</span>${mobileLink('home','Startseite','index.html')}${mobileLink('agritech','Agrartechnologie','agrartechnologie.html','nav.agritech')}${mobileLink('souveraen-ai','SOUVERÄN-AI','souveraen-ai.html','nav.souveraenAi')}</section>
    <section class="mobile-nav-group"><span class="mobile-nav-heading" data-i18n="nav.company">Unternehmen</span>${mobileLink('company','Unternehmen','unternehmen.html')}${mobileLink('hub','Green Hub','green-hub.html')}${mobileLink('cooperation','Kooperation','kooperation.html','nav.cooperation')}${mobileLink('contact','Kontakt','kontakt.html')}${mobileLink('project','Projektanfrage senden','projektanfrage.html','nav.inquiry')}</section>`;

  const header=document.querySelector('[data-site-header]');
  if(header)header.innerHTML=`<div class="container header-inner"><button class="menu-toggle" type="button" aria-controls="mobile-nav-drawer" aria-expanded="false" aria-label="Navigation öffnen"><span aria-hidden="true">☰</span></button><a class="brand" href="${path('index.html')}" aria-label="Bavaria AeroTech Startseite"><img src="${path('assets/brand/logo-horizontal.svg')}" width="390" height="82" alt="Bavaria AeroTech Solutions"></a><nav class="site-nav desktop-nav" aria-label="Hauptnavigation">${links}</nav><div class="header-actions"><div class="lang-switch" aria-label="Sprache"><button type="button" data-lang="de" aria-pressed="true">DE</button><button type="button" data-lang="en" aria-pressed="false">EN</button><button type="button" data-lang="uk" aria-pressed="false">UA</button></div><a class="btn btn--primary" href="${path('projektanfrage.html')}" data-i18n="nav.inquiry">Projektanfrage senden</a></div></div>`;

  const drawer=document.createElement('nav');
  drawer.className='mobile-nav-drawer';
  drawer.id='mobile-nav-drawer';
  drawer.setAttribute('aria-label','Mobile Navigation');
  drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML=mobileLinks;
  document.body.append(drawer);

  const footer=document.querySelector('[data-site-footer]');
  const footerLink=(url,key,label)=>`<li><a href="${path(url)}" data-i18n="${key}">${label}</a></li>`;
  if(footer) footer.innerHTML=`
    <div class="container">
      <div class="footer-intro">
        <a class="footer-brand" href="${path('index.html')}">
          <img src="${path('assets/brand/logo-horizontal-light.svg')}" width="260" height="55" alt="Bavaria AeroTech Solutions" loading="lazy" decoding="async">
        </a>
        <p class="small" data-i18n="footer.claim">Bavaria AeroTech erforscht SOUVERÄN-AI und bereitet landwirtschaftliche Pilotvorhaben vor.</p>
      </div>
      <div class="footer-grid">
        <nav aria-labelledby="footer-focus">
          <h2 id="footer-focus" data-i18n="footer.focus">Schwerpunkte</h2>
          <ul>
            ${footerLink('agrartechnologie.html','nav.agritech','Agrartechnologie')}
            ${footerLink('souveraen-ai.html','nav.souveraenAi','SOUVERÄN-AI')}
          </ul>
        </nav>
        <nav aria-labelledby="footer-company">
          <h2 id="footer-company" data-i18n="nav.company">Unternehmen</h2>
          <ul>
            ${footerLink('unternehmen.html','footer.about','Über uns')}
            ${footerLink('green-hub.html','nav.hub','Green Hub')}
            ${footerLink('kooperation.html','nav.cooperation','Kooperation')}
            ${footerLink('medien.html','nav.media','Medien')}
          </ul>
        </nav>
        <div class="footer-contact">
          <h2 data-i18n="nav.contact">Kontakt</h2>
          <address class="small">
            Am Steig 2F<br>91183 Abenberg<br>
            <a href="mailto:info@bavaria-aerotech.de">info@bavaria-aerotech.de</a><br>
            <a href="tel:+4915110609744">+49 151 10609744</a>
          </address>
          <a class="footer-inquiry" href="${path('projektanfrage.html')}" data-i18n="nav.inquiry">Projektanfrage senden</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Bavaria AeroTech Solutions UG</span>
        <span class="footer-legal"><a href="${path('impressum.html')}">Impressum</a><a href="${path('datenschutz.html')}">Datenschutz</a></span>
      </div>
    </div>
  `;

  const toggle=document.querySelector('.menu-toggle');
  const menuLabels={de:{open:'Navigation öffnen',close:'Navigation schließen',drawer:'Mobile Navigation'},en:{open:'Open navigation',close:'Close navigation',drawer:'Mobile navigation'},uk:{open:'Відкрити навігацію',close:'Закрити навігацію',drawer:'Мобільна навігація'}};
  const setMenuState=open=>{
    const labels=menuLabels[document.documentElement.lang]||menuLabels.de;
    toggle?.setAttribute('aria-expanded',String(open));
    toggle?.setAttribute('aria-label',open?labels.close:labels.open);
    toggle?.querySelector('span')?.replaceChildren(open?'×':'☰');
    drawer.setAttribute('aria-label',labels.drawer);
  };
  setMenuState(false);
  const backdrop=document.createElement('div');
  backdrop.className='nav-backdrop';
  backdrop.hidden=true;
  document.body.append(backdrop);
  let returnFocus=null;
  let documentOverflow='';
  let lockedScroll=0;
  const pageContent=()=>[...document.body.children].filter(element=>element!==header&&element!==drawer&&element!==backdrop);

  const setDrawerTop=()=>{
    const height=Math.ceil(header?.getBoundingClientRect().height||72);
    drawer.style.setProperty('--drawer-top',`${height}px`);
    backdrop.style.setProperty('--drawer-top',`${height}px`);
  };
  const focusable=()=>[...drawer.querySelectorAll('a,button:not([disabled])')].filter(element=>element.offsetParent!==null);
  const lockPage=()=>{
    lockedScroll=window.scrollY;
    documentOverflow=document.documentElement.style.overflow;
    document.documentElement.style.overflow='hidden';
    pageContent().forEach(element=>{element.inert=true});
    body.classList.add('nav-open');
  };
  const unlockPage=()=>{
    body.classList.remove('nav-open');
    document.documentElement.style.overflow=documentOverflow;
    pageContent().forEach(element=>{element.inert=false});
    requestAnimationFrame(()=>window.scrollTo(0,lockedScroll));
  };
  const closeMenu=(restore=true)=>{
    if(!drawer.classList.contains('is-open'))return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
    setMenuState(false);
    backdrop.classList.remove('is-visible');
    unlockPage();
    setTimeout(()=>{backdrop.hidden=true},280);
    if(restore&&returnFocus) returnFocus.focus();
  };
  const openMenu=()=>{
    returnFocus=document.activeElement;
    setDrawerTop();
    lockPage();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    setMenuState(true);
    backdrop.hidden=false;
    requestAnimationFrame(()=>backdrop.classList.add('is-visible'));
    setTimeout(()=>focusable()[0]?.focus(),80);
  };

  document.addEventListener('click',event=>{
    if(event.target.closest('.menu-toggle')){drawer.classList.contains('is-open')?closeMenu():openMenu();return}
    const dropdownButton=event.target.closest('.desktop-nav .nav-dropdown>button');
    if(dropdownButton){const dropdown=dropdownButton.closest('.nav-dropdown');const open=dropdown.classList.toggle('is-open');dropdownButton.setAttribute('aria-expanded',String(open));return}
    if(event.target.closest('.mobile-nav-drawer a'))closeMenu(false);
    if(!event.target.closest('.desktop-nav .nav-dropdown'))document.querySelectorAll('.desktop-nav .nav-dropdown.is-open').forEach(dropdown=>{dropdown.classList.remove('is-open');dropdown.querySelector('button')?.setAttribute('aria-expanded','false')});
  });
  backdrop.addEventListener('click',()=>closeMenu());
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeMenu();document.querySelectorAll('.desktop-nav .nav-dropdown.is-open').forEach(dropdown=>{dropdown.classList.remove('is-open');dropdown.querySelector('button')?.setAttribute('aria-expanded','false')})}
    if(event.key==='Tab'&&drawer.classList.contains('is-open')){
      const elements=focusable();if(!elements.length)return;const first=elements[0],last=elements.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    }
  });
  addEventListener('resize',()=>{if(innerWidth>1380)closeMenu(false);else if(drawer.classList.contains('is-open'))setDrawerTop()},{passive:true});
  if(header&&'ResizeObserver' in window)new ResizeObserver(()=>{if(drawer.classList.contains('is-open'))setDrawerTop()}).observe(header);

  if(header){
    const updateHeader=()=>{
      if(body.classList.contains('nav-open'))return;
      if(current!=='home'){header.classList.remove('site-header--overlay');header.classList.add('site-header--solid');return}
      const solid=window.scrollY>80;
      header.classList.toggle('site-header--solid',solid);
      header.classList.toggle('site-header--overlay',!solid);
      document.querySelector('.scroll-cue')?.classList.toggle('is-hidden',window.scrollY>innerHeight*.28);
    };
    updateHeader();
    addEventListener('scroll',updateHeader,{passive:true});
  }
  document.addEventListener('bat:languagechange',()=>setMenuState(drawer.classList.contains('is-open')));
})();
