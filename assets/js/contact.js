(()=>{
  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.querySelector('[data-contact-form]');if(!form)return;
    const params=new URLSearchParams(location.search);
    const area=form.elements.business_area;const requestedArea=params.get('business_area');
    if(area&&requestedArea&&[...area.options].some(option=>option.value===requestedArea))area.value=requestedArea;
    const focusSelect=form.elements.focus;const requestedFocus=params.get('focus');
    if(focusSelect&&requestedFocus&&[...focusSelect.options].some(option=>option.value===requestedFocus))focusSelect.value=requestedFocus;
    const messages={
      de:{name:'Bitte geben Sie Ihren Namen ein.',email:'Bitte geben Sie eine gültige E-Mail-Adresse ein.',message:'Bitte beschreiben Sie Ihr Anliegen mit mindestens 10 Zeichen.',area:'Bitte wählen Sie einen Geschäftsbereich.',consent:'Ihre Zustimmung ist erforderlich.',sending:'Anfrage wird geprüft …',success:'Die Testdaten wurden im Browser geprüft. Es wurde keine E-Mail gesendet.',failure:'Die Anfrage konnte nicht gesendet werden. Bitte nutzen Sie unsere E-Mail-Adresse.'},
      en:{name:'Please enter your name.',email:'Please enter a valid email address.',message:'Please describe your request in at least 10 characters.',area:'Please select a business area.',consent:'Your consent is required.',sending:'Checking enquiry …',success:'The test data was validated in your browser. No email was sent.',failure:'The enquiry could not be sent. Please use our email address.'},
      uk:{name:'Будь ласка, вкажіть ваше ім’я.',email:'Будь ласка, вкажіть коректну електронну адресу.',message:'Будь ласка, опишіть ваш запит щонайменше 10 символами.',area:'Будь ласка, оберіть напрям діяльності.',consent:'Потрібна ваша згода.',sending:'Перевіряємо запит …',success:'Тестові дані перевірено в браузері. Лист не надіслано.',failure:'Не вдалося надіслати запит. Скористайтеся нашою електронною адресою.'}
    };
    const text=()=>messages[document.documentElement.lang]||messages.de;
    ['name','email','business_area','message','consent'].forEach(name=>{
      const field=form.elements[name],error=document.getElementById(`${name}-error`);
      if(field&&error){field.setAttribute('aria-describedby',error.id);error.setAttribute('role','alert');error.setAttribute('aria-live','polite');}
    });
    const setError=(name,message)=>{const target=document.getElementById(`${name}-error`);if(target)target.textContent=message;const field=form.elements[name];if(field)field.setAttribute('aria-invalid',message?'true':'false')};
    const tabs=document.querySelector('[data-contact-tabs]');
    if(tabs&&form.elements.type){
      const typeInput=form.elements.type,focus=form.elements.focus;
      const configs={landwirtschaft:[['gruenfutter','Grünfutter'],['drohnen','Drohnen'],['beides','Beides']],forschung:[['tierernaehrung','Tierernährung'],['agritechnik','Agrartechnik'],['daten','Datenanalyse']],technologie:[['pilot','Pilotphase'],['ausbau','Ausbauphase']],investment:[['pilot','Pilotphase'],['green-hub','Green Hub']],allgemein:[['allgemein','Allgemeine Anfrage'],['medien','Medien'],['inspektion','Inspektionen']]};
      const selectType=type=>{
        typeInput.value=type;
        if(!focus)return;
        focus.replaceChildren(...(configs[type]||configs.allgemein).map(([value,label])=>new Option(label,value)));
      };
      tabs.addEventListener('bat:contacttypechange',event=>selectType(event.detail.type));
      const options=[...tabs.querySelectorAll('[role="tab"]')];
      const initial=options.find(tab=>tab.dataset.type===params.get('type'))||options[0];
      initial?.click();
      const interest=params.get('interest');
      if(focus&&interest&&[...focus.options].some(option=>option.value===interest))focus.value=interest;
    }
    form.elements.form_started.value=String(Date.now());
    form.querySelector('[type=submit]').disabled=false;
    form.addEventListener('submit',event=>{
      event.preventDefault();['name','email','message','consent','business_area'].forEach(name=>setError(name,''));
      let valid=true,copy=text();
      if(form.elements.name.value.trim().length<2){setError('name',copy.name);valid=false}
      if(!form.elements.email.validity.valid){setError('email',copy.email);valid=false}
      if(form.elements.message.value.trim().length<10){setError('message',copy.message);valid=false}
      if(form.elements.business_area&&!form.elements.business_area.value){setError('business_area',copy.area);valid=false}
      if(!form.elements.consent.checked){setError('consent',copy.consent);valid=false}
      if(!valid){form.querySelector('[aria-invalid="true"]')?.focus();return;}
      const status=form.querySelector('[data-form-status]');
      status.className='form-status is-success';
      status.textContent=copy.success;

    });
  });
})();
