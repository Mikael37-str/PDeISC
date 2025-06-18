import { tipos } from './datos.js';

// agrega un tipo si no existe
export function nuevoTipo() {
  const entrada = document.getElementById("campoNuevoTipoAnimal");
  const valor = entrada.value.trim();
  if (valor && !tipos.includes(valor)) {
    tipos.push(valor);
    actualizarListas();
    entrada.value = "";
  }
}

// actualiza los select de tipo
export function actualizarListas() {
  const selTipo = document.getElementById("seleccionTipoAnimal");
  const selFiltro = document.getElementById("filtroTipoAnimal");
  selTipo.innerHTML = selFiltro.innerHTML = "";
  tipos.forEach((t, i) => {
    let op = new Option(t, i);
    selTipo.appendChild(op);
    selFiltro.appendChild(op.cloneNode(true));
  });
}
