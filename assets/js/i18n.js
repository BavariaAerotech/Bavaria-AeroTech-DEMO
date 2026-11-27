(()=>{
  const root=document.body.dataset.root||'';
  const storageKey='bat-lang';
  const originalText=new WeakMap();
  const originalAttributes=new WeakMap();
  let dictionary={};
  let automatic={};
  let activeLanguage='de';
  let mutationObserver;
  let loadSequence=0;
  let initialised=false;
  let automaticPromise;
  const pageMetaOverrides={'souveraen-ai':{de:{title:'SOUVERÄN-AI | Bavaria AeroTech',description:'Forschungskonzept für eine lokal lernende KI-Architektur mit erfahrungsbasierter Anpassung.'},en:{title:'SOUVERÄN-AI | Bavaria AeroTech',description:'Research concept for a locally learning AI architecture with experience-based adaptation.'},uk:{title:'SOUVERÄN-AI | Bavaria AeroTech',description:'Дослідницька концепція архітектури ШІ з локальним навчанням на досвіді.'}},agritech:{de:{title:'Agrartechnologie | Bavaria AeroTech',description:'Pilotvorhaben für hydroponisches Grünfutter und Agrardrohnen in Vorbereitung.'},en:{title:'Agricultural technology | Bavaria AeroTech',description:'Pilot projects for hydroponic green fodder and agricultural drones in preparation.'},uk:{title:'Агротехнології | Bavaria AeroTech',description:'Підготовка пілотних проєктів із гідропонного корму й агродронів.'}},project:{de:{title:'Projektanfrage | Bavaria AeroTech Solutions UG',description:'Projektanfrage an Bavaria AeroTech Solutions UG für SOUVERÄN-AI-Forschung, Agrartechnologie, Hydroponik, Agrardrohnen, technische Inspektionen und Green Hub-Partnerschaften.'},en:{title:'Project enquiry | Bavaria AeroTech Solutions UG',description:'Enquiry to Bavaria AeroTech Solutions UG about SOUVERÄN-AI research, agricultural technology, hydroponics, agricultural drones, technical inspections and Green Hub partnerships.'},uk:{title:'Проєктний запит | Bavaria AeroTech Solutions UG',description:'Запит до Bavaria AeroTech Solutions UG щодо досліджень SOUVERÄN-AI, агротехнологій, гідропоніки, агродронів, технічних інспекцій і партнерств Green Hub.'}} ,company:{de:{title:'Unternehmen | Bavaria AeroTech Solutions UG',description:'Bavaria AeroTech Solutions UG in Abenberg: Unternehmensansatz, Entwicklungsfelder, Technologiekooperation und aktueller Projektstatus.'},en:{title:'Company | Bavaria AeroTech Solutions UG',description:'Bavaria AeroTech Solutions UG in Abenberg: company approach, development areas, technology cooperation and current project status.'},uk:{title:'Компанія | Bavaria AeroTech Solutions UG',description:'Bavaria AeroTech Solutions UG в Абенберзі: підхід компанії, напрями розвитку, технологічна співпраця та поточний статус проєкту.'}}};
  const nonTranslatable=new Set(['Bavaria AeroTech','Bavaria AeroTech Solutions','Bavaria AeroTech Solutions UG','Bavaria AeroTech Solutions UG (haftungsbeschränkt)','Green Hub','DroneUA','DJI Agras','DJI Agras T25','Christina Botnari','Eduard Botnari']);

  const get=(object,path)=>path.split('.').reduce((value,part)=>value?.[part],object);
  const translationIndex=language=>language==='en'?0:language==='uk'?1:-1;
  const translate=(value,language)=>{
    const index=translationIndex(language);
    return index<0?value:(automatic[value]?.[index]||value);
  };
  const skipText=node=>node.parentElement?.closest('script,style,noscript,svg,[data-i18n],[aria-hidden="true"],.media-debug');
  const localizeTextNode=(node,language,unresolved)=>{
    if(skipText(node))return;
    if(!originalText.has(node)){
      const match=node.nodeValue.match(/^(\s*)(.*?)(\s*)$/s);
      if(!match?.[2])return;
      originalText.set(node,{prefix:match[1],value:match[2],suffix:match[3]});
    }
    const source=originalText.get(node);
    const output=translate(source.value,language);
    if(node.nodeValue!==source.prefix+output+source.suffix)node.nodeValue=source.prefix+output+source.suffix;
    if(language!=='de'&&output===source.value&&/[A-Za-zÄÖÜäöüß]/.test(source.value)&&!nonTranslatable.has(source.value))unresolved.add(source.value);
  };
  const localizeAttribute=(element,name,language,unresolved)=>{
    if(name==='aria-label'&&element.hasAttribute('data-i18n-aria'))return;
    if(name==='alt'&&element.hasAttribute('data-i18n-alt'))return;
    if(!originalAttributes.has(element))originalAttributes.set(element,{});
    const originals=originalAttributes.get(element);
    if(!(name in originals))originals[name]=element.getAttribute(name);
    const source=originals[name];
    if(!source)return;
    const output=translate(source,language);
    if(element.getAttribute(name)!==output)element.setAttribute(name,output);
    if(language!=='de'&&output===source&&/[A-Za-zÄÖÜäöüß]/.test(source)&&!nonTranslatable.has(source))unresolved.add(source);
  };
  const applyAutomatic=(language,scope=document.body)=>{
    const unresolved=new Set(window.__BAT_I18N_UNRESOLVED||[]);
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
    let node;
    while(node=walker.nextNode())localizeTextNode(node,language,unresolved);
    const elements=[scope,...scope.querySelectorAll?.('[placeholder],[aria-label],[alt],[title]')||[]];
    elements.forEach(element=>['placeholder','aria-label','alt','title'].forEach(name=>{
      if(element.hasAttribute?.(name))localizeAttribute(element,name,language,unresolved);
    }));
    window.__BAT_I18N_UNRESOLVED=[...unresolved].sort((a,b)=>a.localeCompare(b));
  };
  const apply=language=>{
    activeLanguage=language;
    window.__BAT_I18N_UNRESOLVED=[];
    document.documentElement.lang=language==='uk'?'uk':language;
    document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
    document.querySelectorAll('[data-i18n]').forEach(element=>{
      const value=get(dictionary,element.dataset.i18n);
      if(typeof value==='string')element.textContent=value;
      else if(language!=='de')window.__BAT_I18N_UNRESOLVED.push(`[key] ${element.dataset.i18n}`);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element=>{
      const value=get(dictionary,element.dataset.i18nPlaceholder);if(value)element.placeholder=value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element=>{
      const value=get(dictionary,element.dataset.i18nAria);if(value)element.setAttribute('aria-label',value);
    });
    applyAutomatic(language);
    const page=document.body.dataset.page||'home';
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      const value = get(dictionary, element.dataset.i18nAlt);
      if (typeof value === 'string') element.alt = value;
    });
    const override=pageMetaOverrides[page]?.[language];
    const title=override?.title||get(dictionary,`meta.${page}.title`);
    const description=override?.description||get(dictionary,`meta.${page}.description`);
    if(title)document.title=title;
    if(description)document.querySelector('meta[name="description"]')?.setAttribute('content',description);
    const setMeta=(selector,value)=>{if(value)document.querySelector(selector)?.setAttribute('content',value)};
    setMeta('meta[property="og:title"]',title);
    setMeta('meta[property="og:description"]',description);
    setMeta('meta[name="twitter:title"]',title);
    setMeta('meta[name="twitter:description"]',description);
    localStorage.setItem(storageKey,language);
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);
    document.dispatchEvent(new CustomEvent('bat:languagechange',{detail:{lang:language}}));
    mutationObserver?.disconnect();
    mutationObserver=new MutationObserver(records=>records.forEach(record=>{
      if(record.type==='attributes'&&record.attributeName==='aria-hidden'&&record.target.getAttribute('aria-hidden')!=='true')applyAutomatic(activeLanguage,record.target);
      record.addedNodes.forEach(added=>{
        if(added.nodeType===Node.TEXT_NODE)localizeTextNode(added,activeLanguage,new Set());
        else if(added.nodeType===Node.ELEMENT_NODE)applyAutomatic(activeLanguage,added);
      });
    }));
    mutationObserver.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-hidden']});
  };
  const loadAutomatic=()=>{
    if(!automaticPromise)automaticPromise=fetch(`${root}assets/locales/content-auto.json`,{cache:'no-store'}).then(response=>response.ok?response.json():{}).catch(error=>{automaticPromise=null;throw error});
    return automaticPromise;
  };
  const load=async language=>{
    const requestedLanguage=['de','en','uk'].includes(language)?language:'de';
    const request=++loadSequence;
    try{
      const [localeResponse,nextAutomatic]=await Promise.all([
        fetch(`${root}assets/locales/${requestedLanguage}.json`,{cache:'no-store'}),
        loadAutomatic()
      ]);
      if(!localeResponse.ok)throw new Error(localeResponse.status);
      const nextDictionary=await localeResponse.json();
      if(request!==loadSequence)return;
      dictionary=nextDictionary;
      automatic=nextAutomatic;
      apply(requestedLanguage);
    }catch(error){console.warn('Language files unavailable; German HTML fallback remains active.',error)}
  };

  const initialise=()=>{
    if(initialised)return;
    initialised=true;
    if(location.protocol==='file:'){
      console.warn('Localization requires a local HTTP server because browsers block locale JSON fetches from file:// URLs.');
      return;
    }
    document.addEventListener('click',event=>{
      const button=event.target.closest('[data-lang]');
      if(!button||!['de','en','uk'].includes(button.dataset.lang))return;
      event.preventDefault();
      load(button.dataset.lang);
    });
    const requested=new URLSearchParams(location.search).get('lang');
    load(['de','en','uk'].includes(requested)?requested:(localStorage.getItem(storageKey)||'de'));
  };
  initialise();
})();
