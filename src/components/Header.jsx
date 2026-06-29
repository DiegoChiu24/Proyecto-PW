import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header({ backLink, backText, variant = 'red' }) {
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

  useEffect(() => {
    if (location.state?.isLoggedIn) {
      setIsLoggedIn(true);
      setNombreUsuario(location.state.nombreUsuario);
      setRolUsuario(location.state.rol || 'Alumno');
    }
  }, [location.state]);

  const handleCerrarSesion = () => {
    setMenuAbierto(false);
    localStorage.clear();
    setIsLoggedIn(false);
    setNombreUsuario('Usuario');
    setRolUsuario('Alumno');
    navigate('/', { state: {} });
  };

  const isRed = variant === 'red';

  return (
    <div className={isRed ? "bg-red-900 text-white" : "bg-white border-b border-gray-200"}>
      <header className={`w-full ${isRed ? "border-b border-red-700" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-3">
            <img
              src="/imagenes/LogoNose.jpg"
              alt="Logo Universidad del NOSE"
              className="w-16 h-16 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className={!isRed ? "text-red-900 font-black" : ""}>Universidad del NOSE</span>
          </h1>

          <div className="flex gap-4">
            {backLink ? (
              <Link
                to={backLink}
                className={`text-sm font-medium border px-4 py-1.5 rounded-md transition flex items-center ${
                  isRed
                    ? "border-white text-white hover:bg-white hover:text-red-900"
                    : "border-red-900 text-red-900 hover:bg-red-50"
                }`}
              >
                {backText || "← Volver"}
              </Link>
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setMenuAbierto(!menuAbierto)}
                  className={`flex items-center gap-3 border px-4 py-1.5 rounded-md transition outline-none cursor-pointer select-none ${
                    isRed
                      ? "bg-red-800 border-red-700 hover:bg-red-750 text-white"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-750"
                  }`}
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
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-750 hover:bg-gray-100 font-medium transition-colors"
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
                <Link
                  to="/login"
                  className={`font-medium flex items-center transition ${
                    isRed ? "text-white hover:text-red-200" : "text-red-900 hover:text-red-700"
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className={`border px-4 py-1 rounded-md transition flex items-center justify-center ${
                    isRed
                      ? "border-white text-white hover:bg-white hover:text-red-900"
                      : "border-red-900 text-red-900 hover:bg-red-50"
                  }`}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
