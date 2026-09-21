function setLang(lang){
  const html=document.getElementById('htmlRoot');
  html.setAttribute('lang',lang);
  html.setAttribute('dir',lang==='ar'?'rtl':'ltr');
  document.getElementById('arBtn').classList.toggle('active',lang==='ar');
  document.getElementById('enBtn').classList.toggle('active',lang==='en');
  document.querySelectorAll('[data-ar][data-en]').forEach(el=>{el.innerHTML=el.getAttribute('data-'+lang);});
  try{localStorage.setItem('lang',lang);}catch(e){}
}
setLang((function(){try{return localStorage.getItem('lang')||'ar';}catch(e){return 'ar';}})());

const header=document.getElementById('header');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40),{passive:true});

const mt=document.getElementById('menuToggle'),nm=document.getElementById('navMenu');
mt.addEventListener('click',()=>{mt.classList.toggle('active');nm.classList.toggle('active');});
nm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mt.classList.remove('active');nm.classList.remove('active');}));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();scrollTo({top:t.offsetTop-70,behavior:'smooth'});}
}));

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// animated counters
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,end=+el.dataset.count,t0=performance.now();
  (function tick(t){const p=Math.min((t-t0)/1400,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);})(t0);
}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

const toTop=document.getElementById('toTop');
addEventListener('scroll',()=>toTop.classList.toggle('show',scrollY>700),{passive:true});
toTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

const dEl=document.getElementById('bDate');
if(dEl)dEl.min=new Date().toISOString().split('T')[0];
const pEl=document.getElementById('bPhone');
if(pEl)pEl.setAttribute('pattern','^(\\+20|0)?1[0125][0-9]{8}$');

document.querySelectorAll('.chip').forEach(ch=>ch.addEventListener('click',()=>{
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  ch.classList.add('active');
  const f=ch.dataset.f;
  document.querySelectorAll('#progGrid .card').forEach(card=>{
    const show=f==='all'||card.dataset.prog===f;
    card.classList.toggle('hide',!show);
    if(show&&f!=='all'){card.classList.remove('flash');void card.offsetWidth;card.classList.add('flash');}
  });
}));

const lb=document.getElementById('lightbox'),lbImg=document.getElementById('lightboxImg');
if(lb){
  document.querySelectorAll('#realGrid .shot img').forEach(img=>img.addEventListener('click',()=>{lbImg.src=img.src;lb.classList.add('open');lb.setAttribute('aria-hidden','false');}));
  lb.addEventListener('click',()=>{lb.classList.remove('open');lb.setAttribute('aria-hidden','true');});
  addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open');});
}

document.getElementById('bookingForm').addEventListener('submit',function(e){
  e.preventDefault();
  const n=bName.value.trim(),p=bPhone.value.trim(),s=bProg.value,d=bDate.value,no=bNotes.value.trim();
  const ar=htmlRoot.getAttribute('lang')==='ar';
  let m=ar?'*طلب حجز جديد*\n\n':'*New booking*\n\n';
  m+=ar?('الاسم: '+n+'\nالموبايل: '+p+'\nالبرنامج: '+s+'\nاليوم: '+d+'\n'):('Name: '+n+'\nPhone: '+p+'\nProgram: '+s+'\nDate: '+d+'\n');
  if(no)m+=(ar?'ملاحظات: ':'Notes: ')+no+'\n';
  open('https://wa.me/201019815737?text='+encodeURIComponent(m),'_blank');
});
