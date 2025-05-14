document.addEventListener('DOMContentLoaded', () => {
  // Navegación entre páginas
  const links = [
    { id: 'pripag', url: 'evento1.html' },
    { id: 'segpag', url: 'evento2.html' },
    { id: 'terpag', url: 'evento3.html' },
    { id: 'cuapag', url: 'evento4.html' },
    { id: 'quipag', url: 'evento5.html' }
  ];
  links.forEach(link => {
    const el = document.getElementById(link.id);
    if (el) {
      el.addEventListener('click', () => window.location.href = link.url);
    }
  });

  // Evento 1: Mostrar imagen al reproducir video
  const video = document.getElementById('miVideo');
  const imagen = document.getElementById('imagen');
  if (video && imagen) {
    video.addEventListener('play', () => {
      imagen.style.display = 'block';
    });
  }

  // Evento 2: Tecla K
  const mensaje = document.getElementById('txt');
  if (mensaje) {
    document.addEventListener('keydown', (event) => {
      if (event.key.toLowerCase() === 'k') {
        mensaje.textContent = 'Estas apretando la tecla K';
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key.toLowerCase() === 'k') {
        mensaje.textContent = 'Soltaste la tecla K';
      }
    });
  }

  // Evento 3: Cambiar fondo al hacer click solo en una zona específica
  const pagina3 = document.getElementById('p3');
  if (pagina3) {
    const colores = ['green', 'purple', 'orange', 'gray', 'pink'];
    let indice = 0;
    pagina3.addEventListener('click', () => {
      document.body.style.backgroundColor = colores[indice];
      indice = (indice + 1) % colores.length;
    });
  }

  // Evento 4: Mouse dentro y fuera de zona
  const zona = document.getElementById('zona');
  const mensajeZona = document.getElementById('mensaje');
  if (zona && mensajeZona) {
    zona.addEventListener('mousemove', () => {
      mensajeZona.textContent = 'Estás dentro de la zona';
    });
    zona.addEventListener('mouseleave', () => {
      mensajeZona.textContent = '';
    });
  }

  // Evento 5: Rueda del mouse cambia texto solo si existe el texto
  const texto = document.getElementById('texto');
  const pagina5 = document.getElementById('p5');
  if (texto && pagina5) {
    pagina5.addEventListener('wheel', (event) => {
      texto.textContent = event.deltaY > 0
        ? 'Spotify es una empresa sueca de servicios multimedia fundada en el año 2006, cuyo producto es la aplicación homónima empleada para la reproducción de música vía streaming. Su modelo de negocio es el denominado freemium.'
        : 'Instagram (comúnmente abreviado como IG o Insta) es una aplicación y red social propiedad de Meta. Creada por Kevin Systrom y Mike Krieger, fue lanzada el 6 de octubre de 2010. Ganó rápidamente popularidad, llegando a tener más de 100 millones de usuarios activos en abril de 2012 y más de 300 millones en diciembre de 2014,[2]​ Fue diseñada originalmente para iPhone y a su vez está disponible para sus hermanos iPad y iPod con el sistema iOS 3.0.2 o superior. El 3 de abril de 2012, se publicó una versión para Android[3]​ y en 2013 se lanzó la versión beta para Windows Phone y oficial para Windows 10 en 2016.';
    });
  }
});
