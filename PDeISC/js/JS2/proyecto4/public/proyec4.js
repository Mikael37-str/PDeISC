document.addEventListener('DOMContentLoaded', () => {
    const resultado = document.getElementById('resultados');
  
    const selectNumero = document.getElementById('selectNumero');
    const selectMensaje = document.getElementById('selectMensaje');
    const selectCliente = document.getElementById('selectCliente');
  
    const btnQuitarNumero = document.getElementById('quitarNumeroBtn');
    const btnQuitarMensaje = document.getElementById('quitarMensajeBtn');
    const btnAtenderCliente = document.getElementById('atenderClienteBtn');
  
    const btnMostrarNumeros = document.getElementById('mostrarNumerosBtn');
    const btnMostrarMensajes = document.getElementById('mostrarMensajesBtn');
    const btnMostrarClientes = document.getElementById('mostrarClientesBtn');
  
    let numeros = [1, 5, 10, 100, 1000, 3];
    let mensajes = ['JavaScript', 'NodeJS', 'Alpha', 'Beta', 'Omega'];
    let clientes = ['Cliente 1', 'Cliente 2', 'Cliente 3', 'Cliente 4'];
  
    function agregarResultado(texto) {
      const li = document.createElement('li');
      li.textContent = texto;
      resultado.appendChild(li);
    }
  
    function actualizarSelect(select, array) {
      select.innerHTML = '';
      array.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = item;
        select.appendChild(option);
      });
    }
  
    actualizarSelect(selectNumero, numeros);
    actualizarSelect(selectMensaje, mensajes);
    actualizarSelect(selectCliente, clientes);
  
    // quita elementos
    btnQuitarNumero.addEventListener('click', () => {
      const index = parseInt(selectNumero.value);
      if (!isNaN(index)) {
        const eliminado = numeros.splice(index, 1)[0];
        agregarResultado(`Número eliminado: ${eliminado}`);
        actualizarSelect(selectNumero, numeros);
      }
    });
  
    btnQuitarMensaje.addEventListener('click', () => {
      const index = parseInt(selectMensaje.value);
      if (!isNaN(index)) {
        const eliminado = mensajes.splice(index, 1)[0];
        agregarResultado(`Mensaje eliminado: "${eliminado}"`);
        actualizarSelect(selectMensaje, mensajes);
      }
    });
  
    btnAtenderCliente.addEventListener('click', () => {
      const index = parseInt(selectCliente.value);
      if (!isNaN(index)) {
        const eliminado = clientes.splice(index, 1)[0];
        agregarResultado(`Cliente atendido: ${eliminado}`);
        actualizarSelect(selectCliente, clientes);
      }
    });
  
    // muestra arrays
    btnMostrarNumeros.addEventListener('click', () => {
      agregarResultado(`Números actuales: ${numeros.join(', ') || 'No hay'}`);
    });
  
    btnMostrarMensajes.addEventListener('click', () => {
      agregarResultado(`Mensajes actuales: ${mensajes.join(' / ') || 'No hay'}`);
    });
  
    btnMostrarClientes.addEventListener('click', () => {
      agregarResultado(`Clientes actuales: ${clientes.join(', ') || 'No hay'}`);
    });
  });
  