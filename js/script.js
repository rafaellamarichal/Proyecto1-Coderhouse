// Datos iniciales
const tareasPorHacer = [];
const tareasEnProgreso = [];
const tareasHechas = [];

// Función 1: Agregar tarea
function agregarTarea() {
  const tarea = prompt("Ingrese el nombre de la nueva tarea:");
  if (tarea) {
    tareasPorHacer.push(tarea);
    alert(`Tarea "${tarea}" agregada a 'Por hacer'.`);
  }
}

// Función 2: Mover tarea entre listas
function moverTarea() {
  const origen = prompt("¿Desde qué lista querés mover? (por, progreso, hecho)");
  const destino = prompt("¿A qué lista querés moverla? (por, progreso, hecho)");

  let listaOrigen = obtenerLista(origen);
  let listaDestino = obtenerLista(destino);

  if (!listaOrigen || !listaDestino) {
    alert("Alguna de las listas ingresadas no es válida.");
    return;
  }

  const tarea = prompt(`Tareas en ${origen}: ${listaOrigen.join(", ")}\n\nIngrese el nombre exacto de la tarea a mover:`);

  const index = listaOrigen.indexOf(tarea);
  if (index !== -1) {
    listaOrigen.splice(index, 1);
    listaDestino.push(tarea);
    alert(`Tarea "${tarea}" movida de ${origen} a ${destino}.`);
  } else {
    alert("La tarea no fue encontrada en la lista indicada.");
  }
}

// Función 3: Mostrar todas las listas
function mostrarTablero() {
  console.log("==== TABLERO DE TAREAS ====");
  console.log("📋 Por hacer:", tareasPorHacer);
  console.log("🛠️ En progreso:", tareasEnProgreso);
  console.log("✅ Hecho:", tareasHechas);
}

// Función auxiliar
function obtenerLista(nombre) {
  switch (nombre.toLowerCase()) {
    case "por":
      return tareasPorHacer;
    case "progreso":
      return tareasEnProgreso;
    case "hecho":
      return tareasHechas;
    default:
      return null;
  }
}

// Flujo principal
function iniciarSimulador() {
  let continuar = true;

  while (continuar) {
    const opcion = prompt(
      "Elige una opción:\n1. Agregar tarea\n2. Mover tarea\n3. Mostrar tablero\n4. Salir"
    );

    switch (opcion) {
      case "1":
        agregarTarea();
        break;
      case "2":
        moverTarea();
        break;
      case "3":
        mostrarTablero();
        break;
      case "4":
        continuar = false;
        break;
      default:
        alert("Opción no válida.");
    }
  }

  alert("¡Gracias por usar el simulador de tareas!");
}

iniciarSimulador(); // Llamada inicial

