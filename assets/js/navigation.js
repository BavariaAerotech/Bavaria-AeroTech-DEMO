(()=>{
  const body=document.body;
  const root=body.dataset.root||"";
  if(!document.querySelector('link[data-bat-theme]')){
    const theme=document.createElement('link');
    theme.rel='stylesheet';
    theme.href=`${root}assets/css/site-theme.css?v=20260727-1230`;
    theme.dataset.batTheme='';
    document.head.append(theme);
  }
  const current=body.dataset.page||"home";
  const path=value=>root+value;
  const solutionMenu=`<div class="nav-dropdown"><button type="button" data-i18n="nav.solutions" aria-expanded="false">Geschäftsbereiche <span aria-hidden="true">⌄</span></button><div class="nav-menu"><a href="${path('loesungen/gruenfutter.html')}" data-i18n="nav.fodder">Hydroponik</a><a href="${path('loesungen/agrardrohnen.html')}" data-i18n="nav.drones">Agrardrohnen</a><a href="${path('loesungen/inspektionen.html')}" data-i18n="nav.inspections">Drohneninspektion</a></div></div>`;
  const items=[['home','Startseite','index.html'],['solutions','Geschäftsbereiche',null],['hub','Green Hub','green-hub.html'],['company','Unternehmen','unternehmen.html'],['contact','Kontakt','kontakt.html']];
  const links=items.map(([key,label,url])=>key==='solutions'?solutionMenu:`<a href="${path(url)}" ${current===key?'aria-current="page"':''} data-nav="${key}" data-i18n="nav.${key}">${label}</a>`).join('');
  const mobileLink=(key,label,url,i18n=`nav.${key}`)=>`<a href="${path(url)}" ${current===key?'aria-current="page"':''} data-nav="${key}" data-i18n="${i18n}">${label}</a>`;
  const mobileLinks=`
    <section class="mobile-nav-group"><span class="mobile-nav-heading" data-i18n="nav.overview">Übersicht</span>${mobileLink('home','Startseite','index.html')}</section>
    <section class="mobile-nav-group"><span class="mobile-nav-heading" data-i18n="nav.solutions">Geschäftsbereiche</span>${mobileLink('fodder','Hydroponik','loesungen/gruenfutter.html','nav.fodder')}${mobileLink('drones','Agrardrohnen','loesungen/agrardrohnen.html','nav.drones')}${mobileLink('inspections','Drohneninspektion','loesungen/inspektionen.html','nav.inspections')}</section>
    <section class="mobile-nav-group"><span class="mobile-nav-heading" data-i18n="nav.company">Unternehmen</span>${mobileLink('hub','Green Hub','green-hub.html')}${mobileLink('company','Unternehmen','unternehmen.html')}${mobileLink('contact','Kontakt','kontakt.html')}</section>`;

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
  if(footer)footer.innerHTML=`<div class="container"><div class="footer-grid"><div><img src="${path('assets/brand/logo-horizontal-light.svg')}" width="260" height="55" alt="Bavaria AeroTech Solutions"><p class="small" data-i18n="footer.claim">Technologie für Landwirtschaft, luftgestützte Datenerfassung und die verantwortungsvolle Entwicklung regionaler Lösungen.</p></div><div><h2 data-i18n="nav.solutions">Geschäftsbereiche</h2><ul><li><a href="${path('loesungen/gruenfutter.html')}" data-i18n="nav.fodder">Hydroponik</a></li><li><a href="${path('loesungen/agrardrohnen.html')}" data-i18n="nav.drones">Agrardrohnen</a></li><li><a href="${path('loesungen/inspektionen.html')}" data-i18n="nav.inspections">Drohneninspektion</a></li></ul></div><div><h2 data-i18n="nav.company">Unternehmen</h2><ul><li><a href="${path('green-hub.html')}">Green Hub</a></li><li><a href="${path('unternehmen.html')}" data-i18n="footer.about">Über uns</a></li><li><a href="${path('kontakt.html')}" data-i18n="nav.contact">Kontakt</a></li></ul></div><div><h2 data-i18n="nav.contact">Kontakt</h2><p class="small">Am Steig 2F<br>91183 Abenberg<br><a href="mailto:info@bavaria-aerotech.de">info@bavaria-aerotech.de</a><br><a href="tel:+4915110609744">+49 151 10609744</a></p><p><a class="text-arrow" href="${path('projektanfrage.html')}" data-i18n="nav.inquiry">Projektanfrage senden</a></p></div></div><div class="footer-bottom"><span>© 2026 Bavaria AeroTech Solutions UG</span><span><a href="${path('impressum.html')}">Impressum</a> · <a href="${path('datenschutz.html')}">Datenschutz</a></span></div></div>`;

  const toggle=document.querySelector('.menu-toggle');
  const backdrop=document.createElement('div');
  backdrop.className='nav-backdrop';
  backdrop.hidden=true;
  document.body.append(backdrop);
  let returnFocus=null;
  let documentOverflow='';
  let lockedScroll=0;

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
    body.classList.add('nav-open');
  };
  const unlockPage=()=>{
    body.classList.remove('nav-open');
    document.documentElement.style.overflow=documentOverflow;
    requestAnimationFrame(()=>window.scrollTo(0,lockedScroll));
  };
  const closeMenu=(restore=true)=>{
    if(!drawer.classList.contains('is-open'))return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
    toggle?.setAttribute('aria-expanded','false');
    toggle?.querySelector('span')?.replaceChildren('☰');
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
    toggle?.setAttribute('aria-expanded','true');
    toggle?.querySelector('span')?.replaceChildren('×');
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
    if(event.key==='Escape'){closeMenu();document.querySelectorAll('.desktop-nav .nav-dropdown.is-open').forEach(dropdown=>dropdown.classList.remove('is-open'))}
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
})();
