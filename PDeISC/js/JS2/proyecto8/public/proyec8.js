document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  // Referencias a los campos de entrada y botones
  const rolesInput = document.getElementById('rolesInput');
  const coloresInput = document.getElementById('coloresInput');
  const numerosInput = document.getElementById('numerosInput');
  const cargarArraysBtn = document.getElementById('cargarArraysBtn');

  const btnVerificarAdmin = document.getElementById('verificarAdminBtn');
  const btnVerificarVerde = document.getElementById('verificarVerdeBtn');
  const btnAgregarNumero = document.getElementById('agregarNumeroBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // Arrays se inicializan vacíos
  let roles = [];
  let colores = [];
  let numeros = [];

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

  // Cargar arrays desde inputs del usuario
  cargarArraysBtn.addEventListener('click', () => {
    resultado.innerHTML = '';
    roles = parseArrayInput(rolesInput.value);
    colores = parseArrayInput(coloresInput.value);
    numeros = parseArrayInput(numerosInput.value, true);
    agregarResultado('Arrays cargados.');
  });

  // Verificar si roles contiene "admin"
  btnVerificarAdmin.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (roles.length === 0) {
      agregarResultado('El array de roles está vacío. Cargue el array primero.');
      return;
    }
    if (roles.includes('admin')) {
      agregarResultado(`El array de roles contiene "admin".`);
    } else {
      agregarResultado(`"admin" no está en el array de roles.`);
    }
  });

  // Verificar si colores contiene "verde"
  btnVerificarVerde.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (colores.length === 0) {
      agregarResultado('El array de colores está vacío. Cargue el array primero.');
      return;
    }
    if (colores.includes('verde')) {
      agregarResultado(`El color "verde" sí existe en el array de colores.`);
    } else {
      agregarResultado(`"verde" no está en el array de colores.`);
    }
  });

  // Agregar 100 a números si no existe
  btnAgregarNumero.addEventListener('click', () => {
    resultado.innerHTML = '';
    if (!numeros.includes(100)) {
      numeros.push(100);
      agregarResultado(`El número 100 no estaba, se ha agregado.`);
    } else {
      agregarResultado(`El número 100 ya está en el array de números.`);
    }
  });

  // Mostrar el estado actual de todos los arrays
  btnMostrarArrays.addEventListener('click', () => {
    resultado.innerHTML = '';
    mostrarCurrentArrays();
  });

  // Función para mostrar el estado de los arrays
  function mostrarCurrentArrays() {
    if (roles.length === 0 && colores.length === 0 && numeros.length === 0) {
      agregarResultado('No hay arrays cargados actualmente. Ingrese elementos y haga clic en "Cargar Arrays".');
    } else {
      agregarResultado('--- Arrays Actuales ---');
      agregarResultado(`Roles: [${roles.length > 0 ? roles.join(', ') : 'vacío'}]`);
      agregarResultado(`Colores: [${colores.length > 0 ? colores.join(', ') : 'vacío'}]`);
      agregarResultado(`Números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
      agregarResultado('-----------------------');
    }
  }
});