// espera a que el contenido se cargue
document.addEventListener('DOMContentLoaded', () => {
  
  // toma referencias al formulario
  const form = document.getElementById('registroForm');
  const lista = document.getElementById('lista');
  const msgOk = document.getElementById('msgExito');
  const msgError = document.getElementById('msgError');

  // toma los campos del formulario y los guarda en un objeto
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

  // envía del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    // oculta los mensajes de éxito y error
    msgOk.style.display = 'none';
    msgError.style.display = 'none';

    // crea un objeto con los datos del formulario
    const datos = {};
    for (let key in campos) {
      datos[key] = campos[key].value.trim(); 
    }

    try {
      // envía los datos al servidor 
      const res = await fetch('/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      // tira error si la respuesta no esta bien
      if (!res.ok) throw new Error();

      // convierte la respuesta en un objeto
      const persona = await res.json();

      // crea una lista con el nombre completo de la persona 
      const li = document.createElement('li');
      li.textContent = `${persona.nombre} ${persona.apellido}`;
      lista.appendChild(li);

      // limpia el formulario y muestra el mensaje de éxito
      form.reset();
      campos.nombre.focus();
      msgOk.style.display = 'block';

    } catch (err) {
      // si hay error muestra el mensaje
      msgError.style.display = 'block';
    }
  });

  // cuando carga la pagina muestra las personas ya registradas
  fetch('/personas')
    .then(r => r.json()) 
    .then(data => {
      // cada registro crea un esopacio en la lista
      data.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.nombre} ${p.apellido}`;
        lista.appendChild(li);
      });
    });
});
