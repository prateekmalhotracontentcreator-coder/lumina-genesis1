
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BibleReader from './components/BibleReader';
import PrayerWall from './components/PrayerWall';
import AIChaplain from './components/AIChaplain';
import ManifestationPlan from './components/ManifestationPlan';
import PremiumGuide from './components/PremiumGuide';
import BibleTrivia from './components/BibleTrivia';
import ChristianCalendar from './components/ChristianCalendar';
import SleepMeditations from './components/SleepMeditations';
import OccasionalPrayers from './components/OccasionalPrayers';
import MediaVault from './components/MediaVault';
import CommunityHub from './components/CommunityHub';
import EStore from './components/EStore';
import LandingPage from './components/LandingPage';
import BibleStructure from './components/BibleStructure';
import BibleSituationSearch from './components/BibleSituationSearch';
import Confessions from './components/Confessions';
import BereanTool from './components/BereanTool';
import { AppView, UserProfile } from './types';
import { APP_CONFIG } from './constants';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeView, setActiveView] = useState<AppView>(() => {
    const state = location.state as { view?: string };
    if (state?.view && Object.values(AppView).includes(state.view as AppView)) {
      return state.view as AppView;
    }
    return AppView.DASHBOARD;
  });

  const [profile, setProfile] = useState<UserProfile>({
    name: 'Faithful Soul',
    familyDetails: '',
    isPremium: false,
    points: 750
  });

  // Sync state with location if navigating deep links from Landing Page
  useEffect(() => {
    const state = location.state as { view?: string };
    if (state?.view && Object.values(AppView).includes(state.view as AppView)) {
      setActiveView(state.view as AppView);
      // Clean up state to prevent loops on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const togglePremium = () => setProfile(p => ({ ...p, isPremium: !p.isPremium }));

  const renderContent = () => {
    switch (activeView) {
      case AppView.DASHBOARD: return <Dashboard setActiveView={setActiveView} points={profile.points} />;
      case AppView.BIBLE: return <BibleReader />;
      case AppView.PRAYERS: return <PrayerWall />;
      case AppView.AI_PASTOR: return <AIChaplain />;
      case AppView.CONFESSIONS: return <Confessions userName={profile.name} />;
      case AppView.MANIFEST: return <ManifestationPlan />;
      case AppView.MEDITATION: return <SleepMeditations />;
      case AppView.TRIVIA: return <BibleTrivia />;
      case AppView.CALENDAR: return <ChristianCalendar />;
      case AppView.OCCASIONAL_PRAYERS: return <OccasionalPrayers isPremium={profile.isPremium} onSubscribe={togglePremium} userName={profile.name} />;
      case AppView.MEDIA_VAULT: return <MediaVault isPremium={profile.isPremium} onSubscribe={togglePremium} userName={profile.name} />;
      case AppView.COMMUNITY_HUB: return <CommunityHub />;
      case AppView.ESTORE: return <EStore userPoints={profile.points} />;
      case AppView.BIBLE_STRUCTURE: return <BibleStructure />;
      case AppView.SITUATION_SEARCH: return <BibleSituationSearch />;
      case AppView.PREMIUM_GUIDE: return <PremiumGuide isPremium={profile.isPremium} onSubscribe={togglePremium} />;
      case AppView.SETTINGS: return <BereanTool />;
      default: return <Dashboard setActiveView={setActiveView} points={profile.points} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      <div key={activeView} className="animate-enter h-full w-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
