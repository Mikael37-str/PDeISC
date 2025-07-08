document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  // Referencias a los campos de entrada y al botón de carga
  const numerosInput = document.getElementById('numerosInput');
  const nombresInput = document.getElementById('nombresInput');
  const preciosInput = document.getElementById('preciosInput');
  const cargarArraysBtn = document.getElementById('cargarArraysBtn');

  // Referencias a los botones de operación
  const btnMultiplicar = document.getElementById('multiplicarBtn');
  const btnMayus = document.getElementById('nombresMayusBtn');
  const btnIVA = document.getElementById('calcularIVABtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // Arrays inicializados vacíos
  let numeros = [];
  let nombres = [];
  let precios = [];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // Convierte cadena de texto a array, opcionalmente a números
  function parseArrayInput(inputString, asNumbers = false) {
    const items = inputString.split(',').map(item => item.trim()).filter(item => item !== '');
    return asNumbers ? items.map(Number) : items;
  }

  // Event listener para el botón "Cargar Arrays"
  cargarArraysBtn.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiar resultados anteriores
    numeros = parseArrayInput(numerosInput.value, true);
    nombres = parseArrayInput(nombresInput.value);
    precios = parseArrayInput(preciosInput.value, true); // Los precios también son numéricos
    agregarResultado('Arrays cargados.');
  });

  // Multiplica números por 3
  btnMultiplicar.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (numeros.length === 0) {
      agregarResultado('El array de números está vacío. Cargue el array primero.');
      return;
    }
    const multiplicados = numeros.map(num => num * 3);
    agregarResultado(`Números multiplicados por 3: ${multiplicados.join(', ')}`);
  });

  // Convierte nombres a mayúsculas
  btnMayus.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (nombres.length === 0) {
      agregarResultado('El array de nombres está vacío. Cargue el array primero.');
      return;
    }
    const mayus = nombres.map(nombre => nombre.toUpperCase());
    agregarResultado(`Nombres en mayúsculas: ${mayus.join(', ')}`);
  });

  // Calcula precios con IVA
  btnIVA.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (precios.length === 0) {
      agregarResultado('El array de precios está vacío. Cargue el array primero.');
      return;
    }
    const conIVA = precios.map(precio => (precio * 1.21).toFixed(2));
    agregarResultado(`Precios con IVA: ${conIVA.join(', ')}`);
  });

  // Muestra el estado actual de los arrays
  btnMostrarArrays.addEventListener('click', () => {
    resultado.innerHTML = '';
    mostrarCurrentArrays();
  });

  // Función para mostrar el estado de los arrays
  function mostrarCurrentArrays() {
    if (numeros.length === 0 && nombres.length === 0 && precios.length === 0) {
      agregarResultado('No hay arrays cargados actualmente. Ingrese elementos y haga clic en "Cargar Arrays".');
    } else {
      agregarResultado('--- Arrays Actuales ---');
      agregarResultado(`Números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
      agregarResultado(`Nombres: [${nombres.length > 0 ? nombres.join(', ') : 'vacío'}]`);
      agregarResultado(`Precios: [${precios.length > 0 ? precios.join(', ') : 'vacío'}]`);
      agregarResultado('-----------------------');
    }
  }
});