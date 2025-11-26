import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'auth';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md lg:max-w-lg',
  lg: 'max-w-lg'
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  className = '',
  variant = 'default'
}: ModalProps) {
  if (!isOpen) return null;

  const isAuthModal = variant === 'auth';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-3xl shadow-2xl transform transition-all scale-100 px-8 py-10 animate-in fade-in zoom-in duration-200 ${
          isAuthModal
            ? 'bg-linear-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200/40'
            : 'bg-white'
        } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isAuthModal
              ? 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
          aria-label="Close modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className={`text-center space-y-2 pr-8 mb-8`}>
          <h2 id="modal-title" className={`text-2xl font-bold ${isAuthModal ? 'text-indigo-900' : 'text-slate-900'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-sm ${isAuthModal ? 'text-indigo-600' : 'text-slate-500'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

export default Modal;
