import { useState } from 'react';
import letter from '../assets/images/pattern-bg.png';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [color, setColor] = useState('');

  const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!regex.test(email.trim())) {
      setMsg('Por favor, ingresa un correo electrónico válido.');
      setColor('red');
    } else {
      setMsg('¡Correo electrónico válido!');
      setColor('green');
      setEmail('');
    }
  };

  return (
    <section className="newsletter bg-light"  style={{ backgroundImage: `url(${letter})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 py-5 my-5">
            <div className="subscribe-header text-center pb-3">
              <h3 className="section-title text-uppercase">Registrate en nuestras noticias</h3>
            </div>
            <form className="d-flex flex-wrap gap-2" onSubmit={handleSubmit}>
              <input
                type="text"
                name="email"
                placeholder="Tu dirección de correo electrónico"
                className="form-control form-control-lg"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className="btn btn-dark btn-lg text-uppercase w-100">Registrarse</button>
            </form>
            <div style={{ color, fontSize: '0.95em', marginTop: 4 }}>{msg}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
