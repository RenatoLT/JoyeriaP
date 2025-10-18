import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../assets/css/carro.css'; // Usa tu CSS o agrega clases nuevas

function Producto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    fetch('/datos/catalog.json')
      .then(res => res.json())
      .then(data => {
        const p = data.find(item => item.id === parseInt(id));
        if (!p) setError(true);
        else setProducto(p);
      })
      .catch(() => setError(true));
  }, [id]);

  const agregarAlCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    if (!carritoActual.includes(producto.id)) {
      carritoActual.push(producto.id);
      localStorage.setItem('carrito', JSON.stringify(carritoActual));
    }
    setMensajeExito('Producto agregado al carrito!');
    setTimeout(() => setMensajeExito(null), 3000);

  };

  if (error) return <p className="text-center py-5">Producto no encontrado.</p>;
  if (!producto) return <p className="text-center py-5">Cargando producto...</p>;

  return (
    <div className="container my-5">
      <div className="row justify-content-center align-items-start">
        {/* Imagen del producto */}
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <div className="shadow rounded p-3 bg-white">
            <img
              src={producto.foto}
              alt={producto.nombre}
              className="img-fluid rounded"
              style={{ maxHeight: '450px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-md-5">
          <h2 className="fw-bold mb-3">{producto.nombre}</h2>
          <p className="text-muted mb-3">{producto.descripcion}</p>
          <h4 className="text-dark mb-4">${producto.precio.toLocaleString()}</h4>

          <div className="mb-4">
            <h5 className="fw-semibold">Especificaciones:</h5>
            <ul className="list-unstyled ms-3">
              {Object.entries(producto.especificaciones).map(([key, value]) => (
                <li key={key} className="mb-1">
                  <b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b> {value}
                </li>
              ))}
            </ul>
          </div>

          <button
            className="btn btn-dark btn-lg w-100 mb-3"
            onClick={agregarAlCarrito}
          >
            Agregar al carrito
          </button>
          {mensajeExito && (
              <p className="text-success mt-2">{mensajeExito}</p>
            )}

          <Link to="/catalog" className="btn btn-outline-secondary w-100">
            Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Producto;
