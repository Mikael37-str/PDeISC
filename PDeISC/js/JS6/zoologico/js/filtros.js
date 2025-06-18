import { animales, tipos } from './datos.js';

// filtra por jaula y peso menor
export function filtrarPorPeso() {
  const numJaula = parseInt(document.getElementById("filtroJaula1").value); // corregido ID
  const maxPeso = parseFloat(document.getElementById("filtroPesoMax1").value); // corregido ID
  const resultado = animales.filter(a => a.jaula === numJaula && a.peso < maxPeso);
  alert(`Cantidad: ${resultado.length}`);
}

// filtra por tipo y rango de jaulas
export function buscarPorTipoYJaula() {
  const tipo = parseInt(document.getElementById("filtroTipoAnimal").value);
  const desde = parseInt(document.getElementById("filtroJaulaDesde").value);
  const hasta = parseInt(document.getElementById("filtroJaulaHasta").value);
  const resultado = animales.filter(a => a.tipo === tipo && a.jaula >= desde && a.jaula <= hasta);
  alert(`Cantidad: ${resultado.length}`);
}

// muestra el primer animal con menor peso en jaula
export function menorPesoEnJaula() {
  const jaula = parseInt(document.getElementById("filtroJaula2").value); // corregido ID
  const limite = parseFloat(document.getElementById("filtroPesoMax2").value); // corregido ID
  const encontrado = animales.find(a => a.jaula === jaula && a.peso < limite);
  alert(encontrado ? `Encontrado: ${encontrado.nombre}` : "No hay coincidencias");
}
