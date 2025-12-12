/* ===========================================================
   CLASS NISEKO — script.js
   - Stable DOM binding (DOMContentLoaded)
   - Hamburger / Mobile Nav
   - Header scrolled effect
   - Fade-up animation
   - Reservation: multi-course add/delete + timeslot toggle
   - Submit → Google Apps Script (Google Sheet)
   - Smooth anchor scrolling
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     Hamburger & Mobile Nav
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

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
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
      if (window.scrollY > 30) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  /* =========================================================
     Fade-up Scroll Animation
  ========================================================= */
  const fadeUps = document.querySelectorAll('.fade-up');
  if (fadeUps.length) {
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
  }

  /* =========================================================
     Reservation (Multi-course)
  ========================================================= */
  const form = document.getElementById('reservationForm');
  const thankyou = document.getElementById('thankyou');
  const loading = document.getElementById('loading');

  const courseList = document.getElementById('courseList');
  const addBtn = document.getElementById('addCourseBtn');

  if (courseList && addBtn) {
    // Add course
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

    // Duration → show/hide time-slot
    courseList.addEventListener('change', e => {
      if (!e.target.classList.contains('duration')) return;
      const item = e.target.closest('.course-item');
      if (!item) return;
      const timeSlot = item.querySelector('.time-slot');
      if (!timeSlot) return;
      timeSlot.style.display = e.target.value === '3' ? 'block' : 'none';
    });

    // Delete course
    courseList.addEventListener('click', e => {
      if (!e.target.classList.contains('delete-course')) return;
      const item = e.target.closest('.course-item');
      if (item) item.remove();
    });
  }

  /* =========================================================
     Form Submit → Google Sheet
     1) Replace YOUR_WEB_APP_URL_HERE with your deployed Web App URL
=========================================================== */
  const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwWGqhq9PEzCAJguEliRCpL_WLld8voFfAtL6cHAvwIqaiqWzQNKHrIIXi1bMlJHrLgsw/exec';

  /*
  if (form && loading && thankyou) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Guard
      if (!courseList) {
        alert('表單初始化失敗（courseList 不存在）');
        return;
      }

      // Collect courses
      const courses = [];
      courseList.querySelectorAll('.course-item').forEach(item => {
        const date = item.querySelector('input[type="date"]')?.value || '';
        const resort = item.querySelector('select[name="course_resort[]"]')?.value || '';
        const duration = item.querySelector('select.duration')?.value || '';
        const timeslot = item.querySelector('.time-slot select')?.value || '';

        if (date && resort && duration) {
          courses.push({ date, resort, duration, timeslot });
        }
      });

      if (!courses.length) {
        alert('請至少填寫一堂課程');
        return;
      }

      const payload = {
        name: document.getElementById('r_name')?.value.trim() || '',
        email: document.getElementById('r_email')?.value.trim() || '',
        contactMethod: document.getElementById('r_contactMethod')?.value || '',
        contactID: document.getElementById('r_contactID')?.value.trim() || '',
        remarks: document.getElementById('r_remarks')?.value.trim() || '',
        courses
      };

      for (const key of ['name', 'email', 'contactMethod', 'contactID']) {
        if (!payload[key]) {
          alert('請完整填寫所有必填欄位');
          return;
        }
      }

      if (!GOOGLE_SHEET_ENDPOINT || GOOGLE_SHEET_ENDPOINT === 'YOUR_WEB_APP_URL_HERE') {
        alert('請先在 script.js 填入 GOOGLE_SHEET_ENDPOINT（Web App URL）');
        return;
      }

      loading.style.display = 'inline-block';

      try {
        const res = await fetch(GOOGLE_SHEET_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (!result.ok) throw new Error(result.error || 'Submission failed');

        loading.style.display = 'none';
        form.style.display = 'none';
        thankyou.style.display = 'block';

      } catch (err) {
        loading.style.display = 'none';
        alert('送出失敗，請稍後再試或直接聯絡我們');
        console.error(err);
      }
    });
  }
*/
  /* =========================================================
     Smooth Scroll (Anchor Links)
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile nav if open
      if (mobileNav && hamburger && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
      }
    });
  });
});
