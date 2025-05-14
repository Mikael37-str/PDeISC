const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// toma los archivos de "public"
app.use(express.static(path.join(__dirname, 'public')));

// pagina principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PUERTO = 8087;
app.listen(PUERTO, () => console.log(`Servidor activo en http://localhost:${PUERTO}`));
