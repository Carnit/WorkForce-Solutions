import { useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { authAPI } from '../../services/api';
import { Modal } from '../ui/modal';
import { InputField } from '../ui/input-field';
import type { AuthModalProps } from '../../types';

export default function AuthModal({ type, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(type === 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const data = isLogin 
        ? await authAPI.login(body)
        : await authAPI.signup(body);

      login(data.access_token);
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ email: '', password: '', username: '', full_name: '' });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isLogin ? 'Welcome Back' : 'Sign up'}
      subtitle={isLogin ? 'Log in to your account' : 'Start your 7-day free trial'}
      size="md"
      variant="auth"
    >
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-2">Name*</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-indigo-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-2">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-indigo-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-base"
                required
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-indigo-900 mb-2">Email*</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-indigo-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-base"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-indigo-900 mb-2">Password*</label>
          <input
            type="password"
            placeholder={isLogin ? '••••••••' : 'Create a password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-indigo-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-base"
            required
          />
          {!isLogin && (
            <p className="text-xs text-indigo-700 mt-1">Must be at least 8 characters.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base mt-6"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Loading...
            </span>
          ) : (
            isLogin ? 'Sign In' : 'Create account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative py-4 my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-indigo-200"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-linear-to-br from-indigo-50 via-white to-purple-50 px-2 text-indigo-600 font-medium text-xs">Or continue with</span>
        </div>
      </div>

      {/* Social Auth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="h-10 px-4 border border-indigo-300 hover:border-indigo-400 text-slate-700 hover:bg-indigo-50 font-medium rounded-lg transition-all text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button
          type="button"
          className="h-10 px-4 border border-indigo-300 hover:border-indigo-400 text-slate-700 hover:bg-indigo-50 font-medium rounded-lg transition-all text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </button>
      </div>

      {/* Toggle Mode */}
      <p className="text-center text-slate-700 text-sm pt-4">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={handleToggleMode}
          className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </Modal>
  );
}