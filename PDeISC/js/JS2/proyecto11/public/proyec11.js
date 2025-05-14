document.addEventListener('DOMContentLoaded', () => {
  const resultado = document.getElementById('resultados');

  const btnFiltrarNumeros = document.getElementById('filtrarNumerosBtn');
  const btnFiltrarPalabras = document.getElementById('filtrarPalabrasBtn');
  const btnFiltrarUsuarios = document.getElementById('filtrarUsuariosBtn');
  const btnMostrarArrays = document.getElementById('mostrarArraysBtn');

  let numeros = [53, 2, 18, 15, 3, 75];
  let palabras = ['té', 'pescar', 'html', 'cuando', 'terracota'];
  let usuarios = [
    { nombre: 'Ambar', activo: true },
    { nombre: 'Nicolás', activo: false },
    { nombre: 'Cristian', activo: true },
    { nombre: 'Luis', activo: false }
  ];

  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;
    resultado.appendChild(li);
  }

  // filtra numeros mayores a 10
  btnFiltrarNumeros.addEventListener('click', () => {
    const mayoresA10 = numeros.filter(num => num > 10);
    agregarResultado(`Números mayores a 10: ${mayoresA10.join(', ')}`);
  });

  // filtra palabras con mas de 5 letras
  btnFiltrarPalabras.addEventListener('click', () => {
    const largas = palabras.filter(palabra => palabra.length > 5);
    agregarResultado(`Palabras con más de 5 letras: ${largas.join(', ')}`);
  });

  // filtra usuarios activos
  btnFiltrarUsuarios.addEventListener('click', () => {
    const activos = usuarios.filter(usuario => usuario.activo);
    const nombresActivos = activos.map(usuario => usuario.nombre);
    agregarResultado(`Usuarios activos: ${nombresActivos.join(', ')}`);
  });

  // muestra los arrays originales
  btnMostrarArrays.addEventListener('click', () => {
    agregarResultado(`Números originales: ${numeros.join(', ')}`);
    agregarResultado(`Palabras originales: ${palabras.join(', ')}`);
    agregarResultado(`Usuarios: ${usuarios.map(u => `${u.nombre} (${u.activo ? 'activo' : 'inactivo'})`).join(', ')}`);
  });
});
