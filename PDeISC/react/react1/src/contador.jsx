import React, { useState } from 'react';
import './contador.css';

const Contador = () => {
  const [contador, setContador] = useState(0);

  const incrementar = () => {
    setContador(contador + 1);
  };

  const decrementar = () => {
    setContador(contador - 1);
  };

  return (
    <div className="contenedor-contador">
      <h2>Contador</h2>
      <p className="valor-contador">{contador}</p>
      <div className="contenedor-botones">
        <button onClick={incrementar}>Incrementar</button>
        <button onClick={decrementar}>Decrementar</button>
      </div>
    </div>
  );
};

export default Contador;