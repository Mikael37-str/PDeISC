import React, { useState } from 'react';
import './formulario.css';

const Formulario = () => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (nombre.trim() !== '') {
      setMensaje(`¡Bienvenido, ${nombre}!`);
    } else {
      setMensaje('Por favor, ingresa tu nombre.');
    }
  };

  return (
    <div className="formulario-container">
      <h2>Formulario de Bienvenida</h2>
      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingresa tu nombre"
        />
        <button type="submit">Enviar</button>
      </form>
      {mensaje && <p className="mensaje-bienvenida">{mensaje}</p>}
    </div>
  );
};

export default Formulario;