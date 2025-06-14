let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

const form = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("titulo");
const inputDescripcion = document.getElementById("descripcion");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevaTarea = {
    id: Date.now(),
    titulo: inputTitulo.value,
    descripcion: inputDescripcion.value,
    estado: "porHacer"
  };
  tareas.push(nuevaTarea);
  guardarTareas();
  renderizarTareas();
  form.reset();
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

  document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      const nuevaEstado = e.target.value;
      const tarea = tareas.find((t) => t.id === id);
      tarea.estado = nuevaEstado;
      guardarTareas();
      renderizarTareas();
    });
  });

  document.querySelectorAll(".eliminar-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      tareas = tareas.filter((t) => t.id !== id);
      guardarTareas();
      renderizarTareas();
    });
  });
}

renderizarTareas();


  alert("¡Gracias por usar el simulador de tareas!");
}

iniciarSimulador(); // Llamada inicial

