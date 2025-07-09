document.getElementById("btnBuscarConFetch").addEventListener("click", () => {
  // envía una petición a la API externa con fetch
  fetch("https://jsonplaceholder.typicode.com/users")
    .then(respuestaExterna => respuestaExterna.json())
    .then(datosUsuarios => mostrarResultado("Resultado con Fetch", datosUsuarios))
    .catch(errorFetchExterno => mostrarResultado("Error Fetch Externo", errorFetchExterno));

  // envía una petición a la API local con fetch
  fetch("/api/buscar-con-fetch")
    .then(respuestaLocal => respuestaLocal.json())
    .then(datosLocal => mostrarResultado("Fetch", datosLocal))
    .catch(errorFetchLocal => mostrarResultado("Error con Fetch", errorFetchLocal));
});

document.getElementById("btnObtenerConAxios").addEventListener("click", () => {
  // envía una petición a la API externa con axios
  axios.get("https://jsonplaceholder.typicode.com/users")
    .then(respuestaAxiosExterna => mostrarResultado("Resultado con Axios", respuestaAxiosExterna.data))
    .catch(errorAxiosExterno => mostrarResultado("Error con Axios", errorAxiosExterno));

  // envía una petición a la API local con axios
  axios.get("/api/obtener-con-axios") 
    .then(respuestaAxiosLocal => mostrarResultado("Resultado con Axios", respuestaAxiosLocal.data))
    .catch(errorAxiosLocal => mostrarResultado("Error con Axios", errorAxiosLocal));
});

function mostrarResultado(titulo, datos) {
  const contenedorResultados = document.getElementById("contenedorResultados");
  let htmlContenido = `<h3>${titulo}</h3><ul class="lista-usuarios">`;

  // muestra los usuarios del array
  if (Array.isArray(datos)) {
    datos.forEach(usuario => {
      htmlContenido += `<li>${usuario.name} <span class="email-usuario">(${usuario.email})</span></li>`;
    });
  } else {
    htmlContenido += `<li>No se pudieron obtener los datos o hubo un error: ${JSON.stringify(datos)}</li>`;
  }

  htmlContenido += `</ul>`;
  contenedorResultados.innerHTML = htmlContenido;
}