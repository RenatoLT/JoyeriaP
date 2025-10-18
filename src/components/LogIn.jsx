import { useState } from 'react';
import { useAdmin } from '../components/AdminContext';
import { Link, useNavigate } from 'react-router-dom';

function LogIn() {
  const { login } = useAdmin();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [msgColor, setMsgColor] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setMsg('Correo inválido.');
      setMsgColor('red');
      return;
    }

    if (!passwordRegex.test(password)) {
      setMsg('Contraseña inválida. Debe tener mínimo 8 caracteres, incluyendo mayúscula, minúscula y un carácter especial.');
      setMsgColor('red');
      return;
    }

    if (password !== confirmPassword) {
      setMsg('Las contraseñas no coinciden.');
      setMsgColor('red');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (storedUsers.some(u => u.email === email)) {
      setMsg('El correo ya está registrado.');
      setMsgColor('red');
      return;
    }

    const newUser = { nombre, email, password };
    localStorage.setItem('usuarios', JSON.stringify([...storedUsers, newUser]));

    login(email, nombre); // loguear automáticamente
    navigate('/');

    setMsg('¡Registro exitoso!');
    setMsgColor('green');

    setNombre('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-3" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
              <input type="email" className="form-control mb-3" placeholder="Correo Electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" className="form-control mb-3" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
              <input type="password" className="form-control mb-3" placeholder="Repite Contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

              <div className="text-center mb-3" style={{ color: msgColor }}>{msg}</div>

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
