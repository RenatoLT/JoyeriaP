document.addEventListener('DOMContentLoaded', function () {
  fetch('./datos/catalog.json')
    .then(response => response.json())
    .then(productos => {
      const contenedor = document.getElementById('catalogo');
      if (!contenedor) return;
      const row = document.createElement('div');
      row.className = 'row';
      productos.forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
          <div className="card h-100">
            <img src="${producto.foto}" className="card-img-top" alt="${producto.nombre}" />
            <div className="card-body">
              <h5 className="card-title">${'{'}producto.nombre{'}'}</h5>
              <p className="card-text">${'{'}producto.descripcion{'}'}</p>
              <p className="card-text"><b>Precio:</b> $${'{'}producto.precio.toLocaleString(){'}'}</p>
              <button className="btn btn-dark w-100">Agregar al carrito</button>
            </div>
          </div>
        `;
        row.appendChild(col);
      });
      contenedor.appendChild(row);
    })
    .catch(error => {
      document.getElementById('catalogo').innerHTML = '<p>Error al cargar el catálogo.</p>';
    });
});