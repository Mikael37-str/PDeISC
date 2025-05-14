document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnVerificarAdmin = document.getElementById('verificarAdminBtn');
  const btnVerificarVerde = document.getElementById('verificarVerdeBtn');
  const btnAgregarNumero = document.getElementById('agregarNumeroBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  let roles = ['javascript', 'kenobi', 'admin'];
  let colores = ['rojo', 'azul', 'amarillo', 'verde', 'marron', 'negro'];
  let numeros = [102, 52, 3, 24];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // verifica si contiene "admin"
  btnVerificarAdmin.addEventListener('click', () => {
    if (roles.includes('admin')) {
      agregarResultado(`El array contiene "admin".`);
    } else {
      agregarResultado(`"admin" no está en el array.`);
    }
  });

  // verifica si el color "verde" está en el array
  btnVerificarVerde.addEventListener('click', () => {
    if (colores.includes('verde')) {
      agregarResultado(`El color "verde" sí existe en el array.`);
    } else {
      agregarResultado(`"verde" no está en el array de colores.`);
    }
  });

  // verifica si el número 100 está, si no lo agrega
  btnAgregarNumero.addEventListener('click', () => {
    if (!numeros.includes(100)) {
      numeros.push(100);
      agregarResultado(`El número 100 no estaba, se ha agregado.`);
    } else {
      agregarResultado(`El número 100 ya está en el array.`);
    }
  });

  // muestra arrays originales
  btnMostrarArrays.addEventListener('click', () => {
    agregarResultado(`Palabras: ${roles.join(', ')}`);
    agregarResultado(`Colores: ${colores.join(', ')}`);
    agregarResultado(`Números: ${numeros.join(', ')}`);
  });
});
