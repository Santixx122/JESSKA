// Form validation and interactions for JESSKA Landing Page
document.addEventListener('DOMContentLoaded', () => {
  // Form validation for login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const submitButton = document.getElementById('iniciarsesion');
      const spinner = submitButton.querySelector('.spinner-border');
      const buttonText = submitButton.querySelector('.button-text');
      let isValid = true;

      // Reset previous validation states
      email.classList.remove('is-invalid');
      password.classList.remove('is-invalid');

      // Email validation
      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        isValid = false;
      }

      // Password validation
      if (!password.value || password.value.length < 6) {
        password.classList.add('is-invalid');
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
        return;
      }

      // Show loading state
      if (submitButton && spinner && buttonText) {
        submitButton.disabled = true;
        spinner.classList.remove('d-none');
        buttonText.textContent = 'Iniciando sesión...';
      }

      // The form will submit normally, but we show loading state
      // The server will handle the redirect logic
    });
  }

  // Form validation for register
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const inputs = this.querySelectorAll('input[required]');
      const password = this.querySelector('input[name="password"]');
      const confirmPassword = this.querySelector('input[name="confirmPassword"]');
      let isValid = true;

      inputs.forEach(input => {
        input.classList.remove('is-invalid');
        
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        }
        
        // Email validation
        if (input.type === 'email' && input.value && !input.value.includes('@')) {
          input.classList.add('is-invalid');
          isValid = false;
        }
        
        // Password validation
        if (input.name === 'password' && input.value && input.value.length < 8) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      });

      // Password confirmation validation
      if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
          confirmPassword.classList.add('is-invalid');
          isValid = false;
        }
      }

      if (!isValid) {
        e.preventDefault();
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Auto-open modals if there are server messages
  try {
    const loginModal = document.getElementById('exampleModal');
    const registerModal = document.getElementById('staticBackdrop');
    
    // Check for login errors or access denied messages
    if (loginModal && loginModal.querySelector('.alert.alert-danger') && window.bootstrap) {
      const modal = new window.bootstrap.Modal(loginModal);
      modal.show();
    }
    
    // Check for register messages
    if (registerModal && registerModal.querySelector('.alert') && window.bootstrap) {
      const modal = new window.bootstrap.Modal(registerModal);
      modal.show();
    }

    // Check for general error messages (access denied, session expired)
    const generalAlert = document.querySelector('.alert.alert-danger:not(.modal .alert)');
    if (generalAlert) {
      // Auto-hide general alerts after 5 seconds
      setTimeout(() => {
        if (generalAlert && generalAlert.parentNode) {
          generalAlert.style.transition = 'opacity 0.5s';
          generalAlert.style.opacity = '0';
          setTimeout(() => {
            if (generalAlert.parentNode) {
              generalAlert.parentNode.removeChild(generalAlert);
            }
          }, 500);
        }
      }, 5000);
    }
  } catch (err) {
    console.log('Bootstrap modal initialization error:', err);
  }

  // Handle URL parameters for error messages
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('error')) {
    // Clean URL after showing error
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
});