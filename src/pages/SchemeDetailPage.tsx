import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore } from '../store/userStore';
import { SCHEMES } from '../data/schemes';
import { calculateMatches } from '../engine/matchingEngine';
import { ArrowLeft, Share2, ExternalLink, MessageSquare, Send, CheckCircle2, AlertCircle, XCircle, Sparkles, ShieldCheck, FileCheck, Bookmark, ChevronRight, Loader2 } from 'lucide-react';
import { askGemini } from '../services/geminiService';

export default function SchemeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { profile } = useUserStore();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scheme = useMemo(() => SCHEMES.find(s => s.id === id), [id]);
  const match = useMemo(() => {
    if (!profile || !scheme) return null;
    return calculateMatches(profile, [scheme])[0];
  }, [profile, scheme]);

  if (!scheme || !match) return null;

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const systemPrompt = `You are a helper for the government scheme: ${scheme.name.en}. 
    The user's profile is: ${JSON.stringify(profile)}. 
    The scheme details are: ${JSON.stringify(scheme)}. 
    Answer questions about eligibility, benefits, and how to apply. Be concise and helpful.`;

    const aiResponse = await askGemini(userMsg, systemPrompt);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pb-40 bg-slate-50">
      {/* Executive Header */}
      <header className="px-6 py-6 bg-white/95 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all border border-slate-200">
          <ArrowLeft size={18} />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all border border-slate-200">
             <Bookmark size={18} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-[#0a192f] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <Share2 size={18} />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-md mx-auto">
        {/* Title & Badge */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
             <div className="px-3 py-1 bg-brand/10 border border-brand/20 rounded-full">
                <span className="text-[10px] font-black text-brand uppercase tracking-[0.2em]">{scheme.category}</span>
             </div>
             <div className="h-4 w-[1px] bg-slate-200" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scheme.ministry || "National Ministry"}</span>
          </div>
          
          <h1 className="text-3xl font-display font-bold text-slate-900 leading-tight tracking-tight">
            {scheme.name[i18n.language] || scheme.name['en']}
          </h1>

          <div className="flex items-center justify-center gap-3">
            {match.isEligible ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shadow-sm">
                <CheckCircle2 size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none pt-0.5">Eligibility Confirmed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl shadow-sm">
                <AlertCircle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none pt-0.5">Awaiting Info</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#0a192f] text-white rounded-xl shadow-xl shadow-slate-900/10">
               <span className="text-[10px] font-bold uppercase tracking-widest">{match.score}% MATCH</span>
            </div>
          </div>
        </div>

        {/* Benefits Card - National Branding */}
        <section className="bg-[#0a192f] p-8 rounded-[36px] text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 left-0 right-0 h-1 flex">
             <div className="flex-1 bg-brand" />
             <div className="flex-1 bg-white" />
             <div className="flex-1 bg-secondary" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/10">
                  <ShieldCheck size={20} className="text-brand" />
               </div>
               <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">National Allocation</h3>
            </div>
            
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
               <p className="text-white text-base leading-relaxed font-semibold italic">
                 {scheme.benefit}
               </p>
            </div>

            <div className="flex items-center gap-2 text-[9px] text-white/40 font-bold uppercase tracking-[0.2em]">
               <FileCheck size={12} className="text-brand" />
               Automated Disbursement Authorized
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl group-hover:bg-brand/10 transition-all duration-700" />
        </section>

        {/* Requirements Status */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] px-1">Verification Matrix</h3>
          <div className="space-y-3">
            {match.reasons.length > 0 ? (
              match.reasons.map((reason, i) => (
                <div key={i} className="flex gap-4 items-center p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand/40 transition-colors shadow-sm">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                    <XCircle size={18} />
                  </div>
                  <span className="text-[12px] font-semibold text-slate-600 leading-snug">{reason}</span>
                </div>
              ))
            ) : (
              <div className="flex gap-4 items-center p-6 bg-white rounded-[28px] border border-slate-200 shadow-xl shadow-slate-200/40 group">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                   <CheckCircle2 size={20} />
                </div>
                <div>
                   <p className="text-[12px] font-bold text-slate-900 tracking-widest uppercase italic leading-none">Sanctioned Profile</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-none">Compliant with National Standards</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Detailed Guidelines */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] px-1">Service Description</h3>
          <div className="p-7 bg-white rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="absolute -left-1 top-0 bottom-0 w-1 bg-brand group-hover:w-1.5 transition-all" />
             <p className="text-slate-500 text-[13px] leading-relaxed font-sans italic pl-2">
               "{scheme.description[i18n.language] || scheme.description['en']}"
             </p>
             <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol ID</p>
                <code className="text-[10px] font-mono text-brand bg-brand/5 px-3 py-1 rounded-lg font-bold">#UPSI-{scheme.id.toUpperCase()}</code>
             </div>
          </div>
        </section>
      </main>

      {/* Persistent Command Center */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-2xl border-t border-slate-200 z-50">
        <div className="max-w-md mx-auto flex gap-4 pb-4">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 rounded-[24px] bg-slate-900 border border-slate-800 text-white flex items-center justify-center hover:bg-brand transition-all active:scale-95 shadow-xl shadow-slate-900/20"
          >
            <MessageSquare size={24} />
          </button>
          <a 
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-8 py-5 bg-[#0a192f] text-white rounded-[24px] font-bold flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 hover:scale-[1.02] transition-all active:scale-95 group font-display"
          >
            <span className="text-[11px] uppercase tracking-[0.25em]">Authorized Application</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-brand" />
          </a>
        </div>
      </div>

      {/* Redesigned AI Chat Canvas */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[70] max-h-[85vh] flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] border-t border-slate-100"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-4" />
              
              <div className="px-8 pb-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-white rounded-2xl shadow-xl shadow-slate-900/20">
                    <Sparkles size={24} className="text-brand animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-slate-900 tracking-tight leading-none">Service Assistant</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Official AI Support Channel</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 no-scrollbar bg-slate-50">
                {chatHistory.length === 0 && (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                       <MessageSquare size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-[13px] font-medium leading-relaxed max-w-[200px] mx-auto italic">
                       Registry assistant online. How can I help with your application?
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['How do I apply?', 'Eligibility check', 'Process timeline'].map(q => (
                        <button 
                          key={q} 
                          onClick={() => { setChatInput(q); handleSendMessage(); }} 
                          className="px-5 py-3 rounded-2xl border border-slate-200 text-[11px] font-bold text-slate-500 bg-white hover:border-brand hover:text-brand transition-all shadow-sm"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {chatHistory.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-5 rounded-[24px] text-[13px] leading-relaxed font-medium shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-[#0a192f] text-white border-[#0a192f] rounded-tr-none italic' 
                        : 'bg-white text-slate-700 border-slate-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="p-5 bg-white rounded-[24px] rounded-tl-none border border-slate-100 flex gap-2 items-center shadow-sm">
                       <Loader2 size={16} className="animate-spin text-brand" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing Registry...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white border-t border-slate-100">
                <div className="flex gap-3 p-3 rounded-[28px] bg-slate-50 border border-slate-200 shadow-inner">
                  <input 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type official query here..."
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isLoading}
                    className="w-12 h-12 bg-[#0a192f] text-white rounded-[20px] flex items-center justify-center shadow-xl hover:bg-brand transition-all disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
