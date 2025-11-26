import { MODES } from '../../config/constants';
import type { ModeBadgeProps } from '../../types';

export default function ModeBadge({ mode }: ModeBadgeProps) {
  const isBuilder = mode === MODES.BUILDER;
  
  return (
    <div
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        isBuilder
          ? 'bg-blue-100 text-blue-700'
          : 'bg-teal-100 text-teal-700'
      }`}
    >
      {isBuilder ? '🔨 Builder' : '⚡ Hustler'}
    </div>
  );
}