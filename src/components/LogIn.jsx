import { useState } from 'react';
import { useAdmin } from '../components/AdminContext';
import api from '../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';

function LogIn() {
  const { login } = useAdmin();
  const navigate = useNavigate();

  // Estados para todos los campos del formulario
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [run, setRun] = useState('');
  const [dv, setDv] = useState('');
  const [telefono, setTelefono] = useState('');

  const [msg, setMsg] = useState('');
  const [msgColor, setMsgColor] = useState('');

  // Validaciones simples
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validaciones locales
    if (!emailRegex.test(email)) {
      setMsg('Correo inválido.');
      setMsgColor('red');
      return;
    }

    if (!passwordRegex.test(password)) {
      setMsg('Contraseña débil: Mínimo 8 caracteres, mayúscula, minúscula y símbolo.');
      setMsgColor('red');
      return;
    }

    if (password !== confirmPassword) {
      setMsg('Las contraseñas no coinciden.');
      setMsgColor('red');
      return;
    }

    // 2. Preparar objeto para el Backend (Nombres exactos que espera Java)
    const usuarioNuevo = {
        nombre: nombre,
        apellido1: apellido1,
        apellido2: apellido2,
        email: email,
        password: password,
        run: run,
        dv: dv,
        telefono: parseInt(telefono) || 0, // Convertir a número
        fechaNacimiento: "2000-01-01" // Fecha por defecto (puedes agregar un input date si quieres)
    };

    try {
        // 3. Enviar al Backend (Spring Boot)
        // POST /api/v1/usuarios
        await api.post('/usuarios', usuarioNuevo);
        
        // 4. Si registra bien, intentar loguear automáticamente
        // Esta función login viene de AdminContext y debe ser la versión nueva (asíncrona)
        const loginResult = await login(email, password);
        
        if (loginResult && loginResult.success) {
            setMsg('¡Registro exitoso! Redirigiendo...');
            setMsgColor('green');
            setTimeout(() => navigate('/'), 1500);
        } else {
            setMsg('Cuenta creada, pero no se pudo iniciar sesión automáticamente. Intenta entrar manual.');
            setMsgColor('orange');
            setTimeout(() => navigate('/signin'), 2000);
        }

    } catch (error) {
        console.error("Error en registro:", error);
        // Mensaje de error si el Backend rechaza (ej: RUT duplicado)
        if (error.response && error.response.status === 400) {
             setMsg('Error: Datos inválidos o el usuario (RUT/Email) ya existe.');
        } else {
             setMsg('Error de conexión con el servidor.');
        }
        setMsgColor('red');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
              
              {/* RUT y DV en la misma fila */}
              <div className="d-flex gap-2 mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="RUT (sin puntos/guion)" 
                    value={run} 
                    onChange={e => setRun(e.target.value)} 
                    required 
                    maxLength={8}
                  />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="DV" 
                    style={{width: '70px'}} 
                    value={dv} 
                    onChange={e => setDv(e.target.value)} 
                    required 
                    maxLength={1}
                  />
              </div>

              <input 
                type="text" 
                className="form-control mb-3" 
                placeholder="Nombre" 
                value={nombre} 
                onChange={e => setNombre(e.target.value)} 
                required 
              />
              
              {/* Apellidos en la misma fila */}
              <div className="d-flex gap-2 mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Apellido Paterno" 
                    value={apellido1} 
                    onChange={e => setApellido1(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Apellido Materno" 
                    value={apellido2} 
                    onChange={e => setApellido2(e.target.value)} 
                    required 
                />
              </div>

              <input 
                type="number" 
                className="form-control mb-3" 
                placeholder="Teléfono" 
                value={telefono} 
                onChange={e => setTelefono(e.target.value)} 
                required 
              />

              <input 
                type="email" 
                className="form-control mb-3" 
                placeholder="Correo Electrónico" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              
              <input 
                type="password" 
                className="form-control mb-3" 
                placeholder="Contraseña" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              
              <input 
                type="password" 
                className="form-control mb-3" 
                placeholder="Repite Contraseña" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
              />

              <div className="text-center mb-3" style={{ color: msgColor, fontWeight: 'bold' }}>{msg}</div>

              <button type="submit" className="btn btn-dark w-100 mb-3">Registrarse</button>

              <p className="text-center">
                ¿Ya tienes una cuenta? <Link to="/signin"><b>Inicia sesión aquí</b></Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;