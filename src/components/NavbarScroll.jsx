import React, { useEffect, useState } from 'react';

export default function NavbarScroll({ children }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`navbar fixed-top${scrolled ? ' bg-black' : ''}`}>{children}</nav>
  );
}
