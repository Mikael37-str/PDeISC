const express = require('express');
const path = require('path');
const app = express();

let personas = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/enviar', (req, res) => {
  const { nombre, apellido, edad, nacimiento, sexo, documento, estado, nacionalidad, telefono, email, hijos } = req.body;

  if (!nombre || !apellido || !edad || !nacimiento || !sexo || !documento || !estado || !nacionalidad || !telefono || !email) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const persona = { nombre, apellido, edad, nacimiento, sexo, documento, estado, nacionalidad, telefono, email, hijos };
  personas.push(persona);
  res.json(persona);
});

app.get('/personas', (req, res) => {
  res.json(personas);
});

const PUERTO = 8087;
app.listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));
