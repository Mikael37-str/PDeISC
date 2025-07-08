document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  // Referencias a inputs y botones
  const numerosInput = document.getElementById('numerosInput');
  const preciosInput = document.getElementById('preciosInput');
  const cargarArraysBtn = document.getElementById('cargarArraysBtn');

  const btnSumar = document.getElementById('sumarBtn');
  const btnMultiplicar = document.getElementById('multiplicarBtn');
  const btnTotalPrecios = document.getElementById('totalPreciosBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // Arrays inicializados vacíos
  let numeros = [];
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

  // Convierte cadena de precios a array de objetos { precio: numero }
  function parsePreciosInput(inputString) {
    return inputString.split(',').map(priceString => {
      const parsedPrice = Number(priceString.trim());
      if (!isNaN(parsedPrice) && priceString.trim() !== '') {
        return { precio: parsedPrice };
      }
      return null; // Ignorar entradas no válidas
    }).filter(priceObj => priceObj !== null);
  }

  // Cargar arrays desde inputs del usuario
  cargarArraysBtn.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiar resultados anteriores
    numeros = parseArrayInput(numerosInput.value, true);
    precios = parsePreciosInput(preciosInput.value);
    agregarResultado('Arrays cargados.');
  });

  // Suma los elementos
  btnSumar.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (numeros.length === 0) {
      agregarResultado('El array de números está vacío. Cargue el array primero.');
      return;
    }
    const suma = numeros.reduce((acc, val) => acc + val, 0);
    agregarResultado(`Suma total de números: ${suma}`);
  });

  // Multiplica los elementos
  btnMultiplicar.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (numeros.length === 0) {
      agregarResultado('El array de números está vacío. Cargue el array primero.');
      return;
    }
    const producto = numeros.reduce((acc, val) => acc * val, 1);
    agregarResultado(`Producto total de números: ${producto}`);
  });

  // Total de precios
  btnTotalPrecios.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (precios.length === 0) {
      agregarResultado('El array de precios está vacío. Cargue el array primero.');
      return;
    }
    const total = precios.reduce((acc, obj) => acc + obj.precio, 0);
    agregarResultado(`Total de precios: $${total.toFixed(2)}`);
  });

  // Muestra el estado actual de los arrays
  btnMostrarArrays.addEventListener('click', () => {
    resultado.innerHTML = '';
    mostrarCurrentArrays();
  });

  // Función para mostrar el estado de los arrays
  function mostrarCurrentArrays() {
    if (numeros.length === 0 && precios.length === 0) {
      agregarResultado('No hay arrays cargados actualmente. Ingrese elementos y haga clic en "Cargar Arrays".');
    } else {
      agregarResultado('--- Arrays Actuales ---');
      agregarResultado(`Números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
      agregarResultado(`Precios: [${precios.length > 0 ? precios.map(p => `$${p.precio}`).join(', ') : 'vacío'}]`);
      agregarResultado('-----------------------');
    }
  }
});