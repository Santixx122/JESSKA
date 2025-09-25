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

            celdaVisibilidad.innerHTML = `
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-visibility" type="checkbox" checked data-producto-index="${index}">
                    <label class="form-check-label">Visible</label>
                </div>
            `;
                
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalCrearProducto'));
    modal.show();

function crearModalCrearProducto() {
    const modalHTML = `
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
                                        <label for="nombre" class="form-label">Nombre *</label>
                                        <input type="text" class="form-control" id="nombre" name="nombre" required>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="categoria" class="form-label">Categoría *</label>
                                        <select class="form-select" id="categoria" name="categoriaId" required>
                                            <option value="">Seleccionar categoría</option>
                                        </select>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="marca" class="form-label">Marca *</label>
                                        <select class="form-select" id="marca" name="marcaId" required>
                                            <option value="">Seleccionar marca</option>
                                        </select>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="mb-3">
                                        <label for="color" class="form-label">Color *</label>
                                        <input type="text" class="form-control" id="color" name="color" required>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripción *</label>
                                <textarea class="form-control" id="descripcion" name="descripcion" rows="3" required></textarea>
                                <div class="invalid-feedback"></div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="talla" class="form-label">Talla *</label>
                                        <select class="form-select" id="talla" name="talla" required>
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
                                        <label for="precio" class="form-label">Precio *</label>
                                        <input type="number" class="form-control" id="precio" name="precio" min="0" step="0.01" required>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="stock" class="form-label">Stock *</label>
                                        <input type="number" class="form-control" id="stock" name="stock" min="0" required>
                                        <div class="invalid-feedback"></div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="mb-3">
                                        <label for="estado" class="form-label">Estado</label>
                                        <select class="form-select" id="estado" name="estado">
                                            <option value="activo">Activo</option>
                                            <option value="agotado">Agotado</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="visible" name="visible" checked>
                                    <label class="form-check-label" for="visible">
                                        Visible en catálogo
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="guardarProducto()">
                            <span class="spinner-border spinner-border-sm d-none" role="status"></span>
                            Crear Producto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function guardarProducto() {
    const form = document.getElementById('formCrearProducto');
    const btnGuardar = document.querySelector('#modalCrearProducto .btn-primary');
    const spinner = btnGuardar.querySelector('.spinner-border') || createSpinner(btnGuardar);
    
    // Obtener datos del formulario
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'visible') {
            data[key] = document.getElementById('visible').checked;
        } else {
            data[key] = value;
        }
    }

    // Mostrar loading
    btnGuardar.disabled = true;
    spinner.classList.remove('d-none');
    btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Creando...';

    // Hacer la llamada real al servidor
    fetch('/api/admin/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            mostrarAlerta('Producto creado exitosamente', 'success');
            
            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCrearProducto'));
            modal.hide();
            
            // Limpiar formulario
            form.reset();
            
            // Recargar la página para mostrar el nuevo producto
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Mostrar errores específicos
            if (result.field && result.field !== 'general') {
                const field = document.getElementById(result.field);
                if (field) {
                    field.classList.add('is-invalid');
                    mostrarAlerta(result.message, 'danger');
                }
            } else {
                mostrarAlerta(result.message || 'Error al crear producto', 'danger');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión', 'danger');
    })
    .finally(() => {
        // Ocultar loading
        btnGuardar.disabled = false;
        spinner.classList.add('d-none');
        btnGuardar.innerHTML = 'Crear Producto';
    });
}

function createSpinner(button) {
    const spinner = document.createElement('span');
    spinner.className = 'spinner-border spinner-border-sm d-none';
    spinner.setAttribute('role', 'status');
    button.insertBefore(spinner, button.firstChild);
    return spinner;
}

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
    }, 3000);
}