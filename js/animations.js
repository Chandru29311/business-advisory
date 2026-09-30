/* STACKLY Business Advisory - GSAP & Canvas Animations */

document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is available
  if (typeof gsap !== 'undefined') {
    // 1. Navbar entrance animation
    gsap.fromTo('.navbar-container', 
      { y: -20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'all' }
    );

    // 2. Hero Section Animations
    if (document.querySelector('.hero-title')) {
      gsap.from('.hero-subtitle', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: 'power2.out',
        delay: 0.3
      });

      gsap.from('.hero-title', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.5
      });

      gsap.from('.hero-desc', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.7
      });

      gsap.from('.hero-buttons', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.9
      });
    }

    // 3. Hero Dashboard Parallax & Float
    const heroDashboard = document.querySelector('.hero-dashboard-wrapper');
    if (heroDashboard) {
      gsap.from(heroDashboard, {
        duration: 1.2,
        scale: 0.9,
        opacity: 0,
        y: 50,
        ease: 'power3.out',
        delay: 0.6
      });

      // Parallax mouse move
      window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 30;
        const yPos = (clientY / window.innerHeight - 0.5) * 30;
        gsap.to(heroDashboard, {
          duration: 1,
          x: xPos,
          y: yPos,
          rotateY: xPos * 0.2,
          rotateX: -yPos * 0.2,
          ease: 'power1.out'
        });
      });
    }

    // 4. Register ScrollTrigger if loaded
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Section Header Scroll Reveals
      gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: 'top 85%'
          },
          duration: 0.8,
          y: 40,
          opacity: 0,
          ease: 'power2.out'
        });
      });

      // Card Stagger Reveals
      gsap.utils.toArray('.grid-reveal').forEach(grid => {
        gsap.from(grid.children, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%'
          },
          duration: 0.8,
          y: 40,
          opacity: 0,
          stagger: 0.15,
          ease: 'power2.out'
        });
      });
    }
  }

  // Counter Animations for Statistics
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const animateCounters = () => {
      const duration = 2000; // 2 seconds animation duration
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        // easeOutCubic easing for smooth count-up
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          if (!isNaN(target)) {
            const currentVal = Math.floor(easeProgress * target);
            counter.innerText = currentVal;
          }
        });

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (!isNaN(target)) {
              counter.innerText = target;
            }
          });
        }
      };

      requestAnimationFrame(updateCount);
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCounters();
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2 });
        observer.observe(statsSection);
      } else {
        let counted = false;
        const onScroll = () => {
          if (!counted) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.85) {
              animateCounters();
              counted = true;
              window.removeEventListener('scroll', onScroll);
            }
          }
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
      }
    }
  }

  // Particle Canvas Background Generator
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let width = particleCanvas.width = particleCanvas.offsetWidth;
    let height = particleCanvas.height = particleCanvas.offsetHeight;

    window.addEventListener('resize', () => {
      width = particleCanvas.width = particleCanvas.offsetWidth;
      height = particleCanvas.height = particleCanvas.offsetHeight;
    });

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }
});
