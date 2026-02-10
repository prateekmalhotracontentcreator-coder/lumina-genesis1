import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import BibleReader from './BibleReader';
import PrayerWall from './PrayerWall';
import AIChaplain from './AIChaplain';
import ManifestationPlan from './ManifestationPlan';
import PremiumGuide from './PremiumGuide';
import BibleTrivia from './BibleTrivia';
import ChristianCalendar from './ChristianCalendar';
import SleepMeditations from './SleepMeditations';
import OccasionalPrayers from './OccasionalPrayers';
import MediaVault from './MediaVault';
import CommunityHub from './CommunityHub';
import EStore from './EStore';
import LandingPage from './LandingPage';
import BibleStructure from './BibleStructure';
import BibleSituationSearch from './BibleSituationSearch';
import Confessions from './Confessions';
import BereanTool from './BereanTool';
import { AppView, UserProfile } from './types';
import { APP_CONFIG } from './constants';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Environment Detection for Exodus Phase
  const [isStandalone, setIsStandalone] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lumina_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState<AppView>(() => {
    const state = location.state as { view?: string };
    if (state?.view && Object.values(AppView).includes(state.view as AppView)) {
      return state.view as AppView;
    }
    return AppView.DASHBOARD;
  });

  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('lumina_points') || '750');
  });

  useEffect(() => {
    // Detect Deployment Environment
    if (window.matchMedia('(display-mode: standalone)').matches || (window as any).navigator.standalone) {
      setIsStandalone(true);
    }
    if (window.location.hostname !== 'localhost') {
      setIsProduction(true);
    }
    
    if (user) localStorage.setItem('lumina_user', JSON.stringify(user));
    localStorage.setItem('lumina_points', points.toString());
  }, [user, points]);

  const handleLogin = () => {
    const mockUser: UserProfile = {
      uid: 'exodus_dev_01',
      name: 'Exodus Disciple',
      email: 'believer@lumina.genesis',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      familyDetails: '',
      isPremium: false,
      points: points
    };
    setUser(mockUser);
  };

  const togglePremium = () => {
    if (user) setUser({ ...user, isPremium: !user.isPremium });
  };

  useEffect(() => {
    const state = location.state as { view?: string };
    if (state?.view && Object.values(AppView).includes(state.view as AppView)) {
      setActiveView(state.view as AppView);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const renderContent = () => {
    const profile = user || { name: 'Guest Soul', points, isPremium: false, familyDetails: '' };
    
    switch (activeView) {
      case AppView.DASHBOARD: return <Dashboard setActiveView={setActiveView} profile={profile} />;
      case AppView.BIBLE: return <BibleReader />;
      case AppView.PRAYERS: return <PrayerWall />;
      case AppView.AI_PASTOR: return <AIChaplain />;
      case AppView.CONFESSIONS: return <Confessions userName={profile.name} />;
      case AppView.MANIFEST: return <ManifestationPlan />;
      case AppView.MEDITATION: return <SleepMeditations />;
      case AppView.TRIVIA: return <BibleTrivia />;
      case AppView.CALENDAR: return <ChristianCalendar />;
      case AppView.OCCASIONAL_PRAYERS: return <OccasionalPrayers isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} userName={profile.name} />;
      case AppView.MEDIA_VAULT: return <MediaVault isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} userName={profile.name} />;
      case AppView.COMMUNITY_HUB: return <CommunityHub />;
      case AppView.ESTORE: return <EStore profile={profile} onSubscribe={togglePremium} />;
      case AppView.BIBLE_STRUCTURE: return <BibleStructure />;
      case AppView.SITUATION_SEARCH: return <BibleSituationSearch />;
      case AppView.PREMIUM_GUIDE: return <PremiumGuide isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} />;
      case AppView.SETTINGS: return (
        <div className="space-y-6 pb-20 max-w-2xl mx-auto animate-enter">
          <div className="glass p-8 flex items-center gap-6 border-indigo-500/30 bg-indigo-900/10">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center overflow-hidden shadow-2xl">
               {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-3xl">👤</span>}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{user ? user.name : 'Guest Soul'}</h3>
              <p className="text-xs text-white/40 mt-1">{user ? user.email : 'Sanctuary Status: Offline'}</p>
              <div className="mt-3 inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest">{APP_CONFIG.edition}</span>
              </div>
            </div>
          </div>
          
          {!user && (
            <button onClick={handleLogin} className="w-full py-5 bg-white text-black font-bold rounded-2xl shadow-2xl uppercase tracking-widest text-xs hover:scale-[1.02] transition-all">
              Initialize Exodus Account
            </button>
          )}

          <div className="space-y-4">
             <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-2">Theological Validation</h4>
             <BereanTool />
          </div>

          <div className="glass p-6 space-y-4 border-white/5">
             <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Exodus Diagnostics</h4>
             <div className="flex justify-between text-[10px] font-bold">
                <span className="opacity-40 uppercase tracking-tighter">Interface Mode</span>
                <span className="text-indigo-400 uppercase tracking-widest">{isStandalone ? 'PWA Native' : 'Responsive Web'}</span>
             </div>
             <div className="flex justify-between text-[10px] font-bold">
                <span className="opacity-40 uppercase tracking-tighter">Deployment State</span>
                <span className={`uppercase tracking-widest ${isProduction ? 'text-green-400' : 'text-amber-400'}`}>{isProduction ? 'Live Production' : 'Staging/Local'}</span>
             </div>
             <div className="flex justify-between text-[10px] font-bold">
                <span className="opacity-40 uppercase tracking-tighter">Active Build</span>
                <span className="opacity-80 font-mono">v{APP_CONFIG.version}-{APP_CONFIG.buildTag}</span>
             </div>
          </div>

          {user && (
            <button onClick={() => {setUser(null); localStorage.removeItem('lumina_user');}} className="w-full py-4 glass border-red-500/20 text-red-400 font-bold rounded-xl text-xs uppercase hover:bg-red-500/5 transition-all">
              Sign Out of Sanctuary
            </button>
          )}
        </div>
      );
      default: return <Dashboard setActiveView={setActiveView} profile={profile} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} user={user}>
      <div key={activeView} className="h-full w-full">
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