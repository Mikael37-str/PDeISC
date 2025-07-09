const listaAlumnosBaseHTML = document.getElementById("listaAlumnosBase");

// obtiene los datos de los alumnos
fetch("/api/alumnos_configurados")
  .then(respuesta => {
    if (!respuesta.ok) {
      throw new Error(`Error de red: ${respuesta.status}`);
    }
    return respuesta.json(); 
  })
  .then(alumnos => {
    // crea la lista para los alumnos
    alumnos.forEach(alumno => {
      const elementoLi = document.createElement("li");
      elementoLi.className = "alumno-item-base"; // Clase para estilizado

      // muestra los atributos del alumno en la lista
      elementoLi.innerHTML = `
        <strong>${alumno.nombre}</strong> (ID: ${alumno.id})<br>
        Edad: ${alumno.edad}<br>
        Curso: ${alumno.curso} | Turno: ${alumno.turno}<br>
        Especialidad: ${alumno.especia}
      `;
      listaAlumnosBaseHTML.appendChild(elementoLi); // agrega el elemento a la lista HTML
    });
  })
  .catch(error => {
    // busca errores 
    console.error("Fallo al cargar la lista de alumnos:", error);
    listaAlumnosBaseHTML.textContent = "Error: No se pudo cargar la información de los alumnos.";
    listaAlumnosBaseHTML.className = "mensaje-error-base";
  });