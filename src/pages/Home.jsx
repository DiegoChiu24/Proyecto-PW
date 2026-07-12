import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiFetch, { obtenerSesion, cerrarSesion } from '../api.js';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [platos, setPlatos] = useState([]);
  const [menuDia, setMenuDia] = useState(null);

  const [usuario, setUsuario] = useState(() => {
    return location.state?.usuario || obtenerSesion();
  });

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  const isLoggedIn = !!usuario;
  const nombreUsuario = usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Usuario';
  const rolUsuario = usuario?.rol || 'Alumno';

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const platosObtenidos = await apiFetch('/platos');
        setPlatos(platosObtenidos);
      } catch (err) {
        console.error("Error al cargar platos:", err);
      }

      try {
        const hoyStr = new Date().toLocaleDateString('sv'); // formato YYYY-MM-DD
        const menuObtenido = await apiFetch(`/menu-dia?fecha=${hoyStr}`);
        setMenuDia(menuObtenido);
      } catch (err) {
        console.error("Error al cargar menú del día:", err);
      }
    }
    cargarDatos();
  }, []);

  useEffect(() => {
    if (location.state?.usuario) {
      setUsuario(location.state.usuario);
    }
  }, [location.state]);

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    cerrarSesion();
    setUsuario(null);
    navigate('/', { state: {} });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="text-white">
        <header className="w-full border-b border-red-700 bg-red-900">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-3">
              <img 
                src="/imagenes/LogoNose.jpg" 
                alt="Logo Universidad del NOSE" 
                className="w-16 h-16 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span>Universidad del NOSE</span>
              </h1>
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setDarkMode((current) => !current)}
                aria-label="Alternar modo oscuro"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                {darkMode ? '☀' : '🌙'}
              </button>

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
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                      <Link 
                        to={rolUsuario === 'Admin' ? '/perfil/admin' : '/perfil'} 
                        onClick={() => setMenuAbierto(false)}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                      >
                        Mi Perfil
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
                  <Link to="/login" className="text-white hover:text-red-200 transition font-medium flex items-center gap-2">
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

        <main
          className="relative flex flex-col items-center px-6 py-20 bg-cover bg-center"
          style={{ backgroundImage: 'url("/imagenes/fondo.jpg")' }}
        >
          <div className="absolute inset-0 bg-slate-950/50"></div>
          <section className="relative text-center max-w-3xl text-white">
            <h2 className="text-5xl font-bold">Sistema de Reservas</h2>
            <p className="mt-6 text-lg leading-relaxed">
              Plataforma web para la gestión de reservas de la Universidad del NOSE. Facilita a los estudiantes reservar su almuerzo, consultar el menú del día y gestionar sus reservas de manera eficiente, todo desde la comodidad de su dispositivo móvil o computadora.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/reservar" 
                className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-xl shadow-lg transition font-medium text-center"
              >
                Reserva
              </Link>
              <Link 
                to="/misreservas" 
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-xl shadow-lg transition font-medium text-center"
              >
                Mis Reservas
              </Link>
            </div>
          </section>
          <div className="w-full max-w-5xl mt-20">
            <div className="h-1 bg-red-500 rounded-full"></div>
          </div>
        </main>
      </div>

      <section className="flex-1 w-full bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-semibold text-gray-800">Platos Destacados</h3>
            <p className="text-gray-500 mt-3">Opciones disponibles en el comedor universitario.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
              <div className="h-64 bg-gray-100 overflow-hidden">
                <img src="/imagenes/lomo-saltado.jpg" alt="Lomo Saltado" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h4 className="text-xl font-semibold text-gray-800">Lomo Saltado</h4>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">Clásico plato peruano acompañado de papas fritas y arroz.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
              <div className="h-64 bg-gray-100 overflow-hidden">
                <img src="/imagenes/aji-gallina.jpg" alt="Ají de Gallina" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h4 className="text-xl font-semibold text-gray-800">Ají de Gallina</h4>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">Pollo deshilachado en crema de ají amarillo y queso.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
              <div className="h-64 bg-gray-100 overflow-hidden">
                <img src="/imagenes/tallarines-verdes.jpg" alt="Tallarines Verdes" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h4 className="text-xl font-semibold text-gray-800">Tallarines Verdes</h4>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">Pasta en salsa de albahaca con bisteck a la parrilla.</p>
              </div>
            </div>
          </div> 

          {menuDia ? (
            <div className="mt-20 bg-gray-100 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Menú del Día</h3>
              <p className="text-center text-sm font-bold text-red-800 mb-6">Precio: S/ {Number(menuDia.precio).toFixed(2)}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h4 className="font-semibold text-red-800">Entrada</h4>
                  <p className="text-gray-600 mt-2">{menuDia.entrada}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Plato Principal</h4>
                  <p className="text-gray-600 mt-2">{menuDia.platoPrincipal}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Bebida</h4>
                  <p className="text-gray-600 mt-2">{menuDia.bebida}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-20 bg-gray-100 rounded-2xl p-8 border border-gray-200 text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Menú del Día</h3>
              <p className="text-gray-500 text-sm mt-3">No hay un menú del día registrado para hoy.</p>
            </div>
          )}

          <div className="mt-16">
            <h3 className="text-3xl font-semibold text-gray-800 text-center mb-10">Platos de Carta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platos.map((plato) => (
                <div key={plato.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col">
                  <h4 className="text-xl font-semibold text-red-800">{plato.nombre}</h4>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed grow">{plato.descripcion}</p>
                  <p className="mt-4 text-2xl font-bold text-gray-800">S/ {Number(plato.precio).toFixed(2)}</p>
                  <button 
                    onClick={() => navigate('/reservar')} 
                    className="mt-5 w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded-lg font-medium transition cursor-pointer"
                  >
                    Ordenar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}