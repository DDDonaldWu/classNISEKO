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
   Reservation Form (新版多課程)
=========================================================== */
const form = document.getElementById('reservationForm');
const thankyou = document.getElementById('thankyou');
const loading = document.getElementById('loading');
const courseList = document.getElementById('courseList');
const addBtn = document.getElementById('addCourseBtn');

// 新增課程
addBtn.addEventListener('click', () => {
  const count = document.querySelectorAll('.course-item').length + 1;

  const div = document.createElement('div');
  div.classList.add('course-item');
  div.innerHTML = `
    <h3>課程 ${count}</h3>

    <label>日期</label>
    <input type="date" name="course_date[]" required>

    <label>雪場</label>
    <select name="course_resort[]" required>
      <option value="">請選擇雪場</option>
      <option value="Niseko Grand Hirafu">Niseko Grand Hirafu</option>
      <option value="Niseko Annupuri">Niseko Annupuri</option>
      <option value="Hanazono">Hanazono</option>
      <option value="Moiwa">Moiwa</option>
    </select>

    <label>課程時數</label>
    <select name="course_duration[]" class="duration" required>
      <option value="">選擇時數</option>
      <option value="3">3 小時</option>
      <option value="6">6 小時</option>
      <option value="7">7 小時</option>
    </select>

    <div class="time-slot" style="display:none">
      <label>時段（3 小時課程）</label>
      <select name="course_timeslot[]">
        <option value="09:00-12:00">09:00 — 12:00</option>
        <option value="13:00-16:00">13:00 — 16:00</option>
      </select>
    </div>

    <button type="button" class="delete-course">刪除此課程</button>
    <hr class="course-split">
  `;

  courseList.appendChild(div);
});

// 時段顯示控制
courseList.addEventListener('change', e => {
  if (e.target.classList.contains('duration')) {
    const parent = e.target.closest('.course-item');
    const timeSlot = parent.querySelector('.time-slot');

    timeSlot.style.display = e.target.value === '3' ? 'block' : 'none';
  }
});

// 刪除課程
courseList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-course')) {
    e.target.closest('.course-item').remove();
  }
});

/* ===========================================================
   Form Submit
=========================================================== */
form.addEventListener('submit', e => {
  e.preventDefault();

  loading.style.display = 'inline-block';

  setTimeout(() => {
    loading.style.display = 'none';
    form.style.display = 'none';
    thankyou.style.display = 'block';
  }, 900);
});

/* ===========================================================
   Smooth Scroll
=========================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // close mobile nav
      if (mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
});