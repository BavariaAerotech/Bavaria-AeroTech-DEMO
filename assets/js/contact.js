(()=>{
  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.querySelector('[data-contact-form]');if(!form)return;
    const messages={
      de:{name:'Bitte geben Sie Ihren Namen ein.',email:'Bitte geben Sie eine gültige E-Mail-Adresse ein.',message:'Bitte beschreiben Sie Ihr Anliegen mit mindestens 10 Zeichen.',area:'Bitte wählen Sie einen Geschäftsbereich.',consent:'Ihre Zustimmung ist erforderlich.',sending:'Anfrage wird gesendet …',success:'Vielen Dank für Ihre Projektanfrage. Wir haben Ihre Nachricht erhalten und melden uns zeitnah bei Ihnen.',failure:'Die Anfrage konnte nicht gesendet werden. Bitte nutzen Sie unsere E-Mail-Adresse.'},
      en:{name:'Please enter your name.',email:'Please enter a valid email address.',message:'Please describe your request in at least 10 characters.',area:'Please select a business area.',consent:'Your consent is required.',sending:'Sending enquiry …',success:'Thank you for your project enquiry. We have received your message and will get back to you shortly.',failure:'The enquiry could not be sent. Please use our email address.'},
      uk:{name:'Будь ласка, вкажіть ваше ім’я.',email:'Будь ласка, вкажіть коректну електронну адресу.',message:'Будь ласка, опишіть ваш запит щонайменше 10 символами.',area:'Будь ласка, оберіть напрям діяльності.',consent:'Потрібна ваша згода.',sending:'Надсилаємо запит …',success:'Дякуємо за ваш проєктний запит. Ми отримали повідомлення та невдовзі з вами зв’яжемося.',failure:'Не вдалося надіслати запит. Скористайтеся нашою електронною адресою.'}
    };
    const text=()=>messages[document.documentElement.lang]||messages.de;
    const setError=(name,message)=>{const target=document.getElementById(`${name}-error`);if(target)target.textContent=message;const field=form.elements[name];if(field)field.setAttribute('aria-invalid',message?'true':'false')};
    const tabs=document.querySelector('[data-contact-tabs]');
    if(tabs&&form.elements.type){
      const typeInput=form.elements.type,focus=form.elements.focus;
      const configs={landwirtschaft:[['gruenfutter','Grünfutter'],['drohnen','Drohnen'],['beides','Beides']],forschung:[['tierernaehrung','Tierernährung'],['agritechnik','Agrartechnik'],['daten','Datenanalyse']],technologie:[['pilot','Pilotphase'],['ausbau','Ausbauphase']],investment:[['pilot','Pilotphase'],['green-hub','Green Hub']],allgemein:[['allgemein','Allgemeine Anfrage'],['medien','Medien'],['inspektion','Inspektionen']]};
      const selectType=type=>{typeInput.value=type;tabs.querySelectorAll('[role="tab"]').forEach(tab=>tab.setAttribute('aria-selected',String(tab.dataset.type===type)));if(focus){focus.innerHTML=(configs[type]||configs.allgemein).map(([value,label])=>`<option value="${value}">${label}</option>`).join('')};};
      tabs.addEventListener('click',event=>{const tab=event.target.closest('[data-type]');if(tab)selectType(tab.dataset.type)});
      selectType(new URLSearchParams(location.search).get('type')||'landwirtschaft');
    }
    form.elements.form_started.value=String(Date.now());
    form.addEventListener('submit',async event=>{
      event.preventDefault();['name','email','message','consent','business_area'].forEach(name=>setError(name,''));
      let valid=true,copy=text();
      if(form.elements.name.value.trim().length<2){setError('name',copy.name);valid=false}
      if(!form.elements.email.validity.valid){setError('email',copy.email);valid=false}
      if(form.elements.message.value.trim().length<10){setError('message',copy.message);valid=false}
      if(form.elements.business_area&&!form.elements.business_area.value){setError('business_area',copy.area);valid=false}
      if(!form.elements.consent.checked){setError('consent',copy.consent);valid=false}
      if(!valid)return;
      const status=form.querySelector('[data-form-status]'),submit=form.querySelector('[type="submit"]');submit.disabled=true;status.className='form-status';status.textContent=copy.sending;
      try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.message||'failed');status.className='form-status is-success';status.textContent=copy.success;form.reset();form.elements.form_started.value=String(Date.now())}
      catch(error){status.className='form-status is-error';status.textContent=copy.failure}
      finally{submit.disabled=false}
    });
  });
})();
