document.addEventListener('DOMContentLoaded', () => {
    const resultado = document.getElementById('resultados');
  
    const btnCopiarPrimeros = document.getElementById('copiarPrimerosBtn');
    const btnCopiarPeliculas = document.getElementById('copiarPeliculasBtn');
    const btnCopiarUltimos = document.getElementById('copiarUltimosBtn');
    const btnMostrarArrays = document.getElementById('mostrarArraysBtn');
  
    let numeros = [1, 20, 30, 40, 50, 60];
    let peliculas = ['Busqueda implacable', 'Novocaine', 'Star Wars: Episodio II', 'Bladerunner 2049', 'Godzilla', 'Batman'];
    let letras = ['L', 'M', 'N', 'O', 'P', 'Q'];
  
    function agregarResultado(texto) {
      const li = document.createElement('li');
      li.textContent = texto;
      resultado.appendChild(li);
    }
  
    // copia los primeros 3 elementos de números
    btnCopiarPrimeros.addEventListener('click', () => {
      const copia = numeros.slice(0, 3);
      agregarResultado(`Primeros 3 números copiados: ${copia.join(', ')}`);
    });
  
    // copia las películas desde posición 2 hasta 4
    btnCopiarPeliculas.addEventListener('click', () => {
      const copia = peliculas.slice(2, 4);
      agregarResultado(`Películas copiadas (2 a 4): ${copia.join(', ')}`);
    });
  
    // copia los últimos 3 elementos de letras
    btnCopiarUltimos.addEventListener('click', () => {
      const copia = letras.slice(-3);
      agregarResultado(`Últimos 3 elementos copiados: ${copia.join(', ')}`);
    });
  
    // muestra el contenido original de todos los arrays
    btnMostrarArrays.addEventListener('click', () => {
      agregarResultado(`Array de números: ${numeros.join(', ')}`);
      agregarResultado(`Array de películas: ${peliculas.join(', ')}`);
      agregarResultado(`Array de letras: ${letras.join(', ')}`);
    });
  });
  