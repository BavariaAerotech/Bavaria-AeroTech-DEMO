(()=>{
  const iconPaths={
    grain:'M12 3v18M8 6c-3 0-4-2-4-2 3 0 4 2 4 2Zm8 4c3 0 4-2 4-2-3 0-4 2-4 2ZM8 12c-3 0-4-2-4-2 3 0 4 2 4 2Zm8 4c3 0 4-2 4-2-3 0-4 2-4 2Z',
    filter:'M4 5h16l-6 7v5l-4 2v-7L4 5Z',drop:'M12 3s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12Z',
    sprout:'M12 21v-8m0 1c-5 0-7-3-7-7 5 0 7 3 7 7Zm0-3c5 0 7-3 7-7-5 0-7 3-7 7Z',
    led:'M8 3h8v5H8V3Zm-3 9h14v9H5v-9Zm3 3v3m4-3v3m4-3v3',harvest:'M8 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm0 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-1-8 13 8M7 15l13-8',
    wash:'M6 5h12v14H6V5Zm3-3v3m6-3v3m-6 6c1.5-2 4.5-2 6 0s1.5 4 0 6',
    output:'M4 7h10v10H4V7Zm10 5h6m-3-3 3 3-3 3'
  };
  const icon=id=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${iconPaths[id]||iconPaths.sprout}"/></svg>`;
  const escapeHtml=value=>String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const list=items=>`<ul>${items.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`;

  document.addEventListener('DOMContentLoaded',()=>{
    const host=document.querySelector('[data-process-app]');
    const model=window.HYDROPONIC_PROCESS;
    if(!host||!model)return;
    let lang=localStorage.getItem('bat-lang')||'de';
    let active=0;
    const rotationOpen=true;
    let playing=false;
    let timer=null;

    const t=()=>model.ui[lang]||model.ui.de;
    const value=(source,fallback='')=>source?.[lang]||source?.de||fallback;
    const waterLoopLabel={de:'Geschlossener Prozesskreis',en:'Closed process loop',uk:'Замкнений процесний контур'};
    const stop=()=>{playing=false;clearInterval(timer);timer=null;updatePlayButton()};

    const stageButton=stage=>{
      const index=model.stages.indexOf(stage);
      const current=index===active;
      return `<li class="process-stage process-stage--${stage.id} ${index<active?'is-complete':''} ${current?'is-active':''}" data-stage-item="${stage.id}">
        <button type="button" data-stage="${stage.id}" aria-current="${current?'step':'false'}" aria-label="${escapeHtml(`${String(stage.number).padStart(2,'0')} ${value(stage.title)}, ${value(stage.day)}`)}">
          <span class="process-stage__number">${String(stage.number).padStart(2,'0')}</span><span class="process-stage__icon">${icon(stage.icon)}</span>
          <span class="process-stage__copy"><strong>${escapeHtml(value(stage.title))}</strong><small>${escapeHtml(value(stage.day))}</small></span><span class="process-stage__chevron" aria-hidden="true">›</span>
        </button></li>`;
    };

    const detailMarkup=stage=>`<div class="process-info__top"><span class="badge badge--progress">${escapeHtml(t().current)} ${String(stage.number).padStart(2,'0')}</span><span class="process-info__day">${escapeHtml(value(stage.day))}</span></div>
      <h3>${escapeHtml(value(stage.title))}</h3><p class="process-info__duration">${escapeHtml(value(stage.duration))}</p>
      <p class="process-info__description">${escapeHtml(value(stage.description))}</p>
      <section><h4>${escapeHtml(t().functionLabel)}</h4><p>${escapeHtml(value(stage.function))}</p></section>
      <div class="process-info__columns"><section><h4>${escapeHtml(t().parameters)}</h4>${list(value(stage.parameters,[]))}</section><section><h4>${escapeHtml(t().sensors)}</h4>${list(value(stage.sensors,[]))}</section></div>
      <section><h4>${escapeHtml(t().automation)}</h4>${list(value(stage.automation,[]))}</section>
      <p class="process-target-note"><strong>${escapeHtml(t().planned)}.</strong> ${escapeHtml(value(stage.note,t().targetNote))}</p>`;

    const rotationMarkup=()=>`<section class="rotation-view water-cycle-view" aria-labelledby="rotation-title"><div class="rotation-copy"><h3 id="rotation-title">${escapeHtml(t().rotationTitle)}</h3><p>${escapeHtml(t().rotationLead)}</p></div><div class="water-cycle-visual"><div class="water-cycle-ring" role="img" aria-label="${escapeHtml(t().rotationTitle)}"><div class="water-cycle-core"><strong>100%</strong><span>${escapeHtml(waterLoopLabel[lang]||waterLoopLabel.de)}</span></div></div><div class="water-cycle-steps">${value(model.zones.water.items,[]).map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div></div></section>`;

    const supportMarkup=()=>`<details class="support-layer" open><summary><span>${escapeHtml(t().support)}</span><small>03 · 04 · 05 · 07</small></summary><p>${escapeHtml(t().supportText)}</p><div class="support-chips">${model.support[lang].map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div></details>`;

    const processMarkup=()=>`<section class="process-view"><div class="process-header"><div><h3>${escapeHtml(t().title)}</h3><p>${escapeHtml(t().lead)}</p></div><div class="process-actions"><button class="btn btn--primary" type="button" data-process-play>${escapeHtml(playing?t().pause:t().start)}</button></div></div>
      <div class="process-workspace"><div class="process-flow"><div class="process-legend"><span class="legend-product">${escapeHtml(t().productFlow)}</span><span class="legend-tray">${escapeHtml(t().trayFlow)}</span></div><div class="process-track-wrap"><img class="process-flow-lines" src="assets/svg/process-flow.svg" alt="" aria-hidden="true"><ol class="process-track">${model.stages.map(stageButton).join('')}</ol></div>${supportMarkup()}</div><aside class="process-info" data-process-info aria-live="polite">${detailMarkup(model.stages[active])}<div class="process-nav"><button class="btn" type="button" data-process-prev ${active===0?'disabled':''}>← ${escapeHtml(t().previous)}</button><button class="btn btn--primary" type="button" data-process-next>${escapeHtml(active===model.stages.length-1?t().restart:t().next)} →</button></div></aside></div>${rotationMarkup()}<p class="process-disclaimer">${escapeHtml(t().disclaimer)}</p><div class="process-cta"><a class="btn" href="pilotprojekt.html">${escapeHtml(t().pilotCta)}</a><a class="btn btn--secondary" href="kontakt.html?type=landwirtschaft">${escapeHtml(t().interestCta)}</a></div></section>`;

    const shell=()=>processMarkup();

    const updatePlayButton=()=>{const button=host.querySelector('[data-process-play]');if(button)button.textContent=playing?t().pause:(active===model.stages.length-1?t().restart:t().start)};
    const select=(index,focus=false)=>{
      active=(index+model.stages.length)%model.stages.length;
      host.querySelectorAll('[data-stage]').forEach((button,i)=>{
        button.setAttribute('aria-current',i===active?'step':'false');
        button.closest('.process-stage').classList.toggle('is-active',i===active);
        button.closest('.process-stage').classList.toggle('is-complete',i<active);
      });
      const info=host.querySelector('[data-process-info]');
      if(info){const nav=info.querySelector('.process-nav');info.innerHTML=detailMarkup(model.stages[active]);info.append(nav);nav.querySelector('[data-process-prev]').disabled=active===0;nav.querySelector('[data-process-next]').innerHTML=`${escapeHtml(active===model.stages.length-1?t().restart:t().next)} →`}
      updatePlayButton();
      if(focus)host.querySelector(`[data-stage="${model.stages[active].id}"]`)?.focus({preventScroll:true});
    };
    const play=()=>{
      if(playing){stop();return}
      if(active===model.stages.length-1)select(0);
      playing=true;updatePlayButton();
      timer=setInterval(()=>{if(active>=model.stages.length-1){stop();return}select(active+1)},3200);
    };
    const bind=()=>{
      host.addEventListener('click',event=>{
        const stage=event.target.closest('[data-stage]');if(stage){stop();select(model.stages.findIndex(item=>item.id===stage.dataset.stage));return}
        if(event.target.closest('[data-process-play]')){play();return}
        if(event.target.closest('[data-process-prev]')){stop();select(Math.max(0,active-1),true);return}
        if(event.target.closest('[data-process-next]')){stop();select(active===model.stages.length-1?0:active+1,true);return}
      });
      host.addEventListener('keydown',event=>{
        const stage=event.target.closest('[data-stage]');
        if(!stage)return;
        if(event.key==='ArrowDown'||event.key==='ArrowRight'){event.preventDefault();stop();select(Math.min(model.stages.length-1,active+1),true)}
        if(event.key==='ArrowUp'||event.key==='ArrowLeft'){event.preventDefault();stop();select(Math.max(0,active-1),true)}
      });
    };
    const build=()=>{host.innerHTML=shell();window.__HYDROPONIC_PROCESS_APP={active,rotationOpen,playing}};
    document.addEventListener('bat:languagechange',event=>{lang=event.detail?.lang||localStorage.getItem('bat-lang')||'de';stop();build()});
    build();bind();
  });
})();
