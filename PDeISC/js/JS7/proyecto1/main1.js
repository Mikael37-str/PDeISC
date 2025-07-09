import express from "express";
import axios from "axios";

const app = express();
const PUERTO_SERVICIO = 8083; 

app.use(express.static("archivos_publicos"));
app.use(express.json());


app.get("/", (req, res) => {
  res.send("<h1>Servidor activo. Abrí /pagina_modificada.html en el navegador.</h1>");
});

// solicitudes para fetch 
app.get("/api/buscar-con-fetch", async (req, res) => {
  try {
    const respuestaExterna = await fetch("https://jsonplaceholder.typicode.com/users");
    const datos = await respuestaExterna.json();
    res.json(datos); 
  } catch (error) {
    console.error("Error con Fetch:", error);
    res.status(500).json({ estado: "error", mensaje: "No se pudieron obtener los usuarios con Fetch." });
  }
});

// solicitudes para axios
app.get("/api/obtener-con-axios", async (req, res) => {
  try {
    const respuesta = await axios.get("https://jsonplaceholder.typicode.com/users");
    res.json(respuesta.data);
  } catch (error) {
    console.error("Error con Axios:", error);
    res.status(500).json({ estado: "error", mensaje: "No se pudieron obtener los usuarios con Axios." });
  }
});

app.listen(PUERTO_SERVICIO, () => {
  console.log(`Servidor funcionando en http://localhost:${PUERTO_SERVICIO}`);
  console.log(`Abrí http://localhost:${PUERTO_SERVICIO}/pagina_modificada.html para probar`);
});
