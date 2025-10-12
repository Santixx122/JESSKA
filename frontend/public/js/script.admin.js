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


// Función para manejar la apertura de modales
function handleModal(type, mode, btn = null) {
    const config = {
        producto: {
            modalId: 'modalCrearProducto',
            formId: 'modalCrearProducto',
            createPath: '/api/admin/productos',
            editPath: '/api/admin/productos',
            title: 'Producto'
        },
        usuario: {
            modalId: 'modalCrearUsuario',
            formId: 'modalCrearUsuario',
            createPath: '/admin/crearUsuario',
            editPath: '/admin/editarUsuario',
            title: 'Usuario'
        },
        categoria: {
            modalId: 'modalCrearCategoria',
            formId: 'modalCrearCategoria',
            createPath: '/admin/crearCategoria',
            editPath: '/admin/editarCategoria',
            title: 'Categoría'
        },
        marca: {
            modalId: 'modalCrearMarca',
            formId: 'modalCrearMarca',
            createPath: '/admin/crearMarca',
            editPath: '/admin/editarMarca',
            title: 'Marca'
        },
        pedidos: {
            modalId: 'modalCrearPedido',
            formId: 'modalCrearPedido',
            createPath: '/admin/crearPedido',
            editPath: '/admin/editarPedido',
            title: 'Pedido'
        }
    };

    const typeConfig = config[type];
    if (!typeConfig) return;

    const modalElement = document.getElementById(typeConfig.modalId);
    if (!modalElement) {
        console.error(`Modal no encontrado: ${typeConfig.modalId}`);
        return;
    }

    const form = modalElement.querySelector('form');
    if (!form) {
        console.error(`Formulario no encontrado en el modal: ${typeConfig.modalId}`);
        return;
    }

    const titleElement = modalElement.querySelector('.modal-title');
    const modal = new bootstrap.Modal(modalElement);

    if (mode === 'create') {
        titleElement.innerText = `Crear ${typeConfig.title}`;
        form.querySelector('button[type="submit"]').textContent = 'Agregar';
        form.action = typeConfig.createPath;
        form.reset();
    } else if (mode === 'edit' && btn) {
        titleElement.innerText = `Editar ${typeConfig.title}`;
        form.querySelector('button[type="submit"]').textContent = 'Guardar cambios';
        form.action = `${typeConfig.editPath}/${btn.dataset.id}`;

        // Manejo específico para cada tipo
        if (type === 'producto') {
            try {
                console.log('Datos del producto a editar:', btn.dataset);
                
                // Campos básicos del producto
                const campos = ['nombre', 'descripcion', 'color', 'talla', 'precio', 'stock', 'estado'];
                campos.forEach(campo => {
                    const input = form.querySelector(`#${campo}`);
                    if (input) {
                        input.value = btn.dataset[campo] || '';
                        console.log(`Campo ${campo} actualizado con valor:`, input.value);
                    } else {
                        console.error(`Campo no encontrado: ${campo}`);
                    }
                });

                // Manejo de checkbox visible
                const visibleCheck = form.querySelector('#visible');
                if (visibleCheck) {
                    visibleCheck.checked = btn.dataset.visible === 'true';
                }

                // Asegurarse de que el select de categoría esté configurado
                const categoriaSelect = form.querySelector('#categoria');
                if (categoriaSelect && btn.dataset.categoriaid) {
                    categoriaSelect.value = btn.dataset.categoriaid;
                }

            } catch (error) {
                console.error('Error al cargar datos del producto:', error);
            }
        } else if (type === 'usuario') {
            form.querySelector('#nombre').value = btn.dataset.nombre || '';
            form.querySelector('#email').value = btn.dataset.email || '';
            form.querySelector('#telefono').value = btn.dataset.telefono || '';
        } else if (type === 'pedidos') {
            console.log('Datos del pedido:', btn.dataset);
            
            // Asignar ID de usuario
            const idUsuarioInput = form.querySelector('#idUsuario');
            if (idUsuarioInput) {
                idUsuarioInput.value = btn.dataset.clienteid || '';
            }
            
            // Formatear y asignar fecha
            const fechaInput = form.querySelector('#fecha');
            if (fechaInput && btn.dataset.fecha) {
                const fecha = new Date(btn.dataset.fecha);
                fechaInput.value = fecha.toISOString().split('T')[0];
            }
            
            // Asignar total y estado
            const totalInput = form.querySelector('#total');
            if (totalInput) {
                totalInput.value = btn.dataset.total || '';
            }

            const estadoInput = form.querySelector('#estado');
            if (estadoInput) {
                estadoInput.value = btn.dataset.estado || '';
            }
        } else if (type === 'categoria') {
            form.querySelector('#nombre').value = btn.dataset.nombre || '';
            form.querySelector('#descripcion').value = btn.dataset.descripcion || '';
        } else if (type === 'marca') {
            form.querySelector('#nombre').value = btn.dataset.nombre || '';
        }
    }

    // Mostrar el modal
    modal.show();
}

// Event listeners para botones cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Configuración de los modales al abrir para crear
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-bs-target').substring(1);
            const modal = document.getElementById(modalId);
            if (modal) {
                const form = modal.querySelector('form');
                if (form) {
                    form.reset();
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) submitBtn.textContent = 'Crear';
                    // Reset del título
                    const titleElement = modal.querySelector('.modal-title');
                    if (titleElement) {
                        const tipo = modalId.replace('modalCrear', '');
                        titleElement.textContent = `Crear ${tipo}`;
                    }
                }
            }
        });
    });

    // Event listeners para botones de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', () => handleModal(btn.dataset.type, 'edit', btn));
    });
});


// Configurar event listeners para el reseteo de los modales al cerrarse
document.addEventListener('DOMContentLoaded', () => {
    const modales = [
        { id: 'modalCrearProducto', path: '/api/admin/productos', titulo: 'Producto' },
        { id: 'modalCrearCategoria', path: '/admin/crearCategoria', titulo: 'Categoría' },
        { id: 'modalCrearMarca', path: '/admin/crearMarca', titulo: 'Marca' },
        { id: 'modalCrearUsuario', path: '/admin/crearUsuario', titulo: 'Usuario' },
        { id: 'modalCrearPedido', path: '/admin/crearPedido', titulo: 'Pedido' }
    ];

    modales.forEach(({ id, path, titulo }) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.addEventListener('hidden.bs.modal', () => {
                const form = modal.querySelector('form');
                if (form) {
                    const titleElement = modal.querySelector('.modal-title');
                    if (titleElement) {
                        titleElement.textContent = `Crear ${titulo}`;
                    }
                    
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.textContent = 'Agregar';
                    }
                    
                    form.action = path;
                    form.reset();
                }
            });
        }
    });
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

