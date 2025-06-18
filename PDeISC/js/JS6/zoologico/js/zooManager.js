// Estado
export let animales = [];
export let tipos = ["Felino", "Ave", "Reptil"];
export let totalJaulas = 0;

// Inicialización
export function iniciar() {
  actualizarTipos();
}

// Crear jaulas y poblar el selector
export function crearJaulas() {
  totalJaulas = parseInt(document.getElementById("campoCantidadJaulas").value);
  const selector = document.getElementById("seleccionJaula");
  selector.innerHTML = "";
  for (let i = 1; i <= totalJaulas; i++) {
    selector.appendChild(new Option("Jaula " + i, i));
  }
}

// Agregar nuevo tipo de animal
export function agregarTipo() {
  const campo = document.getElementById("campoNuevoTipoAnimal");
  const nombre = campo.value.trim();
  if (nombre && !tipos.includes(nombre)) {
    tipos.push(nombre);
    actualizarTipos();
    campo.value = "";
  }
}

// Poblar selectores de tipo
export function actualizarTipos() {
  const selTipo = document.getElementById("seleccionTipoAnimal");
  const selFiltro = document.getElementById("filtroTipoAnimal");
  selTipo.innerHTML = selFiltro.innerHTML = "";
  tipos.forEach((t, i) => {
    let opcion = new Option(t, i);
    selTipo.appendChild(opcion);
    selFiltro.appendChild(opcion.cloneNode(true));
  });
}

// Agregar un animal al registro
export function registrar(animal) {
  animales.push(animal);
}

// Renderizar tabla de animales
export function mostrarTabla() {
  const contenedor = document.getElementById("contenedorTablaAnimales");
  let html = `<table><thead><tr>
    <th>ID</th><th>Nombre</th><th>Jaula</th><th>Tipo</th><th>Peso (kg)</th>
  </tr></thead><tbody>`;
  for (let a of animales) {
    html += `<tr>
      <td>${a.id}</td><td>${a.nombre}</td><td>${a.jaula}</td>
      <td>${tipos[a.tipo]}</td><td>${a.peso}</td>
    </tr>`;
  }
  html += "</tbody></table>";
  contenedor.innerHTML = html;
}

// Filtro: por jaula y peso menor
export function filtrarPeso() {
  const j = parseInt(document.getElementById("jaulaFiltro1").value);
  const p = parseFloat(document.getElementById("pesoFiltro1").value);
  const filtrados = animales.filter(a => a.jaula === j && a.peso < p);
  alert(`Coincidencias: ${filtrados.length}`);
}

// Filtro: por tipo y rango de jaulas
export function filtrarTipoRango() {
  const tipo = parseInt(document.getElementById("filtroTipoAnimal").value);
  const desde = parseInt(document.getElementById("jaulaDesde").value);
  const hasta = parseInt(document.getElementById("jaulaHasta").value);
  const filtrados = animales.filter(a => a.tipo === tipo && a.jaula >= desde && a.jaula <= hasta);
  alert(`Coincidencias: ${filtrados.length}`);
}

// Filtro: primer animal con menor peso bajo límite en jaula
export function buscarMenorPeso() {
  const j = parseInt(document.getElementById("jaulaFiltro2").value);
  const p = parseFloat(document.getElementById("pesoFiltro2").value);
  const a = animales.find(a => a.jaula === j && a.peso < p);
  alert(a ? `Encontrado: ${a.nombre}` : "No se encontró ninguno.");
}

// Mostrar todo con document.write()
export function mostrarTodo() {
  document.write("<h1>Listado completo</h1>");
  animales.forEach(a => {
    document.write(`ID: ${a.id} | Nombre: ${a.nombre} | Jaula: ${a.jaula} | Tipo: ${tipos[a.tipo]} | Peso: ${a.peso} kg<br>`);
  });
}
