const bcrypt = require('bcrypt');

// Función para generar hash
async function generateHash(password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('\n✅ Hash generado exitosamente:');
    console.log('==================================');
    console.log('Contraseña:', password);
    console.log('Hash:', hash);
    console.log('==================================\n');
    console.log('Copia el hash y úsalo en tu SQL:');
    console.log(`'${hash}'`);
    console.log('\n');
  } catch (error) {
    console.error('❌ Error generando hash:', error);
  }
}

// Generar hashes para admin y test user
console.log('\n🔐 Generando hashes de contraseñas...\n');

generateHash('admin123').then(() => {
  generateHash('test123');
});

// Uso:
// node generateHash.js