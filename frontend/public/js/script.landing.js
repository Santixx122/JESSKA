document.addEventListener('DOMContentLoaded', () => {
  
  // Variable global para almacenar los IDs de los widgets
  window.recaptchaWidgets = {};
 
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
        // Resetear todos los widgets registrados
        Object.values(window.recaptchaWidgets).forEach(widgetId => {
          try {
            grecaptcha.reset(widgetId);
          } catch (e) {
            console.warn('No se pudo resetear widget:', widgetId);
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
        // Obtener la respuesta del widget específico de login
        const loginWidget = window.recaptchaWidgets.login;
        if (loginWidget !== undefined) {
          recaptchaResponse = grecaptcha.getResponse(loginWidget);
        } else {
          // Fallback: usar el método estándar
          recaptchaResponse = grecaptcha.getResponse();
        }
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
        // Obtener la respuesta del widget específico de registro
        const registerWidget = window.recaptchaWidgets.register;
        if (registerWidget !== undefined) {
          recaptchaResponseRegister = grecaptcha.getResponse(registerWidget);
        } else {
          // Fallback: buscar por el elemento del registro
          const recaptchaElement = document.querySelector('#recaptcha-register');
          if (recaptchaElement) {
            // Si no tenemos el widget ID, intentar obtener la respuesta del widget más reciente
            recaptchaResponseRegister = grecaptcha.getResponse();
          }
        }
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


  // Formulario de recuperación de contraseña
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevenir envío normal del formulario
      
      const emailForgot = document.getElementById('emailForgot');
      const submitButton = document.getElementById('sendResetLink');
      const spinner = submitButton?.querySelector('.spinner-border');
      const buttonText = submitButton?.querySelector('.button-text');
      const recaptchaContainerForgot = document.getElementById('recaptcha-container-forgot');
      const recaptchaErrorForgot = document.getElementById('recaptcha-error-forgot');
      let isValid = true;

      // Limpiar errores previos
      if (emailForgot) emailForgot.classList.remove('is-invalid');
      if (recaptchaContainerForgot) recaptchaContainerForgot.classList.remove('invalid');
      if (recaptchaErrorForgot) recaptchaErrorForgot.classList.remove('show');

      // Validar email
      if (!emailForgot.value || !emailForgot.value.includes('@')) {
        emailForgot.classList.add('is-invalid');
        isValid = false;
      }

      // Validar reCAPTCHA
      let recaptchaResponseForgot = '';
      try {
        const forgotWidget = window.recaptchaWidgets.forgot;
        if (forgotWidget !== undefined) {
          recaptchaResponseForgot = grecaptcha.getResponse(forgotWidget);
        } else {
          recaptchaResponseForgot = grecaptcha.getResponse();
        }
      } catch (error) {
        console.error('Error al obtener respuesta de reCAPTCHA en recuperación:', error);
      }
      
      if (!recaptchaResponseForgot) {
        if (recaptchaContainerForgot && recaptchaErrorForgot) {
          recaptchaContainerForgot.classList.add('invalid');
          recaptchaErrorForgot.classList.add('show');
        }
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Mostrar loading
      if (submitButton && spinner && buttonText) {
        submitButton.disabled = true;
        spinner.classList.remove('d-none');
        buttonText.textContent = 'Enviando...';
      }

      // Enviar datos al backend usando fetch
      fetch('/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailForgot.value,
          'g-recaptcha-response': recaptchaResponseForgot
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Cerrar modal
          const modal = document.getElementById('forgotPasswordModal');
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
          
          // Mostrar mensaje de éxito
          showAlert('success', data.message);
          
          // Resetear formulario
          forgotPasswordForm.reset();
          if (window.recaptchaWidgets.forgot !== undefined) {
            grecaptcha.reset(window.recaptchaWidgets.forgot);
          }
          
        } else {
          // Mostrar error específico
          if (data.field === 'email') {
            emailForgot.classList.add('is-invalid');
          } else if (data.field === 'recaptcha') {
            if (recaptchaContainerForgot && recaptchaErrorForgot) {
              recaptchaContainerForgot.classList.add('invalid');
              recaptchaErrorForgot.classList.add('show');
            }
          }
          showAlert('danger', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showAlert('danger', 'Error de conexión. Por favor, intenta nuevamente.');
      })
      .finally(() => {
        // Restaurar botón
        if (submitButton && spinner && buttonText) {
          submitButton.disabled = false;
          spinner.classList.add('d-none');
          buttonText.textContent = 'Enviar Enlace';
        }
      });
    });
  }

  // Función para mostrar alertas
  function showAlert(type, message) {
    // Buscar container de alertas o crearlo
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.className = 'alert-container position-fixed top-0 start-50 translate-middle-x mt-3';
      alertContainer.style.zIndex = '9999';
      document.body.appendChild(alertContainer);
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
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

// Callback global para cuando reCAPTCHA esté listo
window.onRecaptchaReady = function() {
  try {
    // Renderizar widget de login si existe
    const loginRecaptcha = document.getElementById('recaptcha-login');
    if (loginRecaptcha && !window.recaptchaWidgets.login) {
      window.recaptchaWidgets.login = grecaptcha.render('recaptcha-login', {
        'sitekey': loginRecaptcha.getAttribute('data-sitekey')
      });
    }
    
    // Renderizar widget de registro si existe
    const registerRecaptcha = document.getElementById('recaptcha-register');
    if (registerRecaptcha && !window.recaptchaWidgets.register) {
      window.recaptchaWidgets.register = grecaptcha.render('recaptcha-register', {
        'sitekey': registerRecaptcha.getAttribute('data-sitekey')
      });
    }
    
    // Renderizar widget de recuperación si existe
    const forgotRecaptcha = document.getElementById('recaptcha-forgot');
    if (forgotRecaptcha && !window.recaptchaWidgets.forgot) {
      window.recaptchaWidgets.forgot = grecaptcha.render('recaptcha-forgot', {
        'sitekey': forgotRecaptcha.getAttribute('data-sitekey')
      });
    }
  } catch (error) {
    console.error('Error al inicializar widgets de reCAPTCHA:', error);
  }
};