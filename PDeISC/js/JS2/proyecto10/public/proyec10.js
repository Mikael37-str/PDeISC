document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnMultiplicar = document.getElementById('multiplicarBtn');
  const btnMayus = document.getElementById('nombresMayusBtn');
  const btnIVA = document.getElementById('calcularIVABtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  let numeros = [14, 62, 38, 53];
  let nombres = ['maría', 'jose', 'andrés'];
  let precios = [1400.00, 2000.00, 235.50];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // multiplica por 3
  btnMultiplicar.addEventListener('click', () => {
    const multiplicados = numeros.map(num => num * 3);
    agregarResultado(`Números multiplicados por 3: ${multiplicados.join(', ')}`);
  });

  // convierte a mayus
  btnMayus.addEventListener('click', () => {
    const mayus = nombres.map(nombre => nombre.toUpperCase());
    agregarResultado(`Nombres en mayúsculas: ${mayus.join(', ')}`);
  });

  // calcula precios con IVA
  btnIVA.addEventListener('click', () => {
    const conIVA = precios.map(precio => (precio * 1.21).toFixed(2));
    agregarResultado(`Precios con IVA: ${conIVA.join(', ')}`);
  });

  // muestra arrays originales
  btnMostrarArrays.addEventListener('click', () => {
    agregarResultado(`Números originales: ${numeros.join(', ')}`);
    agregarResultado(`Nombres originales: ${nombres.join(', ')}`);
    agregarResultado(`Precios originales: ${precios.join(', ')}`);
  });
});
