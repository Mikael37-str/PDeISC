import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function BarraNav() {
  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">Gestión de Usuarios</Link>
      <ul className="nav-links">
        <li><NavLink className="nav-link" to="/usuarios">Listado</NavLink></li>
        <li><NavLink className="nav-link" to="/usuarios/crear">Agregar</NavLink></li>
      </ul>
    </nav>
  );
}