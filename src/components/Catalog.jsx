import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    fetch('/datos/catalog.json')
      .then(res => res.json())
      .then(setProductos)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    let filtrados = [...productos];

    if (categoriaFiltro) {
      filtrados = filtrados.filter(p => p.categoria === categoriaFiltro);
    }

    if (searchText) {
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(searchText.toLowerCase())
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

  const agregarAlCarrito = (id) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoActual.push(id);
    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    navigate('/cart');
  };

  if (error) return <p>Error al cargar el catálogo.</p>;
  if (!productos.length) return <p>Cargando productos...</p>;

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
                placeholder={50000}
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

                  <div className="col-md-4 mb-4" key={producto.id}>
                    <div className="card h-100 shadow-sm">
                      <Link to={`/product/${producto.id}`} className="text-decoration-none text-dark">
                        <img
                          src={producto.foto}
                          className="card-img-top"
                          alt={producto.nombre}
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                        <div className="card-body d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="card-title">{producto.nombre}</h5>
                            <p className="card-text">{producto.descripcion}</p>
                            <p className="card-text">
                              <b>Precio:</b> ${producto.precio.toLocaleString()}
                            </p>
                          </div>
                          <button
                            className="btn btn-dark w-100"
                            onClick={() => agregarAlCarrito(producto.id)}
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
