import React from 'react';

export const Badge = ({ children, variant = 'rose', size = 'md', className = '' }) => {
  const variantMap = {
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30 dark:text-rose-300 light:bg-rose-100 light:text-rose-700 light:border-rose-300',
    pink: 'bg-pink-500/15 text-pink-400 border-pink-500/30 dark:text-pink-300 light:bg-pink-100 light:text-pink-700 light:border-pink-300',
    crimson: 'bg-red-500/15 text-red-400 border-red-500/30 dark:text-red-300 light:bg-red-100 light:text-red-700 light:border-red-300',
    fuchsia: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30 dark:text-fuchsia-300 light:bg-fuchsia-100 light:text-fuchsia-700 light:border-fuchsia-300',
    indigo: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 light:bg-emerald-100 light:text-emerald-700',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30 light:bg-amber-100 light:text-amber-700',
    slate: 'bg-slate-800 text-slate-300 border-slate-700 light:bg-slate-200 light:text-slate-700 light:border-slate-300',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    violet: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  };

  const sizeMap = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border transition-colors ${variantMap[variant] || variantMap.rose} ${sizeMap[size] || sizeMap.md} ${className}`}>
      {children}
    </span>
  );
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  icon: Icon,
}) => {
  const variantMap = {
    primary: 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-600/25 border-rose-500/40',
    pink: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-600/25 border-pink-500/40',
    secondary: 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-200 border-rose-500/20 light:bg-rose-100 light:hover:bg-rose-200 light:text-rose-900 light:border-rose-300',
    outline: 'bg-transparent hover:bg-rose-500/10 text-rose-200 hover:text-white border-rose-500/30 hover:border-rose-400 light:text-rose-800 light:hover:bg-rose-50 light:border-rose-300',
    danger: 'bg-red-600 hover:bg-red-500 text-white border-red-500/30',
    ghost: 'bg-transparent hover:bg-rose-500/10 text-rose-300 hover:text-white border-transparent light:text-rose-700 light:hover:bg-rose-100',
  };

  const sizeMap = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 rounded-xl',
    lg: 'text-base px-6 py-2.5 rounded-xl font-semibold',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium border transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantMap[variant] || variantMap.primary} ${sizeMap[size] || sizeMap.md} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
};

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  name,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 text-left ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-rose-100 dark:text-rose-200 light:text-rose-900">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-rose-400/80 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-slate-950/80 dark:bg-slate-950/80 light:bg-white border ${
            error ? 'border-red-500' : 'border-rose-500/25 focus:border-rose-500'
          } text-slate-100 light:text-slate-900 placeholder-rose-300/40 light:placeholder-rose-900/40 text-sm rounded-xl py-2.5 ${
            Icon ? 'pl-10 pr-3.5' : 'px-3.5'
          } outline-none transition-all duration-150 focus:ring-2 focus:ring-rose-500/25`}
        />
      </div>
      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
    </div>
  );
};

export const Spinner = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div className="flex items-center justify-center p-6">
      <div className={`${sizeMap[size]} border-2 border-rose-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full ${maxWidth} glass-panel rounded-2xl border border-rose-500/30 shadow-2xl p-6 overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-4 mb-4">
          <h3 className="text-lg font-bold text-white light:text-rose-950">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-500/20 transition"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
};
