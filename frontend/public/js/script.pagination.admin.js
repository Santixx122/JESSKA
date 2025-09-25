function paginarTabla(tablaId, paginacionId, filasPorPagina = 5) {
  const tabla = document.getElementById(tablaId);
  const filas = tabla.querySelectorAll("tbody tr");
  const paginacion = document.getElementById(paginacionId);
  const totalPaginas = Math.ceil(filas.length / filasPorPagina);

  let paginaActual = 1;

  function mostrarPagina(pagina) {
    paginaActual = pagina;
    let inicio = (pagina - 1) * filasPorPagina;
    let fin = inicio + filasPorPagina;

    filas.forEach((fila, index) => {
      fila.style.display = (index >= inicio && index < fin) ? "" : "none";
    });

    // marcar botón activo
    document.querySelectorAll(`#${paginacionId} li`).forEach((li, i) => {
      li.classList.toggle("active", i === pagina);
    });
  }

  // generar botones
  paginacion.innerHTML = `
    <li class="page-item"><a class="page-link" href="#" aria-label="Previous">&laquo;</a></li>
    ${Array.from({ length: totalPaginas }, (_, i) =>
      `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`
    ).join("")}
    <li class="page-item"><a class="page-link" href="#" aria-label="Next">&raquo;</a></li>
  `;

  // eventos de los botones
  const botones = paginacion.querySelectorAll("a.page-link");
  botones.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (btn.getAttribute("aria-label") === "Previous" && paginaActual > 1) {
        mostrarPagina(paginaActual - 1);
      } else if (btn.getAttribute("aria-label") === "Next" && paginaActual < totalPaginas) {
        mostrarPagina(paginaActual + 1);
      } else if (!btn.getAttribute("aria-label")) {
        mostrarPagina(parseInt(btn.textContent));
      }
    });
  });

  // mostrar primera página
  mostrarPagina(1);
}

// Inicializar paginación en todas las tablas
document.addEventListener("DOMContentLoaded", () => {
  paginarTabla("tabla-usuarios", "paginacion-usuarios", 5);
  paginarTabla("tabla-productos", "paginacion-productos", 5);
  paginarTabla("tabla-pedidos", "paginacion-pedidos", 5);
});