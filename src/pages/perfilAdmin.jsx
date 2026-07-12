import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { obtenerSesion, cerrarSesion } from '../api.js';

export default function PerfilAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [usuario, setUsuario] = useState(() => location.state?.usuario || obtenerSesion());
  const [isLoggedIn, setIsLoggedIn] = useState(!!(location.state?.usuario || obtenerSesion()));
  const [nombreUsuario, setNombreUsuario] = useState(() => {
    const sesion = location.state?.usuario || obtenerSesion();
    return sesion ? `${sesion.nombres} ${sesion.apellidos}` : 'Usuario';
  });
  const [rolUsuario, setRolUsuario] = useState(() => {
    const sesion = location.state?.usuario || obtenerSesion();
    return sesion?.rol || 'Admin';
  });

  useEffect(() => {
    const sesion = obtenerSesion();
    if (!sesion || sesion.rol !== 'Admin') {
      navigate('/login');
      return;
    }
    setUsuario(sesion);
    setIsLoggedIn(true);
    setNombreUsuario(`${sesion.nombres} ${sesion.apellidos}`);
    setRolUsuario(sesion.rol || 'Admin');
  }, [navigate]);

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    cerrarSesion();
    setUsuario(null);
    setIsLoggedIn(false);
    setNombreUsuario('Usuario');
    setRolUsuario('Admin');
    navigate('/', { state: {} });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-red-900 text-white">
        <header className="w-full border-b border-red-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">
              Universidad del NOSE
            </h1>

            <div className="flex gap-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    className="flex items-center gap-3 bg-red-800 border border-red-700 px-4 py-1.5 rounded-md hover:bg-red-750 transition outline-none cursor-pointer select-none"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm font-medium tracking-wide">
                      {nombreUsuario} ({rolUsuario}) ▼
                    </span>
                  </button>

                  {menuAbierto && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50">
                      <Link
                        to="/"
                        onClick={() => setMenuAbierto(false)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                      >
                        Ir al Home
                      </Link>
                      <hr className="border-gray-150 my-1" />
                      <button
                        onClick={handleCerrarSesion}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-red-200 transition font-medium flex items-center">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="border border-white px-4 py-1 rounded-md hover:bg-white hover:text-red-900 transition flex items-center justify-center">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-12">
        <div>
          <h2 className="text-3xl font-bold text-red-900 mb-8">
            Bienvenido usuario {nombreUsuario}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                Información de tu Cuenta
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Nombres Completos</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{nombreUsuario}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Tipo de Usuario</p>
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-900 rounded-md mt-1">
                    {rolUsuario}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Estado</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium text-slate-800">Conectado / Panel de Administración</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">
                  Accesos rápidos
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Accede al sistema de solicitudes y visualiza la interacción de los alumnos con el comedor.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to="/misreservas"
                  className="block w-full bg-[#1a2e40] hover:bg-[#111f2c] text-white text-center font-medium py-2.5 px-4 rounded-xl shadow-md transition-all text-sm"
                >
                  Ver Mis Reservas →
                </Link>

                <Link
                  to="/"
                  className="block w-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-center font-medium py-2.5 px-4 rounded-xl transition-all text-sm"
                >
                  Volver a la Carta
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Paneles de Control Avanzado</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-gray-300 divide-y md:divide-y-0 md:divide-x divide-gray-300 rounded-none shadow-none">
            <div className="p-6 flex flex-col justify-between min-h-[260px] rounded-none">
              <div>
                <div className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3 rounded-none">
                  SECCIÓN 01
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 rounded-none">
                  Gestión de Bloques Horarios
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Permite configurar, modificar y añadir los rangos de horas disponibles en los que los alumnos pueden agendar el recojo de sus almuerzos.
                </p>
              </div>
              <Link
                to="/admin/horarios"
                className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 border border-slate-300 transition-colors rounded-none text-center block"
              >
                Configurar Horarios
              </Link>
            </div>

            <div className="p-6 flex flex-col justify-between min-h-[260px] rounded-none">
              <div>
                <div className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3 rounded-none">
                  SECCIÓN 02
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 rounded-none">
                  Admin: Control de Bloqueos/Inhabilitación
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Módulo restrictivo para deshabilitar fechas festivas, suspender el servicio temporalmente o bloquear usuarios que infrinjan las normas del comedor.
                </p>
              </div>
              <Link
                to="/admin/bloqueos"
                className="mt-6 w-full bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold py-2 px-4 border border-red-200 transition-colors rounded-none text-center block"
              >
                Gestionar Bloqueos
              </Link>
            </div>

            <div className="p-6 flex flex-col justify-between min-h-[260px] rounded-none">
              <div>
                <div className="inline-block text-[10px] font-bold tracking-wider text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 mb-3 rounded-none">
                  SECCIÓN 03
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 rounded-none">
                  Admin: Reporte Diario de Reservas
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Visualiza y exporta el conteo en tiempo real de los platos solicitados en el día para optimizar la preparación de insumos en la cocina.
                </p>
              </div>
              <Link
                to="/admin/reporte"
                className="mt-6 w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-4 border border-slate-950 transition-colors rounded-none text-center block"
              >
                Generar Reporte
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}