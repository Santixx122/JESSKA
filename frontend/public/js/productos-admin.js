// Gestión de productos en el panel de administrador
document.addEventListener('DOMContentLoaded', function() {
    let categorias = [];
    let marcas = [];

    // Cargar categorías y marcas al inicializar
    cargarCategoriasYMarcas();

    // Event listeners
    document.addEventListener('click', function(e) {
        // Toggle de visibilidad
        if (e.target.classList.contains('toggle-visibility')) {
            toggleProductVisibility(e.target);
        }

        // Botón eliminar producto
        if (e.target.closest('.btn-eliminar')) {
            const productoId = e.target.closest('.btn-eliminar').dataset.productoId;
            eliminarProducto(productoId);
        }

        // Botón agregar producto
        if (e.target.classList.contains('agregar-btn') || e.target.closest('[data-bs-target="#modalCrearProducto"]')) {
            prepararModalCrearProducto();
        }
    });

    // Función para cargar categorías y marcas
    async function cargarCategoriasYMarcas() {
        try {
            const [categoriasResponse, marcasResponse] = await Promise.all([
                fetch('/api/admin/categorias'),
                fetch('/api/admin/marcas')
            ]);

            if (categoriasResponse.ok) {
                const categoriasData = await categoriasResponse.json();
                categorias = categoriasData.data || [];
            }

            if (marcasResponse.ok) {
                const marcasData = await marcasResponse.json();
                marcas = marcasData.data || [];
            }
        } catch (error) {
            console.error('Error cargando categorías y marcas:', error);
            mostrarAlerta('Error cargando datos necesarios', 'danger');
        }
    }

    // Función para toggle de visibilidad
    async function toggleProductVisibility(toggle) {
        const productoId = toggle.dataset.productoId;
        const label = toggle.nextElementSibling;
        
        try {
            // Deshabilitar el toggle mientras se procesa
            toggle.disabled = true;

            const response = await fetch(`/api/admin/productos/${productoId}/toggle-visibility`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                // Actualizar la etiqueta
                const isVisible = toggle.checked;
                label.textContent = isVisible ? 'Visible' : 'Oculto';
                
                mostrarAlerta(data.message, 'success');
            } else {
                // Revertir el toggle si hay error
                toggle.checked = !toggle.checked;
                mostrarAlerta(data.message || 'Error al cambiar visibilidad', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            // Revertir el toggle si hay error
            toggle.checked = !toggle.checked;
            mostrarAlerta('Error de conexión', 'danger');
        } finally {
            toggle.disabled = false;
        }
    }

    // Función para eliminar producto
    async function eliminarProducto(productoId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return;
        }

        try {
            const response = await fetch(`/productos/${productoId}`, {
                method: 'DELETE',
                headers: {
                    'api-key-441': 'contrasena-super-secreta' // API key del entorno
                }
            });

            const data = await response.json();

            if (data.success) {
                // Remover la fila de la tabla
                const fila = document.querySelector(`tr[data-producto-id="${productoId}"]`);
                if (fila) {
                    fila.remove();
                }
                mostrarAlerta('Producto eliminado exitosamente', 'success');
            } else {
                mostrarAlerta(data.message || 'Error al eliminar producto', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta('Error de conexión', 'danger');
        }
    }

    // Función para preparar modal de crear producto
    function prepararModalCrearProducto() {
        // Crear el modal si no existe
        if (!document.getElementById('modalCrearProducto')) {
            crearModalProducto();
        }

        // Llenar los selects de categoría y marca
        llenarSelectCategorias('categoria-crear');
        llenarSelectMarcas('marca-crear');

        // Limpiar el formulario
        document.getElementById('formCrearProducto').reset();
    }

    // Función para crear el modal de producto
    function crearModalProducto() {
        const modalHTML = `
            <!-- Modal Crear Producto -->
            <div class="modal fade" id="modalCrearProducto" tabindex="-1" aria-labelledby="modalCrearProductoLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalCrearProductoLabel">Crear Nuevo Producto</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formCrearProducto">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="nombre-crear" class="form-label">Nombre *</label>
                                            <input type="text" class="form-control" id="nombre-crear" name="nombre" required>
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="categoria-crear" class="form-label">Categoría *</label>
                                            <select class="form-select" id="categoria-crear" name="categoriaId" required>
                                                <option value="">Seleccionar categoría</option>
                                            </select>
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="marca-crear" class="form-label">Marca *</label>
                                            <select class="form-select" id="marca-crear" name="marcaId" required>
                                                <option value="">Seleccionar marca</option>
                                            </select>
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="color-crear" class="form-label">Color *</label>
                                            <input type="text" class="form-control" id="color-crear" name="color" required>
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="descripcion-crear" class="form-label">Descripción *</label>
                                    <textarea class="form-control" id="descripcion-crear" name="descripcion" rows="3" required></textarea>
                                    <div class="invalid-feedback"></div>
                                </div>
                                <div class="row">
                                    <div class="col-md-3">
                                        <div class="mb-3">
                                            <label for="talla-crear" class="form-label">Talla *</label>
                                            <select class="form-select" id="talla-crear" name="talla" required>
                                                <option value="">Seleccionar</option>
                                                <option value="35">35</option>
                                                <option value="36">36</option>
                                                <option value="37">37</option>
                                                <option value="38">38</option>
                                                <option value="39">39</option>
                                                <option value="40">40</option>
                                                <option value="41">41</option>
                                                <option value="42">42</option>
                                                <option value="43">43</option>
                                                <option value="44">44</option>
                                                <option value="45">45</option>
                                            </select>
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="mb-3">
                                            <label for="precio-crear" class="form-label">Precio *</label>
                                            <input type="number" class="form-control" id="precio-crear" name="precio" min="0" step="0.01" required>
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="mb-3">
                                            <label for="stock-crear" class="form-label">Stock *</label>
                                            <input type="number" class="form-control" id="stock-crear" name="stock" min="0" required>
                                            <div class="invalid-feedback"></div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="mb-3">
                                            <label for="estado-crear" class="form-label">Estado</label>
                                            <select class="form-select" id="estado-crear" name="estado">
                                                <option value="activo">Activo</option>
                                                <option value="agotado">Agotado</option>
                                                <option value="inactivo">Inactivo</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="visible-crear" name="visible" checked>
                                        <label class="form-check-label" for="visible-crear">
                                            Visible en catálogo
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="btnGuardarProducto">
                                <span class="spinner-border spinner-border-sm d-none" role="status"></span>
                                Crear Producto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Agregar event listener para el botón de guardar
        document.getElementById('btnGuardarProducto').addEventListener('click', crearProducto);
    }

    // Función para llenar select de categorías
    function llenarSelectCategorias(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;

        // Limpiar opciones existentes excepto la primera
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria._id;
            option.textContent = categoria.nombre;
            select.appendChild(option);
        });
    }

    // Función para llenar select de marcas
    function llenarSelectMarcas(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;

        // Limpiar opciones existentes excepto la primera
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca._id;
            option.textContent = marca.nombre;
            select.appendChild(option);
        });
    }

    // Función para crear producto
    async function crearProducto() {
        const form = document.getElementById('formCrearProducto');
        const btnGuardar = document.getElementById('btnGuardarProducto');
        const spinner = btnGuardar.querySelector('.spinner-border');

        // Limpiar errores previos
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // Obtener datos del formulario
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key === 'visible') {
                data[key] = document.getElementById('visible-crear').checked;
            } else {
                data[key] = value;
            }
        }

        try {
            // Mostrar loading
            btnGuardar.disabled = true;
            spinner.classList.remove('d-none');
            btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Creando...';

            const response = await fetch('/api/admin/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                mostrarAlerta('Producto creado exitosamente', 'success');
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearProducto'));
                modal.hide();
                
                // Recargar la página para mostrar el nuevo producto
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                // Mostrar errores específicos
                if (result.field && result.field !== 'general') {
                    const field = document.getElementById(`${result.field}-crear`);
                    if (field) {
                        field.classList.add('is-invalid');
                        const feedback = field.nextElementSibling;
                        if (feedback && feedback.classList.contains('invalid-feedback')) {
                            feedback.textContent = result.message;
                        }
                    }
                } else {
                    mostrarAlerta(result.message || 'Error al crear producto', 'danger');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta('Error de conexión', 'danger');
        } finally {
            // Ocultar loading
            btnGuardar.disabled = false;
            spinner.classList.add('d-none');
            btnGuardar.innerHTML = 'Crear Producto';
        }
    }

    // Función para mostrar alertas
    function mostrarAlerta(mensaje, tipo) {
        // Remover alertas existentes
        const alertasExistentes = document.querySelectorAll('.alert-productos');
        alertasExistentes.forEach(alerta => alerta.remove());

        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show alert-productos`;
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insertar la alerta al inicio de la sección de productos
        const seccionProductos = document.getElementById('productos');
        if (seccionProductos) {
            seccionProductos.insertBefore(alerta, seccionProductos.firstChild);
        }

        // Auto-hide después de 5 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, 5000);
    }
});
