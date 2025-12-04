/* Hamburger & Mobile nav */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');
  mobileNav.setAttribute('aria-hidden', mobileNav.classList.contains('active') ? 'false' : 'true');
});

/* Close mobile when clicking link */
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

/* Header scroll effect */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

/* Fade-up on scroll */
const faders = document.querySelectorAll('.fade-up');
const appearOptions = { threshold: 0.12, rootMargin: "0px 0px -60px 0px" };
const appearOnScroll = new IntersectionObserver(function(entries, observer){
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.add('in');
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(f => appearOnScroll.observe(f));

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
  loading.style.display = 'inline-block';
  setTimeout(() => {
    loading.style.display = 'none';
    form.style.display = 'none';
    thankyou.style.display = 'block';
    console.log('Reservation data (client only):', data);
  }, 900);
});

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(!href || href === '#') return;
    const target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if(mobileNav.classList.contains('active')){
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
});
// Scroll Fade-up Reveal
const fadeUps = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target); // 動畫跑一次就結束
    }
  });
}, {
  threshold: 0.2  // 20% 出現在畫面就觸發
});

// 全部元素加入觀察器
fadeUps.forEach(el => observer.observe(el));

// Pricing collapse
const priceCards = document.querySelectorAll(".price-card");

priceCards.forEach(card => {
  const header = card.querySelector(".price-header");

  header.addEventListener("click", () => {
    card.classList.toggle("open");
  });
});