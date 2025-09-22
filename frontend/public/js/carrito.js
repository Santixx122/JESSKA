// Funcionalidad del carrito de compras

// Variables globales
let carrito = [];
let subtotal = 0;
let impuestos = 0;
let total = 0;

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar carrito al inicializar (por ahora mantener vacío)
    carrito = [];
    localStorage.removeItem('carrito');
    actualizarResumen();
    verificarCarritoVacio();
});

// Función para cambiar cantidad de un producto
function cambiarCantidad(productoId, cambio) {
    const fila = document.querySelector(`tr[data-producto-id="${productoId}"]`);
    if (!fila) return;
    
    const cantidadSpan = fila.querySelector('.cantidad');
    const subtotalSpan = fila.querySelector('.subtotal');
    const precioUnitario = parseFloat(fila.querySelector('.producto-precio').textContent.replace('$', ''));
    
    let cantidadActual = parseInt(cantidadSpan.textContent);
    let nuevaCantidad = cantidadActual + cambio;
    
    // No permitir cantidad menor a 1
    if (nuevaCantidad < 1) {
        if (confirm('¿Deseas eliminar este producto del carrito?')) {
            eliminarProducto(productoId);
        }
        return;
    }
    
    // Actualizar cantidad y subtotal
    cantidadSpan.textContent = nuevaCantidad;
    const nuevoSubtotal = precioUnitario * nuevaCantidad;
    subtotalSpan.textContent = `$${nuevoSubtotal.toFixed(2)}`;
    
    // Actualizar carrito en localStorage
    actualizarProductoEnCarrito(productoId, nuevaCantidad);
    
    // Actualizar resumen
    actualizarResumen();
    
    // Animación de cambio
    fila.classList.add('loading');
    setTimeout(() => {
        fila.classList.remove('loading');
    }, 300);
}

// Función para eliminar producto del carrito
function eliminarProducto(productoId) {
    const fila = document.querySelector(`tr[data-producto-id="${productoId}"]`);
    if (!fila) return;
    
    // Animación de eliminación
    fila.style.transition = 'all 0.3s ease';
    fila.style.transform = 'translateX(-100%)';
    fila.style.opacity = '0';
    
    setTimeout(() => {
        fila.remove();
        eliminarProductoDelCarrito(productoId);
        actualizarResumen();
        verificarCarritoVacio();
    }, 300);
}

// Función para cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// Función para guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para actualizar producto en carrito
function actualizarProductoEnCarrito(productoId, cantidad) {
    const producto = carrito.find(item => item.id === productoId);
    if (producto) {
        producto.cantidad = cantidad;
        guardarCarrito();
    }
}

// Función para eliminar producto del carrito
function eliminarProductoDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito();
}

// Función para actualizar resumen del pedido
function actualizarResumen() {
    const filas = document.querySelectorAll('.carrito-item');
    subtotal = 0;
    
    filas.forEach(fila => {
        const subtotalTexto = fila.querySelector('.subtotal').textContent;
        const subtotalProducto = parseFloat(subtotalTexto.replace('$', ''));
        subtotal += subtotalProducto;
    });
    
    // Calcular impuestos (7.5%)
    impuestos = subtotal * 0.075;
    
    // Calcular total
    total = subtotal + impuestos;
    
    // Actualizar elementos del DOM
    document.getElementById('subtotal-amount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('impuestos-amount').textContent = `$${impuestos.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
}

// Función para verificar si el carrito está vacío
function verificarCarritoVacio() {
    const filas = document.querySelectorAll('.carrito-item');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoContenido = document.querySelector('.carrito-productos').parentElement;
    const resumenPedido = document.querySelector('.resumen-pedido').parentElement;
    
    if (filas.length === 0) {
        carritoContenido.style.display = 'none';
        resumenPedido.style.display = 'none';
        carritoVacio.style.display = 'block';
    } else {
        carritoContenido.style.display = 'block';
        resumenPedido.style.display = 'block';
        carritoVacio.style.display = 'none';
    }
}

// Función para proceder al pago
document.addEventListener('DOMContentLoaded', function() {
    const botonPago = document.querySelector('.proceder-pago');
    if (botonPago) {
        botonPago.addEventListener('click', function() {
            // Verificar si el usuario está autenticado
            const usuario = document.querySelector('[data-usuario]');
            
            if (!usuario || usuario.dataset.usuario === 'null') {
                // Mostrar modal de login
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
                return;
            }
            
            // Proceder con el pago
            procesarPago();
        });
    }
});

// Función para procesar el pago
function procesarPago() {
    // Mostrar loading
    const botonPago = document.querySelector('.proceder-pago');
    const textoOriginal = botonPago.textContent;
    botonPago.textContent = 'Procesando...';
    botonPago.disabled = true;
    
    // Simular procesamiento (aquí iría la lógica real de pago)
    setTimeout(() => {
        alert('¡Pedido procesado exitosamente! Recibirás un email de confirmación.');
        
        // Limpiar carrito
        carrito = [];
        guardarCarrito();
        
        // Recargar página o redirigir
        window.location.href = '/';
    }, 2000);
}

// Función para agregar producto al carrito (para uso futuro)
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            talla: producto.talla || '',
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarContadorCarrito();
    renderizarCarrito();
}

// Función para renderizar productos en el carrito
function renderizarCarrito() {
    const tbody = document.getElementById('carrito-items');
    tbody.innerHTML = '';
    
    carrito.forEach(producto => {
        const fila = document.createElement('tr');
        fila.className = 'carrito-item';
        fila.setAttribute('data-producto-id', producto.id);
        
        fila.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img me-3">
                    <div>
                        <h6 class="producto-nombre mb-1">${producto.nombre}</h6>
                        ${producto.talla ? `<small class="text-muted">${producto.talla}</small>` : ''}
                        <div class="producto-precio mt-1">$${producto.precio.toFixed(2)}</div>
                    </div>
                </div>
            </td>
            <td class="text-center">
                <div class="cantidad-controls">
                    <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                    <span class="cantidad mx-2">${producto.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                </div>
            </td>
            <td class="text-center">
                <span class="subtotal">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
            </td>
            <td class="text-center">
                <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">
                    Eliminar
                </button>
            </td>
        `;
        
        tbody.appendChild(fila);
    });
    
    actualizarResumen();
    verificarCarritoVacio();
}

// Función para actualizar contador del carrito en la navegación
function actualizarContadorCarrito() {
    const contador = document.querySelector('.carrito-contador');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    if (contador) {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Función para obtener total de items en el carrito
function obtenerTotalItems() {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
}

// Función para obtener total del carrito
function obtenerTotalCarrito() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Exportar funciones para uso global
window.cambiarCantidad = cambiarCantidad;
window.eliminarProducto = eliminarProducto;
window.agregarAlCarrito = agregarAlCarrito;
