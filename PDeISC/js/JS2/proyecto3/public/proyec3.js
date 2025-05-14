document.addEventListener('DOMContentLoaded', () => {

  const resultado = document.getElementById('resultados');

  const inputColor = document.getElementById('coloresInput');
  const inputTarea = document.getElementById('tareaInput');
  const inputUsuario = document.getElementById('usuarioInput');

  const btnColor = document.getElementById('agregarColorBtn');
  const btnTarea = document.getElementById('agregarTareaBtn');
  const btnUsuario = document.getElementById('agregarUsuarioBtn');

  const btnMostrarColores = document.getElementById('mostrarColoresBtn');
  const btnMostrarTareas = document.getElementById('mostrarTareasBtn');
  const btnMostrarUsuarios = document.getElementById('mostrarUsuariosBtn');

  const colores = [];
  const tareas = [];
  const usuarios = [];

  // función auxiliar que agrega un nuevo resultado con el texto dado
  function agregarResultado(texto) {
    const li = document.createElement('li');
    li.textContent = texto;                
    resultado.appendChild(li);            
  }

  // agrega un nuevo color al principio del array 
  btnColor.addEventListener('click', () => {
    const color = inputColor.value.trim();  
    if (color) {                            
      colores.unshift(color);             
      agregarResultado(`Color agregado al inicio: ${color}`);  
      inputColor.value = '';               
    }
  });

  // agrega una nueva tarea urgente al principio del array 
  btnTarea.addEventListener('click', () => {
    const tarea = inputTarea.value.trim();
    if (tarea) {
      tareas.unshift(tarea);
      agregarResultado(`Tarea urgente agregada: ${tarea}`);
      inputTarea.value = '';
    }
  });

  // agrega un nuevo usuario conectado al principio del array
  btnUsuario.addEventListener('click', () => {
    const usuario = inputUsuario.value.trim();
    if (usuario) {
      usuarios.unshift(usuario);
      agregarResultado(`Usuario conectado primero: ${usuario}`);
      inputUsuario.value = '';
    }
  });

  // muestra los colores actuales en el array 
  btnMostrarColores.addEventListener('click', () => {
    agregarResultado(`Colores actuales: ${colores.join(', ') || 'Sin colores'}`);
  });

  // muestra las tareas actuales
  btnMostrarTareas.addEventListener('click', () => {
    agregarResultado(`Tareas actuales: ${tareas.join(', ')}`);
  });

  // muestra los usuarios conectados
  btnMostrarUsuarios.addEventListener('click', () => {
    agregarResultado(`Usuarios conectados: ${usuarios.join(', ')}`);
  });
});
