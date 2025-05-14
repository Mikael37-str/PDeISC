document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnBuscarPerro = document.getElementById('buscarPerroBtn');
  const btnBuscarNumero50 = document.getElementById('buscarNumero50Btn');
  const btnBuscarMadrid = document.getElementById('buscarMadridBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  let palabras = ['gato', 'perro', 'pez', 'pájaro'];
  let numeros = [10, 20, 30, 50, 70];
  let ciudades = ['Helsinki', 'Vancouver', 'Nueva Dehli', 'Lyon'];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // busca la palabra perro
  btnBuscarPerro.addEventListener('click', () => {
    const index = palabras.indexOf('perro');
    if (index !== -1) {
      agregarResultado(`"perro" se encuentra en la posición ${index}`);
    } else {
      agregarResultado(`"perro" no está en el array.`);
    }
  });

  // verifica si el número 50 está en el array
  btnBuscarNumero50.addEventListener('click', () => {
    const index = numeros.indexOf(50);
    if (index !== -1) {
      agregarResultado(`El número 50 está en la posición ${index}`);
    } else {
      agregarResultado(`El número 50 no está en el array.`);
    }
  });

  // busca "Madrid"
  btnBuscarMadrid.addEventListener('click', () => {
    const index = ciudades.indexOf('Madrid');
    if (index !== -1) {
      agregarResultado(`"Madrid" se encuentra en la posición ${index}`);
    } else {
      agregarResultado(`"Madrid" no se encuentra en el array de ciudades.`);
    }
  });

  // muestra arrays originales
  btnMostrarArrays.addEventListener('click', () => {
    agregarResultado(`Palabras: ${palabras.join(', ')}`);
    agregarResultado(`Números: ${numeros.join(', ')}`);
    agregarResultado(`Ciudades: ${ciudades.join(', ')}`);
  });
});
