import { useState } from 'react';
import { Briefcase, Users, User as UserIcon, LogOut, Settings, Rocket, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import ModeBadge from '../common/ModeBadge';
import NavButton from './NavButton';
import type { DashboardNavProps } from '../../types';

export default function DashboardNav({ currentView, setCurrentView }: DashboardNavProps) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md flex justify-center">
      <div className="w-full max-w-6xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-teal-500 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Workforce</span>
          </div>
          <div className="hidden md:flex gap-1">
            <NavButton
              active={currentView === 'opportunities'}
              onClick={() => setCurrentView('opportunities')}
              icon={<Briefcase className="w-4 h-4" />}
              label="Opportunities"
            />
            <NavButton
              active={currentView === 'posts'}
              onClick={() => setCurrentView('posts')}
              icon={<Users className="w-4 h-4" />}
              label="Posts"
            />
            {user?.mode === 'builder' && (
              <NavButton
                active={currentView === 'applicants'}
                onClick={() => setCurrentView('applicants')}
                icon={<Users className="w-4 h-4" />}
                label="Applicants"
              />
            )}
            <NavButton
              active={currentView === 'network'}
              onClick={() => setCurrentView('network')}
              icon={<Users className="w-4 h-4" />}
              label="Network"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ModeBadge mode={user?.mode || 'builder'} />
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <UserIcon className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">
                {user?.username}
              </span>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                <button
                  onClick={() => {
                    setCurrentView('profile');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-slate-600" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => {
                setCurrentView('opportunities');
                setShowMobileMenu(false);
              }}
              className={`w-full px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                currentView === 'opportunities'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Opportunities
            </button>
            <button
              onClick={() => {
                setCurrentView('network');
                setShowMobileMenu(false);
              }}
              className={`w-full px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                currentView === 'network'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Network
            </button>
            <button
              onClick={() => {
                setCurrentView('profile');
                setShowMobileMenu(false);
              }}
              className={`w-full px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                currentView === 'profile'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => {
                logout();
                setShowMobileMenu(false);
              }}
              className="w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}