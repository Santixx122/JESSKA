const express = require("express");
const router = express.Router();


// Funcionalidad del catálogo
document.addEventListener('DOMContentLoaded', function() {
    cargarProductosVisibles();
    
    // Event listener para botones de agregar al carrito
    document.addEventListener('click', function(e) {
        if (e.target.closest('.cartBtn')) {
            const productoId = e.target.closest('.cartBtn').dataset.productoId;
            agregarAlCarrito(productoId);
        }
    });
});

// Función para cargar productos visibles
async function cargarProductosVisibles() {
    try {
        const response = await fetch('/api/productos/visibles');
        const data = await response.json();
        
        if (data.success && data.data) {
            mostrarProductos(data.data);
        } else {
            mostrarMensajeVacio();
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        mostrarMensajeError();
    }
}

// Función para mostrar productos en el catálogo
function mostrarProductos(productos) {
    const container = document.querySelector('.container.mt-5 .row');
    if (!container) return;
    
    // Limpiar contenido existente
    container.innerHTML = '';
    
    if (productos.length === 0) {
        mostrarMensajeVacio();
        return;
    }
    
    productos.forEach(producto => {
        if (producto.variante && producto.variante.length > 0) {
            const productoHTML = crearTarjetaProducto(producto);
            container.insertAdjacentHTML('beforeend', productoHTML);
        }
    });
    
    // Agregar alerta de éxito (oculta inicialmente)
    container.insertAdjacentHTML('beforeend', `
        <div class="custom-alert alert alert-success d-none" role="alert" id="alertaCarrito">
            <svg class="custom-bi bi flex-shrink-0 me-2" role="img" aria-label="Success:">
                <symbol id="check-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </symbol>
                <use xlink:href="#check-circle-fill" />
            </svg>
            <div>
                <p>Producto agregado al carrito correctamente.</p>
            </div>
        </div>
    `);
}

// Función para crear tarjeta de producto
function crearTarjetaProducto(producto) {
    const variante = producto.variante[0];
    const enStock = variante.stock > 0;
    
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-header text-center">
                    <img src="img/producto-placeholder.jpg" class="card-img-top" alt="${producto.nombre}" 
                         style="height: 200px; object-fit: cover;" 
                         onerror="this.src='img/no-image.png'">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-muted small mb-2">
                        ${producto.descripcion.length > 80 ? producto.descripcion.substring(0, 80) + '...' : producto.descripcion}
                    </p>
                    <div class="mb-2">
                        <small class="text-muted">
                            <strong>Categoría:</strong> ${producto.categoriaId ? producto.categoriaId.nombre : 'Sin categoría'}<br>
                            <strong>Marca:</strong> ${producto.marcaId ? producto.marcaId.nombre : 'Sin marca'}<br>
                            <strong>Color:</strong> ${variante.color}<br>
                            <strong>Talla:</strong> ${variante.talla}
                        </small>
                    </div>
                    <div class="mt-auto">
                        <p class="card-text h5 text-primary mb-3">
                            $${variante.precio.toLocaleString()}
                        </p>
                        ${enStock ? `
                            <button class="cartBtn w-100" data-producto-id="${producto._id}">
                                <svg class="cart" fill="white" viewBox="0 0 576 512" height="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                                </svg>
                                Agregar al Carrito
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" class="product">
                                    <path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"></path>
                                </svg>
                            </button>
                            <small class="text-success d-block mt-1">
                                <i class="fas fa-check-circle"></i> ${variante.stock} disponibles
                            </small>
                        ` : `
                            <button class="btn btn-secondary w-100" disabled>
                                <i class="fas fa-times-circle"></i> Agotado
                            </button>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar mensaje cuando no hay productos
function mostrarMensajeVacio() {
    const container = document.querySelector('.container.mt-5 .row');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-info" role="alert">
                <h4 class="alert-heading">¡Catálogo en construcción!</h4>
                <p>Actualmente no hay productos disponibles en nuestro catálogo.</p>
                <hr>
                <p class="mb-0">Vuelve pronto para ver nuestras novedades.</p>
            </div>
        </div>
    `;
}

// Función para mostrar mensaje de error
function mostrarMensajeError() {
    const container = document.querySelector('.container.mt-5 .row');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-12 text-center">
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al cargar productos</h4>
                <p>No se pudieron cargar los productos del catálogo.</p>
                <hr>
                <button class="btn btn-outline-danger" onclick="cargarProductosVisibles()">
                    <i class="fas fa-redo"></i> Intentar nuevamente
                </button>
            </div>
        </div>
    `;
}

// Función para agregar producto al carrito
async function agregarAlCarrito(productoId) {
    try {
        // Aquí deberías implementar la lógica para agregar al carrito
        // Por ahora solo mostraremos la alerta de éxito
        
        const alerta = document.getElementById('alertaCarrito');
        if (alerta) {
            alerta.classList.remove('d-none');
            
            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
                alerta.classList.add('d-none');
            }, 3000);
        }
        
        console.log('Producto agregado al carrito:', productoId);
        
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        
        // Mostrar alerta de error
        const container = document.querySelector('.container.mt-5');
        if (container) {
            const alertaError = document.createElement('div');
            alertaError.className = 'alert alert-danger alert-dismissible fade show';
            alertaError.innerHTML = `
                Error al agregar el producto al carrito. Intenta nuevamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            container.insertBefore(alertaError, container.firstChild);
            
            // Auto-hide después de 5 segundos
            setTimeout(() => {
                if (alertaError.parentNode) {
                    alertaError.remove();
                }
            }, 5000);
        }
    }
}

// Funcionalidad de filtros de género
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener el género seleccionado
            const genero = this.getAttribute('data-filter');
            
            // Aplicar filtro
            aplicarFiltroGenero(genero);
        });
    });
});

// Función para aplicar filtro por género
function aplicarFiltroGenero(genero) {
    try {
        // Construir URL con parámetros de filtro
        let url = '/catalogo';
        if (genero && genero !== 'todos') {
            url += `?genero=${genero}`;
        }
        
        // Recargar página con filtros aplicados
        window.location.href = url;
        
    } catch (error) {
        console.error('Error aplicando filtro:', error);
    }
}

// Función para cargar productos con filtros
async function cargarProductosConFiltros(genero = null) {
    try {
        let url = '/api/productos';
        if (genero && genero !== 'todos') {
            url += `?genero=${genero}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success && data.data) {
            mostrarProductos(data.data);
            actualizarEstadoFiltros(genero);
        } else {
            mostrarMensajeVacio();
        }
    } catch (error) {
        console.error('Error cargando productos con filtros:', error);
        mostrarMensajeError();
    }
}

// Función para actualizar estado visual de los filtros
function actualizarEstadoFiltros(generoActivo) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        const buttonGenero = button.getAttribute('data-filter');
        
        if ((generoActivo === null || generoActivo === 'todos') && buttonGenero === 'todos') {
            button.classList.add('active');
        } else if (buttonGenero === generoActivo) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}



// POST /carrito/agregar


module.exports = router;