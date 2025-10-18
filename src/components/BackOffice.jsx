import { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext.jsx';
import '../assets/css/backoffice.css';

function BackOffice() {
  const { user, isAdmin, isEmpleado } = useAdmin();
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    especificaciones: {},
    responsable: user ? user.name : ''
  });
  const [activeTab, setActiveTab] = useState('productos');
  const [reclamos, setReclamos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [empleadoForm, setEmpleadoForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'empleado'
  });

  // Cargar productos desde public/catalog.json
  useEffect(() => {
    fetch('/datos/catalog.json')
      .then(res => res.json())
      .then(data => {
        const productosConStock = data.map(p => ({
          ...p,
          stock: p.stock || Math.floor(Math.random() * 20) + 3
        }));
        setProductos(productosConStock);
      })
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  // Cargar reclamos desde localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('reclamos')) || [];
    setReclamos(stored);
  }, []);

  // Cargar empleados desde localStorage
  useEffect(() => {
    const storedEmpleados = JSON.parse(localStorage.getItem('empleados')) || [];
    setEmpleados(storedEmpleados);
  }, []);

  // Actualizar responsable cuando cambie el usuario logueado
  useEffect(() => {
    setFormData(prev => ({ ...prev, responsable: user ? user.name : '' }));
  }, [user]);

  const categoriasEspecificaciones = {
    collares: ['largo', 'material', 'broche'],
    anillos: ['diametro', 'material', 'peso'],
    aros: ['peso', 'material', 'cierre'],
    pulseras: ['largo', 'material', 'broche'],
    relojes: ['diametro', 'material', 'peso', 'broche']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('especificacion-')) {
      setFormData(prev => ({
        ...prev,
        especificaciones: { 
          ...prev.especificaciones, 
          [name.replace('especificacion-', '')]: value 
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      especificaciones: { ...producto.especificaciones },
      responsable: user ? user.name : ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProducto = {
      ...formData,
      id: selectedProducto ? selectedProducto.id : Date.now()
    };

    let updatedProductos;
    if (selectedProducto) {
      updatedProductos = productos.map(p => p.id === selectedProducto.id ? newProducto : p);
    } else {
      updatedProductos = [...productos, newProducto];
    }
    setProductos(updatedProductos);

    // Guardar historial
    setHistorial(prev => [
      ...prev,
      {
        id: newProducto.id,
        nombre: newProducto.nombre,
        precio: newProducto.precio,
        stock: newProducto.stock,
        categoria: newProducto.categoria,
        responsable: user ? user.name : '',
        fecha: new Date().toLocaleString(),
        accion: selectedProducto ? 'Editar' : 'Agregar'
      }
    ]);

    // Reset formulario
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoria: '',
      especificaciones: {},
      responsable: user ? user.name : ''
    });
    setSelectedProducto(null);
  };

  const renderEspecificacionesFields = () => {
    const keys = categoriasEspecificaciones[formData.categoria] || [];
    return keys.map(key => (
      <div className="form-group" key={key}>
        <label htmlFor={`especificacion-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <input
          type="text"
          id={`especificacion-${key}`}
          name={`especificacion-${key}`}
          value={formData.especificaciones[key] || ''}
          onChange={handleInputChange}
        />
      </div>
    ));
  };

  const handleEmpleadoChange = (e) => {
    const { name, value } = e.target;
    setEmpleadoForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEmpleadoSubmit = (e) => {
    e.preventDefault();
    const newEmpleado = { ...empleadoForm, id: Date.now() };
    const updatedEmpleados = [...empleados, newEmpleado];
    setEmpleados(updatedEmpleados);
    localStorage.setItem('empleados', JSON.stringify(updatedEmpleados));

    setEmpleadoForm({
      name: '',
      email: '',
      password: '',
      role: 'empleado'
    });
  };

  return (
    <div className="backoffice-container">
      <h1>Panel de Administración</h1>

        

        <div className="tab-buttons mb-4">
        <button className={`tab-btn ${activeTab === 'productos' ? 'active' : ''}`} onClick={() => setActiveTab('productos')}>Productos</button>
        <button className={`tab-btn ${activeTab === 'reclamos' ? 'active' : ''}`} onClick={() => setActiveTab('reclamos')}>Reclamos</button>
        <button className={`tab-btn ${activeTab === 'historial' ? 'active' : ''}`} onClick={() => setActiveTab('historial')}>Historial de cambios</button>

        {isAdmin && (
            <button className={`tab-btn ${activeTab === 'empleados' ? 'active' : ''}`} onClick={() => setActiveTab('empleados')}>
            Empleados
            </button>
        )}
        </div>


      {/* --- Productos --- */}
      {activeTab === 'productos' && (
        <div className="admin-panel flex">
          <section className="form-container">
            <h2>{selectedProducto ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <form id="product-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Responsable</label>
                <input type="text" value={formData.responsable} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="product-name">Nombre del producto</label>
                <input type="text" id="product-name" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="product-description">Descripción</label>
                <textarea id="product-description" name="descripcion" rows={4} value={formData.descripcion} onChange={handleInputChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="product-price">Precio</label>
                  <input type="number" id="product-price" name="precio" value={formData.precio} onChange={handleInputChange} step="0.01" required />
                </div>
                <div className="form-group">
                  <label htmlFor="product-stock">Stock</label>
                  <input type="number" id="product-stock" name="stock" value={formData.stock} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="product-category">Categoría</label>
                <select id="product-category" name="categoria" value={formData.categoria} onChange={handleInputChange}>
                  {Object.keys(categoriasEspecificaciones).map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              {renderEspecificacionesFields()}
              <div className="form-actions">
                <button type="submit" className="btn-save">{selectedProducto ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </section>

          <section className="product-list-container">
            <h2>Productos</h2>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>${p.precio.toLocaleString('es-CL')}</td>
                    <td>{p.stock}</td>
                    <td>{p.categoria}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(p)}>Editar</button>
                      <button className="btn-delete">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}

      {/* --- Reclamos --- */}
      {activeTab === 'reclamos' && (
        <div className="reclamos-container">
          <h2>Reclamos Guardados</h2>
          {reclamos.length === 0 ? <p>No hay reclamos guardados.</p> : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Nombre</th><th>RUT</th><th>Correo</th><th>Teléfono</th><th>Problema</th><th>Duda</th><th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {reclamos.map((r,i)=>(
                  <tr key={i}>
                    <td>{r.nombre}</td><td>{r.rut}</td><td>{r.correo}</td><td>{r.telefono}</td><td>{r.problema}</td><td>{r.duda}</td><td>{r.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- Historial --- */}
      {activeTab === 'historial' && (
        <div className="historial-container">
          <h2>Historial de Cambios</h2>
          {historial.length === 0 ? <p>No hay cambios registrados.</p> : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Acción</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Categoría</th><th>Responsable</th><th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h,i)=>(
                  <tr key={i}>
                    <td>{h.accion}</td><td>{h.nombre}</td><td>${h.precio.toLocaleString('es-CL')}</td><td>{h.stock}</td><td>{h.categoria}</td><td>{h.responsable}</td><td>{h.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- Empleados (solo admin) --- */}
            {activeTab === 'empleados' && isAdmin && (
            <div className="empleados-container">
                <h2>Gestión de Empleados</h2>
          <form onSubmit={handleEmpleadoSubmit} className="empleado-form">
            <input type="text" name="name" value={empleadoForm.name} placeholder="Nombre" onChange={handleEmpleadoChange} required />
            <input type="email" name="email" value={empleadoForm.email} placeholder="Correo" onChange={handleEmpleadoChange} required />
            <input type="password" name="password" value={empleadoForm.password} placeholder="Contraseña" onChange={handleEmpleadoChange} required />
            <select name="role" value={empleadoForm.role} onChange={handleEmpleadoChange}>
              <option value="empleado">Empleado</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn-save">Crear Empleado</button>
          </form>

          <h3>Lista de Empleados</h3>
          <table className="product-table">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Rol</th></tr>
            </thead>
            <tbody>
              {empleados.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
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
