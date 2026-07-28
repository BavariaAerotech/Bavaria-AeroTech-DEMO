(()=>{
  const root=document.body.dataset.root||'';
  const storageKey='bat-lang';
  const originalText=new WeakMap();
  const originalAttributes=new WeakMap();
  let dictionary={};
  let automatic={};
  let activeLanguage='de';
  let mutationObserver;

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
    if(language!=='de'&&output===source.value&&/[A-Za-zÄÖÜäöüß]/.test(source.value))unresolved.add(source.value);
  };
  const localizeAttribute=(element,name,language,unresolved)=>{
    if(name==='aria-label'&&element.hasAttribute('data-i18n-aria'))return;
    if(!originalAttributes.has(element))originalAttributes.set(element,{});
    const originals=originalAttributes.get(element);
    if(!(name in originals))originals[name]=element.getAttribute(name);
    const source=originals[name];
    if(!source)return;
    const output=translate(source,language);
    if(element.getAttribute(name)!==output)element.setAttribute(name,output);
    if(language!=='de'&&output===source&&/[A-Za-zÄÖÜäöüß]/.test(source))unresolved.add(source);
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
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element=>{
      const value=get(dictionary,element.dataset.i18nPlaceholder);if(value)element.placeholder=value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element=>{
      const value=get(dictionary,element.dataset.i18nAria);if(value)element.setAttribute('aria-label',value);
    });
    applyAutomatic(language);
    const page=document.body.dataset.page||'home';
    const title=get(dictionary,`meta.${page}.title`);
    const description=get(dictionary,`meta.${page}.description`);
    if(title)document.title=title;
    if(description)document.querySelector('meta[name="description"]')?.setAttribute('content',description);
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
  const load=async language=>{
    try{
      const [localeResponse,automaticResponse]=await Promise.all([
        fetch(`${root}assets/locales/${language}.json`),
        fetch(`${root}assets/locales/content-auto.json`)
      ]);
      if(!localeResponse.ok)throw new Error(localeResponse.status);
      dictionary=await localeResponse.json();
      if(automaticResponse.ok)automatic=await automaticResponse.json();
      apply(language);
    }catch(error){console.warn('Language files unavailable; German HTML fallback remains active.',error)}
  };

  const initialise=()=>{
    const requested=new URLSearchParams(location.search).get('lang');
    load(['de','en','uk'].includes(requested)?requested:(localStorage.getItem(storageKey)||'de'));
    document.addEventListener('click',event=>{
      const button=event.target.closest('[data-lang]');if(button)load(button.dataset.lang);
    });
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialise,{once:true});
  else initialise();
})();
