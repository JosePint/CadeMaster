import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { evaluateCode } from '../lib/gemini';
import { Lesson, UserProgress } from '../types';
import { ArrowLeft, CheckCircle2, ChevronRight, Play, Send, Sparkles, XCircle } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface LessonViewProps {
  lessonId: string;
  trackId: string;
  onBack: () => void;
}

export default function LessonView({ lessonId, trackId, onBack }: LessonViewProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [code, setCode] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; score: number; text: string } | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const docRef = doc(db, `tracks/${trackId}/lessons`, lessonId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setLesson(snapshot.data() as Lesson);
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.GET, `tracks/${trackId}/lessons/${lessonId}`);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId, trackId]);

  const handleSubmit = async () => {
    if (!lesson) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      let result;
      if (lesson.exerciseType === 'code') {
        result = await evaluateCode(code, lesson.exerciseData.prompt, trackId);
      } else {
        const isCorrect = selectedOption === lesson.exerciseData.correctAnswer;
        result = {
          correct: isCorrect,
          score: isCorrect ? 100 : 0,
          feedback: isCorrect ? 'Excelente! Você entendeu bem o conceito.' : 'Não foi dessa vez. Tente revisar o conteúdo e verifique a lógica.'
        };
      }

      setFeedback({
        correct: result.correct,
        score: result.score,
        text: result.feedback
      });

      if (result.correct && auth.currentUser) {
        // Save progress
        const progressRef = doc(db, `users/${auth.currentUser.uid}/progress`, lessonId);
        await setDoc(progressRef, {
          userId: auth.currentUser.uid,
          lessonId,
          trackId,
          completed: true,
          score: result.score,
          feedback: result.feedback,
          updatedAt: serverTimestamp()
        } as UserProgress);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>;
  if (!lesson) return <div className="p-8">Lesson not found</div>;

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* Sidebar: Theory */}
      <div className="w-1/3 border-r border-slate-200 p-10 overflow-y-auto bg-white flex flex-col scrollbar-hide">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-10 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={14} />
          Sair da Aula
        </button>

        <div className="flex-1">
          <nav className="flex text-[10px] font-bold text-slate-400 uppercase gap-2 mb-4 tracking-widest">
            <span>Módulo {lesson.order}</span>
            <span>/</span>
            <span>Estudo Teórico</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 italic mb-8 leading-tight">{lesson.title}</h1>
          
          <div className="prose prose-slate prose-indigo max-w-none text-slate-600 font-medium leading-relaxed">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-500 font-medium leading-relaxed">
          "A maestria não vem da velocidade de leitura, mas da profundidade da prática."
        </div>
      </div>

      {/* Editor/Exercise Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between shrink-0 box-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
               <Sparkles size={16} />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Laboratório Adaptativo</span>
               <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">{lesson.exerciseType === 'code' ? 'Algoritmo & Estrutura' : 'Validação de Conceito'}</h4>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pontuação Prevista</p>
                <p className="text-sm font-black text-indigo-600">+{lesson.points} XP</p>
             </div>
             <div className="w-px h-8 bg-slate-200" />
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Engine
             </div>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-10 pb-10">
            {/* The Challenge Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Especificação do Desafio
              </h3>
              <p className="text-slate-700 font-medium leading-relaxed italic text-lg">
                "{lesson.exerciseData.prompt}"
              </p>
            </div>

            {lesson.exerciseType === 'code' ? (
              <div className="space-y-4">
                <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                   <div className="bg-slate-800 px-6 py-3 border-b border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-bold text-white border-b border-indigo-400 pb-1 uppercase tracking-widest">script.js</span>
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 cursor-pointer transition-colors">output.log</span>
                      </div>
                      <div className="flex gap-1.5">
                         <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-red-500 transition-colors" />
                         <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-yellow-500 transition-colors" />
                         <div className="w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-emerald-500 transition-colors" />
                      </div>
                   </div>
                   <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="// Implemente sua lógica aqui..."
                    className="w-full h-80 bg-transparent text-indigo-100 p-8 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {lesson.exerciseData.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full p-6 rounded-2xl text-left transition-all border-2 flex items-center justify-between group ${
                      selectedOption === option 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-200 scale-[1.02]' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <span className="text-sm uppercase tracking-tight">{option}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                       selectedOption === option ? 'bg-white border-white' : 'border-slate-200 group-hover:border-indigo-400'
                    }`}>
                       {selectedOption === option && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-4">
               <button className="px-8 py-5 bg-slate-200 text-slate-700 font-black text-xs rounded-2xl border border-slate-300 hover:bg-slate-300 transition-all uppercase tracking-widest">
                  Revisar Teoria
               </button>
               <button
                onClick={handleSubmit}
                disabled={submitting || (lesson.exerciseType === 'code' ? !code : !selectedOption)}
                className="flex-1 py-5 bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 uppercase tracking-[0.2em] active:scale-[0.98]"
              >
                {submitting ? (
                   <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} className="rotate-45" />
                    Submeter para Avaliação
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-10 rounded-[2.5rem] border shadow-2xl relative overflow-hidden ${
                    feedback.correct 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-emerald-100' 
                      : 'bg-red-50 border-red-200 text-red-900 shadow-red-100'
                  }`}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     {feedback.correct ? <CheckCircle2 size={120} /> : <XCircle size={120} />}
                  </div>
                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-center justify-between">
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          feedback.correct ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-red-100 border-red-300 text-red-700'
                       }`}>
                          {feedback.correct ? 'Aprovado' : 'Revisão Necessária'}
                       </span>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase opacity-60">Score Provedor Gemini</p>
                          <p className="text-2xl font-black italic">{feedback.score}/100</p>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <h4 className="text-2xl font-black italic uppercase tracking-tighter">{feedback.correct ? 'Conquista Desbloqueada' : 'Análise do Compilador'}</h4>
                       <p className="text-base font-medium leading-relaxed opacity-80 max-w-xl">{feedback.text}</p>
                    </div>

                    <div className="pt-6 border-t border-black/5 flex justify-end">
                       {feedback.correct ? (
                        <button 
                          onClick={onBack}
                          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
                        >
                          Continuar Jornada <ChevronRight size={14} />
                        </button>
                       ) : (
                        <button 
                           onClick={() => setFeedback(null)}
                           className="bg-white text-red-600 border border-red-200 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all shadow-lg"
                        >
                           Tentar Novamente
                        </button>
                       )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
