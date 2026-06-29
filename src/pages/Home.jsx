import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import DishCard from '../components/DishCard.jsx';

const platosDeCarta = [
  { id: 1, nombre: 'Lomo Saltado', precio: 'S/ 20.00', desc: 'Trozos de carne salteados con cebolla, tomate, papas fritas y arroz.' },
  { id: 2, nombre: 'Ají de Gallina', precio: 'S/ 15.00', desc: 'Pollo deshilachado en cremosa salsa de ají amarillo acompañado de arroz.' },
  { id: 3, nombre: 'Tallarines Verdes', precio: 'S/ 16.00', desc: 'Pasta en salsa de albahaca servida con bistec a la plancha.' },
  { id: 4, nombre: 'Arroz Chaufa', precio: 'S/ 15.00', desc: 'Arroz salteado al estilo oriental con pollo, huevo y cebollita china.' },
  { id: 5, nombre: 'Pollo a la Brasa', precio: 'S/ 18.00', desc: 'Cuarto de pollo acompañado de papas fritas y ensalada fresca.' },
  { id: 6, nombre: 'Seco de Res', precio: 'S/ 19.00', desc: 'Carne cocida en salsa de culantro acompañada de arroz y frejoles.' },
  { id: 7, nombre: 'Causa Limeña', precio: 'S/ 14.00', desc: 'Puré de papa amarilla relleno de pollo y mayonesa.' },
  { id: 8, nombre: 'Milanesa con Arroz', precio: 'S/ 16.00', desc: 'Milanesa de pollo crocante acompañada de arroz y ensalada.' },
  { id: 9, nombre: 'Arroz con Pollo', precio: 'S/ 16.00', desc: 'Arroz verde preparado con culantro acompañado de presa de pollo.' },
  { id: 10, fontName: 'Papa a la Huancaína', nombre: 'Papa a la Huancaína', precio: 'S/ 14.00', desc: 'Papas cocidas cubiertas con una cremosa salsa de queso y ají amarillo.' },
  { id: 11, nombre: 'Chanfainita', precio: 'S/ 15.00', desc: 'Tradicional guiso peruano acompañado de arroz blanco.' },
  { id: 12, nombre: 'Pollo Broaster', precio: 'S/ 18.00', desc: 'Pollo empanizado y crocante acompañado de papas fritas.' },
  { id: 13, nombre: 'Estofado de Pollo', precio: 'S/ 17.00', desc: 'Pollo cocido en salsa de tomate con zanahoria, arvejas y arroz.' },
  { id: 14, fontName: 'Chicharrón de Cerdo', nombre: 'Chicharrón de Cerdo', precio: 'S/ 20.00', desc: 'Trozos de cerdo fritos servidos con camote y salsa criolla.' },
  { id: 15, nombre: 'Tallarines Rojos', precio: 'S/ 15.00', desc: 'Pasta con salsa de tomate casera acompañada de pollo a la plancha.' },
  { id: 16, fontName: 'Bistec a lo Pobre', nombre: 'Bistec a lo Pobre', precio: 'S/ 19.00', desc: 'Bistec acompañado de huevo frito, plátano maduro y arroz.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header variant="red" />

      <div className="bg-red-900 text-white">
        <main className="flex flex-col items-center px-6 py-20">
          <section className="text-center max-w-3xl">
            <h2 className="text-5xl font-bold">Sistema de Reservas</h2>
            <p className="mt-6 text-lg text-red-100 leading-relaxed">
              Página de proyecto de PW, que trata de un sistema de reservas (descripción en progreso)
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
            <DishCard 
              nombre="Lomo Saltado"
              descripcion="Clásico plato peruano acompañado de papas fritas y arroz."
              imagen="/imagenes/lomo-saltado.jpg"
              variant="featured"
            />
            <DishCard 
              nombre="Ají de Gallina"
              descripcion="Pollo deshilachado en crema de ají amarillo y queso."
              imagen="/imagenes/aji-gallina.jpg"
              variant="featured"
            />
            <DishCard 
              nombre="Tallarines Verdes"
              descripcion="Pasta en salsa de albahaca con bistec a la parrilla."
              imagen="/imagenes/tallarines-verdes.jpg"
              variant="featured"
            />
          </div> 

          <div className="mt-20 bg-gray-100 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Menú del Día</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-red-800">Entrada</h4>
                <p className="text-gray-600 mt-2">Ensalada fresca o sopa criolla.</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Plato Principal</h4>
                <p className="text-gray-600 mt-2">Arroz chaufa con pollo y papas doradas.</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Bebida</h4>
                <p className="text-gray-600 mt-2">Chicha morada o limonada.</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="text-3xl font-semibold text-gray-800 text-center mb-10">Platos de Carta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platosDeCarta.map((plato) => (
                <DishCard 
                  key={plato.id}
                  nombre={plato.nombre}
                  descripcion={plato.desc}
                  precio={plato.precio}
                  variant="menu"
                  onAction={() => navigate('/reservar')}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}