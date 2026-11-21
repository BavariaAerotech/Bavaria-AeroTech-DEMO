(()=>{
  if(!document.querySelector('script[src*="assets/js/i18n.js"]')){
    const script=document.createElement('script');
    script.src=`${document.body.dataset.root||''}assets/js/i18n.js`;
    document.head.append(script);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.remove('is-preload')));
    const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
    }),{threshold:.14,rootMargin:'0px 0px -5%'}):null;
    document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('is-visible'));

    const initTabs=list=>{
      const tabs=[...list.querySelectorAll('[role="tab"]')];
      if(!tabs.length)return;
      const group=list.dataset.tablist||'contact';
      const panels=[...document.querySelectorAll(`[data-tabpanel="${group}"]`)];
      if(!panels.length&&list.matches('[data-contact-tabs]')){
        const form=document.querySelector('[data-contact-form]');
        if(form){form.id=form.id||'contact-form';form.setAttribute('data-tabpanel',group);panels.push(form);}
      }
      const panelFor=tab=>panels.find(panel=>panel.id===tab.getAttribute('aria-controls'));
      tabs.forEach((tab,index)=>{
        if(!tab.id)tab.id=`${group}-tab-${index+1}`;
        if(!tab.hasAttribute('aria-controls')&&panels.length===1)tab.setAttribute('aria-controls',panels[0].id);
        tab.setAttribute('tabindex',index===0?'0':'-1');
      });
      panels.forEach((panel,index)=>{
        panel.setAttribute('role','tabpanel');
        panel.setAttribute('tabindex','0');
        const tab=tabs.find(candidate=>candidate.getAttribute('aria-controls')===panel.id)||tabs[index];
        if(tab)panel.setAttribute('aria-labelledby',tab.id);
      });
      const setActive=(next,moveFocus=false)=>{
        const activeIndex=Math.max(0,tabs.indexOf(next));
        tabs.forEach((tab,index)=>{
          const active=index===activeIndex;
          tab.setAttribute('aria-selected',String(active));
          tab.setAttribute('tabindex',active?'0':'-1');
        });
        panels.forEach(panel=>{
          const active=panel===panelFor(tabs[activeIndex]);
          if(panels.length>1)panel.hidden=!active;
          if(active)panel.setAttribute('aria-labelledby',tabs[activeIndex].id);
        });
        const activeTab=tabs[activeIndex];
        if(moveFocus)activeTab.focus();
        if(list.hasAttribute('data-contact-tabs')){
          list.dispatchEvent(new CustomEvent('bat:contacttypechange',{detail:{type:activeTab.dataset.type}}));
        }
      };
      const linkedTab=()=>panels.length>1 && tabs.find(tab=>`#${tab.getAttribute('aria-controls')}`===location.hash);
      const followLink=()=>{
        const tab=linkedTab();
        if(!tab)return false;
        setActive(tab);
        requestAnimationFrame(()=>panelFor(tab)?.scrollIntoView({block:'start'}));
        return true;
      };
      if(!followLink())setActive(tabs.find(tab=>tab.getAttribute('aria-selected')==='true')||tabs[0]);
      if(panels.length>1)window.addEventListener('hashchange',followLink);
      list.addEventListener('click',event=>{const button=event.target.closest('[role="tab"]');if(button&&tabs.includes(button))setActive(button);});
      list.addEventListener('keydown',event=>{
        const current=tabs.indexOf(document.activeElement);if(current<0)return;
        let next=current;
        if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(current+1)%tabs.length;
        else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(current-1+tabs.length)%tabs.length;
        else if(event.key==='Home')next=0;
        else if(event.key==='End')next=tabs.length-1;
        else return;
        event.preventDefault();setActive(tabs[next],true);
      });
    };
    document.querySelectorAll('[data-tablist], [data-contact-tabs]').forEach(initTabs);

    document.querySelectorAll('.timeline-column button').forEach(button=>button.addEventListener('click',()=>{
      const item=button.closest('li');const open=item.classList.toggle('is-open');button.setAttribute('aria-expanded',String(open));
    }));
  });
})();
