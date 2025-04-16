//importamos para poder crear un servidor
import { createServer } from 'node:http';

//importamos las funciones
import { suma } from './calculo4.js';
import { resta } from './calculo4.js';
import { multipli } from './calculo4.js';
import { dividi } from './calculo4.js';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  //calculamos
  const uma = suma(5, 3);
  const restar = resta(8, 6);
  const multiplicacion = multipli(3, 11);
  const division = dividi(30, 5);

  res.end(`
    <!-- le damos el estilo a la tabla-->
    <style>
     table {
        width: 100%;
        border-collapse: collapse; /* muestra los bordes de las celdas sin epacio entre ellos*/
        margin-bottom: 20px;
        font-family: Arial, sans-serif;
        box-shadow: 15px 15px 15px black, -15px 15px 15px black; /* agregamos una sombra a la tabla*/
      }

      th, td {
        border: 1px solid #ccc;
        padding: 10px; 
        text-align: left;
      }

      th {
        background-color: #4CAF50; 
        color: white; 
        font-weight: bold; /* texto en negrita*/
      }

     

      tr:hover {
        background-color: gray; /* cuando se pasa el mous sobre la celda, la resalta*/
      }
    </style>
<!-- creamos la tabla-->
    <table>
      <thead>
        <tr>
          <th>Operacion</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>(5 + 3)</td>
          <td>${uma}</td>
        </tr>
        <tr>
          <td>(8 - 6)</td>
          <td>${restar}</td>
        </tr>
        <tr>
          <td>(3 * 11)</td>
          <td>${multiplicacion}</td>
        </tr>
        <tr>
          <td>(30 / 5)</td>
          <td>${division}</td>
        </tr>
      </tbody>
    </table>
  `);
});
// usamos el puerto 8086 para ver la pagina
server.listen(8086, '127.0.0.1', () => {
  console.log('Escuchando en 127.0.0.1:8086');
});
