/* ===========================================================
   CLASS NISEKO — i18n Dictionary
   -----------------------------------------------------------
   - Global: window.I18N
   - Access helper: window.t(keyPath)
   - Language source: <html lang="zh|en">
=========================================================== */

window.I18N = {
  zh: {
    hero: {
      brand: 'CLASS NISEKO',
      title: '北海道二世古私人滑雪課程',
      subtitle: 'CLASS NISEKO 提供雙板與單板私人教學，適合初學者與進階滑雪者。',
      ctaPrimary: '立即預約',
      ctaSecondary: '了解課程'
    },
    courses: {
      title: '課程介紹'
    },

    /* ===== 共用 / 表單 / JS 用語 ===== */
    common: {
      submit: '送出',
      submitting: '送出中...',
      processing: '處理中...'
    },
    form: {
      emailInvalid: '請輸入正確的 Email 格式',
      emailCheck: '請確認 Email 格式是否正確',
      submitFailed: '送出失敗，請稍後再試或直接聯絡我們'
    }
  },

  en: {
    hero: {
      brand: 'CLASS NISEKO',
      title: 'Private Ski & Snowboard Lessons in Niseko',
      subtitle: 'Private ski and snowboard lessons for beginners to advanced riders.',
      ctaPrimary: 'Book Now',
      ctaSecondary: 'View Courses'
    },
    courses: {
      title: 'COURSES'
    },

    /* ===== Common / Form / JS ===== */
    common: {
      submit: 'Submit',
      submitting: 'Submitting...',
      processing: 'Processing...'
    },
    form: {
      emailInvalid: 'Please enter a valid email address.',
      emailCheck: 'Please check that your email address is valid.',
      submitFailed: 'Submission failed. Please try again later or contact us directly.'
    }
  }
};


/* ===========================================================
   Language & Access Helper
=========================================================== */

// 語言來源：HTML lang（標準做法）
function getLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'zh';
}

// keyPath 用法： t('form.emailInvalid')
window.t = function (keyPath) {
  const lang = getLang();
  const fallback = window.I18N.zh;

  return keyPath
    .split('.')
    .reduce((obj, key) => obj?.[key], window.I18N[lang])
    ?? keyPath
      .split('.')
      .reduce((obj, key) => obj?.[key], fallback)
    ?? '';
};
