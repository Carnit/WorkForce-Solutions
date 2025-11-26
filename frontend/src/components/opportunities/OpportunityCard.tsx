import { useState } from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { opportunitiesAPI } from '../../services/api';
import ApplyModal from './ApplyModal';
import type { OpportunityCardProps } from '../../types';

export default function OpportunityCard({ opportunity, onUpdate }: OpportunityCardProps) {
  const { user } = useAuth();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const skills = opportunity.required_skills ? JSON.parse(opportunity.required_skills) : [];

  const handleApply = async (message: string) => {
    try {
      await opportunitiesAPI.apply(opportunity.id, message);
      setShowApplyModal(false);
      alert('Application submitted successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error applying:', error);
      alert('Failed to submit application');
    }
  };

  const isOwner = opportunity.creator_id === user?.id;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{opportunity.title}</h3>
          <p className="text-slate-600 text-sm mt-1">{opportunity.description}</p>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(opportunity.created_at).toLocaleDateString()}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              opportunity.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {opportunity.status}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3 whitespace-nowrap">
          {opportunity.bounty_amount && (
            <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded font-semibold flex items-center gap-1 text-sm">
              <DollarSign className="w-4 h-4" />
              {opportunity.bounty_amount}
            </div>
          )}
          {!isOwner && opportunity.status === 'open' && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-all"
            >
              Apply
            </button>
          )}
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          opportunity={opportunity}
          onClose={() => setShowApplyModal(false)}
          onSubmit={handleApply}
        />
      )}
    </div>
  );
}