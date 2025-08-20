import React, { useState } from "react";

export default function Formulario({ agregarTarea }) {
  
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");

  // maneja el envío del formulario.
  const manejarEnvio = (e) => {
    e.preventDefault();

    // validación 
    if (!titulo.trim() || !descripcion.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // llama a la función `agregarTarea`
    agregarTarea({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      completada: false
    });

    // limpia los campos del formulario y el mensaje de error.
    setTitulo("");
    setDescripcion("");
    setError("");
  };

  return (
    <div className="container py-4">
      <h1 className="h1 mb-4 text-center">Crear nueva tarea</h1>
      
      {/* formulario */}
      <form onSubmit={manejarEnvio} className="p-4 border rounded shadow-sm">
        <div className="mb-3">
          <label htmlFor="taskTitulo" className="form-label">Título</label>
          <input type="text" id="taskTitulo" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="taskDescripcion" className="form-label">Descripción</label>
          <textarea id="taskDescripcion" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="form-control"></textarea>
        </div>
        
        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-primary mt-3">Crear tarea</button>
      </form>
    </div>
  );
}