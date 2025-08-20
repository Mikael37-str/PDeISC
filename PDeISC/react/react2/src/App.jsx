import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Inicio from "./components/inicio.jsx";
import Detalles from "./components/detalles.jsx"; 
import Formulario from "./components/formulario.jsx"; 
import "./index.css";

function App() {
  // almacena las tareas
  const [tareas, setTareas] = useState([]);

  // useEffect carga las tareas desde localStorage
  useEffect(() => {
    const almacenadas = localStorage.getItem("tareas");
    if (almacenadas) setTareas(JSON.parse(almacenadas));
  }, []);

  // useEffect guarda las tareas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  // agrega una nueva tarea
  const agregarTarea = (tarea) => {
    setTareas([
      ...tareas,
      {
        id: Date.now(),
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        completada: tarea.completada || false,
        fechaCreacion: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  // cambia el estado de una tarea
  const cambiarEstado = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  };

  // elimina una tarea
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  return (
    <Router>
      {/* Barra de navegación de la aplicación */}
      <header className="bg-primary text-white p-3 d-flex gap-3">
        <NavLink to="/" className={({ isActive }) => `nav-link text-white ${isActive ? "text-decoration-underline" : ""}`}>Inicio</NavLink>
        <NavLink to="/crear" className={({ isActive }) => `nav-link text-white ${isActive ? "text-decoration-underline" : ""}`}>Crear Tarea</NavLink>
        <NavLink to="/detalles" className={({ isActive }) => `nav-link text-white ${isActive ? "text-decoration-underline" : ""}`}>Detalles</NavLink>
      </header>

      {/* Contenedor principal para las rutas */}
      <main className="p-4 bg-light min-vh-100">
        <Routes>
          <Route path="/" element={<Inicio tareas={tareas} cambiarEstado={cambiarEstado} eliminarTarea={eliminarTarea} />} />
          <Route path="/tarea/:id" element={<Detalles tareas={tareas} />} />
          <Route path="/crear" element={<Formulario agregarTarea={agregarTarea} />} />
          <Route path="/detalles" element={<Detalles tareas={tareas} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;