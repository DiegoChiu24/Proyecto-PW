import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';

export default function PerfilCliente() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn] = useState(() => {
    return location.state?.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
  });

  const [nombreUsuario] = useState(() => {
    return location.state?.nombreUsuario || localStorage.getItem('nombreUsuario') || 'Usuario';
  });

  const [rolUsuario] = useState(() => {
    return location.state?.rol || localStorage.getItem('rolUsuario') || 'Alumno';
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header variant="red" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-red-900 mb-8">Bienvenido usuario {nombreUsuario}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Información de tu Cuenta</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Nombres Completos</p>
                <p className="text-sm font-medium text-slate-800 mt-0.5">{nombreUsuario}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Tipo de Usuario</p>
                <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-900 rounded-md mt-1">{rolUsuario}</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Estado</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-sm font-medium text-slate-800">Conectado / Verificado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">Accesos rápidos</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Gestiona las solicitudes de almuerzo enviadas al comedor universitario fácilmente.</p>
            </div>
            <div className="mt-6 space-y-3">
              <Link to="/misreservas" className="block w-full bg-[#1a2e40] hover:bg-[#111f2c] text-white text-center font-medium py-2.5 px-4 rounded-xl shadow-md text-sm">Ver Mis Reservas →</Link>
              <Link to="/" className="block w-full border border-slate-200 text-slate-650 hover:bg-slate-50 text-center font-medium py-2.5 px-4 rounded-xl text-sm">Volver a la Carta</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}