// script carrusel con splide js
document.querySelectorAll('.splide').forEach((carrusel) => {
  new Splide(carrusel, {
    type: 'loop',
    perPage: 4,
    focus: "center",
    breakpoints: {
      640: {
        perPage: 1,
        focus: "center"
      },
      1024: {
        perPage: 3,
        focus: "center"
      },
    },
  }).mount();
});