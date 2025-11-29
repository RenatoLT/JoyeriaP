import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../assets/css/carro.css';

function Producto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    // CAMBIO: Petición al endpoint /productos/{id}
    api.get(`/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(() => setError(true));
  }, [id]);

  const agregarAlCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    // CAMBIO: Usamos idProducto
    if (!carritoActual.includes(producto.idProducto)) {
      carritoActual.push(producto.idProducto);
      localStorage.setItem('carrito', JSON.stringify(carritoActual));
      window.dispatchEvent(new Event('storage'));
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
              src={producto.foto || "https://via.placeholder.com/400"}
              alt={producto.nombreProducto}
              className="img-fluid rounded"
              style={{ maxHeight: '450px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-md-5">
          {/* CAMBIO: Nombres de propiedades del Backend */}
          <h2 className="fw-bold mb-3">{producto.nombreProducto}</h2>
          <p className="text-muted mb-3">{producto.descripcionProducto}</p>
          <h4 className="text-dark mb-4">${producto.precio.toLocaleString()}</h4>

          <p><b>Categoría:</b> {producto.categoria?.nombreCategoria}</p>
          <p><b>Stock disponible:</b> {producto.stock}</p>
          
          {/* Nota: Las "especificaciones" no existen en la entidad Producto actual del Backend. 
              Si las necesitas, habría que agregarlas como un campo JSON o String en Java. */}

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