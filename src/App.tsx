import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { UserProfile } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TrackDetail from './components/TrackDetail';
import LessonView from './components/LessonView';
import Navbar from './components/Navbar';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<{ type: 'dashboard' | 'track' | 'lesson'; id?: string; trackId?: string }>({ type: 'dashboard' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        onSnapshot(userDoc, (snapshot) => {
          if (snapshot.exists()) {
            setProfile(snapshot.data() as UserProfile);
          } else {
            // Create profile
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Developer',
              photoURL: user.photoURL || '',
              totalLessonsCompleted: 0,
              totalPoints: 0,
              averageGrade: 0,
              lastActive: serverTimestamp()
            };
            setDoc(userDoc, newProfile)
              .catch(e => handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}`));
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><LoadingSpinner /></div>;

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar profile={profile} onNavigate={() => setCurrentView({ type: 'dashboard' })} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView.type === 'dashboard' && (
          <Dashboard 
            onSelectTrack={(trackId) => setCurrentView({ type: 'track', id: trackId })} 
            profile={profile}
          />
        )}
        {currentView.type === 'track' && currentView.id && (
          <TrackDetail 
            trackId={currentView.id} 
            onSelectLesson={(lessonId) => setCurrentView({ type: 'lesson', id: lessonId, trackId: currentView.id })}
            onBack={() => setCurrentView({ type: 'dashboard' })}
          />
        )}
         {currentView.type === 'lesson' && currentView.id && currentView.trackId && (
          <LessonView 
            lessonId={currentView.id} 
            trackId={currentView.trackId}
            onBack={() => setCurrentView({ type: 'track', id: currentView.trackId })}
          />
        )}
      </main>
    </div>
  );
}
