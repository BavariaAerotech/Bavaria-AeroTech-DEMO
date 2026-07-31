import fs from 'node:fs';

const pages=[
  '404.html','datenschutz.html','green-hub.html','impressum.html','index.html','kontakt.html',
  'kooperation.html','medien.html','pilotprojekt.html','projektanfrage.html','technologie.html',
  'unternehmen.html','loesungen/agrardrohnen.html','loesungen/gruenfutter.html','loesungen/inspektionen.html'
];
const locales=Object.fromEntries(['de','en','uk'].map(language=>[language,JSON.parse(fs.readFileSync(`assets/locales/${language}.json`,'utf8'))]));
const automatic=JSON.parse(fs.readFileSync('assets/locales/content-auto.json','utf8'));
const allowed=/^(Bavaria AeroTech(?: Solutions UG(?: \(haftungsbeschränkt\))?)?|Green Hub|DroneUA|DJI Agras(?: T25)?|Christina Botnari|Eduard Botnari|Maksym Yerko|Am Steig 2F|91183 Abenberg|Deutschland|Germany|info@bavaria-aerotech\.de|\+49 151 10609744|[A-Z]{2})$/;
const get=(object,path)=>path.split('.').reduce((value,key)=>value?.[key],object);
const unescape=value=>value.replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
let failed=false;
let keyCount=0;
let textCount=0;

for(const page of pages){
  const html=fs.readFileSync(page,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
  const missingKeys=[...html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g)].map(match=>match[1]).filter(key=>['de','en','uk'].some(language=>typeof get(locales[language],key)!=='string'||!get(locales[language],key).trim()));
  const stack=[];
  const unresolved=[];
  for(const token of html.match(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g)||[]){
    if(token.startsWith('<')){
      if(/^<\//.test(token)){stack.pop();continue}
      if(/^<!(?:doctype|--)/i.test(token))continue;
      const tag=(token.match(/^<\s*([\w-]+)/)||[])[1];
      if(!tag)continue;
      const skip=/\bdata-i18n(?:[-=\s])|\baria-hidden=["']true/.test(token)||stack.some(entry=>entry.skip);
      if(!/\/$/.test(token)&&!/(br|img|meta|link|input|source|hr)\b/i.test(tag))stack.push({skip});
      continue;
    }
    if(stack.some(entry=>entry.skip))continue;
    const value=unescape(token).replace(/\s+/g,' ').trim();
    if(value&&/[A-Za-zÄÖÜäöüß]/.test(value)&&!allowed.test(value)&&!automatic[value])unresolved.push(value);
  }
  keyCount+=new Set(missingKeys).size;
  textCount+=new Set(unresolved).size;
  if(missingKeys.length||unresolved.length){
    failed=true;
    console.log(`\n${page}`);
    if(missingKeys.length)console.log(`  missing data-i18n keys: ${[...new Set(missingKeys)].join(', ')}`);
    if(unresolved.length)console.log(`  untranslated text: ${[...new Set(unresolved)].join(' | ')}`);
  }
}

console.log(`\nChecked ${pages.length} public pages; missing keys: ${keyCount}; untranslated text entries: ${textCount}.`);
if(failed)process.exitCode=1;
