import { motion } from 'motion/react';
import { LogIn, Code2 } from 'lucide-react';
import { signIn } from '../lib/firebase';

export default function Login() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
         <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[2.5rem] max-w-lg w-full text-center space-y-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative z-10"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 group transition-transform hover:rotate-6">
            <Code2 size={40} className="text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
             <span className="h-px w-8 bg-slate-200" />
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Ambiente SaaS</span>
             <span className="h-px w-8 bg-slate-200" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic">CodeMaster <span className="font-light text-slate-400">Pro</span></h1>
          <p className="text-slate-500 font-medium leading-relaxed px-4">
            A plataforma de ensino adaptativo que ajusta o currículo ao seu ritmo e desempenho em tempo real.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={signIn}
            className="w-full h-16 flex items-center justify-center gap-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase tracking-widest text-xs"
          >
            <LogIn size={20} className="text-indigo-400" />
            Acessar com Google Auth
          </button>
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
             Servidores Online em tempo real
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-300">
           <span>v2.4.0 Stable</span>
           <span>© 2026 CodeMaster LLC</span>
        </div>
      </motion.div>
    </div>
  );
}
