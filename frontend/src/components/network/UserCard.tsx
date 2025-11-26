import { User as UserIcon } from 'lucide-react';
import ModeBadge from '../common/ModeBadge';
import type { UserCardProps } from '../../types';

export default function UserCard({ user }: UserCardProps) {
  const skills = user.skills ? JSON.parse(user.skills) : [];
  const isBuilder = user.mode === 'builder';
  
  return (
    <div className="h-full flex flex-col bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
        isBuilder ? 'bg-linear-to-br from-blue-50 to-transparent' : 'bg-linear-to-br from-teal-50 to-transparent'
      }`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isBuilder ? 'bg-blue-100' : 'bg-teal-100'
            }`}>
              <UserIcon className={`w-6 h-6 ${
                isBuilder ? 'text-blue-600' : 'text-teal-600'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{user.full_name}</h3>
              <p className="text-sm text-slate-500">@{user.username}</p>
            </div>
          </div>
          <ModeBadge mode={user.mode} />
        </div>

        {user.bio && (
          <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-2">{user.bio}</p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2.5 py-1 text-slate-500 text-xs font-medium">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}