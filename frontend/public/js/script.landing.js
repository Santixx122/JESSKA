document.addEventListener('DOMContentLoaded', () => {
  
 
  function resetButtonState() {
    const submitButton = document.getElementById('iniciarsesion');
    const spinner = submitButton?.querySelector('.spinner-border');
    const buttonText = submitButton?.querySelector('.button-text');
    
    if (submitButton && spinner && buttonText) {
      submitButton.disabled = false;
      spinner.classList.add('d-none');
      buttonText.textContent = 'Iniciar Sesión';
    }
  }


  function resetRecaptcha() {
    try {
      if (typeof grecaptcha !== 'undefined') {

        const widgets = document.querySelectorAll('.g-recaptcha');
        widgets.forEach((widget, index) => {
          try {
            grecaptcha.reset(index);
          } catch (e) {
            grecaptcha.reset();
          }
        });
      }
    } catch (error) {
      console.warn('No se pudo resetear reCAPTCHA:', error);
    }
  }


  if (document.querySelector('.alert-danger')) {
    resetButtonState();
    resetRecaptcha();
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const submitButton = document.getElementById('iniciarsesion');
      const spinner = submitButton.querySelector('.spinner-border');
      const buttonText = submitButton.querySelector('.button-text');
      const recaptchaContainer = document.getElementById('recaptcha-container');
      const recaptchaError = document.getElementById('recaptcha-error');
      let isValid = true;


      email.classList.remove('is-invalid');
      password.classList.remove('is-invalid');
      recaptchaContainer.classList.remove('invalid');
      recaptchaError.classList.remove('show');


      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        isValid = false;
      }

      if (!password.value || password.value.length < 6) {
        password.classList.add('is-invalid');
        isValid = false;
      }


      let recaptchaResponse = '';
      try {
        recaptchaResponse = grecaptcha.getResponse();
      } catch (error) {
        console.error('Error al obtener respuesta de reCAPTCHA:', error);
      }
      
      if (!recaptchaResponse) {
        recaptchaContainer.classList.add('invalid');
        recaptchaError.classList.add('show');
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
        return;
      }


      if (submitButton && spinner && buttonText) {
        submitButton.disabled = true;
        spinner.classList.remove('d-none');
        buttonText.textContent = 'Iniciando sesión...';
      }

    });
  }


  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const inputs = this.querySelectorAll('input[required]');
      const password = this.querySelector('input[name="password"]');
      const confirmPassword = this.querySelector('input[name="confirmPassword"]');
      const recaptchaContainerRegister = document.getElementById('recaptcha-container-register');
      const recaptchaErrorRegister = document.getElementById('recaptcha-error-register');
      let isValid = true;


      if (recaptchaContainerRegister && recaptchaErrorRegister) {
        recaptchaContainerRegister.classList.remove('invalid');
        recaptchaErrorRegister.classList.remove('show');
      }

      inputs.forEach(input => {
        input.classList.remove('is-invalid');
        
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          isValid = false;
        }
        

        if (input.type === 'email' && input.value && !input.value.includes('@')) {
          input.classList.add('is-invalid');
          isValid = false;
        }
        

        if (input.name === 'password' && input.value && input.value.length < 8) {
          input.classList.add('is-invalid');
          isValid = false;
        }
      });


      if (password && confirmPassword) {
        if (password.value !== confirmPassword.value) {
          confirmPassword.classList.add('is-invalid');
          isValid = false;
        }
      }
      let recaptchaResponseRegister = '';
      try {
        recaptchaResponseRegister = grecaptcha.getResponse();
      } catch (error) {
        console.error('Error al obtener respuesta de reCAPTCHA en registro:', error);
      }
      
      if (!recaptchaResponseRegister) {
        if (recaptchaContainerRegister && recaptchaErrorRegister) {
          recaptchaContainerRegister.classList.add('invalid');
          recaptchaErrorRegister.classList.add('show');
        }
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
      }
    });
  }

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


  try {
    const loginModal = document.getElementById('exampleModal');
    const registerModal = document.getElementById('staticBackdrop');
    

    if (loginModal && loginModal.querySelector('.alert.alert-danger') && window.bootstrap) {
      const modal = new window.bootstrap.Modal(loginModal);
      modal.show();
    }
    
    if (registerModal && registerModal.querySelector('.alert') && window.bootstrap) {
      const modal = new window.bootstrap.Modal(registerModal);
      modal.show();
    }


    const generalAlert = document.querySelector('.alert.alert-danger:not(.modal .alert)');
    if (generalAlert) {
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


  document.addEventListener('hidden.bs.modal', function(event) {
    resetRecaptcha();
  });

  document.addEventListener('show.bs.modal', function(event) {
    setTimeout(() => {
      resetRecaptcha();
    }, 100);
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('error')) {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
});