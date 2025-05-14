const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// toma los archivos de la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// entrega el HTML con los filtros
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// mantiene esta ruta para pruebas con datos en memoria 
let datos = {
  numeros: [53, 2, 18, 15, 3, 75],
  palabras: ['té', 'pescar', 'html', 'cuando', 'terracota'],
  usuarios: [
    { nombre: 'Ambar', activo: true },
    { nombre: 'Nicolás', activo: false },
    { nombre: 'Cristian', activo: true },
    { nombre: 'Luis', activo: false }
  ]
};

app.get('/datos', (req, res) => {
  res.json(datos);
});

const PUERTO = 8087;
app.listen(PUERTO, () => console.log(`Servidor activo en http://localhost:${PUERTO}`));
