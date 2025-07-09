import express from "express";
import axios from "axios";

const app = express();
const PUERTO_API = 8081;

app.use(express.static("public")); 
app.use(express.json()); 

let registroUsuarios = [];
let idSiguiente = 101; 

app.post("/api/enviar-con-fetch", async (req, res) => {
  const { nombreUsuario, correoUsuario } = req.body; // Obtiene datos del cuerpo de la petición

  try {
    // Envía datos a la API externa usando fetch con método POST
    const respuestaApi = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nombreUsuario, email: correoUsuario }),
    });
    const datosApi = await respuestaApi.json(); // Espera la respuesta de la API externa

    // Crea un nuevo usuario para el registro local
    const nuevoRegistro = { id: idSiguiente++, name: nombreUsuario, email: correoUsuario, origen: "fetch-api" };
    registroUsuarios.push(nuevoRegistro);

    // Responde con el ID recibido de la API externa y el origen
    res.json({ idRecibido: datosApi.id, origen: "fetch-remoto" });
  } catch (errorFetch) {
    console.error("Error al enviar con fetch:", errorFetch); // Registra el error
    res.status(500).json({ error: "Fallo en el envío con Fetch" }); // Devuelve un error al cliente
  }
});

app.post("/api/enviar-con-axios", async (req, res) => {
  const { nombreUsuario, correoUsuario } = req.body; // Obtiene datos del cuerpo de la petición

  try {
    // Envía datos a la API externa usando axios.post
    const respuestaApi = await axios.post("https://jsonplaceholder.typicode.com/users", {
      name: nombreUsuario,
      email: correoUsuario,
    });

    // Crea un nuevo usuario para el registro local
    const nuevoRegistro = { id: idSiguiente++, name: nombreUsuario, email: correoUsuario, origen: "axios-api" };
    registroUsuarios.push(nuevoRegistro);

    // Responde con el ID recibido de la API externa y el origen
    res.json({ idRecibido: respuestaApi.data.id, origen: "axios-remoto" });
  } catch (errorAxios) {
    console.error("Error al enviar con axios:", errorAxios); 
    res.status(500).json({ error: "Fallo en el envío con Axios" });
  }
});

app.listen(PUERTO_API, () => {
  console.log(`http://localhost:${PUERTO_API}/index2.html`);
});