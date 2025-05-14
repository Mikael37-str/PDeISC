document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnInvertirLetras = document.getElementById('invertirLetrasBtn');
  const btnInvertirNumeros = document.getElementById('invertirNumerosBtn');
  const btnInvertirTexto = document.getElementById('invertirTextoBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  // datos 
  let letras = ['r', 'z', 'm', 's', 'c'];
  let numeros = [23, 24, 10, 44, 15];
  let texto = "javascript";

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // invierte las letras
  btnInvertirLetras.addEventListener('click', () => {
    const invertido = [...letras].reverse();
    agregarResultado(`Letras invertidas: ${invertido.join(', ')}`);
  });

  // invierte los numeros
  btnInvertirNumeros.addEventListener('click', () => {
    const invertido = [...numeros].reverse();
    agregarResultado(`Números invertidos: ${invertido.join(', ')}`);
  });

  // inierte el texto
  btnInvertirTexto.addEventListener('click', () => {
    const invertido = texto.split('').reverse().join('');
    agregarResultado(`Texto invertido: ${invertido}`);
  });

  // muestra arrays originales
  btnMostrarArrays.addEventListener('click', () => {
    agregarResultado(`Letras originales: ${letras.join(', ')}`);
    agregarResultado(`Números originales: ${numeros.join(', ')}`);
    agregarResultado(`Texto original: "${texto}"`);
  });
});
