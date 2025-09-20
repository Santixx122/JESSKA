// script carrusel con splide js
document.querySelectorAll('.splide').forEach((carrusel) => {
  new Splide(carrusel, {
    type: 'loop',
    perPage: 4,
    focus: "center",
    breakpoints: {
      640: {
        perPage: 1,
        focus: "center"
      },
      1024: {
        perPage: 3,
        focus: "center"
      },
    },
  }).mount();
});

// Validaciones del formulario de login y feedback visual
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const submitBtn = document.getElementById('iniciarsesion');
  const spinner = submitBtn?.querySelector('.spinner-border');
  const btnText = submitBtn?.querySelector('.button-text');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setLoading = (loading) => {
    if (!submitBtn) return;
    if (loading) {
      submitBtn.setAttribute('disabled', 'true');
      if (spinner) spinner.classList.remove('d-none');
      if (btnText) btnText.textContent = 'Ingresando...';
    } else {
      submitBtn.removeAttribute('disabled');
      if (spinner) spinner.classList.add('d-none');
      if (btnText) btnText.textContent = 'Iniciar Sesión';
    }
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      let valid = true;

      // Validar email
      if (!emailInput.value || !emailRegex.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        valid = false;
      } else {
        emailInput.classList.remove('is-invalid');
      }

      // Validar password
      if (!passwordInput.value || passwordInput.value.length < 6) {
        passwordInput.classList.add('is-invalid');
        valid = false;
      } else {
        passwordInput.classList.remove('is-invalid');
      }

      if (!valid) {
        e.preventDefault();
        return;
      }

      // Mostrar loading
      setLoading(true);
    });
  }

  // Si hay un error renderizado por el servidor, abrir el modal de login automáticamente
  try {
    const modalEl = document.getElementById('exampleModal');
    const hasServerError = modalEl && modalEl.querySelector('.alert.alert-danger');
    if (hasServerError && window.bootstrap) {
      const modal = new window.bootstrap.Modal(modalEl);
      modal.show();
    }
  } catch (err) {
    // noop
  }

  // Validaciones de registro y auto-abrir modal si hay mensajes
  try {
    const regModalEl = document.getElementById('staticBackdrop');
    const regForm = document.getElementById('registerForm');
    const nombreInput = regForm?.querySelector('input[name="nombre"]');
    const emailRegInput = regForm?.querySelector('input[name="email"]');
    const telInput = regForm?.querySelector('input[name="telefono"]');
    const passRegInput = regForm?.querySelector('input[name="password"]');
    const passConfInput = regForm?.querySelectorAll('input[type="password"]')[1];

    const emailRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^(3\d{9}|[1-9]\d{6,9})$/;

    // Auto-abrir si hay alertas (error o success) en el modal de registro
    const hasRegAlert = regModalEl && regModalEl.querySelector('.alert');
    if (hasRegAlert && window.bootstrap) {
      const regModal = new window.bootstrap.Modal(regModalEl);
      regModal.show();
    }

    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        let valid = true;

        // nombre
        if (!nombreInput.value || nombreInput.value.trim().length < 3) {
          nombreInput.classList.add('is-invalid');
          valid = false;
        } else {
          nombreInput.classList.remove('is-invalid');
        }

        // email
        if (!emailRegInput.value || !emailRegex2.test(emailRegInput.value)) {
          emailRegInput.classList.add('is-invalid');
          valid = false;
        } else {
          emailRegInput.classList.remove('is-invalid');
        }

        // telefono
        if (!telInput.value || !telRegex.test(telInput.value)) {
          telInput.classList.add('is-invalid');
          valid = false;
        } else {
          telInput.classList.remove('is-invalid');
        }

        // password
        if (!passRegInput.value || passRegInput.value.length < 8) {
          passRegInput.classList.add('is-invalid');
          valid = false;
        } else {
          passRegInput.classList.remove('is-invalid');
        }

        // confirm password
        if (!passConfInput.value || passConfInput.value !== passRegInput.value) {
          passConfInput.classList.add('is-invalid');
          valid = false;
        } else {
          passConfInput.classList.remove('is-invalid');
        }

        if (!valid) {
          e.preventDefault();
        }
      });
    }
  } catch (e) {
    // noop
  }
});