document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnEliminarDos = document.getElementById('eliminarDosBtn');
  const btnInsertarNombre = document.getElementById('insertarNombreBtn');
  const btnReemplazarDos = document.getElementById('reemplazarDosBtn');
  const btnMostrarLetras = document.getElementById('mostrarLetrasBtn');

  let letras = ['A', 'B', 'C', 'D', 'E'];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // elimina dos elementos
  btnEliminarDos.addEventListener('click', () => {
    const eliminados = letras.splice(1, 2);
    agregarResultado(`Eliminados desde posición 1: ${eliminados.join(', ')}`);
  });

  // insertaa nombre en la segunda posición
  btnInsertarNombre.addEventListener('click', () => {
    letras.splice(1, 0, 'NuevoNombre');
    agregarResultado(`Insertado 'NuevoNombre' en posición 1`);
  });

  // reemplaza dos elementos desde posición 2
  btnReemplazarDos.addEventListener('click', () => {
    const reemplazados = letras.splice(2, 2, 'X', 'Y');
    agregarResultado(`Reemplazados en posición 2: ${reemplazados.join(', ')} por 'X', 'Y'`);
  });

  // muestra el array actual
  btnMostrarLetras.addEventListener('click', () => {
    agregarResultado(`Letras actuales: ${letras.join(', ')}`);
  });
});
