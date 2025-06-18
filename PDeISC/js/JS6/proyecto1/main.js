const express = require('express');
const path = require('path');
const app = express();
const PUERTO = process.env.PORT || 3000;

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Define la ruta principal que envía el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia el servidor
app.listen(PUERTO, () => console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`));