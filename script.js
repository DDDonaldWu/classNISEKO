/* ===========================================================
   Hamburger & Mobile Nav
   =========================================================== */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileNav.classList.toggle('active');
  mobileNav.setAttribute(
    'aria-hidden',
    mobileNav.classList.contains('active') ? 'false' : 'true'
  );
});

/* 點選手機選單後關閉 */
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    hamburger.classList.remove('active');
  });
});


/* ===========================================================
   Header Scroll Effect
   =========================================================== */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});


/* ===========================================================
   Fade-up Scroll Animation
  （整合，移除你原本重複的版本）
   =========================================================== */
const fadeUps = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      fadeObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
);

fadeUps.forEach(el => fadeObserver.observe(el));


/* ===========================================================
   Reservation Form Handling
   =========================================================== */
const form = document.getElementById('reservationForm');
const thankyou = document.getElementById('thankyou');
const loading = document.getElementById('loading');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    name: r_name.value.trim(),
    email: r_email.value.trim(),
    board: r_board.value,
    resort: r_resort.value,
    people: r_people.value,
    startDate: r_start.value,
    contactMethod: r_contactMethod.value,
    contactID: r_contactID.value.trim(),
    remarks: r_remarks.value.trim(),
  };

  // 確認必填
  for (const key in data) {
    if (!data[key]) {
      alert('請完整填寫所有必填欄位');
      return;
    }
  }

  loading.style.display = 'inline-block';

  setTimeout(() => {
    loading.style.display = 'none';
    form.style.display = 'none';
    thankyou.style.display = 'block';
    console.log('Reservation data (client only):', data);
  }, 900);
});


/* ===========================================================
   Smooth Scroll for Anchor Links
   =========================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // 手機版 - 點選後自動關閉選單
      if (mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
});


/* ===========================================================
   Pricing - Collapse Animation（新版）
   =========================================================== */
document.querySelectorAll('.price-card').forEach(card => {
  
  const toggleBtn = card.querySelector('.price-toggle');   // 折疊按鈕
  const detailBox = card.querySelector('.price-details');  // 內容區塊

  // 安全檢查：避免 HTML 還沒加就報錯
  if (!toggleBtn || !detailBox) return;

  toggleBtn.addEventListener('click', () => {
    detailBox.classList.toggle('open');
    toggleBtn.classList.toggle('open');
  });
});