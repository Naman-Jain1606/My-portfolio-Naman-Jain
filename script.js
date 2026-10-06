/**
 * script.js
 * Interactive Avengers Portfolio Engine for Naman Jain
 * Features:
 * - Dynamic Avengers Canvas Particle & Hologram system
 * - Fullscreen Avengers Page Transitions with sound synchronization
 * - Dynamic Typewriter effect
 * - Theme Switcher (Iron Man, Cap, Thor, Strange, Spider-Man, Panther, Multiverse)
 * - Project Filter & Interactive Demo Modals
 * - Contact transmission and 1-click copy helpers
 */

// ==========================================
// 1. STATE & ROUTING SETUP
// ==========================================
const portfolioState = {
  activeSection: 'home',
  currentTheme: 'all',
  isTransitioning: false,
  soundActive: false
};

// Available sections & their specific Avengers transition data
const avengersTransitions = {
  home: {
    hero: 'Iron Man',
    subtitle: 'REPULSOR SYSTEM ARMED',
    class: 'active-ironman',
    sound: () => window.avengersAudio?.playRepulsor()
  },
  about: {
    hero: 'Captain America',
    subtitle: 'VIBRANIUM SHIELD ENGAGED',
    class: 'active-cap',
    sound: () => window.avengersAudio?.playShieldClang()
  },
  education: {
    hero: 'Doctor Strange',
    subtitle: 'MYSTIC PORTAL OPENED',
    class: 'active-strange',
    sound: () => window.avengersAudio?.playPortalSparks()
  },
  skills: {
    hero: 'Thor Odinson',
    subtitle: 'BIFROST THUNDER STRIKE',
    class: 'active-thor',
    sound: () => window.avengersAudio?.playThunder()
  },
  projects: {
    hero: 'Spider-Man',
    subtitle: 'STARK TECH LAB SLING',
    class: 'active-spiderman',
    sound: () => window.avengersAudio?.playWebThwip()
  },
  achievements: {
    hero: 'Black Panther',
    subtitle: 'VIBRANIUM KINETIC PULSE',
    class: 'active-panther',
    sound: () => window.avengersAudio?.playKineticPulse()
  },
  contact: {
    hero: 'Avengers Assemble',
    subtitle: 'TRANSMISSION BEACON LOCKED',
    class: 'active-avengers',
    sound: () => window.avengersAudio?.playHoloBeep()
  }
};

// ==========================================
// 2. AVENGERS PAGE TRANSITION CONTROLLER
// ==========================================
function navigateToSection(targetId, skipTransition = false) {
  if (portfolioState.isTransitioning || !targetId) return;
  const currentId = portfolioState.activeSection;
  if (currentId === targetId && !skipTransition) return;

  const targetSectionEl = document.getElementById(targetId);
  if (!targetSectionEl) return;

  const portalOverlay = document.getElementById('avengers-transition-portal');
  const portalTitle = document.getElementById('portal-hero-title');
  const transitionData = avengersTransitions[targetId] || avengersTransitions.home;

  if (skipTransition) {
    // Direct switch without animation
    switchSectionView(targetId);
    return;
  }

  // Play cinematic Avengers transition
  portfolioState.isTransitioning = true;
  portalTitle.textContent = `${transitionData.hero} // ${transitionData.subtitle}`;

  // Reset classes and apply target hero transition class
  portalOverlay.className = `active ${transitionData.class}`;

  // Trigger sound effect
  transitionData.sound();

  // Halfway through transition, switch the active DOM section
  setTimeout(() => {
    switchSectionView(targetId);
  }, 380);

  // Complete and hide transition overlay
  setTimeout(() => {
    portalOverlay.className = '';
    portfolioState.isTransitioning = false;
  }, 820);
}

function switchSectionView(targetId) {
  portfolioState.activeSection = targetId;

  // Update Sections
  document.querySelectorAll('.portfolio-section').forEach(section => {
    section.classList.remove('active');
  });
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update Nav Links
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === `#${targetId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update Floating Dock
  document.querySelectorAll('.dock-btn').forEach(btn => {
    if (btn.getAttribute('data-target') === targetId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update URL hash without jumping
  if (history.pushState) {
    history.pushState(null, null, `#${targetId}`);
  } else {
    location.hash = `#${targetId}`;
  }
}

// ==========================================
// 3. TYPEWRITER EFFECT
// ==========================================
const typewriterPhrases = [
  "B.Tech CSE 1st Year @ JECRC",
  "Aspiring Software Engineer",
  "Exploring C++, DSA & Web Dev",
  "Learning Step-by-Step with Passion",
  "Avengers & Marvel Universe Fan"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 90;

function runTypewriter() {
  const targetEl = document.getElementById('typewriter-text');
  if (!targetEl) return;

  const currentPhrase = typewriterPhrases[phraseIndex];

  if (isDeleting) {
    targetEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 45;
  } else {
    targetEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 85;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 1600; // Pause at full phrase
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
    typeSpeed = 400;
  }

  setTimeout(runTypewriter, typeSpeed);
}

// ==========================================
// 4. HERO THEME SWITCHER
// ==========================================
function initThemeSwitcher() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const dropdown = document.getElementById('theme-dropdown');
  const options = document.querySelectorAll('.theme-option');

  if (!toggleBtn || !dropdown) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    window.avengersAudio?.playClick();
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedTheme = opt.getAttribute('data-theme');
      setHeroTheme(selectedTheme);
      dropdown.classList.remove('open');
      window.avengersAudio?.playClick();
    });
  });
}

function setHeroTheme(themeName) {
  portfolioState.currentTheme = themeName;
  document.body.setAttribute('data-hero-theme', themeName);
  localStorage.setItem('naman_portfolio_theme', themeName);

  // Update button label
  const label = document.getElementById('current-theme-name');
  if (label) {
    const themeDisplay = {
      all: 'Multiverse',
      ironman: 'Iron Man',
      cap: 'Captain America',
      thor: 'Thor',
      strange: 'Dr. Strange',
      spiderman: 'Spider-Man',
      panther: 'Black Panther'
    };
    label.textContent = themeDisplay[themeName] || 'Theme';
  }
}

// ==========================================
// 5. AUDIO TOGGLE SYSTEM
// ==========================================
function initAudioToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-status-icon');
  const soundLabel = document.getElementById('sound-status-label');

  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    const active = window.avengersAudio?.toggleSound();
    portfolioState.soundActive = active;

    if (active) {
      soundBtn.classList.add('active');
      soundIcon.className = 'fa-solid fa-volume-high';
      soundLabel.textContent = 'FX: ON';
      window.avengersAudio.playClick();
      showToast('🔊 Jarvis Audio FX Enabled!');
    } else {
      soundBtn.classList.remove('active');
      soundIcon.className = 'fa-solid fa-volume-xmark';
      soundLabel.textContent = 'FX: OFF';
      showToast('🔇 Audio FX Muted');
    }
  });
}

// ==========================================
// 6. DYNAMIC AVENGERS BACKGROUND CANVAS
// ==========================================
function initAvengersCanvas() {
  const canvas = document.getElementById('avengers-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle constellation
  const numParticles = 65;
  const particles = [];

  // Avengers Glyphs
  const glyphs = ['⚛️', '⭐', '⚡', '👁️', '🕸️', '🔺', '🛡️', '🔷'];

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 2 + 1,
      glyph: i % 8 === 0 ? glyphs[Math.floor(Math.random() * glyphs.length)] : null,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    // Render particles & Avengers glyphs
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse proximity repulsion
      const mdx = mouseX - p.x;
      const mdy = mouseY - p.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 120) {
        const force = (120 - mDist) / 120;
        p.x -= (mdx / mDist) * force * 1.5;
        p.y -= (mdy / mDist) * force * 1.5;
      }

      if (p.glyph) {
        ctx.font = '14px Outfit, sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.4})`;
        ctx.fillText(p.glyph, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 243, 255, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00f3ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// ==========================================
// 7. PROJECT FILTERING & DEMO MODALS
// ==========================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      window.avengersAudio?.playClick();

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

// Project Interactive Modal System
const projectDetailsData = {
  quiz: {
    title: 'Avengers Multiverse Tech Quiz Arena',
    badge: 'JavaScript & Web Audio Interactive Game',
    desc: 'An interactive quiz built using Vanilla JavaScript and CSS animations. Test your knowledge of Avengers lore, Tony Stark technology, and computer science trivia.',
    highlights: [
      'Interactive scoring & timer system',
      'Custom Marvel sound effects & victory animations',
      'Dynamic question shuffle and progress indicator',
      'What I Learned: DOM state management, array manipulations, and Web Audio API'
    ],
    interactiveHtml: `
      <div style="background: rgba(0,0,0,0.4); padding: 1.2rem; border-radius: 10px; border: 1px solid var(--border-glow); margin-top: 1rem;">
        <h4 style="color: var(--arc-cyan); margin-bottom: 0.5rem; font-family: var(--font-hud);">Mini Trivia Demo</h4>
        <p style="font-size: 0.95rem; margin-bottom: 0.8rem; color:#fff;">Q: What powers Tony Stark's Iron Man suits?</p>
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <button class="control-btn" onclick="checkQuizAnswer(this, true)" style="text-align:left; justify-content:flex-start;">A) The Arc Reactor (Palladium / New Element)</button>
          <button class="control-btn" onclick="checkQuizAnswer(this, false)" style="text-align:left; justify-content:flex-start;">B) Standard Lithium Battery</button>
          <button class="control-btn" onclick="checkQuizAnswer(this, false)" style="text-align:left; justify-content:flex-start;">C) Vibranium Solar Cell</button>
        </div>
        <p id="quiz-demo-feedback" style="margin-top:0.8rem; font-size:0.85rem; font-weight:bold;"></p>
      </div>
    `
  },
  cgpa: {
    title: 'JECRC University Semester CGPA Estimator',
    badge: 'Utility Tool for CSE Students',
    desc: 'A handy calculation tool designed to help first-year students at JECRC University calculate their semester SGPA and cumulative CGPA based on credit points and grade scales.',
    highlights: [
      'Calculates SGPA based on subject credit weights',
      'Live grade point prediction',
      'Clean user interface with instant real-time calculation',
      'What I Learned: Form data validation, mathematical logic parsing, and responsive UI'
    ],
    interactiveHtml: `
      <div style="background: rgba(0,0,0,0.4); padding: 1.2rem; border-radius: 10px; border: 1px solid var(--border-glow); margin-top: 1rem;">
        <h4 style="color: var(--thor-lightning); margin-bottom: 0.5rem; font-family: var(--font-hud);">Try Quick Calculation</h4>
        <div style="display:flex; gap:0.8rem; flex-wrap:wrap; margin-bottom:0.8rem;">
          <input type="number" id="sub1-marks" placeholder="Subject 1 (out of 100)" class="form-input" style="flex:1; min-width:140px;" value="88">
          <input type="number" id="sub2-marks" placeholder="Subject 2 (out of 100)" class="form-input" style="flex:1; min-width:140px;" value="92">
        </div>
        <button class="btn-primary" onclick="calculateDemoSGPA()" style="padding:0.4rem 1rem; font-size:0.8rem;">Calculate Average GPA</button>
        <p id="cgpa-demo-result" style="margin-top:0.6rem; font-size:0.9rem; color:var(--arc-cyan); font-weight:bold;">Estimated GPA: 9.0 / 10</p>
      </div>
    `
  },
  sorting: {
    title: 'Interactive Algorithm & Sorting Visualizer',
    badge: 'DSA Learning Experiment',
    desc: 'A visualizer for classic sorting algorithms including Bubble Sort and Selection Sort. It renders bar heights and color-codes active comparisons so learners can intuitively grasp algorithm mechanics.',
    highlights: [
      'Visualizes step-by-step element comparison and swapping',
      'Speed adjustment slider and array generator',
      'Color-coded pointers (comparing, sorted, pivot)',
      'What I Learned: Async/await loops, algorithm time complexity, and animation scheduling'
    ]
  },
  cppmgmt: {
    title: 'C++ Student Record Management System',
    badge: 'Console Application with File Handling',
    desc: 'A terminal-based system developed in C++ using Object-Oriented Programming (OOP) concepts. It persists student records, allows search by roll number, and generates report cards.',
    highlights: [
      'Demonstrates C++ Classes, Encapsulation, and File I/O (`fstream`)',
      'Input sanitization and menu-driven command interface',
      'Efficient search and record updating algorithms',
      'What I Learned: Pointer safety, data persistence, and clean code architecture'
    ]
  },
  portfolio: {
    title: 'Stark Tech Personal Portfolio (This Site)',
    badge: 'Modern Responsive Web Experience',
    desc: 'A personal portfolio engineered with custom Avengers transition animations, procedural Web Audio API sound generator, particle background canvas, and multiple hero themes.',
    highlights: [
      'Zero external build dependencies for maximum performance and portability',
      'Modular layout showcasing first-year journey, skills, and projects',
      'Built specifically with humility and eagerness for continuous improvement',
      'What I Learned: CSS Keyframes, Canvas rendering, Web Audio synthesis, accessibility'
    ]
  },
  tasktracker: {
    title: 'Daily Study & Assignment Tracker',
    badge: 'Productivity Web App',
    desc: 'A clean, lightweight productivity web app designed to help college students track their daily coding problems, university assignments, and exam prep milestones with LocalStorage persistence.',
    highlights: [
      'Persistent storage using browser localStorage',
      'Category badges (DSA, University, Projects)',
      'Completion streaks and milestone badges',
      'What I Learned: LocalStorage API, state synchronization, and DOM optimization'
    ]
  }
};

window.checkQuizAnswer = function(btn, isCorrect) {
  const feedback = document.getElementById('quiz-demo-feedback');
  if (isCorrect) {
    btn.style.borderColor = '#10b981';
    btn.style.color = '#10b981';
    feedback.style.color = '#10b981';
    feedback.textContent = '🎉 Correct! Jarvis confirms Arc Reactor technology is active!';
    window.avengersAudio?.playRepulsor();
  } else {
    btn.style.borderColor = '#ef4444';
    btn.style.color = '#ef4444';
    feedback.style.color = '#ef4444';
    feedback.textContent = '⚡ Not quite! Tony Stark powers it with the Arc Reactor!';
  }
};

window.calculateDemoSGPA = function() {
  const m1 = parseFloat(document.getElementById('sub1-marks').value) || 0;
  const m2 = parseFloat(document.getElementById('sub2-marks').value) || 0;
  const avg = (m1 + m2) / 2;
  const gpa = (avg / 10).toFixed(2);
  const res = document.getElementById('cgpa-demo-result');
  res.textContent = `Estimated SGPA: ${gpa} / 10 (Keep grinding Naman!)`;
  window.avengersAudio?.playClick();
};

function openProjectModal(projectId) {
  const modalOverlay = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-dynamic-content');
  const project = projectDetailsData[projectId];

  if (!project || !modalOverlay || !modalContent) return;

  modalContent.innerHTML = `
    <div style="margin-bottom: 1.2rem;">
      <span class="project-badge-type" style="position:static; display:inline-block; margin-bottom:0.6rem;">${project.badge}</span>
      <h3 style="font-size: 1.6rem; color: #fff; margin-bottom: 0.6rem;">${project.title}</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${project.desc}</p>
    </div>
    
    <div style="margin-bottom: 1.2rem;">
      <h5 style="color: var(--theme-accent); font-family: var(--font-hud); font-size: 0.85rem; margin-bottom: 0.5rem; text-transform:uppercase;">Key Features & Takeaways</h5>
      <ul style="padding-left: 1.2rem; color: var(--text-main); font-size: 0.88rem; display:flex; flex-direction:column; gap:0.4rem;">
        ${project.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>

    ${project.interactiveHtml || ''}

    <div style="margin-top: 1.8rem; display:flex; gap: 0.8rem; justify-content: flex-end;">
      <button class="btn-secondary" onclick="closeProjectModal()" style="padding:0.5rem 1.2rem;">Close Window</button>
      <a href="https://github.com/namanjain1606" target="_blank" class="btn-primary" style="padding:0.5rem 1.2rem;">
        <i class="fa-brands fa-github"></i> View GitHub
      </a>
    </div>
  `;

  modalOverlay.classList.add('open');
  window.avengersAudio?.playClick();
}

function closeProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    window.avengersAudio?.playClick();
  }
}

// ==========================================
// 8. CLIPBOARD & QUICK ACTIONS
// ==========================================
function copyToClipboard(text, message) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message || `Copied "${text}" to clipboard!`);
      window.avengersAudio?.playClick();
    });
  } else {
    // Fallback
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast(message || `Copied "${text}" to clipboard!`);
    window.avengersAudio?.playClick();
  }
}

function showToast(msg) {
  let toast = document.getElementById('stark-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'stark-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 25px;
      right: 25px;
      background: rgba(13, 20, 36, 0.95);
      border: 1px solid var(--theme-accent);
      box-shadow: 0 0 20px var(--theme-glow);
      color: #fff;
      padding: 0.75rem 1.4rem;
      border-radius: 8px;
      font-family: var(--font-hud);
      font-size: 0.82rem;
      z-index: 10000;
      transition: all 0.3s ease;
      transform: translateY(30px);
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.style.transform = 'translateY(30px)';
    toast.style.opacity = '0';
  }, 2800);
}

// ==========================================
// 9. CONTACT FORM TRANSMISSION HANDLER
// ==========================================
function initContactForm() {
  const form = document.getElementById('transmission-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sender-name')?.value.trim();
    const email = document.getElementById('sender-email')?.value.trim();
    const message = document.getElementById('sender-message')?.value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all transmission fields!');
      return;
    }

    // Play transmission sound
    window.avengersAudio?.playHoloBeep();

    // Visual transmission simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting to Stark Comm...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Transmission Sent!';
      showToast(`⚡ Message received from ${name}! Naman will reply to ${email} soon.`);

      // Create fallback mailto link to open email client directly
      const subject = encodeURIComponent(`Portfolio Message from ${name}`);
      const body = encodeURIComponent(`Hi Naman,\n\n${message}\n\nFrom: ${name} (${email})`);
      const mailtoLink = `mailto:jainnaman1606@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();
        // Optional mail client trigger
        window.open(mailtoLink, '_blank');
      }, 1500);
    }, 1200);
  });
}

// ==========================================
// 10. EASTER EGGS & INTERACTIVE CRESTS
// ==========================================
function initEasterEggs() {
  const arcReactorLarge = document.getElementById('hero-arc-reactor');
  if (arcReactorLarge) {
    arcReactorLarge.addEventListener('click', () => {
      window.avengersAudio?.playRepulsor();
      showToast('💥 "I Am Iron Man." — Arc Reactor output at 100% efficiency!');
    });
  }

  // Infinity stones descriptions
  const stones = document.querySelectorAll('.infinity-stone-gem');
  const stoneData = {
    'stone-space': 'Space Stone (Tesseract): Infinite travel across all web dimensions.',
    'stone-mind': 'Mind Stone (Vision): Mastering logic, algorithms, and deep thinking.',
    'stone-reality': 'Reality Stone (Aether): Transforming ideas into real web applications.',
    'stone-power': 'Power Stone (Orb): Unleashing computational power and efficiency.',
    'stone-time': 'Time Stone (Eye of Agamotto): Constant revision, practice, and continuous learning.',
    'stone-soul': 'Soul Stone: Putting heart, humility, and passion into engineering.'
  };

  stones.forEach(stone => {
    stone.addEventListener('click', () => {
      window.avengersAudio?.playKineticPulse();
      for (const [cls, desc] of Object.entries(stoneData)) {
        if (stone.classList.contains(cls)) {
          showToast(`💎 ${desc}`);
          break;
        }
      }
    });
  });
}

// ==========================================
// 11. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Check stored theme
  const savedTheme = localStorage.getItem('naman_portfolio_theme') || 'all';
  setHeroTheme(savedTheme);

  // Initialize Canvas
  initAvengersCanvas();

  // Initialize Typewriter
  runTypewriter();

  // Initialize Theme Switcher
  initThemeSwitcher();

  // Initialize Audio
  initAudioToggle();

  // Initialize Project Filters
  initProjectFilters();

  // Initialize Contact Form
  initContactForm();

  // Initialize Easter Eggs
  initEasterEggs();

  // Navigation Links click handler
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').replace('#', '');
      if (targetId && document.getElementById(targetId)) {
        e.preventDefault();
        navigateToSection(targetId);

        // Close mobile drawer if open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
        }
      }
    });
  });

  // Floating dock click handler
  document.querySelectorAll('.dock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        navigateToSection(targetId);
      }
    });
  });

  // Mobile menu toggle button
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      window.avengersAudio?.playClick();
    });
  }

  // Modal close events
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOverlay = document.getElementById('project-modal');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProjectModal();
    });
  }

  // Handle URL hash on initial page load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    navigateToSection(initialHash, true);
  } else {
    navigateToSection('home', true);
  }
});
