import './index.css'
import './assets/css/vendor.css'
import './assets/css/style.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './assets/js/SmoothScroll.js';
import { AdminProvider } from './components/AdminContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <AdminProvider>
      <App />
    </AdminProvider>
  </HashRouter>
);
