/* STACKLY Business Advisory - Auth Logic */

document.addEventListener('DOMContentLoaded', () => {
  // GSAP Entrance
  if (typeof gsap !== 'undefined' && document.querySelector('.auth-card')) {
    gsap.from('.auth-card', {
      duration: 1,
      y: 40,
      opacity: 0,
      scale: 0.95,
      ease: 'power3.out'
    });
  }

  // Role Toggle (Admin vs Client)
  const roleButtons = document.querySelectorAll('.role-btn');
  let selectedRole = 'Client'; // Default

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.getAttribute('data-role');
    });
  });

  // Password Visibility Toggle
  const togglePassBtns = document.querySelectorAll('.toggle-password');
  togglePassBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else if (input) {
        input.type = 'password';
        btn.textContent = '👁️';
      }
    });
  });

  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('username')?.value.trim();
      const passwordInput = document.getElementById('password')?.value;
      const errorDiv = document.getElementById('auth-error');

      if (!usernameInput || !passwordInput) {
        if (errorDiv) {
          errorDiv.innerText = 'Please enter both User ID/Email and Password.';
          errorDiv.style.display = 'block';
        }
        return;
      }

      if (errorDiv) errorDiv.style.display = 'none';

      // Save entered email and selected role for dashboard display
      localStorage.setItem('userEmail', usernameInput);
      localStorage.setItem('userRole', selectedRole);

      loginForm.reset();

      // Redirect based on selected role
      if (selectedRole === 'Admin') {
        window.location.href = 'AdminDashboard.html';
      } else {
        window.location.href = 'ClientDashboard.html';
      }
    });
  }

  // Signup Form Submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;
      const confirmPassword = document.getElementById('confirmPassword')?.value;
      const errorDiv = document.getElementById('auth-error');

      if (!fullName || !email || !password || !confirmPassword) {
        if (errorDiv) {
          errorDiv.innerText = 'All fields are required.';
          errorDiv.style.display = 'block';
        }
        return;
      }

      if (password !== confirmPassword) {
        if (errorDiv) {
          errorDiv.innerText = 'Passwords do not match.';
          errorDiv.style.display = 'block';
        }
        return;
      }

      if (errorDiv) errorDiv.style.display = 'none';

      signupForm.reset();

      // Successful registration -> redirect to Login.html
      showToast('Account created successfully! Redirecting to Login...');
      setTimeout(() => {
        window.location.href = 'Login.html';
      }, 1200);
    });
  }
});
