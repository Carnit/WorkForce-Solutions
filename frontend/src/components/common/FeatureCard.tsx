import type { FeatureCardProps } from '../../types';

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="mb-4 inline-flex items-center justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}