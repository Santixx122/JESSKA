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

// Función para manejar la apertura de modales
function handleModal(type, mode, btn = null) {
    const config = {
        producto: {
            modalId: 'modalCrearProducto',
            formId: 'formCrearProducto',
            createPath: '/admin/crearProducto',
            editPath: '/admin/editarProducto',
            title: 'Producto'
        },
        usuario: {
            modalId: 'modalCrearUsuario',
            formId: 'formCrearUsuario',
            createPath: '/admin/crearUsuario',
            editPath: '/admin/editarUsuario',
            title: 'Usuario'
        },
        categoria: {
            modalId: 'modalCrearCategoria',
            formId: 'formCrearCategoria',
            createPath: '/admin/crearCategoria',
            editPath: '/admin/editarCategoria',
            title: 'Categoría'
        },
        marca: {
            modalId: 'modalCrearMarca',
            formId: 'formCrearMarca',
            createPath: '/admin/crearMarca',
            editPath: '/admin/editarMarca',
            title: 'Marca'
        },
        pedidos: {
            modalId: 'modalCrearPedido',
            formId: 'formCrearPedido',
            createPath: '/admin/crearPedido',
            editPath: '/admin/editarPedido',
            title: 'Pedido'
        }
    };

    const typeConfig = config[type];
    if (!typeConfig) return;

    const modal = new bootstrap.Modal(document.getElementById(typeConfig.modalId));
    const form = document.getElementById(typeConfig.formId);
    const titleElement = document.getElementById(typeConfig.modalId + 'Label');
    
    if (mode === 'create') {
        titleElement.innerText = `Crear ${typeConfig.title}`;
        form.querySelector('button[type=submit]').innerHTML = 'Agregar';
        form.action = typeConfig.createPath;
        form.reset();
    } else if (mode === 'edit' && btn) {
        titleElement.innerText = `Editar ${typeConfig.title}`;
        form.querySelector('button[type=submit]').innerHTML = 'Guardar cambios';
        form.action = `${typeConfig.editPath}/${btn.dataset.id}`;

        // Manejo específico para cada tipo
        if (type === 'producto') {
            try {
                console.log('Datos del producto a editar:', btn.dataset);
                
                const campos = ['nombre', 'descripcion', 'color', 'talla', 'precio', 'stock', 'estado'];
                campos.forEach(campo => {
                    const input = form.querySelector(`#${campo}`);
                    if (input) {
                        input.value = btn.dataset[campo] || '';
                    } else {
                        console.error(`Campo no encontrado: ${campo}`);
                    }
                });

                const visibleCheck = form.querySelector('#visible');
                if (visibleCheck) {
                    visibleCheck.checked = btn.dataset.visible === 'true';
                }
            } catch (error) {
                console.error('Error al cargar datos del producto:', error);
            }
        } else if (type === 'usuario') {
            form.querySelector('#nombre').value = btn.dataset.nombre || '';
            form.querySelector('#email').value = btn.dataset.email || '';
            form.querySelector('#telefono').value = btn.dataset.telefono || '';
        } else if (type === 'pedidos') {
            form.querySelector('#idUsuario').value = btn.dataset.clienteid || '';
            form.querySelector('#fecha').value = btn.dataset.fechacreacion ? 
                new Date(btn.dataset.fechacreacion).toISOString().split('T')[0] : '';
            form.querySelector('#total').value = btn.dataset.total || '';
            form.querySelector('#estado').value = btn.dataset.estado || '';
        } else if (type === 'categoria') {
            form.querySelector('#nombre').value = btn.dataset.nombre || '';
            form.querySelector('#descripcion').value = btn.dataset.descripcion || '';
        } else if (type === 'marca') {
            form.querySelector('#nombre').value = btn.dataset.nombre || '';
        }
    }

    modal.show();
}

// Eventos para botones de agregar
document.addEventListener('DOMContentLoaded', () => {
    // Manejar botones de agregar
    document.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', () => handleModal(btn.dataset.type, 'create'));
    });

    // Manejar botones de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => handleModal(btn.dataset.type, 'edit', btn));
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

document.getElementById("modalCrearPedido").addEventListener("hidden.bs.modal", () => {
  const form = document.getElementById("formCrearPedido");
  document.getElementById("modalCrearPedidoLabel").innerText = "Crear Pedido";
  form.querySelector("button[type=submit]").innerHTML = "Agregar";
  form.action = "/admin/crearPedido";
  form.reset();
});

document.addEventListener("DOMContentLoaded", () => {
  const tablas = [
    { id: "tabla-productos", ruta: "/admin/eliminarProducto/", entidad: "Producto" },
    { id: "tabla-usuarios", ruta: "/admin/eliminarUsuario/", entidad: "Usuario" },
    { id: "tabla-categorias", ruta: "/admin/eliminarCategoria/", entidad: "Categoría" },
    { id: "tabla-marcas", ruta: "/admin/eliminarMarca/", entidad: "Marca" },
    { id: "tabla-pedidos", ruta: "/admin/eliminarPedido/", entidad: "Pedido" }
  ];

  let idAEliminar = null;
  let filaAEliminar = null;
  let rutaAEliminar = null;
  let entidadAEliminar = null;

  const modalEliminar = new bootstrap.Modal(document.getElementById("modalConfirmarEliminar"));
  const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");
  const toastEliminar = new bootstrap.Toast(document.getElementById("toastEliminar"), { delay: 2000 });
  const toastMsg = document.getElementById("toastEliminarMsg");

  tablas.forEach(tablaInfo => {
    const tabla = document.getElementById(tablaInfo.id);
    if (!tabla) return;

    tabla.addEventListener("click", (e) => {
      if (e.target.closest(".btn-eliminar")) {
        const boton = e.target.closest(".btn-eliminar");
        idAEliminar = boton.getAttribute("data-id");
        filaAEliminar = boton.closest("tr");
        rutaAEliminar = tablaInfo.ruta;
        entidadAEliminar = tablaInfo.entidad;
          const textoModal = document.getElementById("modalEliminarTexto");
          if (textoModal) {
            textoModal.textContent = `¿Seguro que deseas eliminar este ${entidadAEliminar.toLowerCase()}?`;
          }
        modalEliminar.show();
      }
    });
  });

  btnConfirmarEliminar.addEventListener("click", async () => {
    if (!idAEliminar || !rutaAEliminar) return;
    try {
      const res = await axios.delete(rutaAEliminar + idAEliminar);
      if (res.data.success) {
        filaAEliminar.remove();
        toastMsg.textContent = `${entidadAEliminar} eliminado correctamente`;
        document.getElementById("toastEliminar").classList.remove("text-bg-danger");
        document.getElementById("toastEliminar").classList.add("text-bg-success");
      } else {
        toastMsg.textContent = `No se pudo eliminar el ${entidadAEliminar.toLowerCase()}`;
        document.getElementById("toastEliminar").classList.remove("text-bg-success");
        document.getElementById("toastEliminar").classList.add("text-bg-danger");
      }
    } catch (error) {
      toastMsg.textContent = "Error al conectar con el servidor";
      document.getElementById("toastEliminar").classList.remove("text-bg-success");
      document.getElementById("toastEliminar").classList.add("text-bg-danger");
    }
    modalEliminar.hide();
    toastEliminar.show();
    // Limpiar variables
    idAEliminar = null;
    filaAEliminar = null;
    rutaAEliminar = null;
    entidadAEliminar = null;
  });
});

