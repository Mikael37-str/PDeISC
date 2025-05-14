// importa los módulos necesarios
const express = require('express');         
const path = require('path');               
const app = express();                       

let personas = []; // almacén en memoria para las personas registradas

app.use(express.urlencoded({ extended: true }));
app.use(express.json());                     
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// recibe los datos del formulario y los guarda en el array "personas"
app.post('/enviar', (req, res) => {
  // extrae los datos de la solicitud
  const { nombre, apellido, email, pais } = req.body;

  // crea un nuevo objeto persona con los datos recibidos
  const persona = { nombre, apellido, email, pais };

  // agrega la persona a la memoria
  personas.push(persona);

  // devuelve la persona como respuesta en formato JSON
  res.json(persona);
});

// devuelve la lista de todas las personas registradas en formato JSON
app.get('/personas', (req, res) => {
  res.json(personas);
});

const PUERTO = 8087;
app.listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
