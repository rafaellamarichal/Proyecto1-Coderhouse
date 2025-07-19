let tareas = [];

const form = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("titulo");
const inputDescripcion = document.getElementById("descripcion");
const inputEstado = document.getElementById("estado");

const jsConfetti = new JSConfetti();

function cargarTareas() {
  const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];

  fetch('tareas.json')
    .then(res => res.json())
    .then(data => {
      tareas = [...data];

      tareasGuardadas.forEach(tareaLS => {
        if (!tareas.find(t => t.id === tareaLS.id)) {
          tareas.push(tareaLS);
        }
      });

      guardarTareas();
      renderizarTareas();
    })
    .catch(() => {
      tareas = tareasGuardadas;
      renderizarTareas();
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevaTarea = {
    id: Date.now(),
    titulo: inputTitulo.value.trim(),
    descripcion: inputDescripcion.value.trim(),
    estado: inputEstado.value,
    creada: new Date().toISOString(),
    finalizada: null
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  renderizarTareas();
  form.reset();

  Swal.fire({
    title: 'Tarea agregada',
    text: 'La tarea fue creada con éxito.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  });
});

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function renderizarTareas() {
  document.getElementById("porHacer").innerHTML = "";
  document.getElementById("enProgreso").innerHTML = "";
  document.getElementById("hecho").innerHTML = "";

  tareas.forEach((tarea) => {
    const div = document.createElement("div");
    div.classList.add("card", "mb-2");

    let duracion = "";
    if (tarea.finalizada) {
      const inicio = new Date(tarea.creada);
      const fin = new Date(tarea.finalizada);
      const diffMs = fin - inicio;

      const horas = Math.floor(diffMs / (1000 * 60 * 60));
      const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

      let partes = [];
      if (horas > 0) partes.push(`${horas} h`);
      if (minutos > 0) partes.push(`${minutos} min`);
      if (segundos > 0 || partes.length === 0) partes.push(`${segundos} seg`);

      duracion = `<p class="text-muted"><small>Duración: ${partes.join(" ")}</small></p>`;
    }

    div.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${tarea.titulo}</h5>
        <p class="card-text">${tarea.descripcion}</p>
        ${duracion}
        <select class="form-select mb-2" data-id="${tarea.id}">
          <option value="porHacer" ${tarea.estado === "porHacer" ? "selected" : ""}>Por hacer</option>
          <option value="enProgreso" ${tarea.estado === "enProgreso" ? "selected" : ""}>En progreso</option>
          <option value="hecho" ${tarea.estado === "hecho" ? "selected" : ""}>Hecho</option>
        </select>
        <button class="btn btn-primary btn-sm editar-btn" data-id="${tarea.id}">Editar</button>
        <button class="btn btn-danger btn-sm eliminar-btn" data-id="${tarea.id}">Eliminar</button>
      </div>
    `;

    document.getElementById(tarea.estado).appendChild(div);
  });

  // Cambiar estado
  document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      const nuevaEstado = e.target.value;
      const tarea = tareas.find((t) => t.id === id);

      tarea.estado = nuevaEstado;

      if (nuevaEstado === "hecho" && !tarea.finalizada) {
        tarea.finalizada = new Date().toISOString();
        jsConfetti.addConfetti();
      } else if (nuevaEstado !== "hecho") {
        // Si vuelve a un estado previo, quitar fecha finalizada
        tarea.finalizada = null;
      }

      if (nuevaEstado === "enProgreso") {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Un paso a la vez, cada logro cuenta',
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });
      }

      guardarTareas();
      renderizarTareas();
    });
  });

  // Eliminar tarea
  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));

      Swal.fire({
        title: '¿Estás segura/o?',
        text: 'Esta acción eliminará la tarea',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          tareas = tareas.filter((t) => t.id !== id);
          guardarTareas();
          renderizarTareas();

          Swal.fire({
            title: 'Tarea eliminada',
            text: 'Se eliminó correctamente.',
            icon: 'info',
            timer: 1200,
            showConfirmButton: false
          });
        }
      });
    });
  });

  // Editar tarea
  document.querySelectorAll(".editar-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      const tarea = tareas.find((t) => t.id === id);

      Swal.fire({
        title: 'Editar tarea',
        html: `
          <input id="edit-titulo" class="swal2-input" placeholder="Título" value="${tarea.titulo}">
          <textarea id="edit-desc" class="swal2-textarea" placeholder="Descripción">${tarea.descripcion}</textarea>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
          const nuevoTitulo = document.getElementById('edit-titulo').value.trim();
          const nuevaDescripcion = document.getElementById('edit-desc').value.trim();

          if (!nuevoTitulo || !nuevaDescripcion) {
            Swal.showValidationMessage('Título y descripción no pueden estar vacíos');
            return false;
          }

          return { nuevoTitulo, nuevaDescripcion };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          tarea.titulo = result.value.nuevoTitulo;
          tarea.descripcion = result.value.nuevaDescripcion;

          guardarTareas();
          renderizarTareas();

          Swal.fire({
            title: 'Tarea actualizada',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false
          });
        }
      });
    });
  });

  // Actualizar "Tus logros"
  renderizarLogros();
}

function renderizarLogros() {
  const contenedorLogros = document.getElementById("tusLogros");
  contenedorLogros.innerHTML = "";

  const tareasHechas = tareas.filter(t => t.estado === "hecho");

  if (tareasHechas.length === 0) {
    contenedorLogros.innerHTML = "<p>No hay logros aún, ¡a seguir trabajando!</p>";
    return;
  }

  tareasHechas.forEach(tarea => {
    const div = document.createElement("div");
    div.classList.add("card", "mb-2");
    div.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${tarea.titulo}</h5>
        <p class="card-text">${tarea.descripcion}</p>
        <small class="text-muted">Terminada: ${new Date(tarea.finalizada).toLocaleString()}</small>
      </div>
    `;
    contenedorLogros.appendChild(div);
  });
}

function mostrarGatito() {
    fetch("https://api.thecatapi.com/v1/images/search")
      .then(res => res.json())
      .then(data => {
        Swal.fire({
          title: "¡Buen trabajo!",
          imageUrl: data[0].url,
          imageAlt: "Un gatito motivador",
          showConfirmButton: false,
          timer: 3000
        });
      })
      .catch(error => {
        console.error("Error al obtener el gatito:", error);
      });
  }
  

// Cargar tareas al inicio
document.getElementById("btn-motivacion").addEventListener("click", mostrarGatito);
cargarTareas();

