document.addEventListener("DOMContentLoaded", () => {
  const cantidadInput = document.getElementById("cantidad");
  const decreaseBtn = document.getElementById("decrease");
  const increaseBtn = document.getElementById("increase");

  if (cantidadInput) {
    const max = parseInt(cantidadInput.max, 10);

    decreaseBtn.addEventListener("click", () => {
      let value = parseInt(cantidadInput.value, 10);
      if (value > 1) cantidadInput.value = value - 1;
    });

    increaseBtn.addEventListener("click", () => {
      let value = parseInt(cantidadInput.value, 10);
      if (value < max) cantidadInput.value = value + 1;
    });
  }
});