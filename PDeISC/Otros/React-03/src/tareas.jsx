import React, { useState } from 'react';
import './tareas.css';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');

  const agregarTarea = () => {
    if (nuevaTarea.trim() !== '') {
      setTareas([...tareas, { id: Date.now(), texto: nuevaTarea, completada: false }]);
      setNuevaTarea('');
    }
  };

  const marcarComoCompletada = (id) => {
    setTareas(tareas.map(tarea => 
      tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    ));
  };

  return (
    <div className="lista-de-tareas-container">
      <h2>Lista de Tareas</h2>
      <div className="input-container">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Añadir nueva tarea"
        />
        <button onClick={agregarTarea}>Añadir</button>
      </div>
      <ul className="tareas-lista">
        {tareas.map(tarea => (
          <li
            key={tarea.id}
            onClick={() => marcarComoCompletada(tarea.id)}
            className={tarea.completada ? 'completada' : ''}
          >
            {tarea.texto}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tareas;