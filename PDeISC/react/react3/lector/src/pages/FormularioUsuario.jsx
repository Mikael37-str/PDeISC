import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormularioUsuario() {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    celular: '',
    fecha_nacimiento: '',
    email: ''
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [validaciones, setValidaciones] = useState({});

  const API = '/api/usuarios';

  useEffect(() => {
    if (!esEdicion) return;
    (async () => {
      setError(null);
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) {
          const b = await res.json().catch(()=>({}));
          throw new Error(b?.error || 'No se encontró el usuario');
        }
        const data = await res.json();
        setForm({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          direccion: data.direccion || '',
          telefono: data.telefono || '',
          celular: data.celular || '',
          fecha_nacimiento: data.fecha_nacimiento || '',
          email: data.email || ''
        });
      } catch (err) {
        setError(err.message || 'Error al cargar usuario');
        console.error(err);
      }
    })();
  }, [id]);

  const cambiar = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validarFormulario = () => {
    const nuevosErrores = {};
    const hoy = new Date().toISOString().split('T')[0];

    // Validación: No números en nombre y apellido
    if (/[0-9]/.test(form.nombre)) {
      nuevosErrores.nombre = 'El nombre no puede contener números.';
    }
    if (/[0-9]/.test(form.apellido)) {
      nuevosErrores.apellido = 'El apellido no puede contener números.';
    }

    // Validación: No fecha de nacimiento futura
    if (form.fecha_nacimiento && form.fecha_nacimiento > hoy) {
      nuevosErrores.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura.';
    }

    // Validación: Email válido (simple)
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nuevosErrores.email = 'El email no es válido.';
    }
    
    // Validación: Teléfono y celular solo números
    if (form.telefono && !/^[0-9]+$/.test(form.telefono)) {
      nuevosErrores.telefono = 'El teléfono solo puede contener números.';
    }
    if (form.celular && !/^[0-9]+$/.test(form.celular)) {
      nuevosErrores.celular = 'El celular solo puede contener números.';
    }

    setValidaciones(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);

    if (!validarFormulario()) {
      setError('Por favor, corrige los errores en el formulario.');
      return;
    }
    
    setCargando(true);

    try {
      const opciones = {
        method: esEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      };
      const url = esEdicion ? `${API}/${id}` : API;
      const res = await fetch(url, opciones);
      const cuerpo = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(cuerpo?.error || 'Error en el servidor');

      setExito(esEdicion ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
      setTimeout(() => navigate('/usuarios'), 900);
    } catch (err) {
      setError(err.message || 'Error al guardar usuario');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div>
      <h3>{esEdicion ? 'Editar Usuario' : 'Crear Usuario'}</h3>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {exito && <div className="alert alert-success" role="alert">{exito}</div>}

      <form onSubmit={enviar} className="form-group-container">
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input 
            name="nombre" 
            value={form.nombre} 
            onChange={cambiar} 
            className={`form-control ${validaciones.nombre ? 'is-invalid' : ''}`} 
            required 
          />
          {validaciones.nombre && <div className="invalid-feedback">{validaciones.nombre}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Apellido</label>
          <input 
            name="apellido" 
            value={form.apellido} 
            onChange={cambiar} 
            className={`form-control ${validaciones.apellido ? 'is-invalid' : ''}`} 
            required 
          />
          {validaciones.apellido && <div className="invalid-feedback">{validaciones.apellido}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Dirección</label>
          <input name="direccion" value={form.direccion} onChange={cambiar} className="form-control" />
        </div>

        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input 
            name="telefono" 
            value={form.telefono} 
            onChange={cambiar} 
            className={`form-control ${validaciones.telefono ? 'is-invalid' : ''}`} 
          />
          {validaciones.telefono && <div className="invalid-feedback">{validaciones.telefono}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Celular</label>
          <input 
            name="celular" 
            value={form.celular} 
            onChange={cambiar} 
            className={`form-control ${validaciones.celular ? 'is-invalid' : ''}`} 
          />
          {validaciones.celular && <div className="invalid-feedback">{validaciones.celular}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={cambiar} 
            className={`form-control ${validaciones.email ? 'is-invalid' : ''}`} 
          />
          {validaciones.email && <div className="invalid-feedback">{validaciones.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de Nacimiento</label>
          <input 
            type="date" 
            name="fecha_nacimiento" 
            value={form.fecha_nacimiento} 
            onChange={cambiar} 
            className={`form-control ${validaciones.fecha_nacimiento ? 'is-invalid' : ''}`} 
            max={hoy}
          />
          {validaciones.fecha_nacimiento && <div className="invalid-feedback">{validaciones.fecha_nacimiento}</div>}
        </div>

        <div className="form-group">
          <button className="btn btn-primary btn-lg" disabled={cargando}>
            {cargando ? (esEdicion ? 'Guardando...' : 'Creando...') : (esEdicion ? 'Guardar cambios' : 'Crear usuario')}
          </button>
        </div>
      </form>
    </div>
  );
}