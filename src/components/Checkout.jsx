import { useState, useEffect } from 'react';
import '../assets/css/checkout.css';

function Checkout() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [activeTab, setActiveTab] = useState('tarjeta');

  const VALOR_ENVIO = 7290;

  // Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(storedCart);
  }, []);

  // Cargar productos del catálogo y filtrar por IDs en el carrito
  useEffect(() => {
    if (carrito.length === 0) return;

    fetch('/datos/catalog.json')
      .then(res => res.json())
      .then(data => {
        const productosEnCarrito = data.filter(p =>
          carrito.includes(p.id)
        );
        setProductos(productosEnCarrito);
      })
      .catch(err => console.error('Error cargando productos:', err));
  }, [carrito]);

  // Calculos
  const subtotal = productos.reduce((acc, p) => acc + p.precio, 0) / 1.19;
  const iva = subtotal * 0.19;
  const envio = subtotal > 109000 ? 0 : VALOR_ENVIO;
  const total = subtotal + iva + envio;

  return (
    <div className="checkout-container container py-5">
      <div className="row">
        {/* IZQUIERDA: Pago */}
        <div className="col-lg-6 mb-4">
          <div className="payment-box p-4 shadow-sm">
            <h3>Método de Pago</h3>
            <div className="tabs mb-3">
              <button
                className={activeTab === 'tarjeta' ? 'active' : ''}
                onClick={() => setActiveTab('tarjeta')}
              >
                Tarjeta
              </button>
              <button
                className={activeTab === 'paypal' ? 'active' : ''}
                onClick={() => setActiveTab('paypal')}
              >
                PayPal
              </button>
            </div>

            {activeTab === 'tarjeta' && (
              <form>
                <div className="form-group mb-2">
                  <label>Número de Tarjeta</label>
                  <input type="text" className="form-control" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="form-group mb-2">
                  <label>Nombre en la tarjeta</label>
                  <input type="text" className="form-control" placeholder="Juan Pérez" />
                </div>
                <div className="form-row d-flex gap-2">
                  <div className="form-group flex-fill">
                    <label>Expiración</label>
                    <input type="text" className="form-control" placeholder="MM/AA" />
                  </div>
                  <div className="form-group flex-fill">
                    <label>CVV</label>
                    <input type="text" className="form-control" placeholder="123" />
                  </div>
                </div>
                <button type="button" className="btn btn-dark mt-3 w-100">Pagar con Tarjeta</button>
              </form>
            )}

            {activeTab === 'paypal' && (
              <form>
                <div className="form-group mb-2">
                  <label>Correo PayPal</label>
                  <input type="email" className="form-control" placeholder="usuario@paypal.com" />
                </div>
                <div className="form-group mb-2">
                  <label>Contraseña PayPal</label>
                  <input type="password" className="form-control" placeholder="********" />
                </div>
                <button type="button" className="btn btn-dark mt-3 w-100">Pagar con PayPal</button>
              </form>
            )}
          </div>
        </div>

        {/* DERECHA: Resumen de compra */}
        <div className="col-lg-6 mb-4">
          <div className="cart-summary p-4 shadow-sm">
            <h3>Resumen de Compra</h3>
            {productos.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              <ul className="list-group mb-3">
                {productos.map(item => (
                  <li key={item.id} className="list-group-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img src={item.foto} alt={item.nombre} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                      <div>
                        <div>{item.nombre}</div>
                        <small className="text-muted">{item.descripcion}</small>
                      </div>
                    </div>
                    <span>${item.precio.toLocaleString('es-CL')}</span>
                  </li>
                ))}
              </ul>
            )}

            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>IVA (19%)</span>
                <span>${iva.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Envío</span>
                <span>${envio.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <strong>Total</strong>
                <strong>${total.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
