document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  // Referencias a inputs y botones
  const numerosInput = document.getElementById('numerosInput');
  const palabrasInput = document.getElementById('palabrasInput');
  const usuariosInput = document.getElementById('usuariosInput');
  const cargarArraysBtn = document.getElementById('cargarArraysBtn');

  const btnFiltrarNumeros = document.getElementById('filtrarNumerosBtn');
  const btnFiltrarPalabras = document.getElementById('filtrarPalabrasBtn');
  const btnFiltrarUsuarios = document.getElementById('filtrarUsuariosBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // Arrays inicializados vacíos
  let numeros = [];
  let palabras = [];
  let usuarios = [];

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

  // Convierte cadena de usuarios (ej: "Juan,true;Maria,false") a array de objetos
  function parseUsuariosInput(inputString) {
    return inputString.split(';').map(userString => {
      const parts = userString.split(',').map(part => part.trim());
      if (parts.length === 2 && parts[0] !== '') {
        const activo = parts[1].toLowerCase() === 'true';
        return { nombre: parts[0], activo: activo };
      }
      return null; // Ignorar entradas mal formadas
    }).filter(user => user !== null);
  }

  // Cargar arrays desde inputs del usuario
  cargarArraysBtn.addEventListener('click', () => {
    resultado.innerHTML = ''; // Limpiar resultados anteriores
    numeros = parseArrayInput(numerosInput.value, true);
    palabras = parseArrayInput(palabrasInput.value);
    usuarios = parseUsuariosInput(usuariosInput.value);
    agregarResultado('Arrays cargados.');
  });

  // Filtra números mayores a 10
  btnFiltrarNumeros.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (numeros.length === 0) {
      agregarResultado('El array de números está vacío. Cargue el array primero.');
      return;
    }
    const mayoresA10 = numeros.filter(num => num > 10);
    agregarResultado(`Números mayores a 10: ${mayoresA10.join(', ')}`);
  });

  // Filtra palabras con más de 5 letras
  btnFiltrarPalabras.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (palabras.length === 0) {
      agregarResultado('El array de palabras está vacío. Cargue el array primero.');
      return;
    }
    const largas = palabras.filter(palabra => palabra.length > 5);
    agregarResultado(`Palabras con más de 5 letras: ${largas.join(', ')}`);
  });

  // Filtra usuarios activos
  btnFiltrarUsuarios.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (usuarios.length === 0) {
      agregarResultado('El array de usuarios está vacío. Cargue el array primero.');
      return;
    }
    const activos = usuarios.filter(usuario => usuario.activo);
    const nombresActivos = activos.map(usuario => usuario.nombre);
    agregarResultado(`Usuarios activos: ${nombresActivos.join(', ')}`);
  });

  // Muestra el estado actual de los arrays
  btnMostrarArrays.addEventListener('click', () => {
    resultado.innerHTML = '';
    mostrarCurrentArrays();
  });

  // Función para mostrar el estado de los arrays
  function mostrarCurrentArrays() {
    if (numeros.length === 0 && palabras.length === 0 && usuarios.length === 0) {
      agregarResultado('No hay arrays cargados actualmente. Ingrese elementos y haga clic en "Cargar Arrays".');
    } else {
      agregarResultado('--- Arrays Actuales ---');
      agregarResultado(`Números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
      agregarResultado(`Palabras: [${palabras.length > 0 ? palabras.join(', ') : 'vacío'}]`);
      agregarResultado(`Usuarios: [${usuarios.length > 0 ? usuarios.map(u => `${u.nombre} (${u.activo ? 'activo' : 'inactivo'})`).join(', ') : 'vacío'}]`);
      agregarResultado('-----------------------');
    }
  }
});