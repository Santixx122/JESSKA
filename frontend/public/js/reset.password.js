document.addEventListener('DOMContentLoaded', function() {
      const form = document.querySelector('form');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirmPassword');
      
      form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Limpiar errores previos
        password.classList.remove('is-invalid');
        confirmPassword.classList.remove('is-invalid');
        
        // Validar longitud de contraseña
        if (password.value.length < 8) {
          password.classList.add('is-invalid');
          isValid = false;
        }
        
        // Validar que las contraseñas coincidan
        if (password.value !== confirmPassword.value) {
          confirmPassword.classList.add('is-invalid');
          isValid = false;
        }
        
        if (!isValid) {
          e.preventDefault();
        }
      });
      
      // Validación en tiempo real
      confirmPassword.addEventListener('input', function() {
        if (password.value && confirmPassword.value) {
          if (password.value === confirmPassword.value) {
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.classList.add('is-valid');
          } else {
            confirmPassword.classList.remove('is-valid');
            confirmPassword.classList.add('is-invalid');
          }
        }
      });
    });