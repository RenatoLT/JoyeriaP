import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    problema: '',
    duda: '',
  });

  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');


  const validarRut = (rut) => {
    rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (!/^(\d{7,8})([0-9K])$/.test(rut)) return false;
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    let suma = 0, multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    let dvEsperado = 11 - (suma % 11);
    dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvEsperado;
  };

  const validarCorreo = (email) => {
    const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    return regex.test(email.trim());
  };

  const validarTelefono = (telefono) => {
    const regex = /^[+]\d{9,12}$/;
    return regex.test(telefono.trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valido = true;
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'Este campo es obligatorio';
      valido = false;
    }
    if (!validarRut(formData.rut)) {
      nuevosErrores.rut = 'RUT inválido';
      valido = false;
    }
    if (!validarCorreo(formData.correo)) {
      nuevosErrores.correo = 'Correo inválido';
      valido = false;
    }
    if (!validarTelefono(formData.telefono)) {
      nuevosErrores.telefono = 'Teléfono inválido (+XXXXXXXXXXX)';
      valido = false;
    }
    if (!formData.problema) {
      nuevosErrores.problema = 'Seleccione un tipo de problema';
      valido = false;
    }
    if (!formData.duda.trim()) {
      nuevosErrores.duda = 'Este campo es obligatorio';
      valido = false;
    }

    setErrors(nuevosErrores);

    if (valido) {
      // Guardar el reclamo en localStorage
      const reclamos = JSON.parse(localStorage.getItem('reclamos')) || [];
      reclamos.push({ ...formData, fecha: new Date().toISOString() });
      localStorage.setItem('reclamos', JSON.stringify(reclamos));


      setMensajeExito('Tu reclamo ha sido enviado correctamente ✅');


      setFormData({
        nombre: '',
        rut: '',
        correo: '',
        telefono: '',
        problema: '',
        duda: '',
      });
    }
  };

  return (
    <section className="ubicacion py-5">
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 500 }}>
        {mensajeExito && (
          <div className="alert alert-success text-center">{mensajeExito}</div>
        )}

        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="rut" className="form-label">RUT</label>
          <input
            type="text"
            className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
            id="rut"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
          />
          {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo electrónico</label>
          <input
            type="text"
            className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
          />
          {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Número de teléfono</label>
          <input
            type="tel"
            className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
          {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="problema" className="form-label">Tipo de problema</label>
          <select
            className={`form-select ${errors.problema ? 'is-invalid' : ''}`}
            id="problema"
            name="problema"
            value={formData.problema}
            onChange={handleChange}
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="reembolso">Reembolso</option>
            <option value="envio">Problemas con el envío</option>
            <option value="producto">Producto defectuoso</option>
            <option value="cambio">Cambio de producto</option>
            <option value="otro">Otro</option>
          </select>
          {errors.problema && <div className="invalid-feedback">{errors.problema}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="duda" className="form-label">Duda</label>
          <textarea
            className={`form-control ${errors.duda ? 'is-invalid' : ''}`}
            id="duda"
            name="duda"
            rows={3}
            value={formData.duda}
            onChange={handleChange}
          />
          {errors.duda && <div className="invalid-feedback">{errors.duda}</div>}
        </div>

        <button type="submit" className="btn btn-dark w-100">Enviar</button>
      </form>
    </section>
  );
}
