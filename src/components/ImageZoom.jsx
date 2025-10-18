import React, { useRef, useState } from 'react';

/**
 * ImageZoom - zoom de imagen compatible con Swiper y Bootstrap.
 *
 * Props:
 *  - src: ruta de la imagen
 *  - alt: texto alternativo
 *  - scale: factor de zoom (por defecto 1.2)
 *  - followMouse: si true, sigue el mouse (por defecto false aquí)
 */
export default function ImageZoom({ src, alt = '', scale = 1.2, followMouse = false }) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const ref = useRef(null);

  const handleMouseMove = e => {
    if (!followMouse || !ref.current) return;

    // En Swiper, el contenedor puede tener transformaciones, por eso usamos offsetX/Y
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.nativeEvent.offsetX || 0) / rect.width) * 100;
    const y = ((e.nativeEvent.offsetY || 0) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      ref={ref}
      className="image-zoom"
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => {
        setZoomed(false);
        setOrigin('50% 50%'); // siempre regresa al centro
      }}
      onMouseMove={handleMouseMove}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 'inherit',
        cursor: 'zoom-in',
        display: 'block'
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: zoomed ? `scale(${scale})` : 'scale(1)',
          transformOrigin: followMouse ? origin : 'center center',
          transition: 'transform 0.4s ease',
          userSelect: 'none',
          display: 'block',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}