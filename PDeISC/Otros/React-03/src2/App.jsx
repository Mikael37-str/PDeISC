import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from './pages/inicio';
import Formulario from './pages/formulario';
import Detalles from './pages/detalles';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/create" element={<Formulario />} />
          <Route path="/tareas/:id" element={<Detalles />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;