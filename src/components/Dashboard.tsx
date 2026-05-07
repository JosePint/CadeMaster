import { motion } from 'motion/react';
import { INITIAL_TRACKS } from '../constants';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface DashboardProps {
  onSelectTrack: (id: string) => void;
  profile: UserProfile | null;
}

export default function Dashboard({ onSelectTrack, profile }: DashboardProps) {
  return (
    <div className="p-10 max-w-7xl mx-auto w-full space-y-12 overflow-y-auto scrollbar-hide">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <nav className="flex text-[10px] font-bold text-slate-400 uppercase gap-2 mb-2 tracking-widest">
            <span>Home</span>
            <span>/</span>
            <span>Dashboard</span>
          </nav>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 italic">CodeMaster <span className="text-indigo-600 font-normal">Dashboard</span></h2>
          <p className="text-slate-500 font-medium text-sm">Bem-vindo de volta, {profile?.displayName}. Você completou {profile?.totalLessonsCompleted} lições até agora.</p>
        </motion.div>

        <div className="flex gap-4">
          <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Icons.Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Pontos Totais</p>
              <p className="text-xl font-black text-slate-800">{profile?.totalPoints}</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Icons.Target size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Frequência</p>
              <p className="text-xl font-black text-slate-800">92%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Tracks */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
            <div className="w-2 h-6 bg-indigo-500 rounded-full" />
            Trilhas de Estudo Sugeridas
          </h3>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">Ver Catálogo Completo</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_TRACKS.map((track, idx) => {
            const Icon = (Icons as any)[track.icon] as LucideIcon;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelectTrack(track.id)}
                className="bg-white p-7 rounded-3xl border border-slate-200 hover:border-indigo-400 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.1)] transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className={`w-14 h-14 ${track.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-100 group-hover:scale-105 transition-transform ring-4 ring-white`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xl mb-2 group-hover:text-indigo-600 transition-colors">{track.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">{track.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                  <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-md border ${
                    track.difficulty === 'beginner' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                    track.difficulty === 'intermediate' ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                  }`}>
                    {track.difficulty}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <span>Estudar</span>
                    <Icons.ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quick Stats / Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-2xl text-slate-900 tracking-tight italic">Fluxo de <span className="text-indigo-600 opacity-60">Frequência</span></h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                Meta
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                Real
              </div>
            </div>
          </div>
          <div className="h-56 flex items-end justify-between gap-4 px-2">
            {[30, 45, 60, 20, 80, 50, 40].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${v}%` }}
                  className={`w-full max-w-[32px] rounded-xl bg-slate-50 border border-slate-200 group relative transition-all hover:bg-indigo-50 hover:border-indigo-200`}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-indigo-500/10 rounded-xl" style={{ height: '100%' }} />
                </motion.div>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                  {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors" />
          <div className="space-y-6 relative z-10">
            <h3 className="font-extrabold text-2xl tracking-tight italic">Relatório <span className="text-indigo-400 font-normal">SaaS</span></h3>
            <div className="space-y-5">
              {[
                { label: 'Lições Concluídas', progress: profile ? Math.round((profile.totalLessonsCompleted / 20) * 100) : 0, val: `${profile?.totalLessonsCompleted}/20` },
                { label: 'Pontuação Média', progress: profile ? profile.averageGrade : 0, val: `${profile?.averageGrade.toFixed(1)}` },
                { label: 'Ritmo de Estudo', progress: 85, val: 'Rápido' }
              ].map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>{m.label}</span>
                    <span className="text-white">{m.val}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progress}%` }}
                      className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => alert(`Relatório de Desempenho:\n\nPontos Totais: ${profile?.totalPoints}\nLições Completas: ${profile?.totalLessonsCompleted}\nMédia: ${profile?.averageGrade.toFixed(2)}\n\nContinue assim!`)}
            className="w-full mt-10 py-4 px-6 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 uppercase tracking-widest active:scale-95 z-10"
          >
            Emitir Certificado Digital
          </button>
        </div>
      </section>
    </div>
  );
}
