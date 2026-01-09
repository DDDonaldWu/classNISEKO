/* ===========================================================
   CLASS NISEKO — Final Stable script.js
   STRUCTURE OVERVIEW
   -----------------------------------------------------------
   [0] Debug / Boot Check
   [1] Simple Text Helper (temporary, will merge into i18n.js)
   [2] DOMContentLoaded Entry
     ├─ [2-1] Mobile Navigation (Hamburger)
     ├─ [2-2] Header Scroll Effect
     ├─ [2-3] Fade-up Animation
     ├─ [2-4] Email UX Validation
     ├─ [2-5] Reservation Form Logic
     ├─ [2-6] Reservation Submit (GAS)
     └─ [2-7] Smooth Anchor Scroll
=========================================================== */


/* ===========================================================
   [0] Debug / Boot Check
=========================================================== */
console.log('script.js LOADED', Date.now());


/* ===========================================================
   [1] Simple Text Helper (TEMP, NO i18n yet)
   👉 將來會整段合併進 i18n.js
=========================================================== */
const TEXT = {
  zh: {
    emailInvalid: '請輸入正確的 Email 格式',
    emailCheck: '請確認 Email 格式是否正確',
    submitFailed: '送出失敗，請稍後再試或直接聯絡我們',
    processing: '處理中...',
    submitting: '送出中...',
    submit: '送出'
  },
  en: {
    emailInvalid: 'Please enter a valid email address.',
    emailCheck: 'Please check that your email address is valid.',
    submitFailed: 'Submission failed. Please try again later or contact us directly.',
    processing: 'Processing...',
    submitting: 'Submitting...',
    submit: 'Submit'
  }
};

// 語言判斷（目前依檔名，之後可改成 <html lang="">）
function getPageLang() {
  return location.pathname.includes('index-en') ? 'en' : 'zh';
}

// 文字唯一出口
function t(key) {
  const lang = getPageLang();
  return TEXT[lang]?.[key] || TEXT.zh[key] || '';
}


/* ===========================================================
   [2] DOMContentLoaded — Main Entry
=========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     [2-1] Hamburger / Mobile Navigation
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
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }


  /* =========================================================
     [2-2] Header Scroll Effect
  ========================================================= */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    });
  }


  /* =========================================================
     [2-3] Fade-up Animation (IntersectionObserver)
  ========================================================= */
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


  /* =========================================================
     [2-4] Email Input UX Validation (Frontend only)
  ========================================================= */
  const emailInput = document.getElementById('r_email');
  if (emailInput) {
    const error = document.createElement('div');
    error.textContent = t('emailInvalid');
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


  /* =========================================================
     [2-5] Reservation Form — Course Builder Logic
  ========================================================= */
  function initReservationForm() {
    const form = document.getElementById('reservationForm');
    const courseList = document.getElementById('courseList');
    const addBtn = document.getElementById('addCourseBtn');

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
      if (!DURATION_RULES[resort]) return;

      const allowed = DURATION_RULES[resort];
      const prev = durationSelect.value;

      durationSelect.innerHTML = '<option value="">選擇時數</option>';

      allowed.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = `${h} 小時`;
        durationSelect.appendChild(opt);
      });

      if (allowed.includes(prev)) durationSelect.value = prev;
    }

    function createCourseItem(index) {
      const div = document.createElement('div');
      div.className = 'course-item';

      div.innerHTML = `
        <h3>課程 ${index + 1}</h3>
        <label>日期</label>
        <input type="date" name="course_date[]" required>
        <label>SKI or SNOWBOARD</label>
        <select name="boardType[]" required>
          <option value="">請選擇</option>
          <option value="Ski">雙板 SKI</option>
          <option value="Snowboard">單板 SNOWBOARD</option>
        </select>
        <label>程度 LEVEL</label>
        <select name="level[]" required>
          <option value="firstTime">無經驗</option>
          <option value="Beginner">初級</option>
          <option value="Intermediate">中級</option>
          <option value="Advanced">高級</option>
        </select>
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
            <option value="09:00-12:00">09:00 — 12:00</option>
            <option value="13:00-16:00">13:00 — 16:00</option>
            <option value="other">其他（請在備註留言）</option>
          </select>
        </div>
        <button type="button" class="delete-course">刪除此課程</button>
        <hr class="course-split">
      `;
      return div;
    }

    if (!courseList.children.length) {
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
        slot?.classList.toggle('is-visible', e.target.value === '3');
      }
    });

    courseList.addEventListener('click', e => {
      if (e.target.classList.contains('delete-course')) {
        e.target.closest('.course-item')?.remove();
      }
    });

    console.log('[Reservation] init OK');
  }


  /* =========================================================
     [2-6] Reservation Submit → Google Apps Script
  ========================================================= */
  const form = document.getElementById('reservationForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const email = document.getElementById('r_email')?.value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
        alert(t('emailCheck'));
        return;
      }

      const submitBtn = form.querySelector('.btn-submit');
      const loading = document.getElementById('loading');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = t('submitting');
      }
      if (loading) loading.style.display = 'inline-block';

      try {
        const res = await fetch(
          'https://script.google.com/macros/s/AKfycbwehnjw-ALHqadYW65BBfzwCe3qWHJkgoFbF8B_q51_wwoG9u8_JgpVDkGFbGvwg2TWBw/exec',
          { method: 'POST', body: new FormData(form) }
        );

        if (!res.ok) throw new Error('Network error');

        const result = await res.json();
        if (!result.ok) throw new Error('GAS error');

        window.location.href = 'thank-you.html';

      } catch (err) {
        console.error(err);
        alert(t('submitFailed'));

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = t('submit');
        }
        if (loading) loading.style.display = 'none';
      }
    });
  }


  /* =========================================================
     [2-7] Smooth Anchor Scroll
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#' || id.length <= 1) return;

      const target = document.querySelector(id);
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
