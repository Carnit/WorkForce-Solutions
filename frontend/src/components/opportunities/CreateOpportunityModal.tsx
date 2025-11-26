import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { opportunitiesAPI } from '../../services/api';
import type { CreateOpportunityModalProps } from '../../types';

export default function CreateOpportunityModal({ onClose, onSuccess }: CreateOpportunityModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    bounty_amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.title.length < 5) {
        throw new Error('Title must be at least 5 characters');
      }
      if (formData.description.length < 20) {
        throw new Error('Description must be at least 20 characters');
      }

      const skills = formData.required_skills
        ? formData.required_skills.split(',').map(s => s.trim()).filter(Boolean)
        : null;

      await opportunitiesAPI.create({
        title: formData.title,
        description: formData.description,
        required_skills: skills,
        bounty_amount: formData.bounty_amount ? parseInt(formData.bounty_amount) : null
      });

      onSuccess();
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create opportunity';
      console.error('Error creating opportunity:', error);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-slate-900 mb-2">Post New Opportunity</h2>
        <p className="text-slate-600 text-sm mb-6">Share your project or bounty with the community</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Title <span className="text-slate-500 text-xs font-normal">({formData.title.length}/200, min 5)</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base"
              placeholder="e.g., Build a Landing Page"
              required
              minLength={5}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-slate-500 text-xs font-normal">({formData.description.length}/∞, min 20)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base"
              placeholder="Describe your project in detail..."
              required
              minLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Required Skills
            </label>
            <input
              type="text"
              value={formData.required_skills}
              onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
              placeholder="React, Tailwind, Node.js (comma-separated)"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bounty Amount (optional)
            </label>
            <input
              type="number"
              value={formData.bounty_amount}
              onChange={(e) => setFormData({ ...formData, bounty_amount: e.target.value })}
              placeholder="500"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3.5 bg-linear-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Creating...
              </span>
            ) : (
              'Post Opportunity'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}