import React, { useState } from "react";

export default function Detalles({ tareas }) {
  // estados para los filtros de la lista.
  const [filtroCompletadas, setFiltroCompletadas] = useState("all");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  return (
    <div className="container py-4">
      <h1 className="h1 mb-4 text-center">Detalles de Tareas</h1>

      <div className="p-3 border rounded mb-4 shadow-sm">
        <div className="d-flex gap-3 flex-wrap">
          <select value={filtroCompletadas} onChange={(e) => setFiltroCompletadas(e.target.value)} className="form-select w-auto">
            <option value="all">Todas</option>
            <option value="completed">Completadas</option>
            <option value="pending">Pendientes</option>
          </select>

          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="form-control w-auto" />
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="form-control w-auto" />
        </div>
      </div>

      {/* filtra las tareas en base a su estado */}
      {(() => {
        const tareasFiltradas = tareas.filter((tarea) => {
          // filtra por estado (completada, pendiente, todas)
          const coincideEstado =
            filtroCompletadas === "all"
              ? true
              : filtroCompletadas === "completed"
              ? tarea.completada
              : !tarea.completada;

          // filtra por rango de fechas
          const coincideFecha =
            (!fechaInicio || tarea.fechaCreacion >= fechaInicio) &&
            (!fechaFin || tarea.fechaCreacion <= fechaFin);

          return coincideEstado && coincideFecha;
        });

        return (
          <ul className="list-group">
            {tareasFiltradas.map((tarea) => (
              <li key={tarea.id} className="list-group-item my-2 border rounded shadow-sm">
                <h2 className="h5">{tarea.titulo}</h2>
                <p>{tarea.descripcion}</p>
                <p className="small text-muted">Fecha: {tarea.fechaCreacion}</p>
                <p className="small fw-bold">{tarea.completada ? "✅ Completada" : "⌛ Pendiente"}</p>
              </li>
            ))}
          </ul>
        );
      })()}
    </div>
  );
}