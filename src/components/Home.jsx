import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import ImageZoom from './ImageZoom';
import AOS from 'aos';
import api from '../api/axiosConfig';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'aos/dist/aos.css';
import '../assets/css/swiper-bundle.min.css';
import '../assets/css/home.css';

function Home() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  // Solo cargamos productos para el carrusel de tendencias
  useEffect(() => {
    api.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error cargando productos:', err));
  }, []);

  return (
    <div className="home-page">
      
      {/* SECCIÓN HERO (BANNER) */}
      <section id="billboard" className="bg-light py-5">
        <div className="container">
          <h1 className="section-title text-center mt-4 mb-3" data-aos="fade-up">
            Tendencias
          </h1>
          <p className="text-center mb-5" data-aos="fade-up" data-aos-delay={300}>
            Lo más comprado en la tienda en los últimos meses. ¡No te los pierdas!
          </p>

          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            className="tendencias-swiper"
          >
            {/* Carrusel dinámico con datos del backend */}
            {productos.slice(0, 6).map((item) => (
              <SwiperSlide key={item.idProducto}>
                <div className="row justify-content-center">
                  <div className="col-12 col-md-8">
                    <div className="rounded overflow-hidden shadow-sm" style={{ height: '450px' }}>
                      <Link to={`/product/${item.idProducto}`}>
                        <ImageZoom
                          src={item.foto || "/images/reloj1.jpg"} 
                          alt={item.nombreProducto}
                          scale={1.15}
                          followMouse={true}
                        />
                      </Link>
                    </div>
                    <div className="text-center mt-3">
                      <h5 className="text-uppercase">{item.nombreProducto}</h5>
                      <Link
                        to={`/product/${item.idProducto}`}
                        className="btn btn-link text-uppercase text-decoration-none"
                      >
                        Descubrir Ahora
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS (Iconos) */}
      <section className="features py-5">
          <div className="container">
          <div className="row justify-content-center">
              <div className="col-md-4 text-center" data-aos="fade-in" data-aos-delay={0}>
              <div className="py-5">
                  {/* Puedes cambiar estos emojis por tus SVGs si los tienes en public */}
                  <h4 className="element-title text-capitalize my-3">📅 Reservar una cita</h4>
                  <p>Puedes reservar una cita para poder probarte las joyas, tomar medidas o asesorías.</p>
              </div>
              </div>
              <div className="col-md-4 text-center" data-aos="fade-in" data-aos-delay={300}>
              <div className="py-5">
                  <h4 className="element-title text-capitalize my-3">🛍️ Retiro en Tienda</h4>
                  <p>Al hacer un encargo, puedes elegir retirar tu pedido en nuestra tienda física.</p>
              </div>
              </div>
              <div className="col-md-4 text-center" data-aos="fade-in" data-aos-delay={600}>
              <div className="py-5">
                  <h4 className="element-title text-capitalize my-3">🎁 Empaquetado especial</h4>
                  <p>Si es una ocasion especial, podemos ofrecerte un empaquetado personalizado.</p>
              </div>
              </div>
          </div>
          </div>
      </section>

      {/* SECCIÓN CATEGORÍAS (Imágenes Estáticas que ya conoces) */}
      <section className="categories overflow-hidden py-5">
          <div className="container">
            <div className="row g-4" data-aos="zoom-out">
              
              <div className="col-md-4">
                <div className="cat-item image-zoom-effect h-100 d-flex flex-column">
                  <div className="image-holder flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden">
                    <Link to="/catalog?categoria=relojes">
                      <ImageZoom 
                        loading="lazy"
                        src="/images/imagen_para_1.jpg" 
                        alt="Relojes" 
                        className="img-fluid" 
                        style={{ height: '300px', objectFit: 'cover', width: '100%' }}
                      />
                    </Link>
                  </div>
                  <div className="category-content text-center mt-3">
                    <div className="product-button">
                        <Link to="/catalog?categoria=relojes" className="btn btn-common text-uppercase">Relojes</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="cat-item image-zoom-effect h-100 d-flex flex-column">
                  <div className="image-holder flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden">
                    <Link to="/catalog?categoria=collares">
                      <ImageZoom 
                        loading="lazy"
                        src="/images/imagen_para_2.jpg" 
                        alt="Collares" 
                        className="img-fluid" 
                        style={{ height: '300px', objectFit: 'cover', width: '100%' }}
                      />
                    </Link>
                  </div>
                  <div className="category-content text-center mt-3">
                    <div className="product-button">
                        <Link to="/catalog?categoria=collares" className="btn btn-common text-uppercase">Collares</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="cat-item image-zoom-effect h-100 d-flex flex-column">
                  <div className="image-holder flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden">
                    <Link to="/catalog?categoria=anillos">
                      <ImageZoom 
                        loading="lazy"
                        src="/images/Imagen_tendencia_3.jpg" 
                        alt="Anillos" 
                        className="img-fluid" 
                        style={{ height: '300px', objectFit: 'cover', width: '100%' }}
                      />
                    </Link>
                  </div>
                  <div className="category-content text-center mt-3">
                    <div className="product-button">
                        <Link to="/catalog?categoria=anillos" className="btn btn-common text-uppercase">Anillos</Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
      </section>

      {/* SECCIÓN COLECCIÓN DESTACADA */}
      <section className="collection bg-light position-relative py-5">
        <div className="container">
          <div className="row">
            <div className="title-xlarge text-uppercase txt-fx domino"/>
            <div className="collection-item d-flex flex-wrap my-5">
              <div className="col-md-6 column-container">
                <div className="image-holder">
                  <img loading="lazy" src="/images/imagen_pi_1.jpg" alt="collection" className="product-image img-fluid" />
                </div>
              </div>
              <div className="col-md-6 column-container bg-white">
                <div className="collection-content p-5 m-0 m-md-5">
                  <h3 className="element-title text-uppercase">Coleccion de compromisos</h3>
                  <p>Celebra el inicio de una nueva etapa con una joya que simbolice amor eterno. Nuestra colección de anillos de compromiso combina elegancia, calidad y diseño atemporal...</p>
                  <Link to="/catalog" className="btn btn-dark text-uppercase mt-3">Ver coleccion</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PODRÍA INTERESARTE (Dinámica del Backend) */}
      <section id="related-products" className="related-products py-5 bg-light position-relative overflow-hidden">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h4 className="text-uppercase">Podría interesarte</h4>
            <Link to="/catalog" className="btn-link">Ver Todos los Productos</Link>
          </div>

          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true }}
            navigation
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            className="productos-swiper"
          >
            {/* Usamos datos reales para sugerencias */}
            {productos.slice(0, 5).map((producto) => (
              <SwiperSlide key={producto.idProducto}>
                <Link
                  to={`/product/${producto.idProducto}`}
                  className="card border-0 shadow-sm text-decoration-none text-dark"
                >
                  <div className="ratio ratio-1x1 overflow-hidden rounded-top">
                    <ImageZoom 
                        src={producto.foto || "/images/reloj1.jpg"} 
                        alt={producto.nombreProducto} 
                        scale={1.1} 
                    />
                  </div>
                  <div className="card-body text-center">
                    <h6 className="text-uppercase fw-semibold">{producto.nombreProducto}</h6>
                    <p className="text-muted mb-0">${producto.precio?.toLocaleString('es-CL')}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}

export default Home;