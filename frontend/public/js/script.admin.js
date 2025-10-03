var ctx = document.getElementById('myChart').getContext('2d')
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Hombres', 'Mujeres', 'Niños'],
        datasets: [{
            label: 'ventas',
            data: [10, 9, 15],
            borderRadius: 10,
            borderSkipped: false,
            backgroundColor: [
                'rgb(0, 147, 180)',
                'rgb(86, 0, 180)',
                'rgb(4, 180, 0)',
            ]
        }]
    }
});
var ctx = document.getElementById('myChart2').getContext('2d')
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo','Abril','Mayo','Junio','Julio'],
        datasets: [{
            label: 'Usuarios',
            data: [59, 80, 74,60,67,90,82],
        }]
    }
});

const cerrarAdmin = document.getElementById('closeAdmin');
cerrarAdmin.onclick = function () {
    window.location.href = '/index.html'
}


//navegar en las diferentes seciones admin panel
const sections = document.querySelectorAll(".section");
const navButtons = document.querySelectorAll(".nav-button");

function mostrarSeccion(id) {
    sections.forEach(section => {
        section.classList.toggle("active", section.id === id);
    });

    navButtons.forEach(button => {
        button.classList.toggle("active", button.dataset.target === id);
    });

    history.pushState(null, null, "#" + id);
}

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        const id = button.dataset.target;
        mostrarSeccion(id);
    });
});
function mostrarSeccionDesdeHash() {
    const hash = window.location.hash || "#dashboard";
    const id = hash.substring(1);
    mostrarSeccion(id);
}
// Inicializar la sección desde el hash
mostrarSeccionDesdeHash();

// Funcionalidad para productos

//botón ID 

document.addEventListener("DOMContentLoaded", () => {
  const toastEl = document.getElementById("copyToast");
  const toast = new bootstrap.Toast(toastEl, {
    delay: 2000 
  });

  // Escuchar todos los botones "copiar"
  document.querySelectorAll(".copiar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id"); // obtener el ID del botón

      navigator.clipboard.writeText(id)
        .then(() => {
          toastEl.querySelector(".toast-body").textContent = `ID copiado: ${id}`;
          toast.show();
        })
        .catch();
    });
  });
});


// Funcion Editar

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;

      if (type === "usuario") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearUsuario"));
        const form = document.getElementById("formCrearUsuario");

        // Restaurar a modo CREAR
        document.getElementById("modalCrearUsuarioLabel").innerText = "Crear Usuario";
        form.querySelector("button[type=submit]").innerHTML = "Agregar";
        form.action = "/admin/crearUsuario";

        // Limpiar inputs
        form.reset();

        modal.show();
      }

            if (type === "pedido") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearProducto"));
        const form = document.getElementById("formCrearProducto");

        document.getElementById("modalCrearProductoLabel").innerText = "Crear Producto";
        form.querySelector("button[type=submit]").innerHTML = "Agregar";
        form.action = "/admin/crearProducto";
        form.reset();

        modal.show();
      }
      
      if (type === "producto") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearProducto"));
        const form = document.getElementById("formCrearProducto");

        document.getElementById("modalCrearProductoLabel").innerText = "Crear Producto";
        form.querySelector("button[type=submit]").innerHTML = "Agregar";
        form.action = "/admin/crearProducto";
        form.reset();

        modal.show();
      }

      if (type === "categoria") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearCategoria"));
        const form = document.getElementById("formCrearCategoria");

        document.getElementById("modalCrearCategoriaLabel").innerText = "Crear Categoría";
        form.querySelector("button[type=submit]").innerHTML = "Agregar";
        form.action = "/admin/crearCategoria";
        form.reset();

        modal.show();
      }

      if (type === "marca") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearMarca"));
        const form = document.getElementById("formCrearMarca");

        document.getElementById("modalCrearMarcaLabel").innerText = "Crear Marca";
        form.querySelector("button[type=submit]").innerHTML = "Agregar";
        form.action = "/admin/crearMarca";
        form.reset();

        modal.show();
      }
    });
  });

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;

      if (type === "usuario") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearUsuario"));
        const form = document.getElementById("formCrearUsuario");

        // Cambiar a modo EDITAR
        document.getElementById("modalCrearUsuarioLabel").innerText = "Editar Usuario";
        form.querySelector("button[type=submit]").innerHTML = "Guardar cambios";
        form.action = `/admin/editarUsuario/${btn.dataset.id}`;

        // Llenar inputs
        form.querySelector("#nombre").value = btn.dataset.nombre;
        form.querySelector("#email").value = btn.dataset.email;
        form.querySelector("#telefono").value = btn.dataset.telefono;

        modal.show();
      }

      if (type === "producto") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearProducto"));
        const form = document.getElementById("formCrearProducto");

        document.getElementById("modalCrearProductoLabel").innerText = "Editar Producto";
        form.querySelector("button[type=submit]").innerHTML = "Guardar cambios";
        form.action = `/admin/editarProducto/${btn.dataset.id}`;

        form.querySelector("#nombre").value = btn.dataset.nombre;
        form.querySelector("#descripcion").value = btn.dataset.descripcion;
        form.querySelector("#color").value = btn.dataset.color;
        form.querySelector("#talla").value = btn.dataset.talla;
        form.querySelector("#precio").value = btn.dataset.precio;
        form.querySelector("#stock").value = btn.dataset.stock;
        form.querySelector("#estado").value = btn.dataset.estado;
        form.querySelector("#visible").checked = btn.dataset.visible === "true";

        modal.show();
      }

      if (type === "categoria") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearCategoria"));
        const form = document.getElementById("formCrearCategoria");

        document.getElementById("modalCrearCategoriaLabel").innerText = "Editar Categoría";
        form.querySelector("button[type=submit]").innerHTML = "Guardar cambios";
        form.action = `/admin/editarCategoria/${btn.dataset.id}`;

        form.querySelector("#nombre").value = btn.dataset.nombre;
        form.querySelector("#descripcion").value = btn.dataset.descripcion;

        modal.show();
      }

      if (type === "marca") {
        const modal = new bootstrap.Modal(document.getElementById("modalCrearMarca"));
        const form = document.getElementById("formCrearMarca");

        document.getElementById("modalCrearMarcaLabel").innerText = "Editar Marca";
        form.querySelector("button[type=submit]").innerHTML = "Guardar cambios";
        form.action = `/admin/editarMarca/${btn.dataset.id}`;

        form.querySelector("#nombre").value = btn.dataset.nombre;

        modal.show();
      }
    });
  });
});


document.getElementById("modalCrearProducto").addEventListener("hidden.bs.modal", () => {
  const form = document.getElementById("formCrearProducto");
  document.getElementById("modalCrearProductoLabel").innerText = "Crear Producto";
  form.querySelector("button[type=submit]").innerHTML = "Agregar";
  form.action = "/admin/crearProducto";
  form.reset();
});

document.getElementById("modalCrearCategoria").addEventListener("hidden.bs.modal", () => {
  const form = document.getElementById("formCrearCategoria");
  document.getElementById("modalCrearCategoriaLabel").innerText = "Crear Categoría";
  form.querySelector("button[type=submit]").innerHTML = "Agregar";
  form.action = "/admin/crearCategoria";
  form.reset();
});

document.getElementById("modalCrearMarca").addEventListener("hidden.bs.modal", () => {
  const form = document.getElementById("formCrearMarca");
  document.getElementById("modalCrearMarcaLabel").innerText = "Crear Marca";
  form.querySelector("button[type=submit]").innerHTML = "Agregar";
  form.action = "/admin/crearMarca";
  form.reset();
});

document.getElementById("modalCrearUsuario").addEventListener("hidden.bs.modal", () => {
  const form = document.getElementById("formCrearUsuario");
  document.getElementById("modalCrearUsuarioLabel").innerText = "Crear Usuario";
  form.querySelector("button[type=submit]").innerHTML = "Agregar";
  form.action = "/admin/crearUsuario";
  form.reset();
});