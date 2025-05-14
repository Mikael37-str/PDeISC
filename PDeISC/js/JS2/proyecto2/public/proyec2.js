document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const resultado = document.getElementById('resultados');
  
    const selectAnimal = document.getElementById('animalSelect');
    const selectProducto = document.getElementById('productoSelect');
    const vaciarBtn = document.getElementById('vaciarBtn');
  
    const animales = ['Perro', 'Jirafa', 'Mono'];
    const productos = ['Azucar', 'Puré de tomate', 'Huevos'];
    const vaciarArray = ['Uno', 'Dos', 'Tres'];
  
    function actualizarSelect(select, array) {
      select.innerHTML = '';
      array.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = item;
        select.appendChild(option);
      });
    }
  
    function agregarResultado(texto) {
      const li = document.createElement('li');
      li.textContent = texto;
      resultado.appendChild(li);
    }
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      // elimina el animal seleccionado
      const indexAnimal = parseInt(selectAnimal.value);
      if (!isNaN(indexAnimal)) {
        const eliminado = animales.splice(indexAnimal, 1);
        agregarResultado(`Animal eliminado: ${eliminado}`);
      }
  
      // elimina el producto seleccionado
      const indexProducto = parseInt(selectProducto.value);
      if (!isNaN(indexProducto)) {
        const eliminado = productos.splice(indexProducto, 1);
        agregarResultado(`Producto eliminado: ${eliminado}`);
      }
  
      actualizarSelect(selectAnimal, animales);
      actualizarSelect(selectProducto, productos);
    });
  
    vaciarBtn.addEventListener('click', () => {
      const eliminados = [];
      while (vaciarArray.length > 0) {
        eliminados.push(vaciarArray.pop());
      }
      agregarResultado(`Array vaciado con pop(): ${eliminados.join(', ') || 'Ya estaba vacío'}`);
    });
  
    actualizarSelect(selectAnimal, animales);
    actualizarSelect(selectProducto, productos);
  });
  