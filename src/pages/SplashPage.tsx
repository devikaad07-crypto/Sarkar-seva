import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useUserStore, UserProfile } from '../store/userStore';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { Languages, ShieldCheck, Loader2, Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'hi', name: 'हिंदी', native: 'Hindi' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ', native: 'Kannada' },
  { code: 'ta', name: 'தமிழ்', native: 'Tamil' },
  { code: 'te', name: 'తెలుగు', native: 'Telugu' },
  { code: 'ml', name: 'മലയാളം', native: 'Malayalam' },
  { code: 'mr', name: 'मराठी', native: 'Marathi' },
  { code: 'bn', name: 'বাংলা', native: 'Bengali' },
  { code: 'gu', name: 'ગુજરાતી', native: 'Gujarati' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', native: 'Punjabi' },
];

export default function SplashPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile, setProfile } = useUserStore();
  const [selectedLang, setSelectedLang] = React.useState('');
  const [isSigningIn, setIsSigningIn] = React.useState(false);

  const handleLanguageSelect = (code: string) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
  };

  const handleSignIn = async () => {
    if (!selectedLang) return;
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        if (!profile || profile.language !== selectedLang) {
          const baseProfile: UserProfile = {
            name: result.user.displayName || '',
            age: 0,
            gender: '',
            mobile: '',
            state: '',
            district: '',
            income: 0,
            occupation: '',
            caste: '',
            familyMembers: 1,
            hasDisability: false,
            hasBPLCard: false,
            onboarded: false,
            language: selectedLang,
          };
          setProfile(baseProfile);
        }
        setTimeout(() => navigate('/onboarding'), 100);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-white">
      {/* Decorative Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
        
        {/* Subtle Tricolor Accents */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex opacity-20">
           <div className="flex-1 bg-brand" />
           <div className="flex-1 bg-white" />
           <div className="flex-1 bg-secondary" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-12 max-w-md w-full"
      >
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-[#0a192f] rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-slate-900/10 group transition-all hover:scale-105 relative z-10">
            <Globe className="text-brand w-12 h-12 group-hover:rotate-12 transition-transform duration-700" />
          </div>
          {/* Official Emblem Backdrop Icon or Illustration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] pointer-events-none">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-none">Sarkar Seva</h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 bg-slate-100" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Unified Public Portal</span>
            <div className="h-[1px] w-8 bg-slate-100" />
          </div>
          <p className="text-slate-500 text-sm font-medium pt-2 leading-relaxed italic">
            Secure digital access to your <br /> 
            <span className="text-[#0a192f] font-bold not-italic">Sanctioned Citizen Benefits</span>
          </p>
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
               Select Official Language
             </h3>
             {selectedLang && <span className="text-[10px] font-bold text-brand uppercase tracking-widest animate-pulse">Selection Active</span>}
          </div>
          
          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
            {LANGUAGES.map((lang, index) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`flex flex-col items-start p-5 rounded-2xl transition-all duration-300 border ${
                  selectedLang === lang.code 
                    ? 'bg-[#0a192f] border-[#0a192f] shadow-2xl shadow-slate-900/20 -translate-y-1' 
                    : 'bg-slate-50 border-slate-100 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <span className={`text-xl font-bold ${selectedLang === lang.code ? 'text-white' : 'text-slate-900'} mb-1`}>{lang.name}</span>
                <span className={`text-[10px] ${selectedLang === lang.code ? 'text-white/60' : 'text-slate-400'} font-bold uppercase tracking-wider`}>{lang.native}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="pt-4 space-y-6">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignIn}
            disabled={!selectedLang || isSigningIn}
            className="w-full h-16 bg-[#0a192f] text-white rounded-2xl flex items-center justify-center gap-4 disabled:bg-slate-100 disabled:text-slate-300 transition-all font-display shadow-2xl shadow-slate-900/10 border border-slate-900/5"
          >
            {isSigningIn ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <ShieldCheck size={20} className={selectedLang ? 'text-brand' : 'text-slate-300'} />
                <span className="text-xs font-bold uppercase tracking-[0.2em] pt-0.5">
                  {selectedLang ? 'Authenticate Identity' : 'Choose Language'}
                </span>
              </>
            )}
          </motion.button>
          
          <div className="flex flex-col items-center gap-5">
            <div className="h-px w-24 bg-slate-100" />
            <div className="text-center space-y-1.5 grayscale opacity-60">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] leading-relaxed">
                National Informatics Center
              </p>
              <div className="flex items-center gap-3 justify-center">
                 <div className="w-6 h-[1px] bg-brand" />
                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Digital India Initiative</span>
                 <div className="w-6 h-[1px] bg-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
