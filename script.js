const { useState, useEffect, useRef } = React;
const dcPhoto = './assents/DSC_1396.JPG';

// ---------- Small reusable icon renderer ----------
function Icon({ d, vb = "0 0 24 24" }) {
  return (
    <svg
      viewBox={vb}
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}

// Raw <path>/<rect>/... markup for each icon, keyed by name
const ic = {
  code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
  layers: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6" y2="6"/><line x1="6" y1="18" x2="6" y2="18"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  trending: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="8" x2="9" y2="8"/><line x1="15" y1="8" x2="15" y2="8"/><line x1="9" y1="13" x2="9" y2="13"/><line x1="15" y1="13" x2="15" y2="13"/><line x1="9" y1="18" x2="15" y2="18"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  gh: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  in: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  up: '<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>',
};

// ---------- Fade-in-on-scroll wrapper ----------
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, visible];
}

function Reveal({ children }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        transition: 'opacity .7s, transform .7s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(24px)',
      }}
    >
      {children}
    </div>
  );
}

// ---------- Header / navigation ----------
function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const links = [
    ['#about', 'About'],
    ['#services', 'Services'],
    ['#skills', 'Skills'],
    ['#projects', 'Projects'],
    ['#experience', 'Experience'],
    ['#contact', 'Contact'],
  ];

  return (
    <header>
      <div className="navrow">
        <div className="logo">
          DANIEL<span>.dev</span>
        </div>

        <nav className="navlinks">
          {links.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="iconbtn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            ◐
          </button>
          <button
            id="menuBtn"
            className="iconbtn"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div id="mobileNav" className="wrap" style={{ paddingBottom: '16px' }}>
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section className="hero wrap" style={{ paddingTop: '64px', paddingBottom: '84px' }}>
      <div className="hero-grid">
        <div>
          <span className="tag">Software Engineer</span>
          <h1>Daniel Nyamongo</h1>
          <p className="lede">I build reliable, scalable, and user-friendly software.</p>
          <p className="bio">
            Daniel turns complex ideas into clean, maintainable frontend and backend
            applications. He values clean code and meaningful digital products,
            collaborates efficiently within agile teams, and prioritizes continuous
            technological learning.
          </p>
          <div className="handle">@Biyaki25</div>

          <div className="ctas">
            <a href="#projects" className="btn btn-primary">View my projects</a>
            <a href="#contact" className="btn btn-outline">Contact me</a>
          </div>

          <div className="socials">
            <a href="https://github.com/Biyaki25" target="_blank" rel="noopener" aria-label="GitHub">
              <Icon d={ic.gh} />
            </a>
            <a href="https://www.linkedin.com/in/daniel-kamanda-a356ba38a" target="_blank" rel="noopener" aria-label="LinkedIn">
              <Icon d={ic.in} />
            </a>
            <a href="mailto:danielnyamongo704@gmail.com" aria-label="Email">
              <Icon d={ic.mail} />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="photo-ring">
            <img
              src={dcPhoto}
              alt="Daniel Nyamongo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <div className="code-float">
            <div style={{ color: '#7a8a92' }}>// Software Engineering Dossier</div>
            <div>
              <span style={{ color: 'var(--accent)' }}>const</span> dev = {'{'} name: "Daniel Nyamongo", stack: ["TS", "Py", "Go"] {'}'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- About ----------
function About() {
  const items = [
    [ic.code, 'Clean, maintainable code', 'Readable structure over clever shortcuts.'],
    [ic.layers, 'Systems-level thinking', 'Designing for how pieces fit together.'],
    [ic.users, 'Collaborative by default', 'Works well inside agile teams.'],
  ];

  return (
    <section id="about" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">About</div>
          <h2>Who I am</h2>
        </div>

        <div className="grid-2">
          <div style={{ color: 'var(--text2)', maxWidth: '560px' }}>
            <p style={{ marginBottom: '16px' }}>
              A software engineer committed to the craftsmanship of high-performing
              web tools. I thrive on architecting clean microservices, building
              pixel-perfect interfaces, and managing end-to-end user experiences.
            </p>
            <p>
              My philosophy centers around modern systems design, continuous
              profiling for latency, and active team contributions. I'd rather ship
              one thing that works well than five things that half-work.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {items.map(([icon, title, desc], i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: '14px', padding: '16px' }}>
                <span className="icwrap" style={{ flexShrink: 0 }}>
                  <Icon d={icon} />
                </span>
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '3px' }}>{title}</h4>
                  <p style={{ color: 'var(--text2)', fontSize: '0.8rem', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}

            <div className="card" style={{ padding: '18px 20px' }}>
              <div className="mono" style={{ color: 'var(--text2)', fontSize: '0.82rem', marginBottom: '6px' }}>
                Currently focused on
              </div>
              Developing cloud-native microservices &amp; interactive React architectures.
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Services ----------
function Services() {
  const services = [
    [ic.monitor, 'Product-Minded Frontend', 'Building responsive, accessible interfaces in React and TypeScript that feel fast and intuitive, from component architecture to pixel-level polish.'],
    [ic.server, 'Reliable Backend & APIs', 'Designing REST APIs and backend services with Node.js and Express, focused on clear structure, solid error handling, and maintainability.'],
    [ic.database, 'Database Design', 'Modeling relational and document data in PostgreSQL, MySQL, and MongoDB, balancing normalization with real-world query performance.'],
    [ic.rocket, 'DevOps & Deployment', 'Setting up Git workflows, Docker containers, and CI/CD pipelines so code ships smoothly and reliably.'],
  ];

  return (
    <section id="services" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">Services</div>
          <h2>How I can help</h2>
        </div>

        <div className="grid-2c">
          {services.map(([icon, title, desc], i) => (
            <div key={i} className="card" style={{ padding: '24px' }}>
              <div className="icwrap" style={{ width: '46px', height: '46px', marginBottom: '16px' }}>
                <Icon d={icon} />
              </div>
              <h3 style={{ fontSize: '1.02rem', marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Skills ----------
function Skills() {
  const groups = [
    [ic.code, 'Programming Languages', ['JavaScript', 'TypeScript', 'Python', 'Java', 'SQL']],
    [ic.monitor, 'Frontend Development', ['HTML5', 'CSS3', 'React.js', 'Next.js', 'Tailwind CSS', 'Responsive Design']],
    [ic.server, 'Backend Development', ['Node.js', 'Express.js', 'REST APIs', 'Auth & OAuth', 'API Integration']],
    [ic.database, 'Databases', ['PostgreSQL', 'MySQL', 'MongoDB']],
    [ic.settings, 'DevOps & Tools', ['Git & GitHub', 'Docker', 'Linux', 'CI/CD']],
    [ic.layers, 'Software Engineering', ['OOP', 'Data Structures', 'Algorithms', 'Database Design', 'Cloud Deployment', 'System Design']],
  ];

  return (
    <section id="skills" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">Toolkit</div>
          <h2>Technical expertise</h2>
        </div>

        <div className="grid-3">
          {groups.map(([icon, title, tags], i) => (
            <div key={i} className="card" style={{ padding: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.95rem', marginBottom: '14px' }}>
                <span style={{ color: 'var(--accent)' }}>
                  <Icon d={icon} />
                </span>
                {title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map((tag) => (
                  <span key={tag} className="pill">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Projects (with client-side category filter) ----------
function Projects() {
  const allProjects = [
    {
      name: 'Project Alpha Stream',
      desc: 'A mock software pipeline processing telemetry data using state-of-the-art mock architectures. Fully representative prototype.',
      tags: ['Next.js', 'Express', 'Docker'],
      category: 'Node.js',
    },
    {
      name: 'Project Beta Shield',
      desc: 'A mock cyber intelligence sandbox dashboard showcasing active telemetry feeds. Visual lift-glow state example.',
      tags: ['MongoDB', 'React'],
      category: 'React',
    },
    {
      name: 'Project Gamma Cloud',
      desc: 'Mock asset manager illustrating automated database indexing and migration protocols within microservices.',
      tags: ['PostgreSQL'],
      category: '',
    },
  ];

  const [filter, setFilter] = useState('All Work');
  const visibleProjects = allProjects.filter(
    (p) => filter === 'All Work' || p.category === filter
  );

  return (
    <section id="projects" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">Gallery</div>
          <h2>Featured projects</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '26px', flexWrap: 'wrap' }}>
          {['All Work', 'React', 'Node.js'].map((label) => (
            <button
              key={label}
              className={'filter-btn' + (filter === label ? ' active' : '')}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid-3">
          {visibleProjects.map((p) => (
            <article key={p.name} className="card proj-card">
              <div className="proj-thumb">{p.name}</div>
              <div style={{ padding: '18px' }}>
                <h3 style={{ fontSize: '1.02rem', marginBottom: '8px' }}>{p.name}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '12px' }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {p.tags.map((tag) => (
                    <span key={tag} className="pill" style={{ fontSize: '0.72rem', padding: '3px 9px' }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--accent)' }}>
                  <a href="#" onClick={(e) => e.preventDefault()}>Live Demo</a>
                  <a href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Experience ----------
function Experience() {
  const roles = [
    ['Web Developer', 'Adidas', 'Full-time · Herzogenaurach, Germany (placeholder location) · Jan 2025 – Oct 2025'],
    ['Backend Developer', 'Lami Technologies', 'Freelance · Herzogenaurach, Germany (placeholder location) · Jan 2025 – Oct 2025'],
  ];

  return (
    <section id="experience" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">Timeline</div>
          <h2>Work experience</h2>
        </div>

        <div className="timeline">
          {roles.map(([title, company, meta], i) => (
            <div key={i} className="tl-item">
              <h3 style={{ fontSize: '1.05rem', marginBottom: '2px' }}>{title} — {company}</h3>
              <div style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '10px' }}>{meta}</div>
              <ul style={{ color: 'var(--text2)', fontSize: '0.9rem', paddingLeft: '18px', marginBottom: '10px' }}>
                <li>[ Achievement placeholder ] Collaborated on scalable storefront components and increased localized UI responsiveness metrics.</li>
                <li>[ Achievement placeholder ] Integrated internal analytics tooling using React.js workflows and REST APIs.</li>
              </ul>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['React.js', 'JavaScript', 'TypeScript', 'Tailwind CSS'].map((tag) => (
                  <span key={tag} className="pill" style={{ fontSize: '0.72rem', padding: '3px 9px' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Education ----------
function Education() {
  return (
    <section id="education" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">Credentials</div>
          <h2>Education &amp; certifications</h2>
        </div>

        <div className="grid-2c">
          <div className="card" style={{ padding: '20px' }}>
            <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.75rem', marginBottom: '10px' }}>Graduate Program</div>
            <h3 style={{ fontSize: '1.02rem', marginBottom: '4px' }}>Software Engineering</h3>
            <div style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '10px' }}>Moringa School</div>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
              Comprehensive technical curriculum focusing on modern software design patterns and full-stack development.
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div className="mono" style={{ color: 'var(--accent)', fontSize: '0.75rem', marginBottom: '10px' }}>Certification</div>
            <h3 style={{ fontSize: '1.02rem', marginBottom: '4px' }}>Python Certification</h3>
            <div style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '10px' }}>Simplilearn SkillUp</div>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>Credential Code: 9702514</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ---------- GitHub activity ----------
function Github() {
  const repos = [
    ['Biyaki25 / mock-engine-core', 'TypeScript', 'Minimal mock compiler written in TypeScript.'],
    ['Biyaki25 / clean-rest-api', 'JavaScript', 'Boilerplate template illustrating clean architecture and JWT logic.'],
  ];

  return (
    <section id="github" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">Contributions</div>
          <h2>GitHub activity</h2>
        </div>

        <div className="grid-2c" style={{ marginBottom: '18px', maxWidth: '560px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div className="stat-num">1,482*</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.82rem', marginTop: '4px' }}>Mock commits (YTD)</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.72rem', marginTop: '6px', opacity: 0.8 }}>*Visibly labeled placeholder numbers</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div className="stat-num">94*</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.82rem', marginTop: '4px' }}>Pull requests</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.72rem', marginTop: '6px', opacity: 0.8 }}>*Visibly labeled placeholder numbers</div>
          </div>
        </div>

        <div className="grid-2c">
          {repos.map(([name, lang, desc], i) => (
            <div key={i} className="card" style={{ padding: '18px' }}>
              <h3 className="mono" style={{ fontSize: '0.92rem', marginBottom: '6px' }}>{name}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '8px' }}>{desc}</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginRight: '6px' }} />
                {lang}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Who I work with ----------
function Clients() {
  const clientTypes = [
    [ic.rocket, 'Early-Stage Startups', 'Teams that need to move fast without cutting corners — I like helping lay a foundation that won\u2019t need rebuilding in six months.'],
    [ic.trending, 'Growing Product Teams', 'Teams outgrowing their current stack, looking for someone who can pick up existing code and extend it cleanly.'],
    [ic.building, 'Small & Medium Businesses', 'Businesses ready to modernize manual processes into dependable, automated systems.'],
  ];

  return (
    <section id="clients" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">Fit</div>
          <h2>Who I work well with</h2>
        </div>

        <div className="grid-3">
          {clientTypes.map(([icon, title, desc], i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '26px 20px' }}>
              <div className="icwrap" style={{ width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 16px' }}>
                <Icon d={icon} />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.85rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Contact form ----------
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);

  function validate(values) {
    const errs = {};
    if (values.name.trim().length < 2) errs.name = 'Please enter at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Please enter a valid email address.';
    if (values.message.trim().length < 10) errs.message = 'Message should be at least 10 characters.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setStatus('Thanks — your message looks good and is ready to send.');
      setForm({ name: '', email: '', message: '' });
    } else {
      setStatus('Please fix the highlighted fields.');
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('danielnyamongo704@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      // clipboard API unavailable — fail silently
    }
  }

  return (
    <section id="contact" className="wrap">
      <Reveal>
        <div className="sec-head">
          <div className="eyebrow">Reach out</div>
          <h2>Get in touch</h2>
        </div>

        <div className="grid-2">
          <div>
            <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
              Have an interesting project or position? I'm always open to discussing
              clean code, front-end optimization, and robust back-end pipelines.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field" style={{ marginBottom: '16px' }}>
                <label htmlFor="cname">Your Name</label>
                <input
                  id="cname"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <div className="err">{errors.name || ''}</div>
              </div>

              <div className="field" style={{ marginBottom: '16px' }}>
                <label htmlFor="cemail">Your Email</label>
                <input
                  id="cemail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <div className="err">{errors.email || ''}</div>
              </div>

              <div className="field" style={{ marginBottom: '16px' }}>
                <label htmlFor="cmsg">Message</label>
                <textarea
                  id="cmsg"
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <div className="err">{errors.message || ''}</div>
              </div>

              <button type="submit" className="btn btn-primary">Send Message</button>
              <div role="status" style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '8px', minHeight: '1.2em' }}>
                {status}
              </div>
            </form>
          </div>

          <div>
            <p style={{ color: 'var(--text2)', marginBottom: '18px' }}>Let's collaborate on software solutions.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', fontSize: '0.92rem', flexWrap: 'wrap' }}>
              <Icon d={ic.mail} />
              <a href="mailto:danielnyamongo704@gmail.com">danielnyamongo704@gmail.com</a>
              <button
                onClick={copyEmail}
                type="button"
                style={{ fontSize: '0.78rem', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '8px', color: 'var(--text2)', cursor: 'pointer', background: 'none' }}
              >
                {copied ? 'Copied!' : 'Copy Email'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', fontSize: '0.92rem' }}>
              <Icon d={ic.phone} />
              +254 790 715 010
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', fontSize: '0.92rem' }}>
              <Icon d={ic.in} />
              <a href="https://www.linkedin.com/in/daniel-kamanda-a356ba38a" target="_blank" rel="noopener">
                linkedin.com/in/daniel-kamanda-a356ba38a
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem' }}>
              <Icon d={ic.gh} />
              <a href="https://github.com/Biyaki25" target="_blank" rel="noopener">
                github.com/Biyaki25
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap foot-row">
        <div>
          <div style={{ fontWeight: 600 }}>Daniel Nyamongo</div>
          <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>Biyaki25 · © {year} Daniel Nyamongo. All rights reserved.</div>
        </div>

        <div style={{ display: 'flex', gap: '16px', color: 'var(--text2)' }}>
          <a href="https://github.com/Biyaki25" target="_blank" rel="noopener" aria-label="GitHub">
            <Icon d={ic.gh} />
          </a>
          <a href="https://www.linkedin.com/in/daniel-kamanda-a356ba38a" target="_blank" rel="noopener" aria-label="LinkedIn">
            <Icon d={ic.in} />
          </a>
          <a href="mailto:danielnyamongo704@gmail.com" aria-label="Email">
            <Icon d={ic.mail} />
          </a>
        </div>

        <button id="backTop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}

// ---------- App root ----------
function App() {
  return (
    <React.Fragment>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Github />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);