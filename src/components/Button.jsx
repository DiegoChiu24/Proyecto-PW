import React from 'react';

export default function Button({
  children,
  type = 'button',
  onClick,
  variant = 'primary', // 'primary' | 'navy' | 'outline' | 'slate' | 'danger' | 'text'
  className = '',
  disabled = false
}) {
  const baseStyle = "px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer text-center duration-150 inline-flex items-center justify-center select-none";

  const variants = {
    primary: "bg-red-800 hover:bg-red-900 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800",
    navy: "bg-[#1a2e40] hover:bg-[#111f2c] text-white shadow-md",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
    slate: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300",
    danger: "text-red-700 bg-red-50 hover:bg-red-100 border border-red-200",
    text: "text-gray-500 hover:text-red-700 font-medium"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}
