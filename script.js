/* ===========================================================
   CLASS NISEKO — script.js
   Purpose:
   - Navigation (hamburger / mobile nav)
   - Header scroll effect
   - Fade-up animation
   - Reservation form (multi-course)
   - Frontend validation
   - Smooth anchor scrolling
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     Navigation: Hamburger & Mobile Nav
  ========================================================= */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      mobileNav.setAttribute(
        'aria-hidden',
        mobileNav.classList.contains('active') ? 'false' : 'true'
      );
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* =========================================================
     Header Scroll Effect
  ========================================================= */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* =========================================================
     Fade-up Animation
  ========================================================= */
  const fadeUps = document.querySelectorAll('.fade-up');
  if (fadeUps.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeUps.forEach(el => observer.observe(el));
  }

  /* =========================================================
     Frontend Validation: Email (即時防呆)
  ========================================================= */
  const emailInput = document.getElementById('r_email');
  if (emailInput) {
    const error = document.createElement('div');
    error.textContent = '請輸入正確的 Email 格式';
    error.style.cssText = `
      color:#8b0000;
      font-size:14px;
      margin:-8px 0 12px;
      display:none;
    `;
    emailInput.after(error);

    emailInput.addEventListener('input', () => {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      error.style.display = (!emailInput.value || valid) ? 'none' : 'block';
    });
  }

  /* =========================================================
     Reservation Form: Multi-course Handling
  ========================================================= */
  const courseList = document.getElementById('courseList');
  const addBtn = document.getElementById('addCourseBtn');

  if (courseList && addBtn) {

    // Add course block
    addBtn.addEventListener('click', () => {
      const count = courseList.children.length + 1;

      const item = document.createElement('div');
      item.className = 'course-item';
      item.innerHTML = `
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
      courseList.appendChild(item);
    });

    // Toggle time slot
    courseList.addEventListener('change', e => {
      if (!e.target.classList.contains('duration')) return;
      const slot = e.target.closest('.course-item')?.querySelector('.time-slot');
      if (slot) slot.style.display = e.target.value === '3' ? 'block' : 'none';
    });

    // Delete course
    courseList.addEventListener('click', e => {
      if (e.target.classList.contains('delete-course')) {
        e.target.closest('.course-item')?.remove();
      }
    });
  }

/* =========================================================
   Smooth Scroll + Close Mobile Nav
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // ⭐ 只有在「手機選單內點擊」才關閉
    if (
      mobileNav &&
      hamburger &&
      mobileNav.classList.contains('active') &&
      this.closest('.mobile-nav')
    ) {
      mobileNav.classList.remove('active');
      hamburger.classList.remove('active');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });
});
});

/* =========================================================
   Form Submit Guard (送出前最後防呆)
   - 綁在 <form onsubmit="return handleFormSubmit()">
========================================================= */
function handleFormSubmit() {
  const email = document.getElementById('r_email')?.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!valid) {
    alert('請確認 Email 格式是否正確');
    return false;
  }

  const btn = document.querySelector('.btn-submit');
  if (btn) {
    btn.disabled = true;
    btn.textContent = '送出中...';
  }

  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'inline-block';

  return true; // 讓表單真的送出
}