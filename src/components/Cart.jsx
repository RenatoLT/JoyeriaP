import { useEffect, useState } from 'react';
import '../assets/css/carro.css';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig'; 

function Cart() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(storedCart);
  }, []);

  useEffect(() => {
    if (carrito.length === 0) {
        setProductos([]);
        return;
    }

    // CAMBIO: Traemos los productos del backend y filtramos
    // (Idealmente el backend tendría un endpoint para buscar por lista de IDs, pero esto sirve por ahora)
    api.get('/productos')
      .then(res => {
        const todosLosProductos = res.data;
        // Filtramos los que están en el carrito (comparando idProducto)
        const productosEnCarrito = todosLosProductos.filter(p => carrito.includes(p.idProducto));
        // Inicializamos cantidad en 1
        setProductos(productosEnCarrito.map(p => ({ ...p, cantidad: 1 })));
      })
      .catch(err => console.error('Error al cargar productos', err));
  }, [carrito]);

  useEffect(() => {
    const totalActual = productos.reduce(
      (acc, prod) => acc + prod.precio * prod.cantidad,
      0
    );

    const subtotalSinIva = totalActual / 1.19;
    setSubtotal(subtotalSinIva);
  }, [productos]);

  const actualizarCantidad = (idProducto, cantidad) => {
    setProductos(prev =>
      prev.map(p =>
        p.idProducto === idProducto ? { ...p, cantidad: parseInt(cantidad) || 1 } : p
      )
    );
  };

  const eliminarProducto = (idProducto) => {
    const nuevoCarrito = carrito.filter(pid => pid !== idProducto);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('storage')); // Actualizar header
    setProductos(prev => prev.filter(p => p.idProducto !== idProducto));
  };

  const VALOR_ENVIO = 7290;
  const iva = subtotal * 0.19;
  const envioAplicable = subtotal < 109000 ? VALOR_ENVIO : 0;
  const totalFinal = subtotal + iva + envioAplicable;

  if (productos.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Carrito de compras</h2>
        <p>No tienes productos en el carrito.</p>
        <Link to="/catalog" className="btn btn-dark">Ir a comprar</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="primero">
        <h2>Carrito de compras</h2>
      </div>

      <p className="p11">{productos.length} producto(s) en el carrito</p>

      <div className="principal">
        <div className="primer-texto">
          <img className="col-md-1" loading="lazy" src="/images/fast-delivery-icon-free-vector.jpg" alt="envio gratis" />
          <p>Envío gratis en todas tus compras superiores a $109.000</p>
        </div>

        <div className="secundario">
          <table className="cart">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {productos.map(producto => (
                <tr key={producto.idProducto}> {/* CAMBIO: idProducto */}
                  <td className="producto">
                    <img
                      className="imagen-producto"
                      src={producto.foto || "https://via.placeholder.com/100"}
                      alt={producto.nombreProducto}
                    />
                    <div className="info-producto">
                      <p>{producto.nombreProducto}</p>
                      {/* descripcionProducto */}
                      <p className="text-muted" style={{fontSize: '0.8em'}}>{producto.descripcionProducto}</p>
                    </div>
                  </td>
                  <td className="precio">
                    ${producto.precio.toLocaleString()}
                  </td>
                  <td className="cantidad">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      defaultValue={producto.cantidad}
                      onChange={e =>
                        actualizarCantidad(producto.idProducto, e.target.value)
                      }
                    />
                  </td>
                  <td className="total">
                    ${(producto.precio * producto.cantidad).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => eliminarProducto(producto.idProducto)}
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={5} className="continuar-comprando">
                  <button
                    className="btn-continuar"
                    onClick={() => (window.location.href = '/catalog')}
                  >
                    Continuar comprando
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="segundo">
            <p className="cupon-descuento">Cupón de descuento</p>
            <input
              className="input-cupon"
              type="text"
              placeholder="Código"
            />
            <button className="btn-dcto">Añadir</button>

            <table className="finalcarro">
              <tbody>
                <tr>
                  <td>
                    <div className="finalcarro-flex">
                      <div className="tr-segundo">
                        <div>Subtotal</div>
                        <div>IVA (19%)</div>
                        <div>Envío</div>
                        <div><b>Total</b></div>
                      </div>
                      <div className="tr-tercero">
                        <div>${subtotal.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</div>
                        <div>${iva.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</div>
                        <div>${envioAplicable.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</div>
                        <div>${totalFinal.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <Link className="btn-pago" to="/checkout">Proceder al pago</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;