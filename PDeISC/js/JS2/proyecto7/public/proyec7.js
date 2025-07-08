document.addEventListener('DOMContentLoaded', () => {
  // Obtenemos una referencia al elemento donde mostraremos los resultados
  const resultado = document.getElementById('resultados');

  // Obtenemos referencias a los campos de entrada para los arrays
  const palabrasInput = document.getElementById('palabrasInput');
  const numerosInput = document.getElementById('numerosInput');
  const ciudadesInput = document.getElementById('ciudadesInput');
  // Botón para cargar los arrays desde los campos de entrada
  const cargarArraysBtn = document.getElementById('cargarArraysBtn');

  // Obtenemos referencias a los botones para las operaciones de búsqueda
  const btnBuscarPerro = document.getElementById('buscarPerroBtn');
  const btnBuscarNumero50 = document.getElementById('buscarNumero50Btn');
  const btnBuscarMadrid = document.getElementById('buscarMadridBtn');
  // Botón para mostrar el estado actual de todos los arrays
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // Declaramos los arrays. Se inicializan vacíos.
  let palabras = [];
  let numeros = [];
  let ciudades = [];

  // Función auxiliar para añadir texto a la lista de resultados
  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // Función para convertir una cadena de texto separada por comas en un array
  function parseArrayInput(inputString) {
    // Divide la cadena por comas, elimina espacios en blanco de cada elemento y filtra elementos vacíos
    return inputString.split(',').map(item => item.trim()).filter(item => item !== '');
  }

  // Event listener para el botón "Cargar Arrays"
  cargarArraysBtn.addEventListener('click', () => {
    // Limpiamos los resultados anteriores antes de mostrar los nuevos
    resultado.innerHTML = '';
    // Parseamos los valores de los campos de entrada y los asignamos a nuestros arrays
    palabras = parseArrayInput(palabrasInput.value);
    numeros = parseArrayInput(numerosInput.value);
    ciudades = parseArrayInput(ciudadesInput.value);
    agregarResultado('Arrays cargados desde la entrada del usuario.');
    // No mostramos los arrays inmediatamente aquí, para no tener mensajes al inicio.
    // El usuario debe usar el botón "Mostrar arrays actuales" si quiere verlos.
  });

  // Event listener para el botón "Buscar 'perro'"
  // Busca la palabra "perro" en el array 'palabras'
  btnBuscarPerro.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiamos resultados anteriores
    if (palabras.length === 0) {
      agregarResultado('El array de palabras está vacío. Por favor, cargue el array primero.');
      return;
    }
    const index = palabras.indexOf('perro');
    if (index !== -1) {
      agregarResultado(`"perro" se encuentra en la posición ${index}`);
    } else {
      agregarResultado(`"perro" no está en el array de palabras.`);
    }
  });

  // Event listener para el botón "Buscar número 50"
  // Verifica si el número 50 está en el array 'numeros'
  btnBuscarNumero50.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiamos resultados anteriores
    if (numeros.length === 0) {
      agregarResultado('El array de números está vacío. Por favor, cargue el array primero.');
      return;
    }
    const index = numeros.indexOf(50); // indexOf para números
    if (index !== -1) {
      agregarResultado(`El número 50 está en la posición ${index}`);
    } else {
      agregarResultado(`El número 50 no está en el array de números.`);
    }
  });

  // Event listener para el botón "Buscar 'Madrid'"
  // Busca "Madrid" en el array 'ciudades'
  btnBuscarMadrid.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiamos resultados anteriores
    if (ciudades.length === 0) {
      agregarResultado('El array de ciudades está vacío. Por favor, cargue el array primero.');
      return;
    }
    const index = ciudades.indexOf('Madrid');
    if (index !== -1) {
      agregarResultado(`"Madrid" se encuentra en la posición ${index}`);
    } else {
      agregarResultado(`"Madrid" no se encuentra en el array de ciudades.`);
    }
  });

  // Event listener para el botón "Mostrar arrays actuales"
  // Muestra el contenido actual de todos los arrays
  btnMostrarArrays.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiamos resultados anteriores
    mostrarCurrentArrays();
  });

  // Función auxiliar para mostrar el estado actual de los arrays
  function mostrarCurrentArrays() {
    // Verificamos si todos los arrays están vacíos para dar un mensaje adecuado
    if (palabras.length === 0 && numeros.length === 0 && ciudades.length === 0) {
      agregarResultado('No hay arrays cargados actualmente. Por favor, ingrese elementos y haga clic en "Cargar Arrays".');
    } else {
      agregarResultado('--- Arrays Actuales ---');
      agregarResultado(`Palabras: [${palabras.length > 0 ? palabras.join(', ') : 'vacío'}]`);
      agregarResultado(`Números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
      agregarResultado(`Ciudades: [${ciudades.length > 0 ? ciudades.join(', ') : 'vacío'}]`);
      agregarResultado('-----------------------');
    }
  }

});