// servidor/public/connectbbdd.js
import mysql from 'mysql2/promise';

export let conexion = null;

export async function conectarBD() {
  // credenciales default XAMPP — cambialas si tu root tiene contraseña
  const configConDB = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'usuarios'
  };

  try {
    // Intento de conexión tal como pediste (con database: 'usuarios')
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'usuarios'
    });

    // Asegurar que la tabla exista
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        direccion VARCHAR(255),
        telefono VARCHAR(50),
        celular VARCHAR(50),
        fecha_nacimiento DATE,
        email VARCHAR(150) UNIQUE,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    conexion = connection;
    console.log('Conexión establecida a la base de datos "usuarios" y tabla asegurada.');
    return conexion;
  } catch (err) {
    console.error('Error al conectar directamente con database "usuarios":', err?.code || err);

    // Si la base no existe, crearla y reconectar
    // ER_BAD_DB_ERROR (1049) es el código cuando la DB no existe
    if (err?.code === 'ER_BAD_DB_ERROR' || err?.errno === 1049) {
      try {
        // Conectar sin especificar DB para crearla
        const tempConn = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: ''
        });

        // Crear la base de datos
        await tempConn.execute(`CREATE DATABASE IF NOT EXISTS \`usuarios\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
        // Seleccionar la DB recién creada
        await tempConn.changeUser({ database: 'usuarios' });

        // Crear la tabla si no existe
        await tempConn.execute(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR(100) NOT NULL,
            direccion VARCHAR(255),
            telefono VARCHAR(50),
            celular VARCHAR(50),
            fecha_nacimiento DATE,
            email VARCHAR(150) UNIQUE,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        await tempConn.end();

        // Volver a intentar conectar especificando la DB
        const connection2 = await mysql.createConnection(configConDB);
        conexion = connection2;
        console.log('Base de datos "usuarios" creada y conexión establecida correctamente.');
        return conexion;
      } catch (err2) {
        console.error('Error creando la base de datos o reconectando:', err2);
        throw err2;
      }
    }

    // Otros errores — relanzar
    throw err;
  }
}
