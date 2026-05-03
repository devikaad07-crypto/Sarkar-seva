import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore } from '../store/userStore';
import { SCHEMES } from '../data/schemes';
import { calculateMatches } from '../engine/matchingEngine';
import { Search, Filter, ArrowLeft, ArrowRight, TrendingUp, CheckCircle2, AlertCircle, LayoutGrid, Briefcase, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SchemesPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const matches = useMemo(() => {
    if (!profile) return [];
    let results = calculateMatches(profile, SCHEMES);
    
    if (searchTerm) {
      results = results.filter(m => 
        m.scheme.name['en'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.scheme.name['hi']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== 'All') {
      results = results.filter(m => m.scheme.category === filter);
    }

    return results;
  }, [profile, searchTerm, filter]);

  const categories = ['All', 'Agriculture', 'Health', 'Education', 'Finance', 'Housing'];

  return (
    <div className="min-h-screen pb-32 bg-slate-50">
      {/* Executive Header */}
      <header className="px-6 py-8 bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 space-y-6 shadow-xl shadow-slate-200/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all border border-slate-200">
               <ArrowLeft size={18} />
             </button>
             <div>
                <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight leading-none">Registry Explorer</h1>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Official National Database</p>
             </div>
          </div>
          <button className="w-10 h-10 rounded-xl bg-[#0a192f] text-white flex items-center justify-center shadow-xl shadow-slate-900/10 active:scale-95 transition-transform">
             <LayoutGrid size={18} />
          </button>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search scheme name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <button className="px-5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pt-1">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.15em] transition-all border ${
                filter === cat 
                  ? 'bg-[#0a192f] text-white border-[#0a192f] shadow-xl shadow-slate-900/20' 
                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{matches.length} Verified Records</span>
          </div>
          <span className="text-[9px] font-bold text-brand uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity">Smart Match Ready</span>
        </div>

        <AnimatePresence mode="popLayout">
          {matches.map((match, idx) => (
            <motion.div 
              key={match.scheme.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => navigate(`/schemes/${match.scheme.id}`)}
              className="gov-card p-6 flex gap-5 relative overflow-hidden group hover:bg-[#0a192f] transition-all duration-500 active:scale-[0.98]"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all border border-slate-100">
                       <Briefcase size={18} />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">{match.scheme.institution || match.scheme.category}</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 border ${
                    match.isEligible ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {match.isEligible ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                    {match.isEligible ? 'Eligible' : 'Verify Info'}
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-[16px] font-bold text-slate-900 group-hover:text-white transition-colors leading-snug font-display tracking-tight">
                    {match.scheme.name[i18n.language] || match.scheme.name['en']}
                  </h4>
                  <p className="text-[12px] text-slate-500 group-hover:text-white/70 line-clamp-2 leading-relaxed font-medium transition-colors">
                     {match.scheme.description[i18n.language] || match.scheme.description['en']}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-50 group-hover:border-white/10 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-3 rounded-full bg-brand" />
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-white/40 uppercase tracking-widest transition-colors">{match.score}% MATCH PROFILE</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900 group-hover:text-white uppercase tracking-widest group-hover:translate-x-1 transition-all">
                    Details <ArrowRight size={14} className="text-brand" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Security Footer */}
      <div className="px-6 pt-4 pb-12 text-center space-y-2 opacity-50">
         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
           <ShieldCheck size={12} /> Registry Verified 2024
         </p>
         <p className="text-[8px] text-slate-600 max-w-[240px] mx-auto italic">
           All scheme details are fetched from authorized government data feeds. 
           Please verify with your local district office for final disbursement.
         </p>
      </div>
    </div>
  );
}
