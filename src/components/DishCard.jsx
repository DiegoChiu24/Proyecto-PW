import React from 'react';

export default function DishCard({
  nombre,
  descripcion,
  precio,
  imagen,
  variant = 'menu', // 'featured' | 'menu'
  onAction
}) {
  if (variant === 'featured') {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition">
        <div className="h-64 bg-gray-100 overflow-hidden">
          <img src={imagen} alt={nombre} className="w-full h-full object-cover" />
        </div>
        <div className="p-5">
          <h4 className="text-xl font-semibold text-gray-800">{nombre}</h4>
          <p className="mt-2 text-gray-600 text-sm leading-relaxed">{descripcion}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col">
      <h4 className="text-xl font-semibold text-red-800">{nombre}</h4>
      <p className="mt-3 text-gray-600 text-sm leading-relaxed grow">{descripcion}</p>
      {precio && <p className="mt-4 text-2xl font-bold text-gray-800">{precio}</p>}
      {onAction && (
        <button
          onClick={onAction}
          className="mt-5 w-full bg-red-800 hover:bg-red-900 text-white py-2 rounded-lg font-medium transition cursor-pointer"
        >
          Ordenar
        </button>
      )}
    </div>
  );
}
