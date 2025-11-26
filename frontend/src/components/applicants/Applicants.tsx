import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { Users } from 'lucide-react';

interface Application {
  id: number;
  opportunity_id: number;
  opportunity_title: string;
  applicant_name: string;
  applicant_email: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export default function Applicants() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // This is a placeholder - you'll need to implement this API endpoint
      // const data = await opportunitiesAPI.getApplications();
      // For now, showing mock data
      setApplications([
        {
          id: 1,
          opportunity_id: 1,
          opportunity_title: 'Integration Test Opportunity',
          applicant_name: 'John Smith',
          applicant_email: 'john@example.com',
          message: 'I have experience with testing and would love to contribute to this project.',
          status: 'pending',
          created_at: '2025-11-25'
        },
        {
          id: 2,
          opportunity_id: 2,
          opportunity_title: 'Test Opportunity',
          applicant_name: 'Jane Doe',
          applicant_email: 'jane@example.com',
          message: 'Very interested in this FastAPI project. I have solid Python experience.',
          status: 'pending',
          created_at: '2025-11-24'
        }
      ]);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    setProcessingId(id);
    try {
      // Update the application status
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status: 'accepted' } : app
      ));
      alert('Application accepted!');
    } catch (error) {
      console.error('Error accepting application:', error);
      alert('Failed to accept application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      // Update the application status
      setApplications(applications.map(app =>
        app.id === id ? { ...app, status: 'rejected' } : app
      ));
      alert('Application rejected!');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  if (user?.mode === 'hustler') {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600">Only builders can view applicants. Switch to builder mode to see applications.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-4 bg-white border border-slate-200 rounded-lg p-4">
        {(['all', 'pending', 'accepted', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && ` (${applications.filter(a => a.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No {filter !== 'all' ? filter : ''} applications yet.</p>
          </div>
        ) : (
          filteredApplications.map(app => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{app.opportunity_title}</h3>
                  <p className="text-sm text-slate-600 mt-1">Opportunity ID: {app.opportunity_id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-slate-900 mb-2">Applicant</h4>
                <p className="text-slate-700">{app.applicant_name}</p>
                <p className="text-slate-600 text-sm">{app.applicant_email}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-slate-900 mb-2">Message</h4>
                <p className="text-slate-700 whitespace-pre-wrap">{app.message}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">{new Date(app.created_at).toLocaleDateString()}</p>
                {app.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={processingId === app.id}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === app.id ? 'Rejecting...' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleAccept(app.id)}
                      disabled={processingId === app.id}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingId === app.id ? 'Accepting...' : 'Accept'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
