import { Link } from 'react-router-dom';

function Footer() {
    return (
    <footer id="footer" className="mt-5">
    <div className="container">
        <div className="row d-flex flex-wrap justify-content-between py-5">
        <div className="col-md-3 col-sm-6">
            <div className="footer-menu footer-menu-001">
            <div className="footer-intro mb-4">
                <Link to="/">
                    <img src="/images/logo_c.png" alt="logo" className="footer-logo img-fluid" />
                </Link>
            </div>
            <p>En Hoseki, creemos que cada joya cuenta una historia. 
                Nos especializamos en crear piezas únicas que combinan artesanía, 
                calidad y elegancia, perfectas para celebrar los momentos más importantes de la vida. 
            </p>
            <div className="social-links">
                <ul className="list-unstyled d-flex flex-wrap gap-3">
                <li>
                    <a href="#" className="text-secondary">
                    <svg width={24} height={24} viewBox="0 0 24 24">
                        <use xlinkHref="#facebook" />
                    </svg>
                    </a>
                </li>
                <li>
                    <a href="#" className="text-secondary">
                    <svg width={24} height={24} viewBox="0 0 24 24">
                        <use xlinkHref="#twitter" />
                    </svg>
                    </a>
                </li>
                <li>
                    <a href="#" className="text-secondary">
                    <svg width={24} height={24} viewBox="0 0 24 24">
                        <use xlinkHref="#youtube" />
                    </svg>
                    </a>
                </li>
                <li>
                    <a href="#" className="text-secondary">
                    <svg width={24} height={24} viewBox="0 0 24 24">
                        <use xlinkHref="#pinterest" />
                    </svg>
                    </a>
                </li>
                <li>
                    <a href="#" className="text-secondary">
                    <svg width={24} height={24} viewBox="0 0 24 24">
                        <use xlinkHref="#instagram" />
                    </svg>
                    </a>
                </li>
                </ul>
            </div>
            </div>
        </div>
        <div className="col-md-3 col-sm-6">
            <div className="footer-menu footer-menu-002">
            <h5 className="widget-title text-uppercase mb-4">Enlaces Rapidos</h5>
            <ul className="menu-list list-unstyled text-uppercase border-animation-left fs-6">
                <li className="menu-item">
                <Link to="/" className="item-anchor">inicio</Link>
                </li>
                <li className="menu-item">
                <Link to="/aboutUs" className="item-anchor">acerca de</Link>
                </li>
                <li className="menu-item">
                <Link to="/contact" className="item-anchor">Contacto</Link>
                </li>
            </ul>
            </div>
        </div>
        <div className="col-md-3 col-sm-6">
            <div className="footer-menu footer-menu-003">
            <h5 className="widget-title text-uppercase mb-4">Ayuda e Información</h5>
            <ul className="menu-list list-unstyled text-uppercase border-animation-left fs-6">
                <li className="menu-item">
                <Link to="/contact" className="item-anchor">Devoluciones y Cambios</Link>
                </li>
                <li className="menu-item">
                <Link to="/contact" className="item-anchor">Contáctenos</Link>
                </li>
                <li className="menu-item">
                <Link to="/Findus" className="item-anchor">Encuéntranos</Link>
                </li>
            </ul>
            </div>
        </div>
        <div id="contacto" className="col-md-3 col-sm-6">
            <div className="footer-menu footer-menu-004 border-animation-left">
            <h5 className="widget-title text-uppercase mb-4">Contáctenos</h5>
            <p>¿Tienes alguna pregunta o sugerencia? <a href="mailto:contact@hoseki.com" className="item-anchor">contact@hoseki.com</a></p>
            <p>¿Necesitas ayuda? <a href="tel:+569 3364 2282" className="item-anchor">+569 3364 2282</a>
            </p>
            </div>
        </div>
        </div>
    </div>
    <div className="border-top py-4">
        <div className="container">
        <div className="row">
            <div className="col-md-6 d-flex flex-wrap">
            <div className="shipping">
                <span>Enviamos con:</span>
                <img src="/images/arct-icon.png" alt="icon" className="img-fluid" />
                <img src="/images/dhl-logo.png" alt="icon" className="img-fluid" />
            </div>
            <div className="payment-option">
                <span>Opción de Pago:</span>
                <img src="/images/visa-card.png" alt="card" className="img-fluid" />
                <img src="/images/paypal-card.png" alt="card" className="img-fluid" />
                <img src="/images/master-card.png" alt="card" className="img-fluid" />
            </div>
            </div>
            <div className="col-md-6 text-end">
            <p>© Copyright 2025 Hoseki. All rights reserved.</p>
            </div>
        </div>
        </div>
    </div>
    </footer>

    );
}

export default Footer;