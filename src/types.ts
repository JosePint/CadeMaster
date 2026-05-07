export interface Track {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Lesson {
  id: string;
  trackId: string;
  order: number;
  title: string;
  content: string;
  exerciseType: 'multiple_choice' | 'code';
  exerciseData: {
    prompt: string;
    options?: string[];
    correctAnswer: string;
  };
  points: number;
}

export interface UserProgress {
  id?: string;
  userId: string;
  lessonId: string;
  trackId: string;
  completed: boolean;
  score: number;
  feedback?: string;
  updatedAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  totalLessonsCompleted: number;
  totalPoints: number;
  averageGrade: number;
  lastActive: any;
}
