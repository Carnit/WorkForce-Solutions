import type { FilterButtonProps } from '../../types';

export default function FilterButton({ active, onClick, label }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all font-medium ${
        active
          ? 'bg-linear-to-r from-blue-600 to-teal-500 text-white shadow-md'
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}