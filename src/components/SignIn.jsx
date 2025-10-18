import { useState } from 'react';
import { useAdmin } from '../components/AdminContext';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
  const { login } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [msgColor, setMsgColor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usuarios normales
    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      login(email, foundUser.nombre);
      navigate('/');
      return;
    }

    // Admin fijo
    if (email === 'admin@admin.com' && password === 'admin') {
      login(email, 'Admin', 'admin');
      navigate('/backoffice');
      return;
    }

    if (email === 'empleado@empleado.com' && password === 'empleado') {
      login(email, 'Empleado', 'empleado'); // rol 'empleado'
      navigate('/backoffice'); // accede al panel pero no ve empleados
      return;
    }

    setMsg('Correo o contraseña incorrectos.');
    setMsgColor('red');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
              <input type="email" className="form-control mb-3" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" className="form-control mb-3" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />

              <div className="text-center mb-3" style={{ color: msgColor }}>{msg}</div>

              <button type="submit" className="btn btn-dark w-100 mb-3">Iniciar sesión</button>

              <p className="text-center">
                ¿No tienes una cuenta? <Link to="/login"><b>Regístrate aquí</b></Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
