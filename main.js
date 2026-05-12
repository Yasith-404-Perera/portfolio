document.addEventListener('DOMContentLoaded', () => {

  /* Page transitions */
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('href');
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = target; }, 500);
    });
  });

  /* Active nav link */
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page.endsWith('/') && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Particles */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const create = (n) => {
      particles = [];
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          o: Math.random() * 0.4 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fill();
      });

      /* connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    create(70);
    draw();
    window.addEventListener('resize', () => { resize(); create(70); });
  }

  /* Parallax scroll */
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight) * speed * 0.5;
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  };

  window.addEventListener('scroll', updateParallax);
  updateParallax();

  /* Card tilt */
  const tiltCards = document.querySelectorAll('.glass-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -6;
      const ry = ((x - cx) / cx) * 6;
      card.style.transform =
        `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });

  /* Scroll reveal */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* Skill bars */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const w = entry.target.dataset.width;
          entry.target.style.width = w + '%';
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  /* Cursor stars and bubbles */
  const cursorContainer = document.createElement('div');
  cursorContainer.id = 'cursor-effects';
  document.body.appendChild(cursorContainer);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    for (let i = 0; i < 2; i++) {
      const star = document.createElement('div');
      star.className = 'cursor-star';
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 25 + 8;
      const size = Math.random() * 3 + 2;
      star.style.cssText = `
        left: ${mouseX}px; top: ${mouseY}px;
        width: ${size}px; height: ${size}px;
        --dx: ${Math.cos(angle) * dist}px;
        --dy: ${Math.sin(angle) * dist}px;
      `;
      cursorContainer.appendChild(star);
      setTimeout(() => star.remove(), 800);
    }
  });

  const numBubbles = 4;
  const bubbles = [];
  for (let i = 0; i < numBubbles; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-bubble';
    const s = 28 - i * 4;
    el.style.width = s + 'px';
    el.style.height = s + 'px';
    cursorContainer.appendChild(el);
    bubbles.push({ el, x: mouseX, y: mouseY, size: s });
  }

  const animateBubbles = () => {
    bubbles[0].x += (mouseX - bubbles[0].x) * 0.2;
    bubbles[0].y += (mouseY - bubbles[0].y) * 0.2;
    bubbles[0].el.style.transform = `translate(${bubbles[0].x - bubbles[0].size / 2}px, ${bubbles[0].y - bubbles[0].size / 2}px)`;

    for (let i = 1; i < numBubbles; i++) {
      const prev = bubbles[i - 1];
      const curr = bubbles[i];
      curr.x += (prev.x - curr.x) * 0.16;
      curr.y += (prev.y - curr.y) * 0.16;
      curr.el.style.transform = `translate(${curr.x - curr.size / 2}px, ${curr.y - curr.size / 2}px)`;
    }

    requestAnimationFrame(animateBubbles);
  };
  animateBubbles();

});
