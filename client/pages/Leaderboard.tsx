import { useState } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, TrendingDown, Minus, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  points: number;
  level: number;
  streak: number;
  accuracy: number;
  gamesPlayed: number;
  rankChange: number; // -1 down, 0 same, 1 up
  badges: string[];
}

// Mock leaderboard data
const generateLeaderboard = (timeframe: 'daily' | 'weekly' | 'all-time'): LeaderboardEntry[] => {
  const baseData = [
    { username: 'TriviaMaster2024', avatar: '👑', points: 15847, level: 45, streak: 89, accuracy: 94, games: 234, change: 0 },
    { username: 'QuizWizard', avatar: '🧙‍♂️', points: 14523, level: 42, streak: 67, accuracy: 92, games: 198, change: 1 },
    { username: 'BrainiacBob', avatar: '🧠', points: 13945, level: 41, streak: 45, accuracy: 89, games: 167, change: -1 },
    { username: 'KnowledgeKing', avatar: '👑', points: 13456, level: 40, streak: 34, accuracy: 91, games: 145, change: 2 },
    { username: 'QuestionQueen', avatar: '💎', points: 12987, level: 38, streak: 56, accuracy: 88, games: 156, change: 0 },
    { username: 'FactFinder', avatar: '🔍', points: 12734, level: 37, streak: 23, accuracy: 86, games: 134, change: -2 },
    { username: 'SmartyCat', avatar: '🐱', points: 12456, level: 36, streak: 78, accuracy: 87, games: 123, change: 1 },
    { username: 'TriviaChamp', avatar: '🏆', points: 12234, level: 35, streak: 34, accuracy: 85, games: 145, change: 0 },
    { username: 'InfoNinja', avatar: '🥷', points: 11987, level: 34, streak: 45, accuracy: 83, games: 167, change: 3 },
    { username: 'QuizMachine', avatar: '🤖', points: 11756, level: 33, streak: 12, accuracy: 84, games: 189, change: -1 },
    { username: 'DataDragon', avatar: '🐉', points: 11523, level: 32, streak: 67, accuracy: 82, games: 178, change: 1 },
    { username: 'LogicLord', avatar: '⚡', points: 11345, level: 31, streak: 23, accuracy: 81, games: 145, change: 0 },
    { username: 'MemoryMaster', avatar: '🎯', points: 11123, level: 30, streak: 89, accuracy: 80, games: 156, change: -3 },
    { username: 'ThinkTank', avatar: '💭', points: 10987, level: 29, streak: 34, accuracy: 79, games: 134, change: 2 },
    { username: 'WisdomWolf', avatar: '🐺', points: 10845, level: 28, streak: 56, accuracy: 78, games: 123, change: 1 }
  ];

  // Adjust points based on timeframe
  const multiplier = timeframe === 'daily' ? 0.1 : timeframe === 'weekly' ? 0.3 : 1;
  
  return baseData.map((entry, index) => ({
    rank: index + 1,
    userId: `user_${index + 1}`,
    username: entry.username,
    avatar: entry.avatar,
    points: Math.floor(entry.points * multiplier),
    level: entry.level,
    streak: entry.streak,
    accuracy: entry.accuracy,
    gamesPlayed: entry.games,
    rankChange: entry.change,
    badges: index < 3 ? ['top_player'] : index < 10 ? ['elite_player'] : []
  }));
};

// Mock current user data
const currentUser = {
  rank: 156,
  username: 'TriviaMaster2024',
  avatar: '🎯',
  points: 2847,
  level: 23,
  streak: 15,
  accuracy: 82,
  gamesPlayed: 89
};

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'all-time'>('all-time');
  const [leaderboard, setLeaderboard] = useState(generateLeaderboard('all-time'));

  const handleTimeframeChange = (newTimeframe: 'daily' | 'weekly' | 'all-time') => {
    setTimeframe(newTimeframe);
    setLeaderboard(generateLeaderboard(newTimeframe));
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 text-center font-bold text-muted-foreground">{rank}</span>;
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const LeaderboardRow = ({ entry, isCurrentUser = false }: { entry: LeaderboardEntry; isCurrentUser?: boolean }) => (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-lg transition-all duration-200",
      isCurrentUser ? "bg-primary/10 border border-primary/30" : "bg-card/50 hover:bg-card/80",
      entry.rank <= 3 && "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30"
    )}>
      {/* Rank */}
      <div className="flex items-center gap-2 w-12">
        {getRankIcon(entry.rank)}
        {entry.rank <= 10 && getRankChangeIcon(entry.rankChange)}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="w-12 h-12 border-2 border-primary/30">
          <AvatarFallback className="text-lg">
            {entry.avatar}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{entry.username}</h3>
            {isCurrentUser && <Badge variant="secondary">You</Badge>}
            {entry.badges.includes('top_player') && <Crown className="w-4 h-4 text-yellow-500" />}
            {entry.badges.includes('elite_player') && <Star className="w-4 h-4 text-purple-500" />}
          </div>
          <div className="text-sm text-muted-foreground">
            Level {entry.level} • {entry.accuracy}% accuracy
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="font-semibold">{entry.streak}</div>
          <div className="text-muted-foreground">Streak</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">{entry.gamesPlayed}</div>
          <div className="text-muted-foreground">Games</div>
        </div>
      </div>

      {/* Points */}
      <div className="text-right">
        <div className="text-xl font-bold text-primary">
          {entry.points.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">points</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Leaderboards
          </h1>
          <p className="text-xl text-muted-foreground">
            See how you stack up against the best trivia players worldwide
          </p>
        </div>

        {/* Current User Position */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Current Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LeaderboardRow 
              entry={{
                rank: currentUser.rank,
                userId: 'current_user',
                username: currentUser.username,
                avatar: currentUser.avatar,
                points: currentUser.points,
                level: currentUser.level,
                streak: currentUser.streak,
                accuracy: currentUser.accuracy,
                gamesPlayed: currentUser.gamesPlayed,
                rankChange: 0,
                badges: []
              }} 
              isCurrentUser={true}
            />
          </CardContent>
        </Card>

        {/* Leaderboard Tabs */}
        <Tabs value={timeframe} onValueChange={(value) => handleTimeframeChange(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="all-time" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              All Time
            </TabsTrigger>
          </TabsList>

          <TabsContent value={timeframe} className="space-y-4">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <Card key={entry.userId} className={cn(
                  "bg-gradient-to-br backdrop-blur-sm border-2",
                  index === 0 ? "from-yellow-500/20 to-orange-500/20 border-yellow-500/50" :
                  index === 1 ? "from-gray-400/20 to-gray-600/20 border-gray-400/50" :
                  "from-amber-600/20 to-amber-800/20 border-amber-600/50"
                )}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-primary/30">
                      <AvatarFallback className="text-2xl">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold mb-2">{entry.username}</h3>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {entry.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Level {entry.level} • {entry.accuracy}% accuracy
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Full Leaderboard */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Full Rankings</span>
                  <Badge variant="secondary">
                    {timeframe === 'daily' ? 'Today' : 
                     timeframe === 'weekly' ? 'This Week' : 
                     'All Time'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {leaderboard.slice(3).map((entry) => (
                  <LeaderboardRow key={entry.userId} entry={entry} />
                ))}
                
                {/* Load More Button */}
                <div className="text-center pt-6">
                  <Button variant="outline" className="w-full md:w-auto">
                    Load More Players
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Info */}
            <Card className="bg-card/80 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold">Leaderboard Information</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Rankings update in real-time as players complete games</li>
                  <li>• Daily leaderboard resets every day at midnight UTC</li>
                  <li>• Weekly leaderboard resets every Monday at midnight UTC</li>
                  <li>• All-time rankings show cumulative performance since joining</li>
                  <li>• Accuracy is calculated from your last 100 questions</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
