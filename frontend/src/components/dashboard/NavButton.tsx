import type { NavButtonProps } from '../../types';

export default function NavButton({ active, onClick, icon, label }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}