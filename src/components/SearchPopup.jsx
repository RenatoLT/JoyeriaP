import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Search.css';

export default function SearchPopup() {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const open = () => {
    setVisible(true);
    setTimeout(() => inputRef.current?.focus(), 350);
  };

  const close = () => setVisible(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim() !== '') {
      navigate(`/catalog?search=${encodeURIComponent(searchText)}`);
      close();
      setSearchText('');
    }
  };

  const irCategoria = (categoria) => {
    navigate(`/catalog?categoria=${categoria}`);
    close();
  };

  return (
    <>
      <button className="btn btn-outline-secondary" onClick={open}>
        <svg width={24} height={24} viewBox="0 0 24 24">
          <use xlinkHref="#search" />
        </svg>
      </button>

      {visible && (
        <div className="search-popup-overlay" onClick={close}>
          <div className="search-popup-content" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar productos..."
                ref={inputRef}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-dark w-100 mt-3">Buscar</button>
            </form>

            <div className="search-categories mt-4">
              <p className="mb-2">Ir a categoría:</p>
              <div className="d-flex gap-2 flex-wrap">
                <button type="button" className="btn btn-outline-dark" onClick={() => irCategoria('collares')}>Collares</button>
                <button type="button" className="btn btn-outline-dark" onClick={() => irCategoria('pulseras')}>Pulseras</button>
                <button type="button" className="btn btn-outline-dark" onClick={() => irCategoria('anillos')}>Anillos</button>
                <button type="button" className="btn btn-outline-dark" onClick={() => irCategoria('relojes')}>Relojes</button>
                <button type="button" className="btn btn-outline-dark" onClick={() => irCategoria('aros')}>Aros</button>
              </div>
            </div>

            <button className="btn-close-search" onClick={close}>✕</button>
          </div>
        </div>
      )}
    </>
  );
}
