document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  // Referencias a inputs y botones
  const nombresInput = document.getElementById('nombresInput');
  const numerosInput = document.getElementById('numerosInput');
  const personasInput = document.getElementById('personasInput');
  const cargarArraysBtn = document.getElementById('cargarArraysBtn');

  const btnSaludar = document.getElementById('saludarNombresBtn');
  const btnDoblar = document.getElementById('doblarNumerosBtn');
  const btnPersonas = document.getElementById('mostrarPersonasBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // Arrays inicializados vacíos
  let nombres = [];
  let numeros = [];
  let personas = [];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // Convierte cadena a array, opcionalmente a números
  function parseArrayInput(inputString, asNumbers = false) {
    const items = inputString.split(',').map(item => item.trim()).filter(item => item !== '');
    return asNumbers ? items.map(Number) : items;
  }

  // Convierte cadena de personas (ej: "Juan,30;Maria,25") a array de objetos
  function parsePersonasInput(inputString) {
    return inputString.split(';').map(personString => {
      const parts = personString.split(',').map(part => part.trim());
      if (parts.length === 2 && parts[0] !== '' && !isNaN(Number(parts[1]))) {
        return { nombre: parts[0], edad: Number(parts[1]) };
      }
      return null; // Ignorar entradas mal formadas
    }).filter(person => person !== null);
  }

  // Cargar arrays desde inputs del usuario
  cargarArraysBtn.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiar resultados anteriores
    nombres = parseArrayInput(nombresInput.value);
    numeros = parseArrayInput(numerosInput.value, true);
    personas = parsePersonasInput(personasInput.value);
    agregarResultado('Arrays cargados desde la entrada del usuario.');
  });

  // Saludar a cada nombre
  btnSaludar.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (nombres.length === 0) {
      agregarResultado('El array de nombres está vacío. Cargue el array primero.');
      return;
    }
    nombres.forEach(nombre => {
      agregarResultado(`Hola ${nombre}`);
    });
  });

  // Doblar cada número
  btnDoblar.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (numeros.length === 0) {
      agregarResultado('El array de números está vacío. Cargue el array primero.');
      return;
    }
    numeros.forEach(numero => {
      agregarResultado(`El doble de ${numero} es ${numero * 2}`);
    });
  });

  // Mostrar nombre y edad de cada persona
  btnPersonas.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (personas.length === 0) {
      agregarResultado('El array de personas está vacío. Cargue el array primero.');
      return;
    }
    personas.forEach(persona => {
      agregarResultado(`${persona.nombre} tiene ${persona.edad} años`);
    });
  });

  // Mostrar el estado actual de todos los arrays
  btnMostrarArrays.addEventListener('click', () => {
    resultado.innerHTML = '';
    mostrarCurrentArrays();
  });

  // Función para mostrar el estado actual de los arrays
  function mostrarCurrentArrays() {
    if (nombres.length === 0 && numeros.length === 0 && personas.length === 0) {
      agregarResultado('No hay arrays cargados actualmente. Ingrese elementos y haga clic en "Cargar Arrays".');
    } else {
      agregarResultado('--- Arrays Actuales ---');
      agregarResultado(`Nombres: [${nombres.length > 0 ? nombres.join(', ') : 'vacío'}]`);
      agregarResultado(`Números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
      agregarResultado(`Personas: [${personas.length > 0 ? personas.map(p => `${p.nombre} (${p.edad})`).join(', ') : 'vacío'}]`);
      agregarResultado('-----------------------');
    }
  }
});