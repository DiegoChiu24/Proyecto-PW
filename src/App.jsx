import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/login.jsx';
import Register from './pages/Register.jsx'; 
import RegisterAdmin from './pages/RegisterAdmin.jsx';
import RegisterClient from './pages/RegisterClient.jsx';
import MisReservas from './pages/MisReservas.jsx';
import Reservar from './pages/reservar.jsx'; 
import PerfilCliente from './pages/perfilCliente.jsx';
import PerfilAdmin from './pages/perfilAdmin.jsx';
import AdminHorarios from './pages/AdminHorarios.jsx';
import AdminBloqueos from './pages/AdminBloqueos.jsx';
import AdminReporte from './pages/AdminReporte.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/admin" element={<RegisterAdmin />} />
        <Route path="/register/client" element={<RegisterClient />} />
        <Route path="/misreservas" element={<MisReservas />} />
        <Route path="/reservar" element={<Reservar />} />
        <Route path="/perfil" element={<PerfilCliente />} />
        <Route path="/perfil/admin" element={<PerfilAdmin />} />
        <Route path="/admin/horarios" element={<AdminHorarios />} />
        <Route path="/AdminHorarios" element={<AdminHorarios />} />
        <Route path="/admin/bloqueos" element={<AdminBloqueos />} />
        <Route path="/AdminBloqueos" element={<AdminBloqueos />} />
        <Route path="/admin/reporte" element={<AdminReporte />} />
        <Route path="/AdminReporte" element={<AdminReporte />} />
      </Routes>
    </Router>
  );
}

export default App;