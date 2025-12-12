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
   Reservation Form → Google Sheet
=========================================================== */
const GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbwWGqhq9PEzCAJguEliRCpL_WLld8voFfAtL6cHAvwIqaiqWzQNKHrIIXi1bMlJHrLgsw/exec";


const form = document.getElementById("reservationForm");
const thankyou = document.getElementById("thankyou");
const loading = document.getElementById("loading");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 收集多堂課資料
  const courses = [];
  document.querySelectorAll(".course-item").forEach((item) => {
    const course = {
      date: item.querySelector('input[type="date"]')?.value || "",
      resort: item.querySelector('select[name*="resort"]')?.value || "",
      duration: item.querySelector('select.duration')?.value || "",
      timeslot: item.querySelector('.time-slot select')?.value || ""
    };

    if (course.date && course.resort && course.duration) {
      courses.push(course);
    }
  });

  if (courses.length === 0) {
    alert("請至少填寫一堂課程");
    return;
  }

  // 使用者資料
  const payload = {
    name: document.getElementById("r_name").value.trim(),
    email: document.getElementById("r_email").value.trim(),
    contactMethod: document.getElementById("r_contactMethod").value,
    contactID: document.getElementById("r_contactID").value.trim(),
    remarks: document.getElementById("r_remarks").value.trim(),
    courses
  };

  // 基本前端驗證
  for (const key of ["name", "email", "contactMethod", "contactID"]) {
    if (!payload[key]) {
      alert("請完整填寫所有必填欄位");
      return;
    }
  }

  // 顯示 loading
  loading.style.display = "inline-block";

  try {
    const res = await fetch(GOOGLE_SHEET_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!result.ok) {
      throw new Error(result.error || "Submission failed");
    }

    // 成功
    loading.style.display = "none";
    form.style.display = "none";
    thankyou.style.display = "block";

  } catch (err) {
    loading.style.display = "none";
    alert("送出失敗，請稍後再試或直接聯絡我們");
    console.error(err);
  }
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