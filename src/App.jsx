import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/login.jsx';       // 'l' minúscula según tus archivos
import Register from './pages/Register.jsx'; // 'R' mayúscula según tus archivos
import RegisterAdmin from './pages/RegisterAdmin.jsx';
import RegisterClient from './pages/RegisterClient.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta para el Inicio de Sesión */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para el Registro (Selección de Rol) */}
        <Route path="/register" element={<Register />} />

        {/* Ruta para el Registro de Administrador */}
        <Route path="/register/admin" element={<RegisterAdmin />} />

        {/* Ruta para el Registro de Cliente */}
        <Route path="/register/client" element={<RegisterClient />} />
      </Routes>
    </Router>
  );
}

export default App;