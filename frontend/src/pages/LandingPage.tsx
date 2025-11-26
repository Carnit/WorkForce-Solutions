import { useState } from 'react';
import { Rocket, Briefcase, Zap, Users, TrendingUp, ChevronRight } from 'lucide-react';
import AuthModal from '../components/auth/AuthModal';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="h-16 flex items-center justify-center w-full">
          <div className="flex items-center justify-between w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Workforce</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAuth('login')}
                className="px-5 py-2.5 text-slate-700 hover:text-slate-900 font-semibold transition-colors hover:bg-slate-50 rounded-lg text-base"
              >
                Log In
              </button>
              <button
                onClick={() => setShowAuth('signup')}
                className="px-10 py-3 bg-linear-to-r from-blue-600 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 text-base"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-20 w-full">
        {/* Hero Section */}
        <section className="w-full max-w-4xl text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full mb-6 border border-blue-100">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Phase 1 · Community Foundation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-slate-900 max-w-4xl">
            Build Your Network,{' '}
            <span className="bg-linear-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Find Your Hustle
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-3xl mb-10 leading-relaxed">
            Connect with fellow students, unlock collaboration, and turn ideas into impact. Your crew is waiting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowAuth('signup')}
              className="px-8 py-3.5 bg-transparent bg-linear-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent font-semibold rounded-xl hover:bg-blue-50 transition-all hover:scale-105 border-none"
            >
              Join the Community
            </button>
            <button
              onClick={() => setShowAuth('login')}
              className="px-8 py-3.5 border-none text-slate-700 font-semibold rounded-xl hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              I already have an account
            </button>
          </div>
        </section>

        {/* Dual Strategy UI - Split Screen */}
        <section className="w-full flex flex-col items-center mb-20">
          <div className="text-center mb-12 w-full max-w-5xl px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Choose Your Path</h2>
            <p className="text-base sm:text-lg font-semibold bg-linear-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Select whether you're a Builder offering opportunities or a Hustler seeking them</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl px-4">
            {/* Builder Card */}
            <div className="group relative rounded-2xl border-2 border-slate-200 bg-white p-8 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">🔨 Builder</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Post projects, bounties, and opportunities. Lead initiatives and find talented collaborators to bring your ideas to life.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    Post unlimited opportunities
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    Set bounties & deadlines
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    Review applications
                  </li>
                </ul>
                <button
                  onClick={() => setShowAuth('signup')}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start as a Builder
                </button>
              </div>
            </div>

            {/* Hustler Card */}
            <div className="group relative rounded-2xl border-2 border-slate-200 bg-white p-8 hover:border-teal-300 hover:shadow-lg transition-all overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-teal-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">⚡ Hustler</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Browse opportunities, apply for projects, and grow your portfolio. Earn bounties and build your reputation.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <ChevronRight className="w-4 h-4 text-teal-600" />
                    Discover relevant gigs
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <ChevronRight className="w-4 h-4 text-teal-600" />
                    Apply with your pitch
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <ChevronRight className="w-4 h-4 text-teal-600" />
                    Earn bounties & reviews
                  </li>
                </ul>
                <button
                  onClick={() => setShowAuth('signup')}
                  className="w-full px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Start as a Hustler
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Platform Features</h2>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Network Directory</h3>
              <p className="text-slate-600 text-sm">Discover builders and hustlers in your community</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Opportunity Board</h3>
              <p className="text-slate-600 text-sm">Post and find student-to-student projects and bounties</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-100 to-teal-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Dual Modes</h3>
              <p className="text-slate-600 text-sm">Toggle between Builder and Hustler modes seamlessly</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8 mt-auto w-full">
        <div className="px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center">
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <p className="text-sm text-slate-500">© 2025 Workforce Solutions. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && <AuthModal type={showAuth} onClose={() => setShowAuth(null)} />}
    </div>
  );
}