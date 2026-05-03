import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useUserStore } from '../store/userStore';
import { SCHEMES } from '../data/schemes';
import { calculateMatches } from '../engine/matchingEngine';
import { askGemini } from '../services/geminiService';
import { Bell, Search, User, Sparkles, ArrowRight, TrendingUp, ShieldCheck, CheckCircle2, History, LayoutGrid, FileCheck, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useUserStore();

  const matches = useMemo(() => {
    if (!profile) return [];
    return calculateMatches(profile, SCHEMES);
  }, [profile]);

  const eligibleCount = matches.filter(m => m.isEligible).length;

  const [aiSummary, setAiSummary] = React.useState<string>('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  React.useEffect(() => {
    async function getSummary() {
      if (!profile || !matches.length) return;
      setIsAiLoading(true);
      const eligibleList = matches.filter(m => m.isEligible).map(m => m.scheme.name.en).join(', ');
      const prompt = `Act as a formal Indian Government Service Officer. 
      The citizen's profile: ${JSON.stringify(profile)}. 
      Eligible Schemes found: ${eligibleList}. 
      Give a 2-sentence summary in a polite, formal tone listing which top 2 schemes are "allocated" to them and why based on their occupation/income. Use common Indian greetings.`;
      
      const summary = await askGemini(prompt);
      setAiSummary(summary);
      setIsAiLoading(false);
    }
    getSummary();
  }, [profile, matches.length]);

  return (
    <div className="min-h-screen pb-32 bg-slate-50">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0a192f] rounded-xl flex items-center justify-center border border-slate-200 shadow-xl shadow-slate-900/10">
            <ShieldCheck className="text-brand w-6 h-6" />
          </div>
          <div>
            <span className="font-display font-bold text-slate-900 tracking-tight text-lg block leading-none">Sarkar Seva</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mt-1.5">National Digital Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm transition-all hover:bg-slate-100">
            <User size={18} className="text-slate-500" />
          </button>
        </div>
      </header>

      <main className="px-6 pt-6 space-y-6">
        {/* Summary Card with Tricolor Aesthetic */}
        <section className="px-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a192f] p-8 rounded-[36px] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group"
          >
            {/* Tricolor Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 flex">
               <div className="flex-1 bg-[#FF9933]" />
               <div className="flex-1 bg-white" />
               <div className="flex-1 bg-[#138808]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                   <ShieldCheck size={12} className="text-brand" />
                   <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">Verified Profile</span>
                </div>
                <Globe size={24} className="text-white/20" />
              </div>
              
              <div className="space-y-2">
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em] font-sans">Digital Citizen Entry</p>
                <h1 className="text-4xl font-bold font-display tracking-tight leading-none italic">Namaste, <br />{profile?.name}</h1>
              </div>

              <div className="flex items-end justify-between pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[9px] text-white/40 uppercase font-bold tracking-[0.3em]">Allocated Benefits</p>
                  <p className="text-3xl font-bold font-display leading-none">{eligibleCount} <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest ml-1">Schemes</span></p>
                </div>
                <button 
                  onClick={() => navigate('/schemes')}
                  className="px-6 py-4 bg-white text-slate-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95"
                >
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            </div>
            
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand/10 rounded-full blur-[80px]" />
          </motion.div>
        </section>

        {/* Status Ticker */}
        <div className="mx-1 flex items-center gap-4 py-3 bg-white rounded-2xl px-5 border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Secure</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">
            Registry Sync Status: Active • Unified Protocol Enabled
          </p>
        </div>        {/* Official AI Insight */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-brand" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Official AI Insight</h3>
            </div>
          </div>
          <div className="gov-card p-6 bg-white border-l-4 border-l-brand relative overflow-hidden group">
            <div className={`space-y-5 transition-opacity duration-500 ${isAiLoading ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a192f] flex-shrink-0 flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                   <Sparkles size={20} className={isAiLoading ? 'animate-spin' : 'animate-pulse text-brand'} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Authorized Assistant</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Protocol Analysis Mode</p>
                </div>
              </div>
              <div className="relative">
                <p className="text-slate-600 text-[13px] leading-relaxed font-medium italic">
                  {isAiLoading ? 'Synthesizing national registry data...' : `"${aiSummary}"`}
                </p>
              </div>
              {!isAiLoading && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-secondary" />
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Authenticated Source</span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-300">ID: UPSI-{profile?.name.length}2024</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* National Updates - IMAGE SECTION */}
        <section className="px-1">
          <div className="relative rounded-[32px] overflow-hidden group h-36 border border-slate-100 shadow-xl shadow-slate-200/40">
            <img 
              src="https://images.unsplash.com/photo-1599661046289-e318978b65bc?auto=format&fit=crop&q=80&w=800" 
              alt="Official" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] to-transparent opacity-60" />
            <div className="absolute bottom-5 left-6 right-6 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">National Dispatch</span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight leading-tight">Digital Allotments authorized for {profile?.district}</h3>
              <p className="text-[8px] text-white/50 font-bold uppercase tracking-widest">Registry ID: #GOV-2024-X8A</p>
            </div>
          </div>
        </section>
        {/* Industry Bento Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] px-2 mb-2">Service Hub</h3>
          </div>
          <div 
            onClick={() => navigate('/verification')}
            className="gov-card p-6 space-y-4 cursor-pointer group hover:bg-[#0a192f] transition-all relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all border border-slate-100 relative z-10">
              <ShieldCheck size={20} />
            </div>
            <div className="relative z-10">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-white transition-colors">Document Vault</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-white/50">KYC & Certs</p>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
               <ShieldCheck size={80} />
            </div>
          </div>
          <div 
             onClick={() => navigate('/schemes')}
             className="gov-card p-6 space-y-4 cursor-pointer group hover:bg-[#0a192f] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all border border-slate-100">
              <TrendingUp size={20} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-white transition-colors">Registry</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-white/50">Direct Access</p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] px-1">Industry Sectors</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
            {['Agriculture', 'Health', 'Education', 'Finance', 'Housing'].map((cat) => (
              <button key={cat} className="px-6 py-3 bg-white border border-slate-200 rounded-xl whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:border-brand hover:text-brand transition-all shadow-sm">
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Top Matches */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Sanctioned Allotments</h3>
            <button onClick={() => navigate('/schemes')} className="text-brand text-[10px] font-bold uppercase tracking-widest underline underline-offset-4">View All</button>
          </div>
          <div className="space-y-4">
            {matches.slice(0, 3).map((match, idx) => (
              <motion.div 
                key={match.scheme.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/schemes/${match.scheme.id}`)}
                className="gov-card p-6 cursor-pointer group border-r-4 border-r-brand/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[8px] font-bold rounded-lg uppercase tracking-wider border border-slate-100">
                    {match.scheme.category}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-bold">{match.score}% MATCH</span>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-brand transition-colors text-base font-display tracking-tight">
                  {match.scheme.name[i18n.language] || match.scheme.name['en']}
                </h4>
                <p className="text-[12px] text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">
                  {match.scheme.description[i18n.language] || match.scheme.description['en']}
                </p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-slate-900 font-bold uppercase tracking-widest">{match.scheme.benefit}</span>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-white/80 backdrop-blur-2xl border-t border-slate-200 flex items-center justify-around z-50">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1.5 text-brand">
          <LayoutGrid size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-bold uppercase tracking-widest text-brand">Home</span>
        </button>
        <button onClick={() => navigate('/schemes')} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors">
          <Search size={22} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Registry</span>
        </button>
        <button onClick={() => navigate('/verification')} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors">
          <FileCheck size={22} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Vault</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors">
          <User size={22} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Account</span>
        </button>
      </nav>
    </div>
  );
}
