// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const puerto = 8086;
const archivoTxt = 'contenido.txt';
const contenidoHTML = `
<html>
<head>
    <meta charset="UTF-8">
    <title>Desde TXT</title>
</head>
<body>
    <h1>Contenido.txt</h1>
    <p>El archivo de texto ya fue creado, este es su contenido.</p>
</body>
</html>`;

// crea el archivo .txt si no existe ('wx' sirve para prevenir sobrescritura)
fs.writeFile(archivoTxt, contenidoHTML, { flag: 'wx' }, (err) => {
    if (err && err.code !== 'EEXIST') {
        console.error('Error al crear el archivo:', err);
    } else if (!err) {
        console.log('Archivo creado con éxito:', archivoTxt);
    }
});

// crea el servidor HTTP
const server = http.createServer((req, res) => {
    const rutaArchivo = path.join(__dirname, archivoTxt);

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error al leer el archivo');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

// inicia el servidor
server.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
