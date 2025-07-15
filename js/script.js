let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

// Elementos del DOM
const form = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("titulo");
const inputDescripcion = document.getElementById("descripcion");
const inputEstado = document.getElementById("estado");

const jsConfetti = new JSConfetti();


// Evento al enviar el formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevaTarea = {
    id: Date.now(),
    titulo: inputTitulo.value,
    descripcion: inputDescripcion.value,
    estado: inputEstado.value
  };

  tareas.push(nuevaTarea);
  guardarTareas();
  renderizarTareas();
  form.reset();

  // Notificación de éxito
  Swal.fire({
    title: 'Tarea agregada',
    text: 'La tarea fue creada con éxito.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false
  });
});

// Guardar en localStorage
function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Mostrar tareas en el HTML
function renderizarTareas() {
  document.getElementById("porHacer").innerHTML = "";
  document.getElementById("enProgreso").innerHTML = "";
  document.getElementById("hecho").innerHTML = "";

  tareas.forEach((tarea) => {
    const div = document.createElement("div");
    div.classList.add("card", "mb-2");
    div.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${tarea.titulo}</h5>
        <p class="card-text">${tarea.descripcion}</p>
        <select class="form-select mb-2" data-id="${tarea.id}">
          <option value="porHacer" ${tarea.estado === "porHacer" ? "selected" : ""}>Por hacer</option>
          <option value="enProgreso" ${tarea.estado === "enProgreso" ? "selected" : ""}>En progreso</option>
          <option value="hecho" ${tarea.estado === "hecho" ? "selected" : ""}>Hecho</option>
        </select>
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
      guardarTareas();
      renderizarTareas();

      if (nuevaEstado === "hecho") {
        jsConfetti.addConfetti();
      }else if (nuevaEstado === "enProgreso") {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Un paso a la vez, cada logro cuenta',
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });
      }

    });
  });

  // Eliminar tarea
  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
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
    });
  });

  function mostrarFraseMotivadora() {
    const divFrase = document.getElementById("fraseMotivadora");
    const frase = frases[Math.floor(Math.random() * frases.length)];
    divFrase.textContent = frase;
  }
}





// Inicializar al cargar la página
renderizarTareas();





