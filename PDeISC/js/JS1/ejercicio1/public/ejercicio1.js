// espera a que el DOM cargue para ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

  // obtiene el formulario, la lista de personas y el mensaje de éxito desde el index
  const form = document.getElementById('registroForm');
  const lista = document.getElementById('lista');
  const msg = document.getElementById('msgExito');

  // declara los campos del formulario en un objeto
  const campos = {
    nombre: document.getElementById('nombre'),
    apellido: document.getElementById('apellido'),
    email: document.getElementById('email'),
    pais: document.getElementById('pais'),
  };

  // evento que se dispara al enviar el formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // previene que la página se recargue cuando se envia el formulario
    msg.style.display = 'none'; // oculta el mensaje de éxito por si estaba visible

    // obtiene los valores del formulario y elimina espacios en blanco
    const datos = {
      nombre: campos.nombre.value.trim(),
      apellido: campos.apellido.value.trim(),
      email: campos.email.value.trim(),
      pais: campos.pais.value,
    };

    try {
      // envía los datos al servidor 
      const res = await fetch('/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos) // convierte los datos a formato JSON
      });

     
      // convierte la respuesta en objeto
      const persona = await res.json();

      // crea una lista con los datos de la persona y lo muestra en pantalla
      const li = document.createElement('li');
      li.textContent = `${persona.nombre} ${persona.apellido} (${persona.pais})`;
      lista.appendChild(li);

      // limpia el formulario y muestra el mensaje de éxito
      form.reset();
      campos.nombre.focus();
      msg.style.display = 'block';

    } catch (err) {
      // si hay un error lo muestra en la consola
      console.error(err);
    }
  });

  // cuando se carga la página, da la lista de personas ya registradas en el servidor
  fetch('/personas')
    .then(r => r.json()) // convierte la respuesta en JSON
    .then(data => {
      // para cada persona recibida, crea un item en la lista 
      data.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.nombre} ${p.apellido} (${p.pais})`;
        lista.appendChild(li);
      });
    });
});
