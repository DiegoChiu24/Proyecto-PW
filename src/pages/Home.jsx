import React from 'react';
import { Link } from 'react-router-dom'; // Importamos la herramienta de navegación

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-red-900 text-white">
        <header className="w-full border-b border-red-700">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-wide">
              Universidad del NOSE
            </h1>
            <div className="flex gap-4">
              {/* Enlace a la página de Login */}
              <Link 
                to="/login" 
                className="text-white hover:text-red-200 transition font-medium flex items-center"
              >
                Iniciar Sesión
              </Link>
              
              {/* Enlace a la página de Registro */}
              <Link 
                to="/register" 
                className="border border-white px-4 py-1 rounded-md hover:bg-white hover:text-red-900 transition flex items-center justify-center"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </header>
        <main className="flex flex-col items-center px-6 py-20">
          <section className="text-center max-w-3xl">
            <h2 className="text-5xl font-light">
              Sistema de Reservas
            </h2>
            <p className="mt-6 text-lg text-red-100 leading-relaxed">
              Pagina de proyecto de PW, que trata de un sistema de reservas (descripcion en progreso)
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-xl shadow-lg transition font-medium">
                Reserva
              </button>
              <button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-xl shadow-lg transition font-medium">
                Mis Reservas
              </button>
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
            <h3 className="text-3xl font-semibold text-gray-800">
              Platos Destacados
            </h3>
            <p className="text-gray-500 mt-3">
              Opciones disponibles en el comedor universitario.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
              <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                Imagen 1
              </div>
              <div className="p-5">
                <h4 className="text-xl font-semibold text-gray-800">
                  Lomo Saltado
                </h4>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  Clásico plato peruano acompañado de papas fritas y arroz.
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
              <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                Imagen 2
              </div>
              <div className="p-5">
                <h4 className="text-xl font-semibold text-gray-800">
                  Ají de Gallina
                </h4>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  Pollo deshilachado en crema de ají amarillo y queso.
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
              <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                Imagen 3
              </div>
              <div className="p-5">
                <h4 className="text-xl font-semibold text-gray-800">
                  Tallarines Verdes
                </h4>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                  Pasta en salsa de albahaca con bistec a la parrilla.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-20 bg-gray-100 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Menú del Día
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-red-800">
                  Entrada
                </h4>
                <p className="text-gray-600 mt-2">
                  Ensalada fresca o sopa criolla.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">
                  Plato Principal
                </h4>
                <p className="text-gray-600 mt-2">
                  Arroz chaufa con pollo y papas doradas.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">
                  Bebida
                </h4>
                <p className="text-gray-600 mt-2">
                  Chicha morada o limonada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}