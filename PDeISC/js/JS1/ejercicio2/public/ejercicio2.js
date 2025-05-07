document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const lista = document.getElementById('lista');
    const msgOk = document.getElementById('msgExito');
    const msgError = document.getElementById('msgError');
  
    const campos = {
      nombre: document.getElementById('nombre'),
      apellido: document.getElementById('apellido'),
      edad: document.getElementById('edad'),
      nacimiento: document.getElementById('nacimiento'),
      sexo: document.getElementById('sexo'),
      documento: document.getElementById('documento'),
      estado: document.getElementById('estado'),
      nacionalidad: document.getElementById('nacionalidad'),
      telefono: document.getElementById('telefono'),
      email: document.getElementById('email'),
      hijos: document.getElementById('hijos')
    };
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msgOk.style.display = 'none';
      msgError.style.display = 'none';
  
      const datos = {};
      for (let key in campos) {
        datos[key] = campos[key].value.trim();
      }
  
      try {
        const res = await fetch('/enviar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
  
        if (!res.ok) throw new Error();
        const persona = await res.json();
  
        const li = document.createElement('li');
        li.textContent = `${persona.nombre} ${persona.apellido}`;
        lista.appendChild(li);
  
        form.reset();
        campos.nombre.focus();
        msgOk.style.display = 'block';
      } catch (err) {
        msgError.style.display = 'block';
      }
    });
  
    fetch('/personas')
      .then(r => r.json())
      .then(data => {
        data.forEach(p => {
          const li = document.createElement('li');
          li.textContent = `${p.nombre} ${p.apellido}`;
          lista.appendChild(li);
        });
      });
  });
  