import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(false);

  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [searchText, setSearchText] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoria = params.get('categoria') || '';
    const search = params.get('search') || '';
    setCategoriaFiltro(categoria);
    setSearchText(search);
  }, [location.search]);

  // CAMBIO: Cargar desde Spring Boot
  useEffect(() => {
    api.get('/productos')
      .then(res => {
        setProductos(res.data);
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
  }, []);

  useEffect(() => {
    let filtrados = [...productos];

    if (categoriaFiltro) {
      // CAMBIO: Accedemos al nombre de la categoría dentro del objeto
      filtrados = filtrados.filter(p => 
        p.categoria?.nombreCategoria?.toLowerCase() === categoriaFiltro.toLowerCase()
      );
    }

    if (searchText) {
      // CAMBIO: Usamos 'nombreProducto'
      filtrados = filtrados.filter(p =>
        p.nombreProducto.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (precioMin) {
      filtrados = filtrados.filter(p => p.precio >= parseInt(precioMin));
    }

    if (precioMax) {
      filtrados = filtrados.filter(p => p.precio <= parseInt(precioMax));
    }

    setProductosFiltrados(filtrados);
  }, [productos, categoriaFiltro, searchText, precioMin, precioMax]);

  // CAMBIO: Recibimos idProducto
  const agregarAlCarrito = (idProducto) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    // Evitamos duplicados si solo guardamos IDs
    if (!carritoActual.includes(idProducto)) {
       carritoActual.push(idProducto);
       localStorage.setItem('carrito', JSON.stringify(carritoActual));
       // Forzamos evento de storage para actualizar el contador del header
       window.dispatchEvent(new Event('storage'));
    }
    navigate('/cart');
  };

  if (error) return <p className="text-center mt-5">Error al cargar el catálogo. Revisa que el Backend esté encendido.</p>;
  if (!productos.length) return <p className="text-center mt-5">Cargando productos...</p>;

  return (
    <div className="container my-5">
      <div className="row">
        <aside className="col-md-3 mb-4">
          <div className="card p-3">
            <h5 className="mb-3">Filtrar productos</h5>

            <div className="mb-3">
              <label htmlFor="categoria" className="form-label">Categoría</label>
              <select
                id="categoria"
                className="form-select"
                value={categoriaFiltro}
                onChange={e => setCategoriaFiltro(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="collares">Collares</option>
                <option value="pulseras">Pulseras</option>
                <option value="anillos">Anillos</option>
                <option value="aros">Aros</option>
                <option value="relojes">Relojes</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="precioMin" className="form-label">Precio mínimo</label>
              <input
                type="number"
                id="precioMin"
                className="form-control"
                placeholder={10000}
                value={precioMin}
                onChange={e => setPrecioMin(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="precioMax" className="form-label">Precio máximo</label>
              <input
                type="number"
                id="precioMax"
                className="form-control"
                placeholder={500000}
                value={precioMax}
                onChange={e => setPrecioMax(e.target.value)}
              />
            </div>

          </div>
        </aside>

        <div className="col-md-9">
          <h2 className="text-center mb-4">Catálogo de Productos</h2>
          {productosFiltrados.length === 0 ? (
            <p className="text-center">No hay productos que coincidan con los filtros.</p>
          ) : (
            <div className="row">
              {productosFiltrados.map(producto => (
                  <div className="col-md-4 mb-4" key={producto.idProducto}> {/* CAMBIO: key idProducto */}
                    <div className="card h-100 shadow-sm">
                      <Link to={`/product/${producto.idProducto}`} className="text-decoration-none text-dark">
                        <img
                          src={producto.foto || "https://via.placeholder.com/300"} // Fallback de imagen
                          className="card-img-top"
                          alt={producto.nombreProducto}
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                        <div className="card-body d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="card-title">{producto.nombreProducto}</h5>
                            <p className="card-text text-muted" style={{fontSize: '0.9rem'}}>
                                {producto.descripcionProducto.substring(0, 60)}...
                            </p>
                            <p className="card-text">
                              <b>Precio:</b> ${producto.precio.toLocaleString()}
                            </p>
                          </div>
                          <button
                            className="btn btn-dark w-100 mt-3"
                            onClick={(e) => {
                                e.preventDefault(); // Evitar navegación del Link
                                agregarAlCarrito(producto.idProducto);
                            }}
                          >
                            Agregar al carrito
                          </button>
                        </div>
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalogo;