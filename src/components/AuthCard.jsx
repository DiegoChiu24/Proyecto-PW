import React from 'react';

export default function AuthCard({
  subtitle,
  title,
  innerSubtitle,
  onSubmit,
  children,
  spacing = 'space-y-6'
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#801414] text-white p-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Universidad del NOSE</h2>
          {subtitle && (
            <p className="text-red-200 text-xs mt-1 uppercase tracking-wider font-semibold">
              {subtitle}
            </p>
          )}
        </div>

        <form className={`p-8 ${spacing}`} onSubmit={onSubmit}>
          <div className="text-center mb-2">
            {title && <h3 className="text-xl font-bold text-slate-800">{title}</h3>}
            {innerSubtitle && <p className="text-slate-400 text-xs mt-1">{innerSubtitle}</p>}
          </div>

          {children}
        </form>
      </div>
    </div>
  );
}
