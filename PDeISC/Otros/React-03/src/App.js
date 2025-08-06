import hola from "./hola.jsx";
import Tarjeta from './utils.jsx';
import Contador from './contador.jsx';
import ListaDeTareas from './tareas.jsx';
import Formulario from './formulario.jsx';

function App() {
  const datosPersona = {
    nombre: 'Aaron',
    apellido: 'Marin',
    profesion: 'Peón',
    imagenUrl: 'https://img.uefa.com/imgml/TP/players/3/2024/324x324/250113392.jpg'
  };

  return (
    <div className="App">
      <header className="App-header">
        {hola()}
        <Tarjeta
          nombre={datosPersona.nombre}
          apellido={datosPersona.apellido}
          profesion={datosPersona.profesion}
          imagenUrl={datosPersona.imagenUrl}
        />
      </header>
      <Contador />
      <ListaDeTareas />
      <Formulario />
    </div>
  );
}

export default App;