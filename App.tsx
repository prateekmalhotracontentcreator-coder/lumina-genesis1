import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { AppView, UserProfile } from './types';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, signOut, syncUserProfile } from './services/firebase';
import BereanTool from './components/BereanTool';

// Lazy Loaded Components for Code Splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const BibleReader = lazy(() => import('./components/BibleReader'));
const PrayerWall = lazy(() => import('./components/PrayerWall'));
const ShekinahLive = lazy(() => import('./components/ShekinahLive'));
const AIChaplain = lazy(() => import('./components/AIChaplain'));
const ManifestationPlan = lazy(() => import('./components/ManifestationPlan'));
const GloryScroll = lazy(() => import('./components/GloryScroll'));
const PremiumGuide = lazy(() => import('./components/PremiumGuide'));
const BibleTrivia = lazy(() => import('./components/BibleTrivia'));
const ChristianCalendar = lazy(() => import('./components/ChristianCalendar'));
const SleepMeditations = lazy(() => import('./components/SleepMeditations'));
const OccasionalPrayers = lazy(() => import('./components/OccasionalPrayers'));
const MediaVault = lazy(() => import('./components/MediaVault'));
const CommunityHub = lazy(() => import('./components/CommunityHub'));
const EStore = lazy(() => import('./components/EStore'));
const BibleStructure = lazy(() => import('./components/BibleStructure'));
const BibleSituationSearch = lazy(() => import('./components/BibleSituationSearch'));
const Confessions = lazy(() => import('./components/Confessions'));
const KingdomVisionBoard = lazy(() => import('./components/KingdomVisionBoard'));
const ScribesProtocol = lazy(() => import('./components/ScribesProtocol'));
const SystemCommand = lazy(() => import('./components/SystemCommand'));

// Sacred Loading State for Suspense Fallbacks
const ResonanceLoading = () => (
  <div className="flex flex-col items-center justify-center p-20 animate-pulse">
    <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Fetching Scroll...</p>
  </div>
);

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [telemetryPulse, setTelemetryPulse] = useState({ latency: 142, flux: 65 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryPulse({
        latency: Math.floor(Math.random() * (160 - 130 + 1)) + 130,
        flux: Math.floor(Math.random() * (85 - 60 + 1)) + 60
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const [activeView, setActiveView] = useState<AppView>(() => {
    const state = location.state as { view?: string };
    if (state?.view && Object.values(AppView).includes(state.view as AppView)) {
      return state.view as AppView;
    }
    return AppView.DASHBOARD;
  });

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
    const profile = user || { name: 'Guest Soul', points: 0, isPremium: false, familyDetails: '', manifestationProgress: [] };
    
    switch (activeView) {
      case AppView.DASHBOARD: return <Dashboard setActiveView={setActiveView} profile={profile} />;
      case AppView.BIBLE: return <BibleReader />;
      case AppView.PRAYERS: return <PrayerWall user={user} />;
      case AppView.SHEKINAH_PORTAL: return <ShekinahLive />;
      case AppView.AI_PASTOR: return <AIChaplain />;
      case AppView.CONFESSIONS: return <Confessions userName={profile.name} />;
      case AppView.MANIFEST: return <ManifestationPlan user={user} />;
      case AppView.GLORY_SCROLL: return <GloryScroll profile={profile} />;
      case AppView.MEDITATION: return <SleepMeditations />;
      case AppView.TRIVIA: return <BibleTrivia />;
      case AppView.CALENDAR: return <ChristianCalendar />;
      case AppView.OCCASIONAL_PRAYERS: return <OccasionalPrayers isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} userName={profile.name} />;
      case AppView.MEDIA_VAULT: return <MediaVault isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} userName={profile.name} />;
      case AppView.COMMUNITY_HUB: return <CommunityHub />;
      case AppView.ESTORE: return <EStore profile={profile} onSubscribe={() => setUser({...profile, isPremium: true})} />;
      case AppView.BIBLE_STRUCTURE: return <BibleStructure />;
      case AppView.SITUATION_SEARCH: return <BibleSituationSearch />;
      case AppView.KINGDOM_VISION: return <KingdomVisionBoard user={profile} />;
      case AppView.PREMIUM_GUIDE: return <PremiumGuide isPremium={profile.isPremium} onSubscribe={() => setActiveView(AppView.ESTORE)} />;
      case AppView.SCRIBES_PROTOCOL: return <ScribesProtocol />;
      case AppView.SYSTEM_COMMAND: return <SystemCommand />;
      case AppView.SETTINGS: return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-enter px-4">
          {/* MASTER ARCHITECT ACCOUNT MODULE */}
          <div className="glass p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 border-green-500/20 bg-black/60 shadow-3xl rounded-[45px] relative overflow-hidden group">
            {/* Background Blueprints Decorative */}
            <div className="absolute top-0 right-0 p-8 text-9xl opacity-[0.02] select-none font-black italic group-hover:rotate-6 transition-transform duration-1000">INFRA</div>
            
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center overflow-hidden shadow-2xl">
                 {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-4xl">👤</span>}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">{user ? user.name : 'Guest Soul'}</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">{user ? user.email : 'Link: Offline'}</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                      <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Senior Architect Access</span>
                   </div>
                </div>
              </div>
            </div>

            {/* TOP RIGHT TELEMETRY WIDGET - THE UNDERLAY ENGINE */}
            <div 
              onClick={() => setActiveView(AppView.SYSTEM_COMMAND)}
              className="glass p-6 bg-green-500/5 border border-green-500/10 rounded-[30px] flex gap-8 items-center cursor-pointer hover:border-green-500/40 transition-all group/tele"
            >
               <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-black text-green-500 uppercase tracking-widest opacity-60">Lattice Latency</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white tabular-nums">{telemetryPulse.latency}</span>
                    <span className="text-[8px] font-bold text-white/30 uppercase">ms</span>
                  </div>
               </div>
               <div className="w-px h-10 bg-white/5" />
               <div className="flex flex-col gap-1">
                  <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest opacity-60">Intercession Flux</span>
                  <div className="flex flex-col gap-1 mt-0.5">
                    <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 animate-pulse" style={{ width: `${telemetryPulse.flux}%` }} />
                    </div>
                    <span className="text-[8px] font-bold text-white/30 text-right uppercase tracking-widest">{telemetryPulse.flux}% Optimal</span>
                  </div>
               </div>
               <div className="w-px h-10 bg-white/5" />
               <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping mb-1" />
                  <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Schema OK</span>
               </div>
            </div>
          </div>
          
          {!user ? (
            <button onClick={handleLogin} className="w-full py-8 bg-white text-black font-black rounded-3xl shadow-3xl uppercase tracking-[0.5em] text-[11px] hover:scale-[1.01] transition-all border-b-4 border-green-600">
              Initialize Exodus Account
            </button>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-green-500/40 uppercase tracking-[0.4em] px-4">System Protocols</h4>
                   <button 
                    onClick={() => setActiveView(AppView.SCRIBES_PROTOCOL)}
                    className="w-full glass p-8 border-amber-500/10 bg-amber-950/5 hover:border-amber-500/40 transition-all text-left flex items-center justify-between group rounded-[35px]"
                   >
                      <div>
                        <h5 className="text-lg font-bold text-amber-400 serif italic">The Scribe's Protocol</h5>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Architectural Documentation</p>
                      </div>
                      <span className="text-3xl group-hover:translate-x-1 transition-transform">📜</span>
                   </button>
                   
                   <button 
                    onClick={() => setActiveView(AppView.SYSTEM_COMMAND)}
                    className="w-full glass p-8 border-green-500/10 bg-green-950/5 hover:border-green-500/40 transition-all text-left flex items-center justify-between group rounded-[35px]"
                   >
                      <div>
                        <h5 className="text-lg font-bold text-green-400 serif italic">Architect Console</h5>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Global Lattice Control</p>
                      </div>
                      <span className="text-3xl group-hover:scale-110 transition-transform">⚙️</span>
                   </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-indigo-500/40 uppercase tracking-[0.4em] px-4">Theological Integrity</h4>
                  <div className="glass p-8 rounded-[35px] border-white/5 bg-black/40">
                    <BereanTool />
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col items-center gap-6">
                <button onClick={handleLogout} className="px-12 py-4 glass border-red-500/10 text-red-400 font-black rounded-full text-[9px] uppercase tracking-[0.4em] hover:bg-red-500/5 transition-all">
                  Terminate Resonance Link
                </button>
                <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.8em]">Exodus Migration Status: Active</p>
              </div>
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
        <Suspense fallback={<ResonanceLoading />}>
          {renderContent()}
        </Suspense>
      </div>
    </Layout>
  );
};

const LandingPageLazy = lazy(() => import('./components/LandingPage'));

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<div className="bg-[#0f1018] min-h-screen" />}>
            <LandingPageLazy />
          </Suspense>
        } />
        <Route path="/app" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;