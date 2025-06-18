import { registrarAnimal } from './funcionesAnimales.js';
import { generarJaulas } from './funcionesJaulas.js';
import { nuevoTipo } from './funcionesTipos.js';
import { filtrarPorPeso, buscarPorTipoYJaula, menorPesoEnJaula } from './filtros.js';
import { renderTabla } from './vista.js';
import { animales, tipos } from './datos.js'; // Agregado: importación de tipos

// muestra la tabla al cargar la página
window.onload = () => renderTabla();

// escucha el envío del formulario
document.getElementById("formularioAnimal").addEventListener("submit", e => {
  e.preventDefault();
  registrarAnimal();
});

// vincula funciones a botones del html
window.crearJaulas = generarJaulas;
window.agregarTipo = nuevoTipo;
window.filtrarAnimalesPeso = filtrarPorPeso;
window.filtrarTipoYJaula = buscarPorTipoYJaula;
window.animalMenorPeso = menorPesoEnJaula;

// muestra todos los animales con document.write
window.mostrarConDocumentWrite = () => {
  document.write("<h1>Listado completo</h1>");
  animales.forEach(a => {
    document.write(`ID: ${a.id} | Nombre: ${a.nombre} | Jaula: ${a.jaula} | Tipo: ${tipos[a.tipo]} | Peso: ${a.peso} kg<br>`);
  });

  // tabla con los mismos datos
  document.write("<h2>Tabla de Animales</h2>");
  document.write("<table border='1'><tr><th>ID</th><th>Nombre</th><th>Jaula</th><th>Tipo</th><th>Peso</th></tr>");
  animales.forEach(a => {
    document.write(`<tr>
      <td>${a.id}</td><td>${a.nombre}</td><td>${a.jaula}</td>
      <td>${tipos[a.tipo]}</td><td>${a.peso} kg</td>
    </tr>`);
  });
  document.write("</table>");
};
