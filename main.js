/**
 * ===================================================================
 * GAYATRI PORTFOLIO - VANILLA JAVASCRIPT ENGINE
 * Pure HTML, CSS, JavaScript (Zero External Framework Dependencies)
 * Features: Scroll Depth HUD, Typewriter, Particle Canvas, Modals,
 *           Terminal Execution, Theme Switcher, Filters & Validation
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1. SCROLL DEPTH ENGINE & ACTIVE SECTION TRACKER
     =================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const scrollDepthHud = document.getElementById('scroll-depth-hud');
  const depthCircleBar = document.getElementById('depth-circle-bar');
  const depthPercentText = document.getElementById('depth-percent-text');
  const depthActiveSection = document.getElementById('depth-active-section');
  const backToTopBtn = document.getElementById('back-to-top');
  const siteHeader = document.getElementById('header');
  const depthSections = document.querySelectorAll('section[data-depth-name]');

  function updateScrollDepth() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Calculate scroll percentage (0 to 100)
    let percent = 0;
    if (scrollHeight > 0) {
      percent = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
    }

    // 1. Update top horizontal scroll line
    if (scrollProgress) {
      scrollProgress.style.width = `${percent}%`;
    }

    // 2. Update floating Scroll Depth HUD gauge & text
    if (depthCircleBar && depthPercentText) {
      depthCircleBar.setAttribute('stroke-dasharray', `${percent}, 100`);
      depthPercentText.textContent = `${percent}%`;
    }

    // 3. Update sticky header state
    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // 4. Update Back-to-Top visibility (visible when scrolled past 15%)
    if (backToTopBtn) {
      if (percent > 15) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // 5. Determine current active section for the Scroll Depth HUD
    let currentSectionName = 'Hero Intro';
    const viewportMiddle = scrollTop + (window.innerHeight * 0.35);

    depthSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (viewportMiddle >= sectionTop && viewportMiddle < sectionTop + sectionHeight) {
        currentSectionName = section.getAttribute('data-depth-name') || currentSectionName;
      }
    });

    if (depthActiveSection && depthActiveSection.textContent !== currentSectionName) {
      depthActiveSection.textContent = currentSectionName;
    }

    // Update active nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          const top = targetElem.offsetTop - 120;
          const height = targetElem.offsetHeight;
          if (scrollTop >= top && scrollTop < top + height) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      }
    });
  }

  // Bind scroll depth update with requestAnimationFrame for smooth performance
  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateScrollDepth);
  }, { passive: true });

  // Initial call
  updateScrollDepth();

  // Scroll to Top action
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Depth HUD click: smoothly jump to next section
  if (scrollDepthHud) {
    scrollDepthHud.addEventListener('click', () => {
      const scrollTop = window.scrollY;
      let nextSection = null;
      for (let sec of depthSections) {
        if (sec.offsetTop > scrollTop + 100) {
          nextSection = sec;
          break;
        }
      }
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }


  /* ===================================================================
     2. DYNAMIC TYPEWRITER EFFECT
     =================================================================== */
  const typewriterElem = document.getElementById('typewriter-text');
  if (typewriterElem) {
    const roles = [
      'B.Tech 1st Year (CSE) Student',
      'Aspiring Full Stack Developer',
      'UI/UX & Creative Designer',
      'Hackathon Competitor & Team Player',
      'Relentless Problem Solver'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typewriterElem.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 40;
      } else {
        typewriterElem.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at end of text
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 400; // Pause before next word
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }


  /* ===================================================================
     3. INTERACTIVE TERMINAL WINDOW RUN SIMULATION
     =================================================================== */
  const runTerminalBtn = document.getElementById('run-terminal-btn');
  if (runTerminalBtn) {
    runTerminalBtn.addEventListener('click', () => {
      runTerminalBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing...';
      runTerminalBtn.disabled = true;

      setTimeout(() => {
        runTerminalBtn.innerHTML = '<i class="fa-solid fa-check"></i> Success!';
        showToast('🚀 Profile executed! Gayatri is ready to innovate and collaborate on your team.', 'success');

        setTimeout(() => {
          runTerminalBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Code';
          runTerminalBtn.disabled = false;
        }, 2500);
      }, 700);
    });
  }


  /* ===================================================================
     4. SKILLS FILTER SYSTEM
     =================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ===================================================================
     5. STATS COUNTER ANIMATION (ON INTERSECTION)
     =================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach(numElem => {
          const target = parseInt(numElem.getAttribute('data-target'), 10);
          const duration = 1600;
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              numElem.textContent = target;
              clearInterval(timer);
            } else {
              numElem.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) {
    statsObserver.observe(statsStrip);
  }


  /* ===================================================================
     6. HACKATHON CASE STUDY MODAL SYSTEM
     =================================================================== */
  const modalOverlay = document.getElementById('hackathon-modal');
  const modalContent = document.getElementById('modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const inspectBtns = document.querySelectorAll('.inspect-modal-btn');

  const hackathonData = {
    sih: {
      title: "EcoTrack: Smart Waste & Campus Carbon Tracker",
      badge: "Smart India Hackathon (SIH) Campus Edition",
      badgeClass: "sih-badge",
      year: "2024",
      teamSize: "Team of 6 Members",
      role: "Frontend Lead & UI/UX Architect",
      challenge: "College campuses generate massive unsegregated waste and lack real-time visibility into their carbon footprints. The administration needed an intuitive, data-driven system to empower both facilities managers and students.",
      solution: "Engineered a centralized dashboard featuring live waste category distribution charts, a carbon emission calculator, and a student recycling leaderboard gamified with digital badges.",
      teamwork: "Gayatri led the frontend coordination for the 6-person team. She established standardized JSON contracts with the 3 backend members, facilitated standup check-ins, and translated whiteboard concepts into clean, accessible HTML/CSS/JavaScript components.",
      techStack: ["JavaScript", "HTML5", "CSS3 Grid", "Chart.js", "Figma", "Git & GitHub"],
      outcome: "Selected as Pre-Finalist from among 45+ freshman teams. Applauded by campus faculty for the intuitive UI and team synergy."
    },
    healthbridge: {
      title: "HealthBridge: Telemedicine & SOS Emergency Portal",
      badge: "HackNova 24-Hour National Hackathon",
      badgeClass: "hacknova-badge",
      year: "2024",
      teamSize: "Team of 4 Members",
      role: "Full Stack Contributor & UI Designer",
      challenge: "Rural clinics often face acute staffing shortages during nighttime emergency triage. Patients need an immediate, zero-latency portal to register symptoms and notify on-call clinicians.",
      solution: "Created a rapid triage portal with minimal bandwidth consumption. Incorporates a dynamic multi-step symptom checker, SOS dispatch alert trigger, and physician response dashboard.",
      teamwork: "During this grueling 24-hour non-stop hackathon sprint, Gayatri worked through the night with 3 teammates. When a late-night API bottleneck occurred at 3 AM, she helped debug asynchronous routes and kept team morale high with relentless positivity.",
      techStack: ["JavaScript (ES6+)", "Node.js", "Express", "Tailwind CSS", "REST APIs", "Git"],
      outcome: "Secured Top 10 in the Freshman Team category. Praised by mentors for exceptional sprint resilience and high usability under tight deadlines."
    },
    campusmate: {
      title: "CampusMate: AI Smart Timetable & Resource Bot",
      badge: "Technovation Ideathon 2024 (2nd Place Winner 🏆)",
      badgeClass: "ideathon-badge",
      year: "2024",
      teamSize: "Team of 3 Members",
      role: "Team Lead & Pitch Presenter",
      challenge: "First-year engineering students frequently struggle with lecture schedule overlaps, finding lab notes, and locating empty study rooms across large campus buildings.",
      solution: "Developed an interactive digital assistant that syncs timetable schedules, suggests verified senior study materials, and maps real-time study hub availability.",
      teamwork: "Gayatri stepped forward as Team Lead. She conducted rapid interviews with 30+ freshman classmates within 3 hours to validate user pain points, built the Figma prototypes, and delivered the 5-minute final pitch to the judging panel.",
      techStack: ["Python", "JavaScript", "Figma Wireframes", "CSS Flexbox", "Pitch Deck"],
      outcome: "Awarded 2nd Place Overall & Best UI/UX Design Trophy. The prototype was featured in the department's freshman innovation showcase."
    },
    skillverse: {
      title: "SkillVerse: Peer-to-Peer Study & Mentorship Hub",
      badge: "DevClash Web-a-Thon 2024",
      badgeClass: "devclash-badge",
      year: "2024",
      teamSize: "Team of 4 Members",
      role: "Frontend Engineer & Component Designer",
      challenge: "Freshman coders often get stuck on foundational C++ bugs (segmentation faults, pointer errors) and hesitate to ask professors. They needed a friendly peer-mentoring ecosystem.",
      solution: "A lightweight collaborative web app where students post code snippets, tag specific error lines, and receive step-by-step guidance from senior mentors.",
      teamwork: "Gayatri paired with a peer developer to construct the interactive code view interface and handled all GitHub branch merges. Her dedication to clean semantic markup and teamwork ensured zero deployment conflicts.",
      techStack: ["HTML5", "CSS3 Custom Properties", "JavaScript", "GitHub Projects", "VS Code"],
      outcome: "Voted Community Pick for its immediate applicability to college students and delightful user experience."
    }
  };

  function openModal(hackathonKey) {
    const data = hackathonData[hackathonKey];
    if (!data || !modalContent || !modalOverlay) return;

    modalContent.innerHTML = `
      <div class="modal-header">
        <span class="modal-badge ${data.badgeClass}">${data.badge}</span>
        <h3 class="modal-title">${data.title}</h3>
        <div class="modal-meta">
          <span><i class="fa-regular fa-calendar"></i> ${data.year}</span>
          <span><i class="fa-solid fa-users"></i> ${data.teamSize}</span>
          <span><i class="fa-solid fa-user-tag"></i> ${data.role}</span>
        </div>
      </div>

      <div class="modal-section">
        <h4><i class="fa-solid fa-circle-exclamation"></i> The Challenge</h4>
        <p>${data.challenge}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fa-solid fa-lightbulb"></i> The Engineered Solution</h4>
        <p>${data.solution}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fa-solid fa-people-group"></i> Teamwork & Gayatri's Contribution</h4>
        <p>${data.teamwork}</p>
      </div>

      <div class="modal-section">
        <h4><i class="fa-solid fa-code"></i> Technologies & Tools</h4>
        <div class="modal-tech-pills">
          ${data.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-section">
        <h4><i class="fa-solid fa-award"></i> Outcome & Key Takeaway</h4>
        <p>${data.outcome}</p>
      </div>
    `;

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hackKey = btn.getAttribute('data-hackathon');
      openModal(hackKey);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });


  /* ===================================================================
     7. THEME TOGGLE (DARK / LIGHT MODE WITH LOCALSTORAGE)
     =================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('gayatri_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('gayatri_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
    });
  }


  /* ===================================================================
     8. MOBILE NAVIGATION DRAWER
     =================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('active');
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close when clicking any nav item
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ===================================================================
     9. CONTACT FORM VALIDATION & SUBMISSION SIMULATION
     =================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      // Helper validation
      function validateField(input, condition, errorId) {
        const group = input.closest('.form-group');
        if (!condition) {
          group.classList.add('has-error');
          isValid = false;
        } else {
          group.classList.remove('has-error');
        }
      }

      validateField(nameInput, nameInput.value.trim().length >= 2, 'name-error');
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(emailInput, emailRegex.test(emailInput.value.trim()), 'email-error');
      
      validateField(subjectInput, subjectInput.value.trim().length >= 3, 'subject-error');
      validateField(messageInput, messageInput.value.trim().length >= 10, 'message-error');

      if (!isValid) {
        showToast('Please fix the highlighted fields in the form.', 'info');
        return;
      }

      // Simulate sending
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
        }
        if (formStatus) {
          formStatus.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-circle-check"></i> Thank you! Your message was received. Gayatri will reply soon.</span>';
        }
        showToast('🎉 Message sent successfully! Thanks for reaching out.', 'success');
        contactForm.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
            submitBtn.disabled = false;
          }
          if (formStatus) {
            formStatus.innerHTML = '';
          }
        }, 4000);
      }, 1000);
    });
  }


  /* ===================================================================
     10. COPY EMAIL TO CLIPBOARD
     =================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'gayatri.tech.dev@example.com';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('📋 Email copied to clipboard!', 'success');
          copyEmailBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
          setTimeout(() => {
            copyEmailBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
          }, 2000);
        });
      } else {
        showToast(`Email: ${email}`, 'info');
      }
    });
  }


  /* ===================================================================
     11. TOAST NOTIFICATION SYSTEM
     =================================================================== */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fa-solid fa-circle-info"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Slide in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3500);
  }


  /* ===================================================================
     12. PURE HTML5 CANVAS PARTICLE CONSTELLATION
     =================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.floor(Math.min(width, 1400) / 18);
    const mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.8 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 2.5;
            this.y += Math.sin(angle) * force * 2.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const isDark = htmlRoot.getAttribute('data-theme') !== 'light';
        ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.45)' : 'rgba(99, 102, 241, 0.25)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const isDark = htmlRoot.getAttribute('data-theme') !== 'light';
      const maxDist = 110;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isDark ? 0.18 : 0.08);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${alpha})` : `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        p.update();
        p.draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  // Update dynamic year in footer
  const currentYearElem = document.getElementById('current-year');
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }

});

