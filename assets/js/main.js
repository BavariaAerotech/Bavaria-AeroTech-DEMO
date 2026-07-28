(()=>{
  if(!document.querySelector('script[src$="assets/js/i18n.js"]')){
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

    document.querySelectorAll('[data-tablist]').forEach(list=>list.addEventListener('click',event=>{
      const button=event.target.closest('[role="tab"]');if(!button)return;
      list.querySelectorAll('[role="tab"]').forEach(tab=>tab.setAttribute('aria-selected',String(tab===button)));
      const group=list.dataset.tablist;
      document.querySelectorAll(`[data-tabpanel="${group}"]`).forEach(panel=>panel.hidden=panel.id!==button.getAttribute('aria-controls'));
    }));

    document.querySelectorAll('.timeline-column button').forEach(button=>button.addEventListener('click',()=>{
      const item=button.closest('li');const open=item.classList.toggle('is-open');button.setAttribute('aria-expanded',String(open));
    }));
  });
})();
