import { jaulas } from './datos.js';

// crea las opciones de jaulas
export function generarJaulas() {
  const cantidad = parseInt(document.getElementById("campoCantidadJaulas").value);
  const selector = document.getElementById("seleccionJaula");
  selector.innerHTML = "";
  for (let i = 1; i <= cantidad; i++) {
    selector.appendChild(new Option("Jaula " + i, i));
  }
}
