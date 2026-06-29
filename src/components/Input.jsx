import React from 'react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  options = [], // Para selects, ej: [{ value: 'x', label: 'X' }]
  className = '',
  min,
  max
}) {
  const commonClasses = "w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none text-sm text-slate-800 transition-all";

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">
          {label}
        </label>
      )}
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          required={required}
          className={commonClasses}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          className={commonClasses}
        />
      )}
    </div>
  );
}
