import { UserProfile } from '../types';
import { LayoutDashboard, LogOut, Terminal } from 'lucide-react';
import { logOut } from '../lib/firebase';

interface NavbarProps {
  profile: UserProfile | null;
  onNavigate: () => void;
}

export default function Navbar({ profile, onNavigate }: NavbarProps) {
  return (
    <nav className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 border-b border-slate-700 sticky top-0 z-50 transition-all">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onNavigate}
      >
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg group-hover:bg-indigo-400 transition-colors">
          C
        </div>
        <h1 className="text-xl font-bold tracking-tight italic">
          CodeMaster <span className="font-normal text-indigo-400">Pro</span>
        </h1>
        <div className="hidden md:block ml-4 px-2 py-1 bg-slate-800 rounded text-[10px] font-medium text-slate-400 border border-slate-700 uppercase tracking-widest">
          Estudante
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden lg:flex gap-8 text-sm font-medium">
          <button 
            onClick={onNavigate}
            className="text-indigo-400 border-b-2 border-indigo-400 pb-5 pt-5 transition-all"
          >
            Painel de Estudo
          </button>
          <button className="text-slate-300 hover:text-white pb-5 pt-5 transition-colors">
            Catálogo
          </button>
          <button className="text-slate-300 hover:text-white pb-5 pt-5 transition-colors">
            Comunidade
          </button>
        </div>
        
        <div className="h-6 w-px bg-slate-700 hidden md:block" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold">{profile?.displayName}</p>
            <p className="text-[10px] text-indigo-400 uppercase font-bold">{profile?.totalPoints} PTS</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-lg hover:border-indigo-500 transition-colors cursor-pointer ring-1 ring-white/5">
            <img 
              src={profile?.photoURL} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          {profile?.uid !== 'guest' && (
            <button 
              onClick={logOut}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
