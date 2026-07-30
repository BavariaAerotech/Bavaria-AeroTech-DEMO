(()=>{
  document.documentElement.dataset.theme='light';
  document.documentElement.style.colorScheme='light';
  try{localStorage.removeItem('bat-theme')}catch(error){}
  const meta=document.querySelector('meta[name="theme-color"]')||document.head.appendChild(document.createElement('meta'));
  meta.name='theme-color';
  meta.content='#f7f8f5';
})();
