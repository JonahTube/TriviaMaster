import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Clock, Zap, Heart, Star, SkipForward, Lightbulb, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SAMPLE_QUESTIONS, TriviaQuestion, CATEGORY_LABELS, DIFFICULTY_COLORS } from '@shared/trivia';
import { cn } from '@/lib/utils';

type AnswerState = 'idle' | 'correct' | 'incorrect' | 'timeout';

export default function Play() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [questions] = useState<TriviaQuestion[]>(
    [...SAMPLE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10)
  );
  const [powerUps, setPowerUps] = useState({
    hint: 3,
    skip: 2,
    extraTime: 2,
    doublePoints: 1
  });
  const [usedHint, setUsedHint] = useState(false);
  const [doublePointsActive, setDoublePointsActive] = useState(false);
  const [eliminatedAnswers, setEliminatedAnswers] = useState<number[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const resetQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setAnswerState('idle');
    setUsedHint(false);
    setEliminatedAnswers([]);
    setTimeLeft(currentQuestion?.timeLimit || 15);
  }, [currentQuestion]);

  useEffect(() => {
    if (!gameStarted || gameEnded || answerState !== 'idle') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setAnswerState('timeout');
          setStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded, answerState, currentQuestionIndex]);

  const startGame = () => {
    setGameStarted(true);
    resetQuestion();
  };

  const calculatePoints = (timeBonus: number = 0) => {
    const basePoints = currentQuestion.basePoints;
    const difficultyMultiplier = currentQuestion.difficulty === 'easy' ? 1 : 
                                 currentQuestion.difficulty === 'medium' ? 1.5 : 2;
    const streakBonus = Math.floor(streak * 2);
    const pointsMultiplier = doublePointsActive ? 2 : 1;
    
    return Math.floor((basePoints * difficultyMultiplier + timeBonus + streakBonus) * pointsMultiplier);
  };

  const handleAnswer = (answerIndex: number) => {
    if (answerState !== 'idle') return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft * 2);
      const pointsEarned = calculatePoints(timeBonus);
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setAnswerState('correct');
    } else {
      setStreak(0);
      setAnswerState('incorrect');
    }

    setDoublePointsActive(false);
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      setGameEnded(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestion();
    }
  };

  const useHint = () => {
    if (powerUps.hint > 0 && !usedHint) {
      setPowerUps(prev => ({ ...prev, hint: prev.hint - 1 }));
      setUsedHint(true);
      
      const wrongAnswers = currentQuestion.answers
        .map((_, index) => index)
        .filter(index => index !== currentQuestion.correctAnswer);
      
      const toEliminate = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
      setEliminatedAnswers(toEliminate);
    }
  };

  const useSkip = () => {
    if (powerUps.skip > 0) {
      setPowerUps(prev => ({ ...prev, skip: prev.skip - 1 }));
      nextQuestion();
    }
  };

  const useExtraTime = () => {
    if (powerUps.extraTime > 0) {
      setPowerUps(prev => ({ ...prev, extraTime: prev.extraTime - 1 }));
      setTimeLeft(prev => prev + 10);
    }
  };

  const useDoublePoints = () => {
    if (powerUps.doublePoints > 0) {
      setPowerUps(prev => ({ ...prev, doublePoints: prev.doublePoints - 1 }));
      setDoublePointsActive(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setGameStarted(false);
    setGameEnded(false);
    setPowerUps({ hint: 3, skip: 2, extraTime: 2, doublePoints: 1 });
    setDoublePointsActive(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl mb-2">Ready to Play?</CardTitle>
            <p className="text-muted-foreground">
              Answer {questions.length} questions across various categories and difficulties. 
              Earn points, maintain streaks, and use power-ups strategically!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <Lightbulb className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="font-semibold">3</div>
                <div className="text-sm text-muted-foreground">Hints</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <SkipForward className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="font-semibold">2</div>
                <div className="text-sm text-muted-foreground">Skips</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="font-semibold">2</div>
                <div className="text-sm text-muted-foreground">Extra Time</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <Zap className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className="font-semibold">1</div>
                <div className="text-sm text-muted-foreground">2x Points</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button onClick={startGame} size="lg" className="px-8">
                <Brain className="w-5 h-5 mr-2" />
                Start Game
              </Button>
              <Link to="/">
                <Button variant="outline" size="lg">
                  <Home className="w-5 h-5 mr-2" />
                  Back Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <Star className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl mb-2">Game Complete!</CardTitle>
            <p className="text-muted-foreground">Here's how you performed</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-secondary/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center p-6 bg-secondary/50 rounded-lg">
                <div className="text-3xl font-bold text-accent">{streak}</div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </div>
              <div className="text-center p-6 bg-secondary/50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-500">
                  {Math.floor((score / (questions.length * 30)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Score Rate</div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button onClick={restartGame} size="lg" className="px-8">
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Link to="/leaderboard">
                <Button variant="outline" size="lg">
                  <Star className="w-5 h-5 mr-2" />
                  View Leaderboard
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{streak}</div>
              <div className="text-sm text-muted-foreground">Streak</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className={cn("text-2xl font-bold", timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-foreground")}>
                {timeLeft}s
              </div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
              <div className="text-sm text-muted-foreground">Question</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress 
            value={(currentQuestionIndex / questions.length) * 100} 
            className="h-3 bg-secondary/50"
          />
        </div>

        {/* Power-ups */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={useHint}
            disabled={powerUps.hint === 0 || usedHint || answerState !== 'idle'}
            className="bg-card/80 backdrop-blur-sm"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Hint ({powerUps.hint})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={useSkip}
            disabled={powerUps.skip === 0 || answerState !== 'idle'}
            className="bg-card/80 backdrop-blur-sm"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Skip ({powerUps.skip})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={useExtraTime}
            disabled={powerUps.extraTime === 0 || answerState !== 'idle'}
            className="bg-card/80 backdrop-blur-sm"
          >
            <Clock className="w-4 h-4 mr-1" />
            +Time ({powerUps.extraTime})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={useDoublePoints}
            disabled={powerUps.doublePoints === 0 || doublePointsActive || answerState !== 'idle'}
            className={cn("bg-card/80 backdrop-blur-sm", doublePointsActive && "bg-purple-500/20 border-purple-500")}
          >
            <Zap className="w-4 h-4 mr-1" />
            2x ({powerUps.doublePoints})
          </Button>
        </div>

        {/* Question Card */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">
                {CATEGORY_LABELS[currentQuestion.category]}
              </Badge>
              <Badge variant="outline" className={DIFFICULTY_COLORS[currentQuestion.difficulty]}>
                {currentQuestion.difficulty.toUpperCase()}
              </Badge>
              {doublePointsActive && (
                <Badge className="bg-purple-500 text-white animate-pulse">
                  DOUBLE POINTS!
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl md:text-2xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Answers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQuestion.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const isEliminated = eliminatedAnswers.includes(index);
            const showResult = answerState !== 'idle';
            
            let buttonClass = "h-auto p-6 text-left justify-start bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300";
            
            if (isEliminated) {
              buttonClass += " opacity-30 cursor-not-allowed";
            } else if (showResult) {
              if (isCorrect) {
                buttonClass += " bg-success/20 border-success text-success-foreground animate-pulse-success";
              } else if (isSelected && !isCorrect) {
                buttonClass += " bg-destructive/20 border-destructive text-destructive-foreground animate-shake";
              }
            }
            
            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClass}
                onClick={() => handleAnswer(index)}
                disabled={answerState !== 'idle' || isEliminated}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center mr-4 flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-base">{answer}</span>
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        {answerState !== 'idle' && (
          <div className="text-center">
            <Button onClick={nextQuestion} size="lg" className="px-8">
              {isLastQuestion ? 'Finish Game' : 'Next Question'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
