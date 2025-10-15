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

  // ====================== COMENTADO: SISTEMA ANTIGUO DE MODALES DE EDICIÓN ======================
  /*
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
  */
  // ====================== FIN COMENTADO ======================
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

// ====================== FUNCIONES PARA MODALES DE USUARIOS ======================

// Función para editar usuario usando el modal existente
function editarUsuario(usuarioId, button) {
    const modal = new bootstrap.Modal(document.getElementById("modalCrearUsuario"));
    const form = document.getElementById("formCrearUsuario");

    // Cambiar a modo EDITAR
    document.getElementById("modalCrearUsuarioLabel").innerText = "Editar Usuario";
    form.querySelector("button[type=submit]").innerHTML = "Guardar cambios";
    form.action = `/admin/editarUsuario/${usuarioId}`;

    // Llenar inputs con los datos del botón
    form.querySelector("#nombre").value = button.dataset.nombre;
    form.querySelector("#email").value = button.dataset.email;
    form.querySelector("#telefono").value = button.dataset.telefono;

    modal.show();
}

// Función para editar categoría usando el modal existente
function editarCategoria(categoriaId, button) {
    const modal = new bootstrap.Modal(document.getElementById("modalCrearCategoria"));
    const form = document.getElementById("formCrearCategoria");

    // Cambiar a modo EDITAR
    document.getElementById("modalCrearCategoriaLabel").innerText = "Editar Categoría";
    form.querySelector("button[type=submit]").innerHTML = "Guardar cambios";
    form.action = `/admin/editarCategoria/${categoriaId}`;

    // Llenar inputs con los datos del botón
    form.querySelector("#nombre").value = button.dataset.nombre;
    form.querySelector("#descripcion").value = button.dataset.descripcion;

    modal.show();
}

// Función para editar marca usando el modal existente
function editarMarca(marcaId, button) {
    const modal = new bootstrap.Modal(document.getElementById("modalCrearMarca"));
    const form = document.getElementById("formCrearMarca");

    // Cambiar a modo EDITAR
    document.getElementById("modalCrearMarcaLabel").innerText = "Editar Marca";
    form.querySelector("button[type=submit]").innerHTML = "Guardar cambios";
    form.action = `/admin/editarMarca/${marcaId}`;

    // Llenar inputs con los datos del botón
    form.querySelector("#nombre").value = button.dataset.nombre;

    modal.show();
}

// ====================== FUNCIONES PARA MODALES DE PRODUCTOS ======================

// Función para abrir modal de editar producto
async function editarProducto(productoId, button) {
    try {
        // Obtener datos del producto
        const response = await axios.get(`http://localhost:4000/productos/${productoId}`, {
            headers: {
                'api-key-441': 'contrasena-super-secreta'
            }
        });

        if (response.data.success) {
            const producto = response.data.data;
            console.log('Datos del producto:', producto);
            
            // Llenar los campos del modal
            document.getElementById('editProductoId').value = producto._id;
            
            // Configurar la acción del formulario con el ID del producto
            const form = document.getElementById('formEditarProducto');
            form.action = `/admin/actualizarProducto/${producto._id}`;
            
            document.getElementById('editNombre').value = producto.nombre || '';
            document.getElementById('editDescripcion').value = producto.descripcion || '';
            
            // Seleccionar categoría y marca correctamente
            const categoriaSelect = document.getElementById('editCategoria');
            const marcaSelect = document.getElementById('editMarca');
            
            if (categoriaSelect && producto.categoriaId) {
                categoriaSelect.value = producto.categoriaId._id || producto.categoriaId;
            }
            
            if (marcaSelect && producto.marcaId) {
                marcaSelect.value = producto.marcaId._id || producto.marcaId;
            }
            
            document.getElementById('editEstado').value = producto.estado || 'activo';
            document.getElementById('editVisible').checked = producto.visible !== false;
            
            // Si el producto tiene variantes, usar la primera variante para los campos individuales
            if (producto.variante && producto.variante.length > 0) {
                const primeraVariante = producto.variante[0];
                document.getElementById('editColor').value = primeraVariante.color || '';
                
                // Para talla, verificar si es un select o input
                const tallaElement = document.getElementById('editTalla');
                if (tallaElement) {
                    tallaElement.value = primeraVariante.talla || '';
                }
                
                document.getElementById('editPrecio').value = primeraVariante.precio || '';
                document.getElementById('editStock').value = primeraVariante.stock || '';
            }
            
            // Mostrar imagen actual si existe
            const imagenActual = document.getElementById('imagenActual');
            if (producto.imagenUrl) {
                imagenActual.src = producto.imagenUrl;
                imagenActual.classList.remove('d-none');
            } else {
                imagenActual.classList.add('d-none');
            }
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('modalEditarProducto'));
            modal.show();
            
            // Agregar manejador para el botón de guardar
            const btnGuardar = document.getElementById('btnGuardarProducto');
            btnGuardar.onclick = function(e) {
                e.preventDefault();
                
                // Validar datos básicos
                const nombre = document.getElementById('editNombre').value.trim();
                const descripcion = document.getElementById('editDescripcion').value.trim();
                
                if (!nombre || !descripcion) {
                    mostrarToast('Por favor complete los campos obligatorios', false);
                    return;
                }
                
                // Mostrar spinner
                const spinner = btnGuardar.querySelector('.spinner-border');
                spinner.classList.remove('d-none');
                btnGuardar.disabled = true;
                
                // Disparar submit del formulario
                form.submit();
            };
        }
    } catch (error) {
        console.error('Error al cargar producto:', error);
        mostrarToast('Error al cargar los datos del producto', false);
    }
}

// Función para guardar producto editado
async function guardarProductoEditado() {
    try {
        const form = document.getElementById('formEditarProducto');
        const formData = new FormData(form);
        const productoId = document.getElementById('editProductoId').value;
        
        console.log('=== GUARDANDO PRODUCTO ===');
        console.log('ID del producto:', productoId);
        
        // Validar campos obligatorios
        const nombre = formData.get('nombre');
        const descripcion = formData.get('descripcion');
        const categoriaId = formData.get('categoriaId');
        const marcaId = formData.get('marcaId');
        
        if (!nombre || !descripcion || !categoriaId || !marcaId) {
            mostrarToast('Por favor complete todos los campos obligatorios', false);
            return;
        }
        
        // Crear un FormData con todos los datos
        const data = new FormData();
        
        // Añadir campos de texto
        data.append('nombre', nombre);
        data.append('descripcion', descripcion);
        data.append('categoriaId', categoriaId);
        data.append('marcaId', marcaId);
        data.append('color', formData.get('color') || '');
        data.append('talla', formData.get('talla') || '');
        data.append('precio', formData.get('precio') || '0');
        data.append('stock', formData.get('stock') || '0');
        data.append('estado', formData.get('estado') || 'activo');
        data.append('visible', formData.get('visible') ? 'on' : '');
        
        // Añadir imagen si se seleccionó una nueva
        const imagenFile = formData.get('imagen');
        if (imagenFile && imagenFile.size > 0) {
            console.log('Imagen seleccionada:', imagenFile.name);
            data.append('imagen', imagenFile);
        }
        
        // Mostrar spinner
        const button = event.target;
        const spinner = button.querySelector('.spinner-border');
        spinner.classList.remove('d-none');
        button.disabled = true;
        
        console.log('Enviando datos al servidor...');
        
        const response = await axios.post(`/admin/actualizarProducto/${productoId}`, data, {
            timeout: 30000 // 30 segundos de timeout
        });
        
        if (response.data.success) {
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarProducto'));
            modal.hide();
            
            // Mostrar toast de éxito
            mostrarToast('Producto editado exitosamente', true);
            
            // Recargar página para mostrar cambios
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            mostrarToast('Error al actualizar el producto: ' + response.data.message, false);
        }
    } catch (error) {
        console.error('Error completo al actualizar producto:', error);
        
        let mensajeError = 'Error al conectar con el servidor';
        if (error.response) {
            mensajeError = error.response.data?.message || `Error ${error.response.status}`;
        } else if (error.code === 'ECONNABORTED') {
            mensajeError = 'Timeout - La operación tardó demasiado';
        }
        
        mostrarToast(mensajeError, false);
    } finally {
        // Ocultar spinner
        try {
            const button = event.target;
            const spinner = button.querySelector('.spinner-border');
            spinner.classList.add('d-none');
            button.disabled = false;
        } catch (e) {
            console.error('Error al ocultar spinner:', e);
        }
    }
}

// Función para cargar variantes en el modal de edición
function cargarVariantesEdit(variantes) {
    const container = document.getElementById('variantesEditContainer');
    container.innerHTML = '';
    
    variantes.forEach((variante, index) => {
        const varianteHtml = `
            <div class="row mb-3 variante-row" data-index="${index}">
                <div class="col-md-3">
                    <label class="form-label">Color</label>
                    <input type="text" class="form-control" name="variantes[${index}][color]" value="${variante.color}" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Talla</label>
                    <input type="text" class="form-control" name="variantes[${index}][talla]" value="${variante.talla}" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Precio</label>
                    <input type="number" class="form-control" name="variantes[${index}][precio]" value="${variante.precio}" min="0" step="0.01" required>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Stock</label>
                    <input type="number" class="form-control" name="variantes[${index}][stock]" value="${variante.stock}" min="0" required>
                </div>
                <div class="col-md-2 d-flex align-items-end">
                    <button type="button" class="btn btn-danger btn-sm" onclick="eliminarVarianteEdit(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', varianteHtml);
    });
}

// Función para agregar nueva variante en edición
function agregarVarianteEdit() {
    const container = document.getElementById('variantesEditContainer');
    const index = container.children.length;
    
    const varianteHtml = `
        <div class="row mb-3 variante-row" data-index="${index}">
            <div class="col-md-3">
                <label class="form-label">Color</label>
                <input type="text" class="form-control" name="variantes[${index}][color]" required>
            </div>
            <div class="col-md-3">
                <label class="form-label">Talla</label>
                <input type="text" class="form-control" name="variantes[${index}][talla]" required>
            </div>
            <div class="col-md-2">
                <label class="form-label">Precio</label>
                <input type="number" class="form-control" name="variantes[${index}][precio]" min="0" step="0.01" required>
            </div>
            <div class="col-md-2">
                <label class="form-label">Stock</label>
                <input type="number" class="form-control" name="variantes[${index}][stock]" min="0" required>
            </div>
            <div class="col-md-2 d-flex align-items-end">
                <button type="button" class="btn btn-danger btn-sm" onclick="eliminarVarianteEdit(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', varianteHtml);
}

// Función para eliminar variante en edición
function eliminarVarianteEdit(button) {
    button.closest('.variante-row').remove();
    // Reindexar variantes
    const container = document.getElementById('variantesEditContainer');
    const rows = container.querySelectorAll('.variante-row');
    rows.forEach((row, index) => {
        row.setAttribute('data-index', index);
        const inputs = row.querySelectorAll('input');
        inputs.forEach(input => {
            const name = input.getAttribute('name');
            if (name) {
                const newName = name.replace(/\[\d+\]/, `[${index}]`);
                input.setAttribute('name', newName);
            }
        });
    });
}

// Función para guardar producto editado
async function guardarProductoEditado() {
    try {
        const form = document.getElementById('formEditarProducto');
        const formData = new FormData(form);
        const productoId = document.getElementById('editProductoId').value;
        
        // Recopilar variantes
        const variantes = [];
        const container = document.getElementById('variantesEditContainer');
        const rows = container.querySelectorAll('.variante-row');
        
        rows.forEach(row => {
            const inputs = row.querySelectorAll('input');
            const variante = {};
            inputs.forEach(input => {
                const name = input.getAttribute('name');
                const field = name.match(/variantes\[\d+\]\[(\w+)\]/)[1];
                variante[field] = input.value;
            });
            variantes.push(variante);
        });
        
        const data = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            categoriaId: formData.get('categoriaId'),
            marcaId: formData.get('marcaId'),
            estado: formData.get('estado'),
            imagenUrl: formData.get('imagenUrl'),
            variante: variantes
        };
        
        // Mostrar spinner
        const button = event.target;
        const spinner = button.querySelector('.spinner-border');
        spinner.classList.remove('d-none');
        button.disabled = true;
        
        const response = await axios.put(`http://localhost:4000/productos/${productoId}`, data, {
            headers: {
                'api-key-441': 'contrasena-super-secreta'
            }
        });
        
        if (response.data.success) {
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarProducto'));
            modal.hide();
            
            // Mostrar mensaje de éxito
            alert('Producto actualizado exitosamente');
            
            // Recargar página para mostrar cambios
            window.location.reload();
        } else {
            alert('Error al actualizar el producto: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert('Error al conectar con el servidor');
    } finally {
        // Ocultar spinner
        const button = event.target;
        const spinner = button.querySelector('.spinner-border');
        spinner.classList.add('d-none');
        button.disabled = false;
    }
}

// ====================== FUNCIONES PARA MODALES DE PEDIDOS ======================

// Función para mostrar toast de pedidos
function mostrarToastPedido(mensaje, esExito = true) {
    const toastEl = document.getElementById('toastPedido');
    const toastMsg = document.getElementById('toastPedidoMsg');
    
    // Cambiar estilo según el tipo de mensaje
    if (esExito) {
        toastEl.className = 'toast align-items-center text-bg-success border-0';
    } else {
        toastEl.className = 'toast align-items-center text-bg-danger border-0';
    }
    
    toastMsg.textContent = mensaje;
    
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}

// Función para mostrar toast de productos
function mostrarToast(mensaje, esExito = true) {
    const toastEl = document.getElementById('toastProducto');
    const toastMsg = document.getElementById('toastProductoMsg');
    
    // Cambiar estilo según el tipo de mensaje
    if (esExito) {
        toastEl.className = 'toast align-items-center text-bg-success border-0';
    } else {
        toastEl.className = 'toast align-items-center text-bg-danger border-0';
    }
    
    toastMsg.textContent = mensaje;
    
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}

// Función para cargar clientes en el select de crear pedido (ya no se usa, pero la mantengo por compatibilidad)
async function cargarClientesPedidos() {
    // Esta función ya no es necesaria ya que ahora es un input manual
    console.log('Cliente ID ahora es manual - función obsoleta');
}

// Función para abrir modal de editar pedido
async function editarPedido(pedidoId, button) {
    try {
        // Obtener datos del pedido
        const response = await axios.get(`http://localhost:4000/pedidos/${pedidoId}`, {
            headers: {
                'api-key-441': 'contrasena-super-secreta'
            }
        });

        if (response.data.success) {
            const pedido = response.data.data;
            
            // Llenar los campos del modal
            document.getElementById('editPedidoId').value = pedido._id;
            document.getElementById('editClienteIdPedido').value = pedido.clienteId || 'Cliente anónimo';
            document.getElementById('editTotalPedido').value = pedido.total;
            document.getElementById('editEstadoPedido').value = pedido.estado;
            
            // Convertir fecha para datetime-local
            const fecha = new Date(pedido.fechaCreacion);
            const fechaLocal = fecha.toISOString().slice(0, 16);
            document.getElementById('editFechaCreacionPedido').value = fechaLocal;
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('modalEditarPedido'));
            modal.show();
        }
    } catch (error) {
        console.error('Error al cargar pedido:', error);
        alert('Error al cargar los datos del pedido');
    }
}

// Función para guardar pedido editado
// Configurar eventos para modales de pedidos
document.addEventListener('DOMContentLoaded', function() {
    // Cargar clientes cuando se abre el modal de crear pedido
    const modalCrearPedido = document.getElementById('modalCrearPedido');
    if (modalCrearPedido) {
        modalCrearPedido.addEventListener('show.bs.modal', cargarClientesPedidos);
    }
    
    // Establecer fecha actual por defecto en crear pedido
    const fechaInput = document.getElementById('fechaCreacion');
    if (fechaInput) {
        const ahora = new Date();
        const fechaLocal = ahora.toISOString().slice(0, 16);
        fechaInput.value = fechaLocal;
    }
});

// Función para abrir modal de crear pedido
function abrirModalCrearPedido() {
    const modal = new bootstrap.Modal(document.getElementById('modalCrearPedido'));
    modal.show();
}

// Función para cargar clientes en los selects de pedidos
async function cargarClientesPedidos() {
    try {
        const response = await axios.get('http://localhost:4000/clientes', {
            headers: {
                'api-key-441': 'contrasena-super-secreta'
            }
        });
        
        if (response.data.success) {
            const clientes = response.data.data;
            const selectCrear = document.getElementById('clienteIdPedido');
            const selectEditar = document.getElementById('editClienteIdPedido');
            
            // Limpiar opciones existentes (excepto la primera)
            [selectCrear, selectEditar].forEach(select => {
                if (select) {
                    while (select.children.length > 1) {
                        select.removeChild(select.lastChild);
                    }
                    
                    clientes.forEach(cliente => {
                        const option = document.createElement('option');
                        option.value = cliente._id;
                        option.textContent = `${cliente.usuarioId?.nombre || 'Cliente'} - ID: ${cliente._id}`;
                        select.appendChild(option);
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// Función para crear nuevo pedido
async function crearPedido() {
    try {
        const form = document.getElementById('formCrearPedido');
        const formData = new FormData(form);
        
        const data = {
            clienteId: formData.get('clienteId') || null,
            total: parseFloat(formData.get('total')),
            estado: formData.get('estado'),
            fechaCreacion: new Date(formData.get('fechaCreacion'))
        };
        
        // Mostrar spinner
        const button = event.target;
        const spinner = button.querySelector('.spinner-border');
        spinner.classList.remove('d-none');
        button.disabled = true;
        
        const response = await axios.post('http://localhost:4000/pedidos', data, {
            headers: {
                'api-key-441': 'contrasena-super-secreta'
            }
        });
        
        if (response.data.success) {
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearPedido'));
            modal.hide();
            
            // Limpiar formulario
            form.reset();
            
            // Mostrar mensaje de éxito
            alert('Pedido creado exitosamente');
            
            // Recargar página para mostrar cambios
            window.location.reload();
        } else {
            alert('Error al crear el pedido: ' + response.data.message);
        }
    } catch (error) {
        console.error('Error al crear pedido:', error);
        alert('Error al conectar con el servidor');
    } finally {
        // Ocultar spinner
        const button = event.target;
        const spinner = button.querySelector('.spinner-border');
        spinner.classList.add('d-none');
        button.disabled = false;
    }
}

// Función para abrir modal de editar pedido
async function editarPedido(pedidoId, button) {
    try {
        // Obtener datos del pedido
        const response = await axios.get(`http://localhost:4000/pedidos/${pedidoId}`, {
            headers: {
                'api-key-441': 'contrasena-super-secreta'
            }
        });

        if (response.data.success) {
            const pedido = response.data.data;
            
            // Llenar los campos del modal
            document.getElementById('editPedidoId').value = pedido._id;
            document.getElementById('editClienteIdPedido').value = pedido.clienteId || '';
            document.getElementById('editTotalPedido').value = pedido.total;
            document.getElementById('editEstadoPedido').value = pedido.estado;
            
            // Convertir fecha para datetime-local
            const fecha = new Date(pedido.fechaCreacion);
            const fechaLocal = fecha.toISOString().slice(0, 16);
            document.getElementById('editFechaCreacionPedido').value = fechaLocal;
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('modalEditarPedido'));
            modal.show();
        }
    } catch (error) {
        console.error('Error al cargar pedido:', error);
        alert('Error al cargar los datos del pedido');
    }
}

// Función para guardar pedido editado
async function guardarPedidoEditado() {
    try {
        const form = document.getElementById('formEditarPedido');
        const formData = new FormData(form);
        const pedidoId = document.getElementById('editPedidoId').value;
        
        const data = {
            clienteId: formData.get('clienteId') || null,
            total: parseFloat(formData.get('total')),
            estado: formData.get('estado'),
            fechaCreacion: new Date(formData.get('fechaCreacion'))
        };
        
        // Mostrar spinner
        const button = event.target;
        const spinner = button.querySelector('.spinner-border');
        spinner.classList.remove('d-none');
        button.disabled = true;
        
        const response = await axios.put(`http://localhost:4000/pedidos/${pedidoId}`, data, {
            headers: {
                'api-key-441': 'contrasena-super-secreta'
            }
        });
        
        if (response.data.success) {
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarPedido'));
            modal.hide();
            
            // Mostrar toast de éxito
            mostrarToastPedido('Pedido editado exitosamente', true);
            
            // Recargar página para mostrar cambios después de un pequeño delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            mostrarToastPedido('Error al actualizar el pedido: ' + response.data.message, false);
        }
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        mostrarToastPedido('Error al conectar con el servidor', false);
    } finally {
        // Ocultar spinner
        const button = event.target;
        const spinner = button.querySelector('.spinner-border');
        spinner.classList.add('d-none');
        button.disabled = false;
    }
}

// Función para limpiar backdrop de modales al cerrar
function limpiarModalBackdrop() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

// Configurar eventos para limpiar backdrop de los nuevos modales
document.addEventListener('DOMContentLoaded', function() {
    // Cargar clientes al abrir modales de pedidos
    const modalCrearPedido = document.getElementById('modalCrearPedido');
    const modalEditarPedido = document.getElementById('modalEditarPedido');
    const modalEditarProducto = document.getElementById('modalEditarProducto');
    
    if (modalCrearPedido) {
        modalCrearPedido.addEventListener('show.bs.modal', cargarClientesPedidos);
        modalCrearPedido.addEventListener('hidden.bs.modal', limpiarModalBackdrop);
    }
    
    if (modalEditarPedido) {
        modalEditarPedido.addEventListener('show.bs.modal', cargarClientesPedidos);
        modalEditarPedido.addEventListener('hidden.bs.modal', limpiarModalBackdrop);
    }
    
    if (modalEditarProducto) {
        modalEditarProducto.addEventListener('hidden.bs.modal', limpiarModalBackdrop);
    }
    
    // Establecer fecha actual por defecto en crear pedido
    const fechaInput = document.getElementById('fechaCreacionPedido');
    if (fechaInput) {
        const ahora = new Date();
        const fechaLocal = ahora.toISOString().slice(0, 16);
        fechaInput.value = fechaLocal;
    }
    
    // Verificar si hay mensaje de éxito en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    
    if (successParam === 'producto_editado') {
        // Mostrar toast de éxito
        setTimeout(() => {
            mostrarToast('Producto editado exitosamente', true);
            
            // Limpiar el parámetro de la URL sin recargar la página
            const newUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, newUrl);
        }, 500);
    }
});
