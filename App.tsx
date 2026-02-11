import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BibleReader from './components/BibleReader';
import PrayerWall from './components/PrayerWall';
import ShekinahLive from './components/ShekinahLive';
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
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, signOut, syncUserProfile } from './services/firebase';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState<AppView>(() => {
    const state = location.state as { view?: string };
    if (state?.view && Object.values(AppView).includes(state.view as AppView)) {
      return state.view as AppView;
    }
    return AppView.DASHBOARD;
  });

  // EXODUS POWER SOURCE: Real Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const profile = await syncUserProfile(firebaseUser);
        setUser(profile as UserProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sanctuary Link Failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error("Exodus Departure Failed:", error);
    }
  };

  useEffect(() => {
    const state = location.state as { view?: string };
    if (state?.view && Object.values(AppView).includes(state.view as AppView)) {
      setActiveView(state.view as AppView);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1018] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-green-500/5 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
        <div className="w-16 h-16 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin relative z-10" />
        <p className="mt-8 text-[10px] font-black text-green-500 uppercase tracking-[0.5em] animate-pulse relative z-10">Synchronizing Resonance...</p>
      </div>
    );
  }

  const renderContent = () => {
    const profile = user || { name: 'Guest Soul', points: 0, isPremium: false, familyDetails: '' };
    
    switch (activeView) {
      case AppView.DASHBOARD: return <Dashboard setActiveView={setActiveView} profile={profile} />;
      case AppView.BIBLE: return <BibleReader />;
      case AppView.PRAYERS: return <PrayerWall user={user} />;
      case AppView.SHEKINAH_PORTAL: return <ShekinahLive />;
      case AppView.AI_PASTOR: return <AIChaplain />;
      case AppView.CONFESSIONS: return <Confessions userName={profile.name} />;
      case AppView.MANIFEST: return <ManifestationPlan user={user} />;
      case AppView.MEDITATION: return <SleepMeditations />;
      case AppView.TRIVIA: return <BibleTrivia />;
      case AppView.CALENDAR: return <ChristianCalendar />;
      case AppView.OCCASIONAL_PRAYERS: return <OccasionalPrayers isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} userName={profile.name} />;
      case AppView.MEDIA_VAULT: return <MediaVault isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} userName={profile.name} />;
      case AppView.COMMUNITY_HUB: return <CommunityHub />;
      case AppView.ESTORE: return <EStore profile={profile} onSubscribe={() => setUser({...profile, isPremium: true})} />;
      case AppView.BIBLE_STRUCTURE: return <BibleStructure />;
      case AppView.SITUATION_SEARCH: return <BibleSituationSearch />;
      case AppView.PREMIUM_GUIDE: return <PremiumGuide isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} />;
      case AppView.SETTINGS: return (
        <div className="space-y-6 pb-20 max-w-2xl mx-auto animate-enter">
          <div className="glass p-8 flex items-center gap-6 border-green-500/30 bg-green-950/10 shadow-2xl rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center overflow-hidden shadow-2xl">
               {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-3xl">👤</span>}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{user ? user.name : 'Guest Soul'}</h3>
              <p className="text-xs text-white/40 mt-1">{user ? user.email : 'Sanctuary Link: Offline'}</p>
            </div>
          </div>
          
          {!user ? (
            <button onClick={handleLogin} className="w-full py-6 bg-white text-black font-black rounded-2xl shadow-2xl uppercase tracking-[0.4em] text-[10px] hover:scale-[1.02] transition-all">
              Initialize Exodus Account
            </button>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-green-500/40 uppercase tracking-[0.4em] px-2">Theological Validation</h4>
                 <BereanTool />
              </div>
              <button onClick={handleLogout} className="w-full py-4 glass border-red-500/20 text-red-400 font-black rounded-2xl text-[10px] uppercase tracking-[0.4em] hover:bg-red-500/5 transition-all">
                Terminate Resonance Link
              </button>
            </div>
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