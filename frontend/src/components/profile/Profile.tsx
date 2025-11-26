import { useState } from 'react';
import { User as UserIcon, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { profileAPI } from '../../services/api';
import ModeBadge from '../common/ModeBadge';
import type { UserProfile } from '../../types';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    bio: user?.bio || '',
    skills: user?.skills ? JSON.parse(user.skills) : [],
    interests: user?.interests ? JSON.parse(user.interests) : []
  });
  const [loading, setLoading] = useState(false);
  const isBuilder = user?.mode === 'builder';

  const handleSave = async () => {
    setLoading(true);
    try {
      const skills = Array.isArray(formData.skills) 
        ? formData.skills 
        : formData.skills?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];
      const interests = Array.isArray(formData.interests) 
        ? formData.interests 
        : formData.interests?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

      const updatedUser = await profileAPI.updateMe({
        bio: formData.bio,
        skills,
        interests
      });

      updateUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = async () => {
    const newMode = user?.mode === 'hustler' ? 'builder' : 'hustler';
    try {
      const updatedUser = await profileAPI.toggleMode(newMode);
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error toggling mode:', error);
      alert('Failed to toggle mode');
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-2xl w-full space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isBuilder ? 'bg-blue-100' : 'bg-teal-100'
            }`}>
              <UserIcon className={`w-10 h-10 ${
                isBuilder ? 'text-blue-600' : 'text-teal-600'
              }`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{user?.full_name}</h1>
              <p className="text-slate-500">@{user?.username}</p>
              <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => editing ? setEditing(false) : setEditing(true)}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Current Mode</h2>
            <button
              onClick={handleModeToggle}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all shadow-md flex items-center gap-2 font-semibold"
            >
              <Zap className="w-5 h-5" />
              Switch to {user?.mode === 'hustler' ? 'Builder' : 'Hustler'} Mode
            </button>
          </div>
          <div className={`p-4 rounded-lg ${
            isBuilder ? 'bg-blue-50' : 'bg-teal-50'
          }`}>
            <ModeBadge mode={user?.mode} />
            <p className="text-slate-600 text-sm mt-2">
              {user?.mode === 'hustler'
                ? "You're in Hustler mode - actively looking for opportunities and gigs"
                : "You're in Builder mode - offering projects and opportunities to others"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-slate-600">{user?.bio || 'No bio added yet'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
            {editing ? (
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base"
                placeholder="React, Python, Design (comma-separated)"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.skills && JSON.parse(user.skills).length > 0 ? (
                  JSON.parse(user.skills).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isBuilder ? 'bg-blue-50 text-blue-700' : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400">No skills added yet</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Interests</label>
            {editing ? (
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-base"
                placeholder="Startups, AI, Web3 (comma-separated)"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.interests && JSON.parse(user.interests).length > 0 ? (
                  JSON.parse(user.interests).map((interest: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400">No interests added yet</p>
                )}
              </div>
            )}
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full px-4 py-3 bg-linear-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold mt-8"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Member Since</h3>
          <p className="text-slate-600">{new Date(user?.created_at || '').toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>
      </div>
    </div>
  );
}