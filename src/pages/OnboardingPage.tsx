import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore, UserProfile } from '../store/userStore';
import { auth } from '../services/firebase';
import { useForm } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Loader2, Phone, User as UserIcon, ShieldCheck, MapPin, Briefcase, FileCheck, Globe } from 'lucide-react';
import { INDIAN_STATES, CASTE_CATEGORIES } from '../constants';

export default function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, setProfile, saveProfile } = useUserStore();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<UserProfile>({
    defaultValues: profile || {
      familyMembers: 1,
    },
  });

  const onSubmit = async (data: Partial<UserProfile>) => {
    const updatedProfile = { ...profile!, ...data };
    
    if (step < 3) {
      setStep(step + 1);
      setProfile(updatedProfile);
    } else {
      const finalProfile = { ...updatedProfile, onboarded: true };
      if (auth.currentUser) {
        try {
          setIsSaving(true);
          await saveProfile(auth.currentUser.uid, finalProfile);
          setProfile(finalProfile);
          navigate('/home');
        } catch (error) {
          console.error("Failed to save profile:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const stepIcons = [UserIcon, MapPin, Briefcase];

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50">
      {/* Header */}
      <header className="w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#0a192f] rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10">
                <ShieldCheck size={24} className="text-brand" />
             </div>
             <div>
                <h2 className="text-sm font-display font-bold text-slate-900 tracking-tight leading-none">Sarkar Seva</h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">National Registry</p>
             </div>
          </div>
          <div className="text-right">
             <span className="text-xs font-bold text-slate-900 leading-none font-mono tracking-tighter">PHASE 0{step}</span>
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Onboarding</p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-1 flex gap-1.5 px-6 mt-6">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`flex-1 rounded-full transition-all duration-700 h-full ${s <= step ? 'bg-secondary' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <main className="flex-1 w-full max-w-md px-6 py-10 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Step Icon & Title */}
            <div className="space-y-3">
               <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                  {step === 1 ? 'Legal Identity' : step === 2 ? 'Regional Registry' : 'Welfare Status'}
               </h2>
               <p className="text-slate-500 text-sm font-medium leading-relaxed italic font-sans">
                  {step === 1 ? 'Enter your legal identity details for cross-registry authentication.' : 
                   step === 2 ? 'Define your primary residence for regional benefit allocation.' : 
                   'Declare your financial status for income-based eligibility.'}
               </p>
            </div>

            <div className="space-y-6">
              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Full Legal Name</label>
                    <input 
                      {...register('name', { required: true })}
                      className="input-field"
                      placeholder="Enter name as per document"
                    />
                    {errors.name && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest pl-1">Name is required</span>}
                  </div>

                  <div className="space-y-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authorized Mobile</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3 border-slate-200 group-focus-within:border-brand transition-colors">
                         <span className="text-xs font-bold text-slate-400">+91</span>
                      </div>
                      <input 
                        type="tel"
                        {...register('mobile', { required: true, pattern: /^[6-9]\d{9}$/ })}
                        className="input-field pl-16"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Age</label>
                      <input 
                        type="number"
                        {...register('age', { required: true, min: 1, max: 120, valueAsNumber: true })}
                        className="input-field px-4"
                        placeholder="Years"
                      />
                    </div>
                    <div className="space-y-2 px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Gender</label>
                      <select 
                        {...register('gender', { required: true })}
                        className="input-field"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Caste Category</label>
                    <select 
                      {...register('caste', { required: true })}
                      className="input-field"
                    >
                      <option value="">Select Official Category</option>
                      {CASTE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">State / Union Territory</label>
                    <select 
                      {...register('state', { required: true })}
                      className="input-field"
                    >
                      <option value="">Choose your state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">District Registry</label>
                    <input 
                      {...register('district', { required: true })}
                      className="input-field"
                      placeholder="Enter district name"
                    />
                  </div>

                  <div className="space-y-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Family size</label>
                    <div className="relative">
                       <input 
                         type="number"
                         {...register('familyMembers', { required: true, min: 1, valueAsNumber: true })}
                         className="input-field px-4"
                         placeholder="Count"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[9px] uppercase tracking-widest">Members</div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Household Income (Annual)</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm group-focus-within:text-brand transition-colors">₹</div>
                      <input 
                        type="number"
                        {...register('income', { required: true, valueAsNumber: true })}
                        className="input-field pl-10"
                        placeholder="Gross annual income"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 px-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Primary Occupation</label>
                    <select 
                      {...register('occupation', { required: true })}
                      className="input-field"
                    >
                      <option value="">Select Professional Status</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Daily Wage Laborer">Daily Wage Laborer</option>
                      <option value="Student">Student</option>
                      <option value="Private Employee">Private Employee</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-4">
                    <label className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-brand transition-all group shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-all border border-slate-100">
                         <ShieldCheck size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors tracking-tight leading-none">PwD Registry Holder</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-none">Disability Benefit Matching</p>
                      </div>
                      <input type="checkbox" {...register('hasDisability')} className="w-5 h-5 accent-brand" />
                    </label>
                    
                    <label className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-brand transition-all group shadow-sm">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand/10 group-hover:text-brand transition-all border border-slate-100">
                         <FileCheck size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors tracking-tight leading-none">Antyodaya/BPL Registry</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-none">Priority Welfare Allotment</p>
                      </div>
                      <input type="checkbox" {...register('hasBPLCard')} className="w-5 h-5 accent-brand" />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 shadow-lg">
        <div className="max-w-md mx-auto flex gap-4">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="w-16 h-14 rounded-xl border border-slate-200 font-bold text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="flex-1 px-8 h-14 bg-[#0a192f] text-white rounded-xl flex items-center justify-center gap-3 font-display hover:bg-brand transition-all active:scale-95 shadow-xl shadow-slate-900/10"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]">{step === 3 ? 'Finalize Auth' : 'Save & Continue'}</span>
            )}
            {!isSaving && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
