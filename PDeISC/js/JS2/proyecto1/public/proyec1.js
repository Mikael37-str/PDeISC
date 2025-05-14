document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const lista = document.getElementById('lista');
  
    const campos = {
      fruta: document.getElementById('fruta'),
      amigo: document.getElementById('amigo'),
      nummay: document.getElementById('nummay'),
    };
  
    const frutas = [];
    const amigos = [];
    const numeros = [];
  
    let ultimoNumero = null;
  
    form.addEventListener('submit', (e) => {
        e.preventDefault();
      
        const fruta = campos.fruta.value.trim();
        const amigo = campos.amigo.value.trim();
        const numero = parseInt(campos.nummay.value.trim());
      
        if (!fruta || !amigo || isNaN(numero)) {
          alert("Completa todos los campos correctamente.");
          return;
        }
      
        if (ultimoNumero !== null && numero <= ultimoNumero) {
          alert("El número debe ser mayor que el anterior.");
          return;
        }
      
        frutas.push(fruta);
        amigos.push(amigo);
        numeros.push(numero);
        ultimoNumero = numero;
      
        const li = document.createElement('li');
        li.textContent = `Fruta: ${fruta}, Amigo: ${amigo}, Número: ${numero}`;
        lista.appendChild(li);
      
        form.reset();
        campos.fruta.focus();
      });
      
  
    form.reset();
    campos.fruta.focus();
    // muestra los arrays cuando se hace clic en el botón
    const botonMostrar = document.getElementById('mostrarBtn');

    const ulFrutas = document.getElementById('frutazas');
    const ulAmigos = document.getElementById('amigazos');
    const ulNumeros = document.getElementById('numerazos');

    form.reset();
    campos.fruta.focus();
  
    botonMostrar.addEventListener('click', () => {
      // limpia listas anteriores
      ulFrutas.innerHTML = '';
      ulAmigos.innerHTML = '';
      ulNumeros.innerHTML = '';
  
      // muestra frutas
      frutas.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        ulFrutas.appendChild(li);
      });
  
      // muestra amigos
      amigos.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a;
        ulAmigos.appendChild(li);
      });
  
      // muestra números
      numeros.forEach(n => {
        const li = document.createElement('li');
        li.textContent = n;
        ulNumeros.appendChild(li);
      });
    });
  });
  