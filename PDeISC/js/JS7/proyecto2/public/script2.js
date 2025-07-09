document.getElementById("btnEnviarConFetch").addEventListener("click", () => {
  procesarEnvio("/api/enviar-con-fetch"); // Llama a la función de envío con la URL para Fetch
});

document.getElementById("btnEnviarConAxios").addEventListener("click", () => {
  procesarEnvio("/api/enviar-con-axios"); // Llama a la función de envío con la URL para Axios
});

async function procesarEnvio(urlEndpoint) {
  const nombreIngresado = document.getElementById("nombreUsuario").value.trim(); 
  const emailIngresado = document.getElementById("emailUsuario").value.trim();

  if (!nombreIngresado || !emailIngresado) { // Valida que los campos no estén vacíos
    mostrarMensaje("Por favor, rellena ambos campos.");
    return;
  }

  try {
    let respuesta;
    if (urlEndpoint.includes("fetch")) {
      // Envío con Fetch
      respuesta = await fetch(urlEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario: nombreIngresado, correoUsuario: emailIngresado }),
      }).then(res => res.json());
    } else {
      // Envío con Axios
      respuesta = await axios.post(urlEndpoint, {
        nombreUsuario: nombreIngresado,
        correoUsuario: emailIngresado,
      }).then(res => res.data);
    }

    // Muestra el ID de respuesta o un mensaje de error
    if (respuesta && respuesta.idRecibido) {
      mostrarMensaje(`¡Usuario creado! ID: ${respuesta.idRecibido} (Fuente: ${respuesta.origen})`);
    } else if (respuesta && respuesta.error) {
      mostrarMensaje(`Error en el servidor: ${respuesta.error}`);
    } else {
      mostrarMensaje("Respuesta inesperada del servidor.");
    }
  } catch (error) {
    console.error("Error al procesar el envío:", error); 
    mostrarMensaje("Ocurrió un error al enviar los datos.");
  }
}

function mostrarMensaje(texto) {
  document.getElementById("areaMensajes").textContent = texto; // Muestra el mensaje en el div de resultados
}