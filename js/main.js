/* STACKLY Business Advisory - Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // Navbar Sticky Scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Active Link Highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile Menu Hamburger Toggle & Scroll Lock
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');

  const openMobileMenu = () => {
    if (hamburger) hamburger.classList.add('active');
    if (mobileMenu) mobileMenu.classList.add('active');
    document.body.classList.add('no-scroll');
    document.documentElement.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
    document.documentElement.style.overflow = '';
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Blog Category Filter ("All Topics" button reset)
  const filterPills = document.querySelectorAll('button.category-pill');
  const blogCards = document.querySelectorAll('.blog-card');
  if (filterPills.length > 0 && blogCards.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.getAttribute('data-category');
        if (cat === 'all') {
          blogCards.forEach(card => card.style.display = 'block');
        }
      });
    });
  }

  // Live Chat Preview Interaction (Contact Page)
  const chatToggle = document.querySelector('.chat-toggle');
  const chatBox = document.querySelector('.chat-preview-box');
  const chatInput = document.querySelector('.chat-input input');
  const chatSend = document.querySelector('.chat-input button');
  const chatMessages = document.querySelector('.chat-messages');

  if (chatToggle && chatBox) {
    chatToggle.addEventListener('click', () => {
      chatBox.classList.toggle('open');
    });
  }

  if (chatSend && chatInput && chatMessages) {
    const sendMessage = () => {
      const text = chatInput.value.trim();
      if (!text) return;

      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user';
      userMsg.textContent = text;
      chatMessages.appendChild(userMsg);

      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Show typing indicator & bot response
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.textContent = "Thank you for reaching out! A STACKLY Business Advisor will assist you shortly. (Redirecting to advisory desk...)";
        chatMessages.appendChild(botMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
          window.location.href = '404.html';
        }, 1800);
      }, 800);
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // 404 Navigation Scroll Position Tracking & Restoration
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="404.html"]');
    if (link) {
      sessionStorage.setItem('stackly_return_scroll', window.scrollY);
      sessionStorage.setItem('stackly_return_url', window.location.href);
    }
  });

  const savedReturnScroll = sessionStorage.getItem('stackly_return_scroll');
  const savedReturnUrl = sessionStorage.getItem('stackly_return_url');
  if (savedReturnScroll !== null && savedReturnUrl) {
    const targetPath = new URL(savedReturnUrl, window.location.origin).pathname;
    if (targetPath === window.location.pathname) {
      const scrollYTarget = parseInt(savedReturnScroll, 10);
      sessionStorage.removeItem('stackly_return_scroll');
      sessionStorage.removeItem('stackly_return_url');

      const applyScroll = () => {
        window.scrollTo({ top: scrollYTarget, behavior: 'instant' });
      };

      applyScroll();
      setTimeout(applyScroll, 50);
      setTimeout(applyScroll, 150);
      setTimeout(applyScroll, 300);
    }
  }
});
