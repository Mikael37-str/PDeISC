const mysql = require('mysql2');
require('dotenv').config();

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mi_app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Convertir a promesas para usar async/await
const promisePool = pool.promise();

// Test de conexión
promisePool.query('SELECT 1')
  .then(() => {
    console.log('✅ Conexión a MySQL exitosa');
  })
  .catch((err) => {
    console.error('❌ Error conectando a MySQL:', err.message);
  });

module.exports = promisePool;