document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnSaludar = document.getElementById('saludarNombresBtn');
  const btnDoblar = document.getElementById('doblarNumerosBtn');
  const btnPersonas = document.getElementById('mostrarPersonasBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  let nombres = ['Jorge', 'Andres', 'Paulo', 'Federico'];
  let numeros = [5, 10, 15, 20];
  let personas = [
    { nombre: 'Lorena', edad: 28 },
    { nombre: 'Roberto', edad: 34 },
    { nombre: 'Carlos', edad: 22 }
  ];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // saluda a cada nombre
  btnSaludar.addEventListener('click', () => {
    nombres.forEach(nombre => {
      agregarResultado(`Hola ${nombre}`);
    });
  });

  // dobla cada número
  btnDoblar.addEventListener('click', () => {
    numeros.forEach(numero => {
      agregarResultado(`El doble de ${numero} es ${numero * 2}`);
    });
  });

  // muestra nombre y edad de cada persona
  btnPersonas.addEventListener('click', () => {
    personas.forEach(persona => {
      agregarResultado(`${persona.nombre} tiene ${persona.edad} años`);
    });
  });

  // muestra contenido original de arrays
  btnMostrarArrays.addEventListener('click', () => {
    agregarResultado(`Nombres: ${nombres.join(', ')}`);
    agregarResultado(`Números: ${numeros.join(', ')}`);
    agregarResultado(`Personas: ${personas.map(p => p.nombre + ' (' + p.edad + ')').join(', ')}`);
  });
});
