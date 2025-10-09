document.addEventListener("DOMContentLoaded", () => {
  const cantidadInputVisible = document.getElementById("cantidad");
  const cantidadInputHidden = document.getElementById("cantidadInput");
  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");

  if (cantidadInputVisible && cantidadInputHidden) {
    const max = parseInt(cantidadInputVisible.max, 10);

    const syncCantidad = () => {
      cantidadInputHidden.value = cantidadInputVisible.value;
    };

    decreaseBtn.addEventListener("click", () => {
      let value = parseInt(cantidadInputVisible.value, 10);
      if (value > 1) cantidadInputVisible.value = value - 1;
      syncCantidad();
    });

    increaseBtn.addEventListener("click", () => {
      let value = parseInt(cantidadInputVisible.value, 10);
      if (value < max) cantidadInputVisible.value = value + 1;
      syncCantidad();
    });

    cantidadInputVisible.addEventListener("input", syncCantidad);

    // Inicializar sincronizado
    syncCantidad();
  }
});

