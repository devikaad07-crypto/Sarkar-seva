import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useUserStore } from '../store/userStore';
import { SCHEMES } from '../data/schemes';
import { calculateMatches } from '../engine/matchingEngine';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { ArrowLeft, Edit3, Settings, LogOut, ChevronRight, PieChart as PieChartIcon, ShieldCheck, FileCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, resetProfile } = useUserStore();
  
  const matches = useMemo(() => {
    if (!profile) return [];
    return calculateMatches(profile, SCHEMES);
  }, [profile]);

  const eligibleCount = matches.filter(m => m.isEligible).length;
  const partialCount = matches.length - eligibleCount;

  const chartData = [
    { name: 'Eligible', value: eligibleCount, color: '#059669' },
    { name: 'Partial', value: partialCount, color: '#d97706' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      resetProfile();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen pb-32 bg-slate-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Citizen Profile</h1>
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <Settings size={22} />
        </button>
      </header>

      <main className="p-6 space-y-6">
        {/* Profile Card */}
        <section className="gov-card p-8 flex flex-col items-center text-center space-y-4 bg-white border border-slate-200 shadow-xl shadow-slate-200/40">
          <div className="w-24 h-24 bg-[#0a192f] text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-slate-900/10">
            <span className="text-4xl font-bold font-display">{profile.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">{profile.name}</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{profile.district}, {profile.state}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest">{profile.age} Yrs</span>
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest">{profile.gender}</span>
            <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 uppercase tracking-widest">{profile.occupation}</span>
          </div>
          <button 
            onClick={() => navigate('/onboarding')}
            className="w-full py-4 bg-[#0a192f] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand transition-all mt-4 shadow-xl shadow-slate-900/10"
          >
            <Edit3 size={14} /> Update Persona Data
          </button>
        </section>

        {/* Verification Hub */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Identity & Credentials</h3>
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 text-[8px] font-black uppercase tracking-widest leading-none">
                <ShieldCheck size={10} /> Active Profile
             </div>
          </div>
          <button 
            onClick={() => navigate('/verification')}
            className="w-full gov-card p-6 group flex items-center justify-between bg-white border border-slate-200 hover:border-[#0a192f] hover:bg-[#0a192f] transition-all shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-brand border border-slate-100 group-hover:bg-white/10 group-hover:text-white transition-all shadow-inner">
                <FileCheck size={28} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-900 group-hover:text-white transition-colors text-base font-display tracking-tight">Citizen Document Vault</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 group-hover:text-white/50">Secured National Repository</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-white translate-x-0 group-hover:translate-x-1 transition-all relative z-10" />
            
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <ShieldCheck size={120} />
            </div>
          </button>
        </section>

        {/* Analytics Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">Eligibility Analytics</h3>
          <div className="gov-card p-6 flex flex-col items-center bg-white border border-slate-200 shadow-sm">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {[
                      { name: 'Eligible', color: '#138808' }, // India Green
                      { name: 'Partial', color: '#ff9933' },  // Saffron
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-8 justify-center text-[9px] font-bold uppercase tracking-[0.2em] mt-4">
              <div className="flex items-center gap-2 text-secondary">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                {eligibleCount} Sanctioned
              </div>
              <div className="flex items-center gap-2 text-brand">
                <div className="w-2 h-2 rounded-full bg-brand"></div>
                {partialCount} Potential
              </div>
            </div>
          </div>
        </section>

        {/* Account Options */}
        <section className="gov-card overflow-hidden bg-white border border-slate-200 shadow-sm">
          <button onClick={handleLogout} className="w-full p-6 flex items-center justify-between group hover:bg-rose-50 transition-colors">
            <div className="flex items-center gap-4 text-rose-500">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100">
                <LogOut size={20} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm tracking-tight">De-authenticate</h4>
                <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">Secure Exit from Portal</p>
              </div>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
