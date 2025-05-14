document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnOrdenarNumeros = document.getElementById('ordenarNumerosBtn');
  const btnOrdenarPalabras = document.getElementById('ordenarPalabrasBtn');
  const btnOrdenarPersonas = document.getElementById('ordenarPersonasBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // datos originales
  let numeros = [12, 18, 9, 88, 4, 23, 1315];
  let palabras = ['Sol', 'batman', 'natalia', 'javascript', 'miercoles'];
  let personas = [
    { nombre: 'Luz', edad: 22 },
    { nombre: 'Juan', edad: 27 },
    { nombre: 'Tomás', edad: 14 },
    { nombre: 'Pepe', edad: 47 }
  ];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // ordena numeros de menor a mayor
  btnOrdenarNumeros.addEventListener('click', () => {
    const ordenados = [...numeros].sort((a, b) => a - b);
    agregarResultado(`Números ordenados: ${ordenados.join(', ')}`);
  });

  // ordena palabras alfabeticamente
  btnOrdenarPalabras.addEventListener('click', () => {
    const ordenadas = [...palabras].sort((a, b) => a.localeCompare(b));
    agregarResultado(`Palabras ordenadas: ${ordenadas.join(', ')}`);
  });

  // ordena objetos por edad
  btnOrdenarPersonas.addEventListener('click', () => {
    const ordenadas = [...personas].sort((a, b) => a.edad - b.edad);
    const nombres = ordenadas.map(p => `${p.nombre} (${p.edad} años)`);
    agregarResultado(`Personas ordenadas por edad: ${nombres.join(', ')}`);
  });

  // muestra los arrays originales
  btnMostrarArrays.addEventListener('click', () => {
    agregarResultado(`Números originales: ${numeros.join(', ')}`);
    agregarResultado(`Palabras originales: ${palabras.join(', ')}`);
    agregarResultado(`Personas originales: ${personas.map(p => `${p.nombre} (${p.edad})`).join(', ')}`);
  });
});
