// ===== Theme toggle (persisted; dark/black is the default) =====
const root = document.documentElement;
function setTheme(t) {
  root.setAttribute('data-theme', t);
  try { localStorage.setItem('theme', t); } catch (e) {}
}
try {
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
} catch (e) {}
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });
}

// ===== Mobile nav =====
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
if (menuBtn && mobileNav) {
  menuBtn.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    })
  );
}

// ===== Skills with real technology logos (Devicon) =====
// [label, devicon slug or '', invert-in-dark?]
const SKILLS = {
  skLang: [['JavaScript', 'javascript'], ['TypeScript', 'typescript'], ['Python', 'python'], ['Java', 'java'], ['SQL', '']],
  skFront: [['HTML5', 'html5'], ['CSS3', 'css3'], ['React.js', 'react'], ['Next.js', 'nextjs', 1], ['Tailwind CSS', 'tailwindcss'], ['Responsive Design', '']],
  skBack: [['Node.js', 'nodejs'], ['Express.js', 'express', 1], ['REST APIs', ''], ['Auth & OAuth', ''], ['API Integration', '']],
  skDb: [['PostgreSQL', 'postgresql'], ['MySQL', 'mysql'], ['MongoDB', 'mongodb']],
  skTools: [['Git & GitHub', 'github', 1], ['Docker', 'docker'], ['Linux', 'linux'], ['CI/CD', '']],
  skEng: [['OOP', ''], ['Data Structures', ''], ['Algorithms', ''], ['Database Design', ''], ['Cloud Deployment', ''], ['System Design', '']],
};
const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';
Object.entries(SKILLS).forEach(([id, items]) => {
  const box = document.getElementById(id);
  if (!box) return;
  items.forEach(([label, slug, inv]) => {
    const pill = document.createElement('span');
    pill.className = 'pill';
    if (slug) {
      const img = new Image();
      img.src = `${CDN}${slug}/${slug}-original.svg`;
      img.alt = '';
      img.loading = 'lazy';
      if (inv) img.className = 'inv';
      img.onerror = () => img.remove();
      pill.appendChild(img);
    }
    pill.appendChild(document.createTextNode(label));
    box.appendChild(pill);
  });
});

// ===== Reveal-on-scroll =====
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ===== Project filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projGrid .proj-card');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      card.hidden = !(filter === 'All Work' || card.dataset.category === filter);
    });
  });
});

// ===== Copy email =====
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('danielnyamongo704@gmail.com');
      copyEmailBtn.textContent = 'Copied!';
    } catch (e) {
      copyEmailBtn.textContent = 'Copy failed';
    }
    setTimeout(() => { copyEmailBtn.textContent = 'Copy Email'; }, 1800);
  });
}

// ===== Contact form validation =====
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
function validateField(input, errId, msg, test) {
  const ok = test(input.value);
  const err = document.getElementById(errId);
  if (err) err.textContent = ok ? '' : msg;
  return ok;
}
if (form) {
  const rules = [
    [document.getElementById('cname'), 'err-name', 'Please enter at least 2 characters.', (v) => v.trim().length >= 2],
    [document.getElementById('cemail'), 'err-email', 'Please enter a valid email address.', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)],
    [document.getElementById('cmsg'), 'err-msg', 'Message should be at least 10 characters.', (v) => v.trim().length >= 10],
  ];
  rules.forEach(([input, errId, msg, test]) =>
    input.addEventListener('blur', () => validateField(input, errId, msg, test))
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = rules.map(([i, id, m, t]) => validateField(i, id, m, t)).every(Boolean);
    if (formStatus) formStatus.textContent = ok
      ? 'Thanks — your message looks good and is ready to send.'
      : 'Please fix the highlighted fields.';
    if (ok) form.reset();
  });
}

// ===== Back to top & footer year =====
const backTop = document.getElementById('backTop');
if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();