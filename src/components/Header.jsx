import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../components/AdminContext';
import logoO from '../assets/images/logo_o.png';
import SearchPopup from './SearchPopup'

function Header() {
  const { user, isAdmin, isEmpleado, logout } = useAdmin();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('carrito')) || [];
    setCartCount(storedCart.length);
    const handleStorageChange = () => setCartCount(JSON.parse(localStorage.getItem('carrito'))?.length || 0);
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light text-uppercase fs-6 p-3 border-bottom align-items-center">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/"><img src={logoO} alt="Logo" className="navbar-logo img-fluid" /></Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menú</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-center flex-grow-1 gap-3">
            
              <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/catalog">Tienda</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/blogs">Blogs</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contacto</Link></li>

              {!user && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/signin">Iniciar sesión</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/login">Crear cuenta</Link></li>
                </>
              )}

              {(user && (isAdmin || isEmpleado || user.role === 'usuario')) && (
                <>
                  <li className="nav-item"><Link className="nav-link" to="/backoffice">Panel</Link></li>
                  <li className="nav-item"><span className="nav-link">Hola, {user.name}</span></li>
                  <li className="nav-item"><button className="nav-link" onClick={logout}>CERRAR SESION</button></li>
                </>
              )}

              <li className="nav-item"><Link className="nav-link" to="/cart">Carrito ({cartCount})</Link></li>
              <SearchPopup />
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
