document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos una referencia al elemento donde mostraremos los resultados
    const resultado = document.getElementById('resultados');

    // Obtenemos referencias a los campos de entrada para los arrays
    const numerosInput = document.getElementById('numerosInput');
    const peliculasInput = document.getElementById('peliculasInput');
    const letrasInput = document.getElementById('letrasInput');
    // Botón para cargar los arrays desde los campos de entrada
    const cargarArraysBtn = document.getElementById('cargarArraysBtn');

    // Obtenemos referencias a los botones para las operaciones slice
    const btnCopiarPrimeros = document.getElementById('copiarPrimerosBtn');
    const btnCopiarPeliculas = document.getElementById('copiarPeliculasBtn');
    const btnCopiarUltimos = document.getElementById('copiarUltimosBtn');
    // Botón para mostrar el estado actual de todos los arrays
    const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

    // Declaramos los arrays. Se inicializan vacíos.
    let numeros = [];
    let peliculas = [];
    let letras = [];

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
      numeros = parseArrayInput(numerosInput.value);
      peliculas = parseArrayInput(peliculasInput.value);
      letras = parseArrayInput(letrasInput.value);
      agregarResultado('Arrays cargados desde la entrada del usuario.');
      // Opcional: Mostramos el estado actual de los arrays inmediatamente después de cargarlos
      // No llamamos a mostrarCurrentArrays() aquí para evitar el mensaje inicial,
      // a menos que el usuario lo solicite explícitamente con el botón.
      // Si quieres que se muestre, descomenta la siguiente línea:
      // mostrarCurrentArrays();
    });

    // Event listener para el botón "Copiar primeros 3 números"
    // Copia los primeros 3 elementos del array 'numeros'
    btnCopiarPrimeros.addEventListener('click', () => {
      // Verificamos que haya suficientes elementos para la operación
      if (numeros.length >= 3) {
        const copia = numeros.slice(0, 3); // slice(inicio, fin): copia hasta 'fin' (exclusivo)
        agregarResultado(`Primeros 3 números copiados: ${copia.join(', ')}`);
      } else {
        agregarResultado('No hay suficientes números para copiar los primeros 3. Por favor, cargue el array.');
      }
    });

    // Event listener para el botón "Copiar películas (pos. 2 a 4)"
    // Copia las películas desde la posición 2 (índice 2) hasta la 4 (índice 3)
    btnCopiarPeliculas.addEventListener('click', () => {
      // Necesitamos al menos 4 elementos para que las posiciones 2 y 3 existan (índices 0, 1, 2, 3)
      if (peliculas.length >= 4) {
        const copia = peliculas.slice(2, 4); // copia los elementos en índice 2 y 3
        agregarResultado(`Películas copiadas (pos. 2 a 4): ${copia.join(', ')}`);
      } else {
        agregarResultado('No hay suficientes películas para copiar desde la posición 2 a 4. Por favor, cargue el array.');
      }
    });

    // Event listener para el botón "Copiar últimos 3 elementos"
    // Copia los últimos 3 elementos del array 'letras'
    btnCopiarUltimos.addEventListener('click', () => {
      // Verificamos que haya al menos 3 elementos
      if (letras.length >= 3) {
        const copia = letras.slice(-3); // slice con número negativo: copia desde el final del array
        agregarResultado(`Últimos 3 elementos copiados: ${copia.join(', ')}`);
      } else {
        agregarResultado('No hay suficientes letras para copiar los últimos 3. Por favor, cargue el array.');
      }
    });

    // Event listener para el botón "Mostrar arrays originales"
    // Muestra el contenido actual (después de cualquier posible modificación) de todos los arrays
    btnMostrarArrays.addEventListener('click', () => {
      // Limpiamos los resultados anteriores antes de mostrar los nuevos
      resultado.innerHTML = '';
      mostrarCurrentArrays();
    });

    // Función auxiliar para mostrar el estado actual de los arrays
    function mostrarCurrentArrays() {
      // Verificamos si los arrays están vacíos para dar un mensaje adecuado
      if (numeros.length === 0 && peliculas.length === 0 && letras.length === 0) {
        agregarResultado('No hay arrays cargados actualmente. Por favor, ingrese elementos y haga clic en "Cargar Arrays".');
      } else {
        agregarResultado('--- Arrays Originales (Estado Actual) ---');
        agregarResultado(`Array de números: [${numeros.length > 0 ? numeros.join(', ') : 'vacío'}]`);
        agregarResultado(`Array de películas: [${peliculas.length > 0 ? peliculas.join(', ') : 'vacío'}]`);
        agregarResultado(`Array de letras: [${letras.length > 0 ? letras.join(', ') : 'vacío'}]`);
        agregarResultado('-----------------------------------------');
      }
    }

  });