import { Animal } from './CZooAnimal.js';
import { animales } from './datos.js';
import { renderTabla } from './vista.js';

// crea y guarda un nuevo animal
export function registrarAnimal() {
  const nuevo = new Animal(
    document.getElementById("campoIdAnimal").value,
    document.getElementById("campoNombreAnimal").value,
    parseInt(document.getElementById("seleccionJaula").value),
    parseInt(document.getElementById("seleccionTipoAnimal").value),
    parseFloat(document.getElementById("campoPesoAnimal").value)
  );
  animales.push(nuevo); // lo agrega a la lista
  document.getElementById("formularioAnimal").reset(); // limpia el formulario
  renderTabla(); // actualiza la tabla
}
