const contenido = document.getElementById('contenido');

    document.getElementById('agtxt').addEventListener('click', () => {
      if (!document.getElementById('titulo')) {
        const h1 = document.createElement('h1');
        h1.id = 'titulo';
        h1.textContent = 'hola DOM';
        contenido.appendChild(h1);
      }
    });

    document.getElementById('catxt').addEventListener('click', () => {
        const tituloExistente = document.getElementById('titulo');
        
        if (tituloExistente) {
          tituloExistente.remove();
        }
        
        const h1 = document.createElement('h1');
        h1.textContent = 'chau DOM';
        h1.id = 'titulo';
        contenido.appendChild(h1);
    });


    document.getElementById('qutxt').addEventListener('click', () => {
      const titulo = document.getElementById('titulo');
      if (titulo) {
        titulo.remove();
      }
    });

    document.getElementById('cctxt').addEventListener('click', () => {
      const titulo = document.getElementById('titulo');
      if (titulo) {
        titulo.style.color = 'green';
      }
    });

    document.getElementById('qctxt').addEventListener('click', () => {
      const titulo = document.getElementById('titulo');
      if (titulo) {
        titulo.style.color = '';
      }
    });

    document.getElementById('agimg').addEventListener('click', () => {
      if (!document.getElementById('imagen')) {
        const img = document.createElement('img');
        img.id = 'imagen';
        img.src = 'https://s2.abcstatics.com/media/viajar/2015/12/07/chott-el-jerid--510x287.jpg'; 
        contenido.appendChild(img);
      }
    });

    document.getElementById('quimg').addEventListener('click', () => {
      const imagen = document.getElementById('imagen');
      if (imagen) {
        imagen.remove();
      }
    });

    document.getElementById('ctimg').addEventListener('click', () => {
      const imagen = document.getElementById('imagen');
      if (imagen) {
        imagen.style.width = '150px';
        imagen.style.height = 'auto';
      }
    });