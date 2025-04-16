// importa las funciones
var http = require('http');
var dt = require('./ejercicio1md1.js');
var { suma, resta, multipli, dividi } = require('./ejercicio1md2.js');
// muestra las funciones como codigo html
const server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<p>La fecha y hora actual es: ' + dt.myDateTime() + '</p>');
  res.write('<h1>Resultados:</h1>');
  
  res.write('<p>Suma: ' + suma(5, 3) + '</p>');
  res.write('<p>Resta: ' + resta(8, 6) + '</p>');
  res.write('<p>Multiplicacion: ' + multipli(3, 11) + '</p>');
  res.write('<p>Division: ' + dividi(30, 5) + '</p>');
  res.end();
});

server.listen(3003, () => {
  console.log('Servidor corriendo en 3003');
});
