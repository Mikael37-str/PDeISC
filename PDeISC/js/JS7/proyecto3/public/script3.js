let listaCompletaUsuarios = []; 

// realiza la petición inicial para obtener todos los usuarios al cargar la página
fetch("/api/obtener-usuarios")
  .then(respuesta => respuesta.json())
  .then(datos => {
    listaCompletaUsuarios = datos; 
    mostrarUsuariosEnLista(listaCompletaUsuarios); 
  })
  .catch(error => {
    // muestra un mensaje de error si la carga de usuarios falla
    console.error("Error al cargar los usuarios:", error);
    document.getElementById("listaResultados").textContent = "Error: No se pudieron cargar los usuarios.";
  });


document.getElementById("campoBusqueda").addEventListener("input", (evento) => {
  const textoBusqueda = evento.target.value.toLowerCase();
  // filtra los usuarios con el nombre del texto de búsqueda
  const usuariosFiltrados = listaCompletaUsuarios.filter(usuario =>
    usuario.name.toLowerCase().includes(textoBusqueda)
  );
  mostrarUsuariosEnLista(usuariosFiltrados);
});

// renderiza la lista de usuarios en el HTML
function mostrarUsuariosEnLista(listaMostrar) {
  const elementoUL = document.getElementById("listaResultados");
  elementoUL.innerHTML = ""; // Limpia la lista existente

  // si no hay usuarios, muestra un mensaje
  if (listaMostrar.length === 0) {
    const liSinResultados = document.createElement("li");
    liSinResultados.textContent = "No se encontraron resultados.";
    liSinResultados.className = "sin-resultados";
    elementoUL.appendChild(liSinResultados);
    return;
  }

  // añade cada usuario a la lista
  listaMostrar.forEach(usuario => {
    const liUsuario = document.createElement("li");
    liUsuario.textContent = `• ${usuario.name}`;
    liUsuario.className = "item-usuario";
    elementoUL.appendChild(liUsuario);
  });
}