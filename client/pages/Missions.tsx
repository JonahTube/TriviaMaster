import { useState, useEffect } from 'react';
import { Target, Clock, CheckCircle, Coins, Star, Gift, Calendar, Flame, Trophy, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORY_LABELS, SAMPLE_MISSIONS, DailyMission } from '@shared/trivia';
import { cn } from '@/lib/utils';

// Mock missions data - in real app this would come from API
const generateDailyMissions = (): DailyMission[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return [
    {
      id: 'daily_1',
      title: 'Daily Grind',
      description: 'Answer 15 trivia questions today',
      requirement: {
        type: 'questions_answered',
        target: 15
      },
      reward: {
        points: 75,
        currency: 15,
        badge: 'daily_grinder'
      },
      progress: 8,
      completed: false,
      expiresAt: tomorrow
    },
    {
      id: 'daily_2',
      title: 'Streak Master',
      description: 'Get 8 correct answers in a row',
      requirement: {
        type: 'correct_streak',
        target: 8
      },
      reward: {
        points: 120,
        currency: 25
      },
      progress: 3,
      completed: false,
      expiresAt: tomorrow
    },
    {
      id: 'daily_3',
      title: 'Science Explorer',
      description: 'Complete 5 science questions correctly',
      requirement: {
        type: 'category_complete',
        target: 5,
        category: 'science'
      },
      reward: {
        points: 90,
        currency: 18
      },
      progress: 5,
      completed: true,
      expiresAt: tomorrow
    },
    {
      id: 'daily_4',
      title: 'Point Hunter',
      description: 'Earn 300 points today',
      requirement: {
        type: 'points_earned',
        target: 300
      },
      reward: {
        points: 150,
        currency: 30,
        badge: 'point_hunter'
      },
      progress: 180,
      completed: false,
      expiresAt: tomorrow
    }
  ];
};

const generateWeeklyMissions = (): DailyMission[] => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);

  return [
    {
      id: 'weekly_1',
      title: 'Weekly Champion',
      description: 'Complete all daily missions for 5 days',
      requirement: {
        type: 'questions_answered',
        target: 5
      },
      reward: {
        points: 500,
        currency: 100,
        badge: 'weekly_champion'
      },
      progress: 2,
      completed: false,
      expiresAt: nextWeek
    },
    {
      id: 'weekly_2',
      title: 'Category Master',
      description: 'Get 90% accuracy in any category with 20+ questions',
      requirement: {
        type: 'questions_answered',
        target: 20
      },
      reward: {
        points: 400,
        currency: 80,
        badge: 'category_master'
      },
      progress: 12,
      completed: false,
      expiresAt: nextWeek
    }
  ];
};

const mockUserProgress = {
  dailyStreak: 7,
  weeklyStreak: 2,
  totalMissionsCompleted: 156,
  dailyMissionsCompleted: 143,
  weeklyMissionsCompleted: 13
};

export default function Missions() {
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([]);
  const [weeklyMissions, setWeeklyMissions] = useState<DailyMission[]>([]);
  const [timeToReset, setTimeToReset] = useState<string>('');

  useEffect(() => {
    setDailyMissions(generateDailyMissions());
    setWeeklyMissions(generateWeeklyMissions());

    // Update countdown timer
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeToReset(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const claimReward = (missionId: string, type: 'daily' | 'weekly') => {
    if (type === 'daily') {
      setDailyMissions(missions => 
        missions.map(mission => 
          mission.id === missionId 
            ? { ...mission, completed: true, progress: mission.requirement.target }
            : mission
        )
      );
    } else {
      setWeeklyMissions(missions => 
        missions.map(mission => 
          mission.id === missionId 
            ? { ...mission, completed: true, progress: mission.requirement.target }
            : mission
        )
      );
    }
  };

  const MissionCard = ({ mission, type }: { mission: DailyMission; type: 'daily' | 'weekly' }) => {
    const progressPercentage = (mission.progress / mission.requirement.target) * 100;
    const isCompleted = mission.completed || mission.progress >= mission.requirement.target;
    const canClaim = !mission.completed && mission.progress >= mission.requirement.target;

    return (
      <Card className={cn(
        "bg-card/80 backdrop-blur-sm border transition-all duration-300",
        isCompleted ? "border-green-500/50 bg-green-500/5" : "border-border/50 hover:border-primary/50"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isCompleted ? "bg-green-500/20" : "bg-primary/20"
              )}>
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Target className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{mission.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{mission.description}</p>
              </div>
            </div>
            <Badge variant={type === 'daily' ? 'default' : 'secondary'} className="capitalize">
              {type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">
                {mission.progress}/{mission.requirement.target}
                {mission.requirement.category && ` (${CATEGORY_LABELS[mission.requirement.category]})`}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{mission.reward.points} pts</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-accent" />
                <span>{mission.reward.currency}</span>
              </div>
              {mission.reward.badge && (
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <span className="text-xs">Badge</span>
                </div>
              )}
            </div>

            {canClaim && (
              <Button 
                size="sm" 
                onClick={() => claimReward(mission.id, type)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Gift className="w-4 h-4 mr-1" />
                Claim
              </Button>
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Resets in {timeToReset}</span>
            </div>
            {isCompleted && (
              <Badge variant="outline" className="text-green-500 border-green-500">
                Completed
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Daily Missions
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete challenges to earn extra points, coins, and exclusive badges
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{mockUserProgress.dailyStreak}</div>
              <div className="text-sm text-muted-foreground">Daily Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{mockUserProgress.weeklyStreak}</div>
              <div className="text-sm text-muted-foreground">Weekly Streak</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{mockUserProgress.dailyMissionsCompleted}</div>
              <div className="text-sm text-muted-foreground">Daily Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">{mockUserProgress.weeklyMissionsCompleted}</div>
              <div className="text-sm text-muted-foreground">Weekly Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Tabs */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Daily Missions
              <Badge variant="secondary" className="ml-2">
                {dailyMissions.filter(m => !m.completed).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Weekly Challenges
              <Badge variant="secondary" className="ml-2">
                {weeklyMissions.filter(m => !m.completed).length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Daily Missions */}
          <TabsContent value="daily" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dailyMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} type="daily" />
              ))}
            </div>

            {/* Daily Mission Info */}
            <Card className="bg-card/80 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">Daily Mission Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Missions reset daily at midnight UTC</li>
                  <li>• Complete all daily missions to maintain your streak</li>
                  <li>• Higher difficulty questions count towards mission progress</li>
                  <li>• Some missions offer exclusive badges that show your dedication</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Missions */}
          <TabsContent value="weekly" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weeklyMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} type="weekly" />
              ))}
            </div>

            {/* Weekly Mission Info */}
            <Card className="bg-card/80 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-purple-500" />
                  <h3 className="text-lg font-semibold">Weekly Challenge Info</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Weekly missions are more challenging but offer greater rewards</li>
                  <li>• These missions reset every Monday at midnight UTC</li>
                  <li>• Weekly missions often require consistent daily play</li>
                  <li>• Completing weekly missions earns rare badges and bonus currency</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
