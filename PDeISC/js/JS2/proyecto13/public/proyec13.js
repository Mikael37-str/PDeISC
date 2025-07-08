document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  // Referencias a inputs y botones
  const numerosInput = document.getElementById('numerosInput');
  const palabrasInput = document.getElementById('palabrasInput');
  const personasInput = document.getElementById('personasInput');
  const cargarArraysBtn = document.getElementById('cargarArraysBtn');

  const btnOrdenarNumeros = document.getElementById('ordenarNumerosBtn');
  const btnOrdenarPalabras = document.getElementById('ordenarPalabrasBtn');
  const btnOrdenarPersonas = document.getElementById('ordenarPersonasBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // Arrays inicializados vacíos
  let numeros = [];
  let palabras = [];
  let personas = [];

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

  // Convierte cadena de personas (ej: "Nombre,Edad;Nombre2,Edad2") a array de objetos
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
    numeros = parseArrayInput(numerosInput.value, true);
    palabras = parseArrayInput(palabrasInput.value);
    personas = parsePersonasInput(personasInput.value);
    agregarResultado('Arrays cargados.');
  });

  // Ordena números de menor a mayor
  btnOrdenarNumeros.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (numeros.length === 0) {
      agregarResultado('El array de números está vacío. Cargue el array primero.');
      return;
    }
    // Usar spread operator para no modificar el array original directamente
    const ordenados = [...numeros].sort((a, b) => a - b);
    agregarResultado(`Números ordenados: ${ordenados.join(', ')}`);
  });

  // Ordena palabras alfabéticamente
  btnOrdenarPalabras.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (palabras.length === 0) {
      agregarResultado('El array de palabras está vacío. Cargue el array primero.');
      return;
    }
    const ordenadas = [...palabras].sort((a, b) => a.localeCompare(b));
    agregarResultado(`Palabras ordenadas: ${ordenadas.join(', ')}`);
  });

  // Ordena objetos por edad
  btnOrdenarPersonas.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (personas.length === 0) {
      agregarResultado('El array de personas está vacío. Cargue el array primero.');
      return;
    }
    const ordenadas = [...personas].sort((a, b) => a.edad - b.edad);
    const nombresOrdenados = ordenadas.map(p => `${p.nombre} (${p.edad} años)`);
    agregarResultado(`Personas ordenadas por edad: ${nombresOrdenados.join(', ')}`);
  });

  // Muestra el estado actual de los arrays
  btnMostrarArrays.addEventListener('click', () => {
    resultado.innerHTML = '';
    mostrarCurrentArrays();
  });

  // Función para mostrar el estado de los arrays
  function mostrarCurrentArrays() {
    if (numeros.length === 0 && palabras.length === 0 && personas.length === 0) {
      agregarResultado('No hay arrays cargados actualmente. Ingrese elementos y haga clic en "Cargar Arrays".');
    } else {
      agregarResultado('--- Arrays Actuales ---');
      agregarResultado(`Números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
      agregarResultado(`Palabras: [${palabras.length > 0 ? palabras.join(', ') : 'vacío'}]`);
      agregarResultado(`Personas: [${personas.length > 0 ? personas.map(p => `${p.nombre} (${p.edad} años)`).join('; ') : 'vacío'}]`);
      agregarResultado('-----------------------');
    }
  }
});