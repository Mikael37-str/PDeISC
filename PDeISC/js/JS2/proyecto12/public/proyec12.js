document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnSumar = document.getElementById('sumarBtn');
  const btnMultiplicar = document.getElementById('multiplicarBtn');
  const btnTotalPrecios = document.getElementById('totalPreciosBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  let numeros = [5, 14, 6, 28];
  let precios = [
    { precio: 1050.0 },
    { precio: 200.0 },
    { precio: 350.75 }
  ];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // suma los elementos
  btnSumar.addEventListener('click', () => {
    const suma = numeros.reduce((acc, val) => acc + val, 0);
    agregarResultado(`Suma total de números: ${suma}`);
  });

  // multiplica los elementos
  btnMultiplicar.addEventListener('click', () => {
    const producto = numeros.reduce((acc, val) => acc * val, 1);
    agregarResultado(`Producto total de números: ${producto}`);
  });

  // total de precios
  btnTotalPrecios.addEventListener('click', () => {
    const total = precios.reduce((acc, obj) => acc + obj.precio, 0);
    agregarResultado(`Total de precios: $${total.toFixed(2)}`);
  });

  // muestra arrays originales
  btnMostrarArrays.addEventListener('click', () => {
    agregarResultado(`Números: ${numeros.join(', ')}`);
    agregarResultado(`Precios: ${precios.map(p => `$${p.precio}`).join(', ')}`);
  });
});
