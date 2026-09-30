/* STACKLY Business Advisory - Validation & Form Handler */

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(String(phone).trim());
}

function showToast(message, isError = false) {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 16px 24px;
      background: #1e293b;
      color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }

  toast.style.borderLeft = isError ? '4px solid #ef4444' : '4px solid #10b981';
  toast.innerText = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Footer Newsletter Validation
  const footerNewsletterForms = document.querySelectorAll('.newsletter-form');
  footerNewsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput) {
        const email = emailInput.value.trim();
        if (!isValidEmail(email)) {
          showToast('Please enter a valid email address.', true);
          return;
        }
        showToast('Subscribing to STACKLY Insights...');
        form.reset();
        setTimeout(() => {
          window.location.href = '404.html';
        }, 1200);
      }
    });
  });

  // 2. Contact Page Form Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const company = document.getElementById('company')?.value.trim();
      const businessType = document.getElementById('businessType')?.value;
      const subject = document.getElementById('subject')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!fullName) {
        showToast('Full Name is required.', true);
        return;
      }
      if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid business email address.', true);
        return;
      }
      if (!phone || !isValidPhone(phone)) {
        showToast('Please enter a valid phone number (e.g. +1234567890).', true);
        return;
      }
      if (!company) {
        showToast('Company Name is required.', true);
        return;
      }
      if (!businessType) {
        showToast('Please select your Business Type.', true);
        return;
      }
      if (!subject) {
        showToast('Subject is required.', true);
        return;
      }
      if (!message || message.length < 15) {
        showToast('Message must be at least 15 characters long.', true);
        return;
      }

      showToast('Thank you! Transmitting inquiry to STACKLY Advisory...');
      contactForm.reset();
      setTimeout(() => {
        window.location.href = '404.html';
      }, 1500);
    });
  }
});
