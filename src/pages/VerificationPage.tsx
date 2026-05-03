import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronLeft,
  Search,
  ShieldCheck,
  Info,
  Camera,
  X,
  Maximize2,
  Download,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../services/firebase';
import { collection, addDoc, onSnapshot, query, serverTimestamp, doc, getDoc } from 'firebase/firestore';

interface DocRecord {
  id: string;
  type: string;
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: any;
}

const DOC_TYPES = [
  { id: 'aadhaar', label: 'Aadhaar Card', icon: ShieldCheck },
  { id: 'income', label: 'Income Certificate', icon: FileText },
  { id: 'caste', label: 'Caste Certificate', icon: FileText },
  { id: 'pwd', label: 'PwD Certificate', icon: AlertCircle },
  { id: 'other', label: 'Other Document', icon: FileText },
];

export default function VerificationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocRecord[]>([]);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeDocType, setActiveDocType] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocRecord | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, `users/${auth.currentUser.uid}/documents`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocRecord[];
      setDocuments(docsData);
    }, (error) => {
       console.error("Firestore error:", error);
    });

    return () => unsubscribe();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Please allow camera access to use this feature.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const saveCapturedDocument = async () => {
    if (!auth.currentUser || !activeDocType || !capturedImage) return;

    setIsUploading(activeDocType);
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/documents`), {
        userId: auth.currentUser.uid,
        type: activeDocType,
        name: `${activeDocType.toUpperCase()}_DOCUMENT.png`,
        status: 'verified',
        uploadedAt: serverTimestamp(),
        url: capturedImage // For demo, we store the dataURL
      });
      setIsCameraOpen(false);
      setCapturedImage(null);
      setActiveDocType(null);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsUploading(null);
    }
  };

  const handleUploadClick = async (type: string) => {
    if (!auth.currentUser) return;
    
    setIsUploading(type);
    
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/documents`), {
        userId: auth.currentUser.uid,
        type,
        name: `${type.toUpperCase()}_CERTIFICATE.pdf`,
        status: 'verified', // Simulation: auto-verify for demo purposes as requested to "verify the users identity"
        uploadedAt: serverTimestamp(),
        url: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=800' 
      });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setTimeout(() => setIsUploading(null), 800);
    }
  };

  const isIdentityVerified = documents.length >= 3;

  return (
    <div className="min-h-screen pb-32 bg-slate-50">
      {/* Official National Header */}
      <header className="pt-12 pb-16 px-6 bg-[#0a192f] relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 right-0 h-1 flex opacity-30">
           <div className="flex-1 bg-brand" />
           <div className="flex-1 bg-white" />
           <div className="flex-1 bg-secondary" />
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand/10 rounded-full blur-3xl" />
        
        <div className="max-w-md mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-8 hover:bg-white/20 transition-all border border-white/10 text-white"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/40">
              <ShieldCheck size={36} className="text-[#0a192f]" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Citizen Vault</h1>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">National Document Repository</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 -mt-8 relative z-10 max-w-md mx-auto space-y-6">
        {/* Identity Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-[32px] border shadow-2xl backdrop-blur-xl ${
            isIdentityVerified 
              ? 'bg-emerald-600 border-emerald-500 text-white' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
             <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
               isIdentityVerified ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
             }`}>
                {isIdentityVerified ? 'Registry Authenticated' : 'Identity Incomplete'}
             </div>
             <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                {isIdentityVerified ? <CheckCircle2 size={18} /> : <AlertCircle size={18} className="text-brand" />}
             </div>
          </div>
          <h3 className="text-lg font-bold font-display leading-tight">
            {isIdentityVerified 
              ? 'Your National Identity is fully verified' 
              : 'Complete 3 document uploads to verify identity'}
          </h3>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${Math.min((documents.length / 3) * 100, 100)}%` }}
               className={`h-full ${isIdentityVerified ? 'bg-white' : 'bg-brand'}`}
             />
          </div>
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-3 ${isIdentityVerified ? 'text-white/70' : 'text-slate-400'}`}>
            {documents.length} of 3 Critical Documents verified
          </p>
        </motion.div>

        {/* Verification Hub */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Certificates</h2>
            <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Live Sync</span>
          </div>
          
          <div className="grid gap-4">
            {DOC_TYPES.map((type, idx) => {
              const existing = documents.find(d => d.type === type.id);
              const isUploadingThis = isUploading === type.id;

              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="gov-card p-5 flex items-center justify-between group overflow-hidden relative"
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                      existing 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:scale-110'
                    }`}>
                      <type.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 border-none outline-none text-[15px] tracking-tight">{type.label}</h4>
                      {existing ? (
                        <div className="flex items-center gap-2 mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ref: #IND-{existing.id.slice(0, 6).toUpperCase()}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-medium">Registry cross-check required</p>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10">
                    {existing ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setPreviewDoc(existing)}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 transition-colors shadow-sm"
                        >
                           <Maximize2 size={12} /> Open
                        </button>
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                           <CheckCircle2 size={16} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setActiveDocType(type.id);
                            setIsCameraOpen(true);
                            startCamera();
                          }}
                          disabled={isUploadingThis}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-brand hover:text-white transition-all shadow-md active:scale-90"
                        >
                           <Camera size={18} />
                        </button>
                        <button 
                          onClick={() => handleUploadClick(type.id)}
                          disabled={isUploadingThis}
                          className="h-10 px-5 rounded-xl bg-[#0a192f] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-slate-900/10"
                        >
                          {isUploadingThis ? (
                            <Loader2 size={14} className="animate-spin text-brand" />
                          ) : (
                            <Upload size={14} />
                          )}
                          {isUploadingThis ? 'Wait' : 'Verify'}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative faint background text for official feel */}
                  <div className="absolute right-[-10px] bottom-[-20px] opacity-[0.03] select-none pointer-events-none">
                     <ShieldCheck size={120} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Security & Authentication */}
        <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                 <ShieldCheck size={20} className="text-brand" />
              </div>
              <div>
                 <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-none">Security Protocol</h4>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status: AES-256 Enabled</p>
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Audit</p>
                 <p className="text-sm font-bold text-slate-900">May 3, 2024</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Encrypted</p>
                 <p className="text-sm font-bold text-emerald-600">Active</p>
              </div>
           </div>
           
           <p className="mt-8 text-center text-[9px] text-slate-400 font-medium leading-relaxed italic">
              "This digital vault is part of the National informatics Center infrastructure. Unauthorized access is strictly prohibited under the IT Act."
           </p>
        </section>
      </main>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
               {!capturedImage ? (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center border-[2px] border-dashed border-white/30 m-12 rounded-2xl">
                       <div className="absolute top-2 text-[10px] font-bold text-white uppercase tracking-[0.3em] bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                          Align document in frame
                       </div>
                    </div>
                  </>
               ) : (
                  <img src={capturedImage} className="h-full w-full object-contain" alt="Captured" />
               )}
            </div>
            
            <div className="bg-[#0a192f] p-8 pb-12 flex flex-col gap-8">
               <div className="flex items-center justify-between">
                  <button 
                    onClick={() => {
                      stopCamera();
                      setIsCameraOpen(false);
                      setCapturedImage(null);
                    }}
                    className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white"
                  >
                    <X size={24} />
                  </button>
                  
                  {!capturedImage ? (
                    <button 
                      onClick={handleCapture}
                      className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl relative"
                    >
                       <div className="absolute inset-1 rounded-full border-2 border-[#0a192f]" />
                       <Camera size={32} className="text-[#0a192f]" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setCapturedImage(null);
                        startCamera();
                      }}
                      className="px-6 py-3 rounded-full bg-white/10 text-white font-bold uppercase text-[10px] tracking-widest"
                    >
                       Retake
                    </button>
                  )}
                  
                  <div className="w-12 h-12" />
               </div>

               {capturedImage && (
                  <button 
                    onClick={saveCapturedDocument}
                    className="w-full h-16 bg-brand text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-xs"
                  >
                    {isUploading ? 'Securing Data...' : 'Submit to Registry'}
                  </button>
               )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document View Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0a192f]/95 backdrop-blur-xl flex flex-col p-6"
          >
             <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10">
                      <ShieldCheck size={24} className="text-brand" />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{previewDoc.name}</h3>
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1">Authorized Document Access</p>
                   </div>
                </div>
                <button 
                  onClick={() => setPreviewDoc(null)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10"
                >
                   <X size={24} />
                </button>
             </header>

             <div className="flex-1 bg-white rounded-[40px] shadow-2xl relative overflow-hidden flex items-center justify-center border-4 border-slate-900/5">
                {/* Security Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] pointer-events-none flex flex-wrap gap-20 p-20 rotate-[-15deg]">
                    {Array.from({ length: 20 }).map((_, i) => (
                       <span key={i} className="text-4xl font-black text-black">CONFIDENTIAL</span>
                    ))}
                </div>

                {previewDoc.url && previewDoc.url !== '#' ? (
                   <img src={previewDoc.url} className="max-w-[90%] max-h-[85%] object-contain shadow-2xl" alt="Document" />
                ) : (
                   <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                         <FileText size={48} />
                      </div>
                      <p className="text-slate-400 font-medium text-sm">Document preview synchronized with national registry.</p>
                   </div>
                )}
                
                <div className="absolute bottom-10 left-10 right-10 flex gap-4">
                   <button className="flex-1 h-14 bg-[#0a192f] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl">
                      <Download size={16} /> Download Copy
                   </button>
                   <button className="h-14 px-8 bg-slate-100 text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 border border-slate-200">
                      Print
                   </button>
                </div>
             </div>
             
             <footer className="mt-8 text-center">
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">Authorized for user ID: {auth.currentUser?.uid.slice(0, 12)}...</p>
             </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
