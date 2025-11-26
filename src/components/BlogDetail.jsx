import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/datos/blogs.json')
      .then(res => res.json())
      .then(data => {
        const b = data.find(item => item.id === parseInt(id));
        if (!b) setError(true);
        else setBlog(b);
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) return <p className="text-center py-5">Blog no encontrado.</p>;
  if (!blog) return <p className="text-center py-5">Cargando blog...</p>;

  return (
    <div className="container my-5">

      <div className="row justify-content-center">
        
        <div className="col-md-8">

          <h1 className="fw-bold mb-3" style={{ color: "black" }}>{blog.titulo}</h1>

          <p className="text-muted">
            <b>Autor:</b> {blog.autor}
            {blog.fecha && (
              <span> — <small>{blog.fecha}</small></span>
            )}
          </p>

          <hr />

          <p className="mt-4" style={{ whiteSpace: "pre-line", textAlign: "justify" }}>
            {blog.cuerpo}
          </p>

          <div className="mt-5">
            <Link to="/blogs" className="btn btn-outline-dark w-100">
              Volver a Blogs
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default BlogDetail;
