import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Importación de imágenes estáticas para que Vite las empaquete correctamente
import logoImg from '../../public/imagenes/LogoNose.jpg';
import fondoImg from '../../public/imagenes/fondo.jpg';
import lomoSaltadoImg from '../../public/imagenes/lomo-saltado.jpg';
import ajiGallinaImg from '../../public/imagenes/aji-gallina.jpg';
import tallarinesVerdesImg from '../../public/imagenes/tallarines-verdes.jpg';

// Mapa para vincular las rutas de la BD con las imágenes importadas
const imageMap = {
  '/imagenes/lomo-saltado.jpg': lomoSaltadoImg,
  '/imagenes/aji-gallina.jpg': ajiGallinaImg,
  '/imagenes/tallarines-verdes.jpg': tallarinesVerdesImg,
};

const API_BASE = 'https://proyecto-pw-ziku.onrender.com/api';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return location.state?.isLoggedIn || localStorage.getItem('isLoggedIn') === 'true';
  });

  const [nombreUsuario, setNombreUsuario] = useState(() => {
    return location.state?.nombreUsuario || localStorage.getItem('nombreUsuario') || 'Usuario';
  });

  const [rolUsuario, setRolUsuario] = useState(() => {
    return location.state?.rol || localStorage.getItem('rolUsuario') || 'Alumno';
  });

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  // --- Estados para datos dinámicos del backend ---
  const [platos, setPlatos] = useState([]);
  const [platosLoading, setPlatosLoading] = useState(true);
  const [platosError, setPlatosError] = useState('');

  const [menuDia, setMenuDia] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState('');

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
    if (location.state?.isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('nombreUsuario', location.state.nombreUsuario);
      localStorage.setItem('rolUsuario', location.state.rol || 'Alumno');
      
      setIsLoggedIn(true);
      setNombreUsuario(location.state.nombreUsuario);
      setRolUsuario(location.state.rol || 'Alumno');
    }
  }, [location.state]);

  // --- Fetch de platos disponibles ---
  useEffect(() => {
    const fetchPlatos = async () => {
      setPlatosLoading(true);
      setPlatosError('');
      try {
        const res = await fetch(`${API_BASE}/platos`);
        if (!res.ok) throw new Error('Error al obtener los platos.');
        const data = await res.json();
        setPlatos(data);
      } catch (err) {
        setPlatosError(err.message || 'No se pudieron cargar los platos. Intenta más tarde.');
      } finally {
        setPlatosLoading(false);
      }
    };
    fetchPlatos();
  }, []);

  // --- Fetch del menú del día ---
  useEffect(() => {
    const fetchMenuDia = async () => {
      setMenuLoading(true);
      setMenuError('');
      try {
        const res = await fetch(`${API_BASE}/menu-dia`);
        if (res.status === 404) {
          // No hay menú definido para hoy — no es un error crítico
          setMenuDia(null);
          setMenuError('');
          return;
        }
        if (!res.ok) throw new Error('Error al obtener el menú del día.');
        const data = await res.json();
        setMenuDia(data);
      } catch (err) {
        setMenuError(err.message || 'No se pudo cargar el menú del día.');
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenuDia();
  }, []);

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    localStorage.clear(); 
    setIsLoggedIn(false);
    setNombreUsuario('Usuario');
    setRolUsuario('Alumno'); 
    navigate('/', { state: {} });
  };

  // Selecciona los primeros 3 platos que tengan imagen para la sección de destacados
  const platosDestacados = platos.filter((p) => p.imagen).slice(0, 3);

  // Helper para formatear precio
  const formatPrecio = (precio) => `S/ ${Number(precio).toFixed(2)}`;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="text-white">
        <header className="w-full border-b border-red-700 bg-red-900">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-3">
              <img 
                src={logoImg} 
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
          style={{ backgroundImage: `url(${fondoImg})` }}
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

          {/* ====== PLATOS DESTACADOS (dinámico) ====== */}
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-semibold text-gray-800">Platos Destacados</h3>
            <p className="text-gray-500 mt-3">Opciones disponibles en el comedor universitario.</p>
          </div>
          
          {platosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : platosError ? (
            <div className="text-center py-12 bg-red-50 border border-red-200 rounded-2xl">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-red-600 font-medium">{platosError}</p>
              <p className="text-red-400 text-sm mt-1">Verifica que el servidor esté activo e intenta de nuevo.</p>
            </div>
          ) : platosDestacados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platosDestacados.map((plato) => (
                <div key={plato.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
                  <div className="h-64 bg-gray-100 overflow-hidden">
                    <img 
                      src={imageMap[plato.imagen] || (import.meta.env.BASE_URL + (plato.imagen || '').replace(/^\//, ''))} 
                      alt={plato.nombre} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">Sin imagen</div>';
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-xl font-semibold text-gray-800">{plato.nombre}</h4>
                    <p className="mt-2 text-gray-600 text-sm leading-relaxed">{plato.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-2xl">
              <p className="text-gray-500">No hay platos destacados disponibles en este momento.</p>
            </div>
          )}

          {/* ====== MENÚ DEL DÍA (dinámico) ====== */}
          <div className="mt-20 bg-gray-100 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Menú del Día</h3>

            {menuLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3 flex flex-col items-center">
                    <div className="h-5 bg-gray-300 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                  </div>
                ))}
              </div>
            ) : menuError ? (
              <div className="text-center py-6">
                <p className="text-red-500 font-medium">{menuError}</p>
                <p className="text-gray-400 text-sm mt-1">No se pudo conectar con el servidor.</p>
              </div>
            ) : menuDia ? (
              <>
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
                <p className="text-center mt-6 text-lg font-bold text-gray-800">
                  Precio del menú: {formatPrecio(menuDia.precio)}
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No hay menú definido para el día de hoy.</p>
                <p className="text-gray-400 text-sm mt-1">Vuelve a consultar más tarde.</p>
              </div>
            )}
          </div>

          {/* ====== PLATOS DE CARTA (dinámico) ====== */}
          <div className="mt-16">
            <h3 className="text-3xl font-semibold text-gray-800 text-center mb-10">Platos de Carta</h3>

            {platosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse flex flex-col space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-7 bg-gray-200 rounded w-1/3 mt-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mt-3"></div>
                  </div>
                ))}
              </div>
            ) : platosError ? (
              <div className="text-center py-12 bg-red-50 border border-red-200 rounded-2xl">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-red-600 font-medium">{platosError}</p>
                <p className="text-red-400 text-sm mt-1">Verifica que el servidor esté activo e intenta de nuevo.</p>
              </div>
            ) : platos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platos.map((plato) => (
                  <div key={plato.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col">
                    <h4 className="text-xl font-semibold text-red-800">{plato.nombre}</h4>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed grow">{plato.descripcion}</p>
                    <p className="mt-4 text-2xl font-bold text-gray-800">{formatPrecio(plato.precio)}</p>
                    <button 
                      onClick={() => navigate('/reservar')} 
                      className="mt-5 w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded-lg font-medium transition cursor-pointer"
                    >
                      Ordenar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-2xl">
                <p className="text-gray-500">No hay platos de carta disponibles en este momento.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}