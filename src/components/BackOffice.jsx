import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../assets/css/backoffice.css';

function BackOffice() {
  const { user, isAdmin, isEmpleado } = useAdmin();
  const navigate = useNavigate();

  // Estados para datos
  const [activeTab, setActiveTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Estado Formulario Producto
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    idProducto: null,
    nombreProducto: '',
    descripcionProducto: '',
    precio: 0,
    stock: 0,
    foto: '',
    categoriaId: 1
  });

  // Protección de ruta
  useEffect(() => {
    if (user && !isAdmin && !isEmpleado) {
      navigate('/');
    }
  }, [user, isAdmin, isEmpleado, navigate]);

  // Cargar datos al cambiar pestaña
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'productos') {
        const res = await api.get('/productos');
        setProductos(res.data);
      } else if (activeTab === 'usuarios') {
        const res = await api.get('/usuarios'); // Ahora funcionará con la ruta corregida en backend
        setUsuarios(res.data);
      } else if (activeTab === 'pedidos') {
        const res = await api.get('/pedidos');
        setPedidos(res.data);
      } else if (activeTab === 'reclamos') {
        const res = await api.get('/reclamos');
        setReclamos(res.data);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD PRODUCTOS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const productoData = {
        nombreProducto: currentProduct.nombreProducto,
        descripcionProducto: currentProduct.descripcionProducto,
        precio: parseInt(currentProduct.precio),
        stock: parseInt(currentProduct.stock),
        foto: currentProduct.foto,
        categoria: { idCategoria: parseInt(currentProduct.categoriaId) } // Objeto anidado
    };

    try {
        if (isEditing) {
            await api.put(`/productos/${currentProduct.idProducto}`, productoData);
            alert('¡Producto actualizado!');
        } else {
            await api.post('/productos', productoData);
            alert('¡Producto creado!');
        }
        setIsEditing(false);
        resetForm();
        loadData();
    } catch (error) {
        console.error(error);
        alert("Error al guardar. Verifica los datos.");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}`);
        loadData();
      } catch (error) {
        alert("No se puede eliminar. Probablemente tiene pedidos asociados.");
      }
    }
  };

  const editProduct = (p) => {
    setIsEditing(true);
    setCurrentProduct({
        idProducto: p.idProducto,
        nombreProducto: p.nombreProducto,
        descripcionProducto: p.descripcionProducto,
        precio: p.precio,
        stock: p.stock,
        foto: p.foto,
        categoriaId: p.categoria?.idCategoria || 1
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct({ idProducto: null, nombreProducto: '', descripcionProducto: '', precio: 0, stock: 0, foto: '', categoriaId: 1 });
  };

  // --- VISTA ---
  if (!user || (!isAdmin && !isEmpleado)) return null;

  return (
    <div className="backoffice-container container my-5">
      <h2 className="text-center mb-4">Panel de Administración</h2>
      
      <ul className="nav nav-tabs mb-4">
        {['productos', 'usuarios', 'pedidos', 'reclamos'].map(tab => (
            <li className="nav-item" key={tab}>
                <button 
                    className={`nav-link ${activeTab === tab ? 'active' : ''} text-capitalize`} 
                    onClick={() => setActiveTab(tab)}
                >{tab}</button>
            </li>
        ))}
      </ul>

      {loading && <p className="text-center">Cargando datos...</p>}

      {/* PRODUCTOS */}
      {!loading && activeTab === 'productos' && (
        <div>
          <div className="card p-4 mb-4 shadow-sm bg-light">
            <h5>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h5>
            <form onSubmit={saveProduct}>
              <div className="row g-2">
                <div className="col-md-6"><input className="form-control" name="nombreProducto" placeholder="Nombre" value={currentProduct.nombreProducto} onChange={handleInputChange} required /></div>
                <div className="col-md-6"><input className="form-control" name="foto" placeholder="URL Foto" value={currentProduct.foto} onChange={handleInputChange} /></div>
                <div className="col-12"><input className="form-control" name="descripcionProducto" placeholder="Descripción" value={currentProduct.descripcionProducto} onChange={handleInputChange} required /></div>
                <div className="col-md-4"><input type="number" className="form-control" name="precio" placeholder="Precio" value={currentProduct.precio} onChange={handleInputChange} required /></div>
                <div className="col-md-4"><input type="number" className="form-control" name="stock" placeholder="Stock" value={currentProduct.stock} onChange={handleInputChange} required /></div>
                <div className="col-md-4">
                    <select className="form-select" name="categoriaId" value={currentProduct.categoriaId} onChange={handleInputChange}>
                        <option value="1">Anillos</option>
                        <option value="2">Collares</option>
                        <option value="3">Pulseras</option>
                        <option value="4">Relojes</option>
                        <option value="5">Aros</option>
                        <option value="6">Piedras</option>
                    </select>
                </div>
              </div>
              <button type="submit" className="btn btn-success mt-3 w-100">{isEditing ? 'Actualizar' : 'Guardar'}</button>
              {isEditing && <button type="button" className="btn btn-secondary mt-2 w-100" onClick={resetForm}>Cancelar</button>}
            </form>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
                <thead className="table-dark"><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.idProducto}>
                            <td>{p.idProducto}</td>
                            <td>{p.nombreProducto}</td>
                            <td>${p.precio.toLocaleString()}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button className="btn btn-sm btn-primary me-2" onClick={() => editProduct(p)}>Editar</button>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.idProducto)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USUARIOS */}
      {!loading && activeTab === 'usuarios' && (
        <div className="table-responsive">
            <table className="table table-hover">
            <thead className="table-dark"><tr><th>ID</th><th>Nombre</th><th>Email</th><th>RUT</th><th>Teléfono</th></tr></thead>
            <tbody>
                {usuarios.map(u => (
                <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre} {u.apellido1}</td>
                    <td>{u.email}</td>
                    <td>{u.run}-{u.dv}</td>
                    <td>{u.telefono}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}

      {/* PEDIDOS */}
      {!loading && activeTab === 'pedidos' && (
        <div className="table-responsive">
            <table className="table table-hover">
            <thead className="table-dark"><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
                {pedidos.map(ped => (
                <tr key={ped.idPedido}>
                    <td>{ped.idPedido}</td>
                    <td>{ped.fechaPedido}</td>
                    {/* Ahora 'usuario' será visible gracias al cambio en Pedido.java */}
                    <td>{ped.usuario ? `${ped.usuario.nombre} ${ped.usuario.apellido1}` : 'Desconocido'}</td>
                    <td>${ped.totalPedido.toLocaleString()}</td>
                    <td><span className="badge bg-info text-dark">{ped.estadoPedido}</span></td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}

      {/* RECLAMOS */}
      {!loading && activeTab === 'reclamos' && (
        <div className="table-responsive">
            <table className="table table-hover">
            <thead className="table-dark"><tr><th>ID</th><th>Nombre</th><th>Asunto</th><th>Mensaje</th><th>Contacto</th></tr></thead>
            <tbody>
                {reclamos.map(r => (
                <tr key={r.idReclamo}>
                    <td>{r.idReclamo}</td>
                    <td>{r.nombre}</td>
                    <td>{r.problema}</td>
                    <td>{r.duda}</td>
                    <td>{r.correo}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}
    </div>
  );
}

export default BackOffice;