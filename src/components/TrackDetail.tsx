import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Lesson, Track } from '../types';
import { INITIAL_TRACKS } from '../constants';
import * as Icons from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface TrackDetailProps {
  trackId: string;
  onSelectLesson: (id: string) => void;
  onBack: () => void;
}

export default function TrackDetail({ trackId, onSelectLesson, onBack }: TrackDetailProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const track = INITIAL_TRACKS.find(t => t.id === trackId);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const q = query(collection(db, `tracks/${trackId}/lessons`), where('trackId', '==', trackId));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty && (trackId === 'js-basics' || trackId === 'python-intro')) {
          // SEED INITIAL LESSONS
          let initialLessons: Lesson[] = [];
          
          if (trackId === 'js-basics') {
            initialLessons = [
              {
                id: 'js-1',
                trackId: 'js-basics',
                order: 1,
                title: 'Variáveis e Constantes',
                content: '# Variáveis no JavaScript\n\nNo JS moderno usamos `let` e `const`. \n\n`let` permite reatribuição, enquanto `const` é para valores que não mudam.',
                exerciseType: 'code',
                exerciseData: {
                  prompt: 'Crie uma constante chamada `meuNome` com o seu nome e uma variável `idade` com sua idade.',
                  correctAnswer: 'const meuNome = "AI"; let idade = 20;'
                },
                points: 10
              },
              {
                id: 'js-2',
                trackId: 'js-basics',
                order: 2,
                title: 'Tipos de Dados',
                content: '# Tipos Primitivos\n\nStrings, Numbers, Booleans, Null e Undefined são os blocos básicos do JavaScript.',
                exerciseType: 'multiple_choice',
                exerciseData: {
                  prompt: 'Qual o tipo de dado de "123"?',
                  options: ['Number', 'String', 'Boolean', 'Object'],
                  correctAnswer: 'String'
                },
                points: 15
              }
            ];
          } else if (trackId === 'python-intro') {
            initialLessons = [
              {
                id: 'py-1',
                trackId: 'python-intro',
                order: 1,
                title: 'Sintaxe e Print',
                content: '# Bem-vindo ao Python\n\nPython é conhecido por sua simplicidade. Para mostrar algo na tela, usamos `print()`.',
                exerciseType: 'code',
                exerciseData: {
                  prompt: 'Escreva um código que imprima "Ola Mundo" na tela.',
                  correctAnswer: 'print("Ola Mundo")'
                },
                points: 10
              },
              {
                id: 'py-2',
                trackId: 'python-intro',
                order: 2,
                title: 'Variáveis Python',
                content: '# Variáveis\n\nEm Python, não precisamos declarar o tipo. Basta atribuir: `x = 5`.',
                exerciseType: 'code',
                exerciseData: {
                  prompt: 'Crie uma variável `x` com valor 10 e `y` com valor 20.',
                  correctAnswer: 'x = 10\ny = 20'
                },
                points: 15
              }
            ];
          }

          for (const l of initialLessons) {
            await setDoc(doc(db, `tracks/${trackId}/lessons`, l.id), l);
          }
          setLessons(initialLessons);
        } else {
          const data = snapshot.docs.map(doc => doc.data() as Lesson);
          setLessons(data.sort((a, b) => a.order - b.order));
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `tracks/${trackId}/lessons`);
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, [trackId]);

  if (!track) return <div>Track not found</div>;

  return (
    <div className="p-10 max-w-5xl mx-auto w-full space-y-10 overflow-y-auto scrollbar-hide">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all text-xs uppercase tracking-widest"
      >
        <Icons.ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Voltar ao Catálogo
      </button>

      <header className="flex flex-col md:flex-row items-center gap-10 p-10 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rotate-45 translate-x-32 -translate-y-32 -z-10" />
        <div className={`w-24 h-24 ${track.color} rounded-3xl flex items-center justify-center shadow-2xl ring-8 ring-white`}>
           {(Icons as any)[track.icon] && <Icons.Code2 size={48} className="text-white" />}
        </div>
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
             <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase border border-indigo-100 tracking-tighter">Trilha Oficial</span>
             <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase border border-slate-200 tracking-tighter">SaaS Edition</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">{track.title}</h2>
          <p className="text-slate-500 font-medium leading-relaxed max-w-xl">{track.description}</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center w-full md:w-auto">
           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
           <p className="text-xl font-black text-emerald-600 uppercase tracking-tighter">Acompanhando</p>
        </div>
      </header>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <Icons.Library size={24} className="text-indigo-500" />
            Estrutura Curricular
          </h3>
          <div className="text-xs font-bold text-slate-400">
             {lessons.length} Módulos Disponíveis
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="space-y-4">
            {lessons.length > 0 ? lessons.map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSelectLesson(lesson.id)}
                className="bg-white p-7 rounded-[1.5rem] border border-slate-200 flex flex-col sm:flex-row items-center justify-between group cursor-pointer hover:border-indigo-400 hover:shadow-xl transition-all shadow-sm"
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                    {String(lesson.order).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lesson.exerciseType === 'code' ? 'Lab Prático' : 'Teoria & Quiz'}</span>
                       <div className="w-1 h-1 rounded-full bg-slate-300" />
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{lesson.points} XP</span>
                    </div>
                    <h4 className="font-extrabold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight italic leading-none">{lesson.title}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-6 sm:mt-0 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-50 text-slate-700 hover:bg-indigo-600 hover:text-white font-black text-xs rounded-xl border border-slate-200 group-hover:border-indigo-500 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    <Icons.Play size={14} />
                    Iniciar
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-inner">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                  <Icons.Sparkles size={32} />
                </div>
                <h4 className="font-black text-xl text-slate-900 uppercase">Módulos em Geração AI</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 font-medium">Nossa rede neural está sintetizando o conteúdo programático mais adequado ao seu perfil atual.</p>
                <div className="mt-8 flex justify-center gap-4">
                   <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition-all uppercase tracking-widest shadow-lg shadow-indigo-100">
                     Gerar Currículo
                   </button>
                   <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-50 transition-all uppercase tracking-widest">
                     Personalizar
                   </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
