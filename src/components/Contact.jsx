import { useState } from 'react';
import api from '../api/axiosConfig'; // Usamos la conexión real

function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    problema: '',
    duda: ''
  });

  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Enviando...' });

    try {
      // ENVIAR AL BACKEND (POST /api/v1/reclamos)
      await api.post('/reclamos', formData);
      
      setStatus({ type: 'success', msg: '¡Mensaje enviado con éxito! Te contactaremos pronto.' });
      // Limpiar formulario
      setFormData({
        nombre: '',
        rut: '',
        correo: '',
        telefono: '',
        problema: '',
        duda: ''
      });
    } catch (error) {
      console.error("Error al enviar reclamo:", error);
      setStatus({ type: 'error', msg: 'Hubo un error al enviar el mensaje. Verifica tus datos e intenta nuevamente.' });
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Contáctanos</h2>
      <p className="text-center mb-5 text-muted">¿Tienes alguna duda o problema con tu pedido? Escríbenos.</p>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow p-4 border-0">
            <form onSubmit={handleSubmit}>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Nombre Completo</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="nombre" 
                    placeholder="Tu nombre"
                    value={formData.nombre} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">RUT</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="rut" 
                    placeholder="12345678-9"
                    value={formData.rut} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Correo Electrónico</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="correo" 
                    placeholder="nombre@ejemplo.com"
                    value={formData.correo} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Teléfono</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="telefono" 
                    placeholder="+56 9 ..."
                    value={formData.telefono} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Asunto / Tipo de Problema</label>
                <select 
                  className="form-select" 
                  name="problema" 
                  value={formData.problema} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Selecciona una opción...</option>
                  <option value="Consulta General">Consulta General</option>
                  <option value="Reclamo de Pedido">Problema con mi Pedido</option>
                  <option value="Envío atrasado">Envío atrasado</option>
                  <option value="Garantía y Devoluciones">Garantía o Devolución</option>
                  <option value="Felicitaciones">Felicitaciones</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Mensaje / Detalle</label>
                <textarea 
                  className="form-control" 
                  name="duda" 
                  rows="5" 
                  placeholder="Cuéntanos más detalles..."
                  value={formData.duda} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>

              {/* Mensajes de estado */}
              {status.msg && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : status.type === 'error' ? 'alert-danger' : 'alert-info'} text-center`} role="alert">
                  {status.msg}
                </div>
              )}

              <button type="submit" className="btn btn-dark w-100 btn-lg text-uppercase">Enviar Mensaje</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;