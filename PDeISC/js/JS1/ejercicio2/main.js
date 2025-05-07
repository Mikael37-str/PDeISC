const express = require('express');
const path = require('path');
const app = express(); // Crea una instancia de la aplicación Express

// donde se almacenan los datos de las personas registradas
let personas = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// envía el archivo HTML al navegador
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// recibe los datos del formulario 
app.post('/enviar', (req, res) => {
  // extrae los campos de la solicitud
  const { nombre, apellido, edad, nacimiento, sexo, documento, estado, nacionalidad, telefono, email, hijos } = req.body;

  // verifica que no falte ningún campo
  if (!nombre || !apellido || !edad || !nacimiento || !sexo || !documento || !estado || !nacionalidad || !telefono || !email) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  // crea el objeto persona con sus datos
  const persona = { nombre, apellido, edad, nacimiento, sexo, documento, estado, nacionalidad, telefono, email, hijos };

  // agrega la persona 
  personas.push(persona);

  // devuelve la persona registrada como respuesta
  res.json(persona);
});

// devuelve la lista de personas
app.get('/personas', (req, res) => {
  res.json(personas);
});

const PUERTO = 8087;
app.listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
