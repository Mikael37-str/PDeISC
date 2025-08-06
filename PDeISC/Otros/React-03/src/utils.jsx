import './utils.css';

const Tarjeta = ({ nombre, apellido, profesion, imagenUrl }) => {
  return (
    <div className="tarjeta">
      <img className="tarjeta-imagen" src={imagenUrl} alt={`Foto de ${nombre} ${apellido}`} />
      <div className="tarjeta-contenido">
        <h2 className="tarjeta-nombre">{nombre} {apellido}</h2>
        <p className="tarjeta-profesion">{profesion}</p>
      </div>
    </div>
  );
};

export default Tarjeta;