/* ===========================================================
   CLASS NISEKO — Final Stable script.js
   - Hamburger / Mobile Nav
   - Header scroll effect
   - Fade-up animation
   - Simple email validation
   - Reservation submit → Google Apps Script
   - Frontend redirect to thank-you page
=========================================================== */
const I18N = {
  zh: {},
  en: {}
};
function setLanguage(lang) {
  const dict = I18N[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.dataset.i18n.split('.');
    let text = dict;

    for (const k of keys) {
      if (!text || typeof text !== 'object') return;
      text = text[k];
    }

    // ⭐ 只有真的有翻譯才改
    if (typeof text === 'string' && text.trim() !== '') {
      el.textContent = text;
    }
  });

  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
}





document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     Hamburger & Mobile Nav
  =============================== */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  setLanguage(localStorage.getItem('lang') || 'zh');
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      setLanguage(btn.dataset.lang);
    });
  });

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

  function initReservationForm() {
    const form = document.getElementById('reservationForm');
    const courseList = document.getElementById('courseList');
    const addBtn = document.getElementById('addCourseBtn');

    // ⭐ 防呆：任一不存在就不跑
    if (!form || !courseList || !addBtn) {
      console.warn('[Reservation] form not found, skip');
      return;
    }

    const DURATION_RULES = {
      'Niseko Grand Hirafu': ['3', '4', '6', '7'],
      'Niseko Annupuri': ['3', '4', '6', '7'],
      'Hanazono': ['4', '7'],
      'Private Area': ['2']
    };

    function updateDurationOptions(courseItem) {
      const resortSelect = courseItem.querySelector('[name="course_resort[]"]');
      const durationSelect = courseItem.querySelector('[name="course_duration[]"]');
      if (!resortSelect || !durationSelect) return;

      const resort = resortSelect.value;
      if (!resort || !DURATION_RULES[resort]) return;

      const allowed = DURATION_RULES[resort];
      const prev = durationSelect.value;

      durationSelect.innerHTML = '<option value="">選擇時數</option>';

      allowed.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = `${h} 小時`;
        durationSelect.appendChild(opt);
      });

      if (allowed.includes(prev)) {
        durationSelect.value = prev;
      }
    }

    function createCourseItem(index) {
      const div = document.createElement('div');
      div.className = 'course-item';

      div.innerHTML = `
      <h3>課程 ${index + 1}</h3>

      <label>日期</label>
      <input type="date" name="course_date[]" required>

      <label>雪場</label>
      <select name="course_resort[]" required>
        <option value="">請選擇雪場</option>
        <option value="Niseko Grand Hirafu">比羅夫 Hirafu</option>
        <option value="Niseko Annupuri">安努普里 Annupuri</option>
        <option value="Hanazono">花園 Hanazono</option>
        <option value="Private Area">私人區域</option>
      </select>

      <label>課程時數</label>
      <select name="course_duration[]" class="duration" required>
        <option value="">選擇時數</option>
      </select>

      <div class="time-slot">
        <label>時段（3 小時課程）</label>
        <select name="course_timeslot[]">
          <option value="09:00-12:00">09:00 — 12:00 </option>
          <option value="13:00-16:00">13:00 — 16:00 </option>
          <option value="13:00-16:00">其他（請在備註留言）</option>
        </select>
      </div>

      <button type="button" class="delete-course">刪除此課程</button>
      <hr class="course-split">
    `;

      return div;
    }

    if (courseList.children.length === 0) {
      courseList.appendChild(createCourseItem(0));
    }

    addBtn.addEventListener('click', () => {
      const index = courseList.querySelectorAll('.course-item').length;
      courseList.appendChild(createCourseItem(index));
    });

    courseList.addEventListener('change', e => {
      const item = e.target.closest('.course-item');
      if (!item) return;

      if (e.target.matches('[name="course_resort[]"]')) {
        updateDurationOptions(item);
        item.querySelector('.time-slot')?.classList.remove('is-visible');
      }

      if (e.target.classList.contains('duration')) {
        const slot = item.querySelector('.time-slot');
        if (!slot) return;

        if (e.target.value === '3') {
          slot.classList.add('is-visible');
        } else {
          slot.classList.remove('is-visible');
        }
      }
    });

    courseList.addEventListener('click', e => {
      if (!e.target.classList.contains('delete-course')) return;
      e.target.closest('.course-item')?.remove();
    });

    console.log('[Reservation] init OK');
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
        'https://script.google.com/macros/s/AKfycbwehnjw-ALHqadYW65BBfzwCe3qWHJkgoFbF8B_q51_wwoG9u8_JgpVDkGFbGvwg2TWBw/exec',
        {
          method: 'POST',
          body: new FormData(form)
        }
      );




      if (!res.ok) throw new Error('Network error');

      const result = await res.json();
      if (!result.ok) throw new Error('GAS error');

      // ✅ 成功 → 前端跳轉
      window.location.href = 'thank-you.html';

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
  initReservationForm();
});
