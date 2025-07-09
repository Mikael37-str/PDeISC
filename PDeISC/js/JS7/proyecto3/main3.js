import express from "express";
import axios from "axios";

const app = express();
const PUERTO_FILTRADO = 8081; 

// sirve archivos estáticos desde una carpeta dedicada
app.use(express.static("public"));

// ruta para obtener todos los usuarios desde la API externa
app.get("/api/obtener-usuarios", async (req, res) => {
  try {
    // realiza una petición GET a la API externa para obtener usuarios
    const respuestaApi = await axios.get("https://jsonplaceholder.typicode.com/users");
    // envía los datos de los usuarios como respuesta JSON al cliente
    res.json(respuestaApi.data);
  } catch (error) {
    // registra el error y envía una respuesta de error al cliente
    console.error("Error al obtener usuarios de la API externa:", error);
    res.status(500).json({ error: "Fallo al cargar la lista de usuarios." });
  }
});

app.listen(PUERTO_FILTRADO, () => {
  console.log(`http://localhost:${PUERTO_FILTRADO}/index3.html`);
});