import { useState } from 'react';
import DashboardNav from '../components/dashboard/DashboardNav';
import OpportunityBoard from '../components/opportunities/OpportunityBoard';
import NetworkDirectory from '../components/network/NetworkDirectory';
import Profile from '../components/profile/Profile';
import Posts from '../components/posts/Posts';
import Applicants from '../components/applicants/Applicants';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('opportunities');

  return (
    <div className="min-h-screen bg-white">
      <DashboardNav currentView={currentView} setCurrentView={setCurrentView} />
      <main className="mt-8 pb-12 flex justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl">
          {currentView === 'opportunities' && <OpportunityBoard />}
          {currentView === 'posts' && <Posts />}
          {currentView === 'applicants' && <Applicants />}
          {currentView === 'network' && <NetworkDirectory />}
          {currentView === 'profile' && <Profile />}
        </div>
      </main>
    </div>
  );
}