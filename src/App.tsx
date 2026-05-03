import { Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './store/userStore';
import { useAuth } from './hooks/useAuth';
import SplashPage from './pages/SplashPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import ProfilePage from './pages/ProfilePage';
import VerificationPage from './pages/VerificationPage';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: storeLoading } = useUserStore();

  const loading = authLoading || (user && storeLoading && !profile);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/" 
            element={user ? (profile?.onboarded ? <Navigate to="/home" /> : <Navigate to="/onboarding" />) : <SplashPage />} 
          />
          <Route 
            path="/onboarding" 
            element={user ? <OnboardingPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/home" 
            element={user && profile?.onboarded ? <HomePage /> : <Navigate to={user ? "/onboarding" : "/"} />} 
          />
          <Route 
            path="/schemes" 
            element={user ? <SchemesPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/schemes/:id" 
            element={user ? <SchemeDetailPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/verification" 
            element={user ? <VerificationPage /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
