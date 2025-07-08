document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const arrayInput = document.getElementById('arrayInput');
  const cargarArrayBtn = document.getElementById('cargarArrayBtn');

  const btnEliminarDos = document.getElementById('eliminarDosBtn');
  const insertarElementoInput = document.getElementById('insertarElementoInput');
  const btnInsertarNombre = document.getElementById('insertarNombreBtn');
  const reemplazarElementosInput = document.getElementById('reemplazarElementosInput');
  const btnReemplazarDos = document.getElementById('reemplazarDosBtn');
  const btnMostrarLetras = document.getElementById('mostrarLetrasBtn');

  let letras = []; // array vacío

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // Cargar array inicial desde el input del usuario
  cargarArrayBtn.addEventListener('click', () => {
    const inputValue = arrayInput.value.trim();
    if (inputValue) {
      letras = inputValue.split(',').map(item => item.trim()); // Split by comma and trim whitespace
      agregarResultado(`Array inicial cargado: ${letras.join(', ')}`);
    } else {
      letras = [];
      agregarResultado('No se ingresaron elementos. El array se ha vaciado.');
    }
  });

  // elimina dos elementos
  btnEliminarDos.addEventListener('click', () => {
    if (letras.length > 1) { // Ensure there are enough elements to remove
      const eliminados = letras.splice(1, 2);
      agregarResultado(`Eliminados desde posición 1: ${eliminados.join(', ')}`);
    } else {
      agregarResultado('No hay suficientes elementos para eliminar.');
    }
  });

  // inserta elemento en la segunda posición
  btnInsertarNombre.addEventListener('click', () => {
    const elementoAInsertar = insertarElementoInput.value.trim();
    if (elementoAInsertar) {
      letras.splice(1, 0, elementoAInsertar);
      agregarResultado(`Insertado '${elementoAInsertar}' en posición 1`);
    } else {
      agregarResultado('Por favor, ingrese un elemento para insertar.');
    }
  });

  // reemplaza elementos desde posición 2
  btnReemplazarDos.addEventListener('click', () => {
    const elementosAReemplazar = reemplazarElementosInput.value.split(',').map(item => item.trim());
    if (elementosAReemplazar.some(item => item !== '')) { // Check if there's at least one non-empty replacement element
      const reemplazados = letras.splice(2, elementosAReemplazar.length, ...elementosAReemplazar); // Use spread operator for replacement
      agregarResultado(`Reemplazados en posición 2: ${reemplazados.join(', ')} por '${elementosAReemplazar.join("', '")}'`);
    } else {
      agregarResultado('Por favor, ingrese elementos para reemplazar.');
    }
  });

  // muestra el array actual
  btnMostrarLetras.addEventListener('click', () => {
    agregarResultado(`Letras actuales: ${letras.join(', ')}`);
  });

  if (arrayInput.value.trim()) {
    letras = arrayInput.value.trim().split(',').map(item => item.trim());
    agregarResultado(`Array inicial precargado: ${letras.join(', ')}`);
  }
});