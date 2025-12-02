// 載入 main.html
fetch('main.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('main-container').innerHTML = html;

    // --- 重要：載入後要重新初始化事件 ---
    // Hamburger & mobile nav
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobileNav');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      mobileNav.setAttribute('aria-hidden', mobileNav.classList.contains('active') ? 'false' : 'true');
    });
    mobileNav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=> {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });

    // Smooth scroll & close mobile
    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
      anchor.addEventListener('click',function(e){
        const href = this.getAttribute('href');
        if(!href || href === '#') return;
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
          if(mobileNav.classList.contains('active')){
            mobileNav.classList.remove('active');
            hamburger.classList.remove('active');
          }
        }
      });
    });

    // Header scroll effect
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', ()=> {
      if(window.scrollY > 30) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });

    // Fade-in animation
    const faders = document.querySelectorAll('.fade-up');
    const appearOptions = {threshold: 0.12, rootMargin: "0px 0px -60px 0px"};
    const appearOnScroll = new IntersectionObserver(function(entries, observer){
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, appearOptions);
    faders.forEach(f => appearOnScroll.observe(f));

    // Form handling
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
      setTimeout(()=> {
        loading.style.display = 'none';
        form.style.display = 'none';
        thankyou.style.display = 'block';
        console.log('Reservation data (client only):', data);
      }, 900);
    });
  });