/* ===========================================================
   CLASS NISEKO — Final Stable script.js
   - Hamburger / Mobile Nav
   - Header scroll effect
   - Fade-up animation
   - Simple email validation
   - Reservation submit → Google Apps Script
   - Frontend redirect to thank-you page
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ===============================
     Hamburger & Mobile Nav
  =============================== */
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
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ===============================
     Header Scroll Effect
  =============================== */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ===============================
     Fade-up Animation
  =============================== */
  const fadeUps = document.querySelectorAll('.fade-up');
  if (fadeUps.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    );
    fadeUps.forEach(el => observer.observe(el));
  }

  /* ===============================
     Simple Email Validation (UX)
  =============================== */
  const emailInput = document.getElementById('r_email');
  if (emailInput) {
    const error = document.createElement('div');
    error.textContent = '請輸入正確的 Email 格式';
    error.style.cssText = `
      color:#8b0000;
      font-size:14px;
      margin-top:-8px;
      margin-bottom:12px;
      display:none;
    `;
    emailInput.after(error);

    emailInput.addEventListener('input', () => {
      const val = emailInput.value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      error.style.display = val && !ok ? 'block' : 'none';
    });
  }

  /* ===============================
     Reservation Submit (Route B)
  =============================== */
  /* =========================================================
   Reservation (Multi-course) — 必須整組存在
========================================================= */
const courseList = document.getElementById('courseList');
const addBtn = document.getElementById('addCourseBtn');

if (courseList && addBtn) {

  // ➕ 新增課程
  addBtn.addEventListener('click', () => {
    const count = courseList.querySelectorAll('.course-item').length + 1;

    const div = document.createElement('div');
    div.className = 'course-item';

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

      <div class="time-slot">
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

  // ⏱ 3 小時 → 顯示時段
  courseList.addEventListener('change', e => {
    if (!e.target.classList.contains('duration')) return;

    const item = e.target.closest('.course-item');
    if (!item) return;

    const timeSlot = item.querySelector('.time-slot');
    if (!timeSlot) return;

    if (e.target.value === '3') {
      timeSlot.classList.add('is-visible');
    } else {
      timeSlot.classList.remove('is-visible');
    }
  });

  // ❌ 刪除課程
  courseList.addEventListener('click', e => {
    if (!e.target.classList.contains('delete-course')) return;
    const item = e.target.closest('.course-item');
    if (item) item.remove();
  });
}
  const form = document.getElementById('reservationForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault(); // ⭐ 關鍵：由前端接管流程

    const email = document.getElementById('r_email')?.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValid) {
      alert('請確認 Email 格式是否正確');
      return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const loading = document.getElementById('loading');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送出中...';
    }
    if (loading) loading.style.display = 'inline-block';

    try {
      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbwWGqhq9PEzCAJguEliRCpL_WLld8voFfAtL6cHAvwIqaiqWzQNKHrIIXi1bMlJHrLgsw/exec',
        {
          method: 'POST',
          body: new FormData(form)
        }
      );

      if (!res.ok) throw new Error('Network error');

      const result = await res.json();
      if (!result.ok) throw new Error('GAS error');

      // ✅ 成功 → 前端跳轉
      window.location.href = '/thank-you.html';

    } catch (err) {
      console.error(err);
      alert('送出失敗，請稍後再試或直接聯絡我們');

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '送出';
      }
      if (loading) loading.style.display = 'none';
    }
  });

  /* ===============================
     Smooth Anchor Scroll
  =============================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (mobileNav?.classList.contains('active')) {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
  const emailEl = document.querySelector('.footer-email');
  const toast = document.getElementById('copyToast');

  if (!emailEl) return;

  emailEl.addEventListener('click', async () => {
    const email = emailEl.dataset.email;

    try {
      await navigator.clipboard.writeText(email);

      if (toast) {
        toast.style.display = 'block';
        setTimeout(() => {
          toast.style.display = 'none';
        }, 1500);
      }
    } catch (e) {
      alert('無法自動複製，請手動複製 Email');
    }
  });
});
});