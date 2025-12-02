/* Hamburger */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');
  mobileNav.setAttribute('aria-hidden', mobileNav.classList.contains('active') ? 'false' : 'true');
});

/* Close mobile when clicking link */
mobileNav.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=>{
    mobileNav.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

/* Header scroll effect */
const header = document.querySelector('header');
window.addEventListener('scroll', ()=> {
  if(window.scrollY > 30) header.classList.add('scrolled'); else header.classList.remove('scrolled');
});

/* Form handling */
const form = document.getElementById('reservationForm');
const thankyou = document.getElementById('thankyou');
const loading = document.getElementById('loading');

form.addEventListener('submit', function(e){
  e.preventDefault();
  const data = {
    name: document.getElementById('r_name').value.trim(),
    email: document.getElementById('r_email').value.trim(),
    board: document.getElementById('r_board').value,
    resort: document.getElementById('r_resort').value,
    people: document.getElementById('r_people').value,
    startDate: document.getElementById('r_start').value,
    contactMethod: document.getElementById('r_contactMethod').value,
    contactID: document.getElementById('r_contactID').value.trim(),
    remarks: document.getElementById('r_remarks').value.trim()
  };
  if(!data.name || !data.email || !data.board || !data.resort || !data.people || !data.startDate || !data.contactMethod || !data.contactID){
    alert('請完整填寫所有必填欄位');
    return;
  }
  loading.style.display='inline-block';
  setTimeout(()=> {
    loading.style.display='none';
    form.style.display='none';
    thankyou.style.display='block';
    console.log('Reservation data:', data);
  },900);
});