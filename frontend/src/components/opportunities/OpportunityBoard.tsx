import { useState, useEffect } from 'react';
import { Plus, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { opportunitiesAPI } from '../../services/api';
import OpportunityCard from './OpportunityCard';
import CreateOpportunityModal from './CreateOpportunityModal';
import type { Opportunity } from '../../types';

export default function OpportunityBoard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const data = await opportunitiesAPI.getAll();
      setOpportunities(data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Opportunity Board</h1>
          <p className="text-slate-600 mt-1">Find projects and bounties from your peers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={user?.mode === 'hustler'}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-all shadow-md ${
            user?.mode === 'hustler'
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-linear-to-r from-blue-600 to-teal-500 text-white hover:shadow-lg hover:scale-105'
          }`}
          title={user?.mode === 'hustler' ? 'Only builders can post opportunities' : ''}
        >
          <Plus className="w-5 h-5" />
          Post Opportunity
        </button>
      </div>

      {loading ? (
        <div className="space-y-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {opportunities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No opportunities yet. Be the first to post!</p>
            </div>
          ) : (
            opportunities.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp} onUpdate={fetchOpportunities} />
            ))
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateOpportunityModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchOpportunities}
        />
      )}
    </div>
  );
}