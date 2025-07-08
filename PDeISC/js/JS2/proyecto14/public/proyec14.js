document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  // Referencias a inputs y botones
  const letrasInput = document.getElementById('letrasInput');
  const numerosInput = document.getElementById('numerosInput');
  const textoInput = document.getElementById('textoInput');
  const cargarDatosBtn = document.getElementById('cargarDatosBtn');

  const btnInvertirLetras = document.getElementById('invertirLetrasBtn');
  const btnInvertirNumeros = document.getElementById('invertirNumerosBtn');
  const btnInvertirTexto = document.getElementById('invertirTextoBtn');
  const btnMostrarDatos = document.getElementById('mostrarDatosBtn'); // Renombrado

  // Datos inicializados vacíos
  let letras = [];
  let numeros = [];
  let texto = "";

  function agregarResultado(textoStr) { // Renombrado el parámetro para evitar conflicto
    const li = document.createElement('li');
    li.textContent = textoStr;
    resultado.appendChild(li);
  }

  // Convierte cadena de texto a array, opcionalmente a números
  function parseArrayInput(inputString, asNumbers = false) {
    const items = inputString.split(',').map(item => item.trim()).filter(item => item !== '');
    return asNumbers ? items.map(Number) : items;
  }

  // Cargar datos desde inputs del usuario
  cargarDatosBtn.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiar resultados anteriores
    letras = parseArrayInput(letrasInput.value);
    numeros = parseArrayInput(numerosInput.value, true);
    texto = textoInput.value.trim();
    agregarResultado('Datos cargados.');
  });

  // Invierte las letras
  btnInvertirLetras.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (letras.length === 0) {
      agregarResultado('El array de letras está vacío. Cargue los datos primero.');
      return;
    }
    const invertido = [...letras].reverse(); // Usa spread para no modificar el original
    agregarResultado(`Letras invertidas: ${invertido.join(', ')}`);
  });

  // Invierte los numeros
  btnInvertirNumeros.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (numeros.length === 0) {
      agregarResultado('El array de números está vacío. Cargue los datos primero.');
      return;
    }
    const invertido = [...numeros].reverse(); // Usa spread para no modificar el original
    agregarResultado(`Números invertidos: ${invertido.join(', ')}`);
  });

  // Invierte el texto
  btnInvertirTexto.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (texto === "") {
      agregarResultado('El campo de texto está vacío. Cargue los datos primero.');
      return;
    }
    const invertido = texto.split('').reverse().join('');
    agregarResultado(`Texto invertido: ${invertido}`);
  });

  // Muestra el estado actual de los datos
  btnMostrarDatos.addEventListener('click', () => {
    resultado.innerHTML = '';
    mostrarCurrentDatos();
  });

  // Función para mostrar el estado de los datos
  function mostrarCurrentDatos() {
    if (letras.length === 0 && numeros.length === 0 && texto === "") {
      agregarResultado('No hay datos cargados actualmente. Ingrese elementos y haga clic en "Cargar Datos".');
    } else {
      agregarResultado('--- Datos Actuales ---');
      agregarResultado(`Letras: [${letras.length > 0 ? letras.join(', ') : 'vacío'}]`);
      agregarResultado(`Números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
      agregarResultado(`Texto: "${texto === "" ? 'vacío' : texto}"`);
      agregarResultado('-----------------------');
    }
  }
});