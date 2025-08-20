import React from "react";

export default function Inicio({ tareas, cambiarEstado, eliminarTarea }) {
  return (
    <div className="container py-4">
      <h1 className="h1 mb-4 text-center">Lista de Tareas</h1>
      
      <ul className="list-group">
        {tareas.map((tarea) => (
          <li key={tarea.id} className="list-group-item my-2 border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h5">{tarea.titulo}</h2>
                <p className="small text-muted">Creada el {tarea.fechaCreacion}</p>
              </div>
              <p className={`fw-bold m-0 ${tarea.completada ? "text-success" : "text-danger"}`}>
                {tarea.completada ? "Completada" : "Pendiente"}
              </p>
            </div>
            
            <div className="d-flex gap-2 mt-2">
              <button onClick={() => cambiarEstado(tarea.id)} className="btn btn-warning btn-sm">Cambiar estado</button>
              <button onClick={() => eliminarTarea(tarea.id)} className="btn btn-danger btn-sm">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}