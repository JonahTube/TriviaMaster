export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TriviaCategory = 'general' | 'science' | 'sports' | 'movies' | 'history' | 'pop-culture';

export interface TriviaQuestion {
  id: string;
  category: TriviaCategory;
  difficulty: DifficultyLevel;
  question: string;
  answers: string[];
  correctAnswer: number; // index of correct answer
  timeLimit: number; // seconds
  basePoints: number;
}

export interface UserStats {
  id: string;
  username: string;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  questionsAnswered: number;
  correctAnswers: number;
  badgesEarned: string[];
  currency: number;
  rank: number;
  joinDate: Date;
  lastActive: Date;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  requirement: {
    type: 'questions_answered' | 'correct_streak' | 'category_complete' | 'points_earned' | 'time_bonus';
    target: number;
    category?: TriviaCategory;
  };
  reward: {
    points: number;
    currency: number;
    badge?: string;
  };
  progress: number;
  completed: boolean;
  expiresAt: Date;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  cost: number;
  cooldown: number; // minutes
  type: 'hint' | 'skip' | 'extra_time' | 'double_points';
}

export interface GameSession {
  id: string;
  userId: string;
  questions: TriviaQuestion[];
  currentQuestionIndex: number;
  score: number;
  streak: number;
  timeBonus: number;
  startTime: Date;
  powerUpsUsed: string[];
}

// Sample trivia questions across categories and difficulties
export const SAMPLE_QUESTIONS: TriviaQuestion[] = [
  // General Knowledge - Easy
  {
    id: 'gen_easy_1',
    category: 'general',
    difficulty: 'easy',
    question: 'What is the capital of France?',
    answers: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    timeLimit: 15,
    basePoints: 10
  },
  {
    id: 'gen_easy_2',
    category: 'general',
    difficulty: 'easy',
    question: 'How many days are there in a leap year?',
    answers: ['365', '366', '364', '367'],
    correctAnswer: 1,
    timeLimit: 15,
    basePoints: 10
  },
  
  // Science - Medium
  {
    id: 'sci_med_1',
    category: 'science',
    difficulty: 'medium',
    question: 'What is the chemical symbol for gold?',
    answers: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    timeLimit: 20,
    basePoints: 20
  },
  {
    id: 'sci_med_2',
    category: 'science',
    difficulty: 'medium',
    question: 'Which planet is known as the Red Planet?',
    answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    timeLimit: 20,
    basePoints: 20
  },
  
  // Movies - Hard
  {
    id: 'mov_hard_1',
    category: 'movies',
    difficulty: 'hard',
    question: 'Who directed the 1994 film "Pulp Fiction"?',
    answers: ['Martin Scorsese', 'Quentin Tarantino', 'David Fincher', 'Christopher Nolan'],
    correctAnswer: 1,
    timeLimit: 25,
    basePoints: 30
  },
  
  // Sports - Easy
  {
    id: 'spo_easy_1',
    category: 'sports',
    difficulty: 'easy',
    question: 'How many players are on a basketball team on the court at one time?',
    answers: ['4', '5', '6', '7'],
    correctAnswer: 1,
    timeLimit: 15,
    basePoints: 10
  },
  
  // History - Medium
  {
    id: 'his_med_1',
    category: 'history',
    difficulty: 'medium',
    question: 'In which year did World War II end?',
    answers: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    timeLimit: 20,
    basePoints: 20
  },
  
  // Pop Culture - Easy
  {
    id: 'pop_easy_1',
    category: 'pop-culture',
    difficulty: 'easy',
    question: 'Which social media platform is known for 280-character posts?',
    answers: ['Facebook', 'Instagram', 'Twitter/X', 'TikTok'],
    correctAnswer: 2,
    timeLimit: 15,
    basePoints: 10
  }
];

// Sample daily missions
export const SAMPLE_MISSIONS: Omit<DailyMission, 'id' | 'progress' | 'completed' | 'expiresAt'>[] = [
  {
    title: 'Daily Grind',
    description: 'Answer 10 trivia questions today',
    requirement: {
      type: 'questions_answered',
      target: 10
    },
    reward: {
      points: 50,
      currency: 10,
      badge: 'daily_grinder'
    }
  },
  {
    title: 'Streak Master',
    description: 'Get 5 correct answers in a row',
    requirement: {
      type: 'correct_streak',
      target: 5
    },
    reward: {
      points: 75,
      currency: 15,
      badge: 'streak_master'
    }
  },
  {
    title: 'Science Enthusiast',
    description: 'Complete 5 science questions correctly',
    requirement: {
      type: 'category_complete',
      target: 5,
      category: 'science'
    },
    reward: {
      points: 60,
      currency: 12
    }
  },
  {
    title: 'Point Hunter',
    description: 'Earn 200 points today',
    requirement: {
      type: 'points_earned',
      target: 200
    },
    reward: {
      points: 100,
      currency: 20,
      badge: 'point_hunter'
    }
  }
];

// Available power-ups
export const POWER_UPS: PowerUp[] = [
  {
    id: 'hint',
    name: 'Hint',
    description: 'Eliminate 2 wrong answers',
    cost: 25,
    cooldown: 5,
    type: 'hint'
  },
  {
    id: 'skip',
    name: 'Skip Question',
    description: 'Skip current question without penalty',
    cost: 30,
    cooldown: 10,
    type: 'skip'
  },
  {
    id: 'extra_time',
    name: 'Extra Time',
    description: 'Add 10 seconds to the timer',
    cost: 20,
    cooldown: 3,
    type: 'extra_time'
  },
  {
    id: 'double_points',
    name: 'Double Points',
    description: 'Double points for the next question',
    cost: 50,
    cooldown: 15,
    type: 'double_points'
  }
];

export const CATEGORY_LABELS: Record<TriviaCategory, string> = {
  general: 'General Knowledge',
  science: 'Science',
  sports: 'Sports', 
  movies: 'Movies',
  history: 'History',
  'pop-culture': 'Pop Culture'
};

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-red-400'
};
