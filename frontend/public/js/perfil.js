document.addEventListener('DOMContentLoaded', () => {
  // Navegación del menú lateral
  const menu = document.getElementById('perfilMenu');
  const sections = {
    home: document.getElementById('section-home'),
    info: document.getElementById('section-info'),
    pedidos: document.getElementById('section-pedidos'),
    mensajes: document.getElementById('section-mensajes'),
    resenas: document.getElementById('section-resenas')
  };

  function showSection(key) {
    Object.values(sections).forEach(sec => sec?.classList.add('d-none'));
    sections[key]?.classList.remove('d-none');
  }

  async function fetchJSON(url) {
    const resp = await fetch(url, { credentials: 'include' });
    if (!resp.ok) throw new Error('Error de red');
    return await resp.json();
  }

  // Render helpers
  function renderPedidos(list) {
    const cont = document.getElementById('pedidosList');
    cont.innerHTML = '';
    if (!list || list.length === 0) {
      cont.innerHTML = '<div class="text-muted">No tienes pedidos aún.</div>';
      return;
    }
    list.forEach(p => {
      const el = document.createElement('div');
      el.className = 'card-list-item';
      const fecha = p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString() : '';
      el.innerHTML = `<div class="d-flex justify-content-between align-items-center">
        <div>
          <div><strong>Pedido:</strong> ${p._id || ''}</div>
          <div class="muted"><strong>Fecha:</strong> ${fecha}</div>
        </div>
        <div class="text-end">
          <div><strong>Total:</strong> $${Number(p.total || 0).toLocaleString()}</div>
          <span class="badge text-bg-secondary">${p.estado || ''}</span>
        </div>
      </div>`;
      cont.appendChild(el);
    });
  }

  function renderMensajes(list) {
    const cont = document.getElementById('mensajesList');
    cont.innerHTML = '';
    if (!list || list.length === 0) {
      cont.innerHTML = '<div class="text-muted">No tienes mensajes.</div>';
      return;
    }
    list.forEach(m => {
      const el = document.createElement('div');
      el.className = 'card-list-item';
      const fecha = m.fecha ? new Date(m.fecha).toLocaleString() : '';
      el.innerHTML = `<div><div class="muted">${fecha}</div><div>${m.contenido || ''}</div></div>`;
      cont.appendChild(el);
    });
  }

  function renderResenas(list) {
    const cont = document.getElementById('resenasList');
    cont.innerHTML = '';
    if (!list || list.length === 0) {
      cont.innerHTML = '<div class="text-muted">No has publicado reseñas.</div>';
      return;
    }
    list.forEach(r => {
      const el = document.createElement('div');
      el.className = 'card-list-item';
      const fecha = r.fecha ? new Date(r.fecha).toLocaleDateString() : '';
      el.innerHTML = `<div class="d-flex justify-content-between align-items-center">
        <div>
          <div><strong>Calificación:</strong> ${'★'.repeat(r.calificacion || 0)}${'☆'.repeat(5 - (r.calificacion || 0))}</div>
          <div class="muted">${fecha}</div>
        </div>
        <div>${r.comentario || ''}</div>
      </div>`;
      cont.appendChild(el);
    });
  }

  async function loadPedidos() {
    try {
      const data = await fetchJSON('/perfil/pedidos');
      renderPedidos(data.data);
    } catch (_) {
      renderPedidos([]);
    }
  }

  async function loadMensajes() {
    try {
      const data = await fetchJSON('/perfil/mensajes');
      renderMensajes(data.data);
    } catch (_) {
      renderMensajes([]);
    }
  }

  async function loadResenas() {
    try {
      const data = await fetchJSON('/perfil/resenas');
      renderResenas(data.data);
    } catch (_) {
      renderResenas([]);
    }
  }

  menu?.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-section]');
    if (!link) return;
    e.preventDefault();
    menu.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    const key = link.getAttribute('data-section');
    showSection(key);
    // Cargas perezosas
    if (key === 'pedidos') loadPedidos();
    if (key === 'mensajes') loadMensajes();
    if (key === 'resenas') loadResenas();
  });

  // Mostrar sección inicial
  showSection('home');

  // Validaciones del formulario de perfil
  const form = document.getElementById('perfilForm');
  const telRegex = /^(3\d{9}|[1-9]\d{6,9})$/;
  form?.addEventListener('submit', (e) => {
    let valid = true;
    const nombre = form.querySelector('input[name="nombre"]');
    const tel = form.querySelector('input[name="telefono"]');
    const pass = form.querySelector('input[name="password"]');

    if (nombre.value && nombre.value.trim().length < 3) {
      nombre.classList.add('is-invalid'); valid = false;
    } else { nombre.classList.remove('is-invalid'); }

    if (tel.value && !telRegex.test(tel.value)) {
      tel.classList.add('is-invalid'); valid = false;
    } else { tel.classList.remove('is-invalid'); }

    if (pass.value && pass.value.length < 8) {
      pass.classList.add('is-invalid'); valid = false;
    } else { pass.classList.remove('is-invalid'); }

    if (!valid) e.preventDefault();
  });
});
