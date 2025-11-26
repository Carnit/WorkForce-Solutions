import { useState } from 'react';
import { X } from 'lucide-react';
import type { ApplyModalProps } from '../../types';

export default function ApplyModal({ opportunity, onClose, onSubmit }: ApplyModalProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await onSubmit(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-screen overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">Apply to {opportunity.title}</h2>
        <p className="text-slate-600 text-sm mb-6">Tell the creator why you're a great fit for this opportunity</p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your pitch, experience, or why you're interested..."
          rows={6}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base mb-6 resize-none"
          required
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || loading}
            className="flex-1 px-4 py-3 bg-linear-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </div>
  );
}