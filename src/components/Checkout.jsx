import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/checkout.css';
import api from '../api/axiosConfig';

function Checkout() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [activeTab, setActiveTab] = useState('tarjeta');
  
  // Nuevo estado para la dirección (El backend la necesita)
  const [direccion, setDireccion] = useState('');

  const navigate = useNavigate();
  const VALOR_ENVIO = 7290;

  // 1. Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(storedCart);
  }, []);

  // 2. Cargar productos DEL BACKEND y filtrar
  useEffect(() => {
    if (carrito.length === 0) return;

    // Usamos la API real, no el json local
    api.get('/productos')
      .then(res => {
        const todosLosProductos = res.data;
        // Filtramos los productos que están en el carrito (comparando IDs)
        const productosEnCarrito = todosLosProductos.filter(p =>
          carrito.includes(p.idProducto) // Usamos el nombre del backend: idProducto
        );
        setProductos(productosEnCarrito);
      })
      .catch(err => console.error('Error cargando productos:', err));
  }, [carrito]);

  // 3. Cálculos
  const subtotal = productos.reduce((acc, p) => acc + p.precio, 0) / 1.19;
  const iva = subtotal * 0.19;
  const envio = subtotal > 109000 ? 0 : VALOR_ENVIO;
  const total = subtotal + iva + envio;

  // 4. Lógica para Procesar el Pago
  const procesarPago = async (e) => {
    e.preventDefault(); // Evitar recarga si es un form submit

    if (!direccion.trim()) {
        alert("Por favor, ingresa una dirección de envío.");
        return;
    }

    // Convertir la lista plana de IDs [1, 1, 2] a lo que espera el backend:
    // [{idProducto: 1, cantidad: 2}, {idProducto: 2, cantidad: 1}]
    const conteoProductos = carrito.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});

    const listaProductosBackend = Object.keys(conteoProductos).map(id => ({
        idProducto: parseInt(id),
        cantidad: conteoProductos[id]
    }));

    const datosPedido = {
        direccionEnvio: direccion,
        metodoPago: activeTab === 'tarjeta' ? 'Tarjeta de Crédito' : 'PayPal',
        productos: listaProductosBackend
    };

    try {
        // Enviamos al endpoint que creamos en el PedidoController
        await api.post('/pedidos/comprar', datosPedido);
        
        alert("¡Compra realizada con éxito!");
        
        // Limpiar carrito y redirigir
        localStorage.removeItem('carrito');
        window.dispatchEvent(new Event('storage')); // Actualizar contador del header
        navigate('/'); // Volver al inicio
    } catch (error) {
        console.error(error);
        alert("Hubo un error al procesar la compra. " + (error.response?.data || ""));
    }
  };

  return (
    <div className="checkout-container container py-5">
      <div className="row">
        {/* IZQUIERDA: Datos y Pago */}
        <div className="col-lg-6 mb-4">
          
          {/* Sección de Dirección (Nueva) */}
          <div className="payment-box p-4 shadow-sm mb-4">
            <h3>Datos de Envío</h3>
            <div className="form-group mb-2">
                <label>Dirección de Entrega</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Calle, Número, Comuna" 
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                />
            </div>
          </div>

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
              <form onSubmit={procesarPago}>
                <div className="form-group mb-2">
                  <label>Número de Tarjeta</label>
                  <input type="text" className="form-control" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="form-group mb-2">
                  <label>Nombre en la tarjeta</label>
                  <input type="text" className="form-control" placeholder="Juan Pérez" required />
                </div>
                <div className="form-row d-flex gap-2">
                  <div className="form-group flex-fill">
                    <label>Expiración</label>
                    <input type="text" className="form-control" placeholder="MM/AA" required />
                  </div>
                  <div className="form-group flex-fill">
                    <label>CVV</label>
                    <input type="text" className="form-control" placeholder="123" required />
                  </div>
                </div>
                <button type="submit" className="btn btn-dark mt-3 w-100">Pagar con Tarjeta</button>
              </form>
            )}

            {activeTab === 'paypal' && (
              <form onSubmit={procesarPago}>
                <div className="form-group mb-2">
                  <label>Correo PayPal</label>
                  <input type="email" className="form-control" placeholder="usuario@paypal.com" required />
                </div>
                <div className="form-group mb-2">
                  <label>Contraseña PayPal</label>
                  <input type="password" className="form-control" placeholder="********" required />
                </div>
                <button type="submit" className="btn btn-dark mt-3 w-100">Pagar con PayPal</button>
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
                  <li key={item.idProducto} className="list-group-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <img 
                        src={item.foto || "https://via.placeholder.com/50"} 
                        alt={item.nombreProducto} 
                        style={{ width: 50, height: 50, objectFit: 'cover' }} 
                      />
                      <div>
                        {/* Usamos nombres del Backend */}
                        <div>{item.nombreProducto}</div>
                        <small className="text-muted">
                            {item.descripcionProducto ? item.descripcionProducto.substring(0, 30) : ''}...
                        </small>
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