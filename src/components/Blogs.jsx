import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/datos/blogs.json')
      .then(res => res.json())
      .then(setBlogs)
      .catch(() => setError(true));
  }, []);

  if (error) return <p>Error al cargar los blogs.</p>;
  if (!blogs.length) return <p>Cargando blogs...</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Últimos Blogs</h2>

      <div className="row">
        {blogs.map(blog => (
          <div className="col-md-4 mb-4" key={blog.id}>
            <div className="card h-100 shadow-sm">

              <Link 
                to={`/blog/${blog.id}`} 
                className="text-decoration-none text-dark"
              >
                <div className="card-body">
                  <h4 className="card-title">{blog.titulo}</h4>

                  <p className="text-muted mb-2">
                    <small>Escrito por: {blog.autor}</small>
                  </p>

                  <p className="card-text" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    color: 'gray'
                  }}>
                    {blog.cuerpo}
                  </p>

                  <button className="btn btn-dark w-100 mt-3">
                    Leer más
                  </button>
                </div>

              </Link>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;
