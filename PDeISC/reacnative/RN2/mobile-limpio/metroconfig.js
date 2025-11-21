const { getDefaultConfig } = require('expo/metro-config');

// Obtenemos la configuración por defecto de Expo
const config = getDefaultConfig(__dirname);

// Añadimos una configuración para asegurar que el código de 'expo'
// sea transpilado para el entorno web, resolviendo el error del token ':'.
config.resolver.nodeModulesPaths = [
    // La clave es añadir 'node_modules/expo' para la transpilación
    'node_modules/expo',
    'node_modules', // Asegura que el resto de módulos sigan siendo resueltos
];

module.exports = config;