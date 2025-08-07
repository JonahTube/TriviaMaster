import { useState } from 'react';
import { User, Trophy, Star, Flame, Calendar, Target, Coins, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORY_LABELS, TriviaCategory } from '@shared/trivia';
import { cn } from '@/lib/utils';

// Mock user data - in real app this would come from API/database
const mockUserData = {
  id: '1',
  username: 'TriviaMaster2024',
  email: 'user@example.com',
  totalPoints: 12847,
  currentStreak: 15,
  bestStreak: 47,
  questionsAnswered: 3429,
  correctAnswers: 2786,
  currency: 450,
  rank: 156,
  joinDate: new Date('2024-01-15'),
  lastActive: new Date(),
  avatar: '/placeholder.svg',
  level: 23,
  experiencePoints: 12847,
  experienceToNext: 3153,
  badgesEarned: [
    { id: 'first_win', name: 'First Victory', description: 'Answer your first question correctly', rarity: 'common' },
    { id: 'streak_5', name: 'Hot Streak', description: 'Get 5 correct answers in a row', rarity: 'common' },
    { id: 'streak_10', name: 'Fire Streak', description: 'Get 10 correct answers in a row', rarity: 'uncommon' },
    { id: 'science_master', name: 'Science Expert', description: 'Answer 100 science questions correctly', rarity: 'rare' },
    { id: 'daily_grinder', name: 'Daily Warrior', description: 'Complete daily missions for 7 days', rarity: 'epic' },
    { id: 'point_hunter', name: 'Point Hunter', description: 'Earn 10,000 points', rarity: 'legendary' }
  ],
  categoryStats: {
    general: { answered: 687, correct: 562, accuracy: 82 },
    science: { answered: 543, correct: 441, accuracy: 81 },
    sports: { answered: 412, correct: 298, accuracy: 72 },
    movies: { answered: 623, correct: 487, accuracy: 78 },
    history: { answered: 578, correct: 456, accuracy: 79 },
    'pop-culture': { answered: 586, correct: 542, accuracy: 92 }
  }
};

const avatarOptions = [
  '/placeholder.svg',
  '🎯', '🧠', '⚡', '🔥', '💎', '🌟', '🏆', '🎮', '🚀', '👑'
];

const rarityColors = {
  common: 'border-gray-500 bg-gray-500/10',
  uncommon: 'border-green-500 bg-green-500/10',
  rare: 'border-blue-500 bg-blue-500/10',
  epic: 'border-purple-500 bg-purple-500/10',
  legendary: 'border-yellow-500 bg-yellow-500/10'
};

export default function Profile() {
  const [user, setUser] = useState(mockUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user.username,
    avatar: user.avatar
  });

  const accuracy = Math.round((user.correctAnswers / user.questionsAnswered) * 100);
  const levelProgress = (user.experiencePoints % 1000) / 10; // Simplified leveling

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      username: editForm.username,
      avatar: editForm.avatar
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      username: user.username,
      avatar: user.avatar
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border border-border/50">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/50">
                  <AvatarImage src={user.avatar.startsWith('/') ? user.avatar : undefined} />
                  <AvatarFallback className="text-4xl">
                    {user.avatar.startsWith('/') ? user.username[0].toUpperCase() : user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  {user.level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                        className="text-xl font-bold"
                      />
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold">{user.username}</h1>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    Rank #{user.rank}
                  </Badge>
                </div>

                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Level {user.level}</span>
                    <span className="text-sm text-muted-foreground">
                      {user.experienceToNext} XP to next level
                    </span>
                  </div>
                  <Progress value={levelProgress} className="h-3 bg-secondary/50" />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{user.currency}</div>
                    <div className="text-sm text-muted-foreground">Coins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{user.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Selection (when editing) */}
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-lg font-semibold mb-4">Choose Avatar</h3>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                  {avatarOptions.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => setEditForm(prev => ({ ...prev, avatar }))}
                      className={cn(
                        "w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all",
                        editForm.avatar === avatar 
                          ? "border-primary bg-primary/20" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {avatar.startsWith('/') ? '👤' : avatar}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Stats Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.questionsAnswered.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {user.correctAnswers.toLocaleString()} correct answers
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
                  <Flame className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.bestStreak}</div>
                  <p className="text-xs text-muted-foreground">
                    Current: {user.currentStreak}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {user.joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor((Date.now() - user.joinDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.badgesEarned.map((badge) => (
                <Card key={badge.id} className={cn("bg-card/80 backdrop-blur-sm border-2", rarityColors[badge.rarity])}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                    <Badge variant="outline" className={cn("capitalize", rarityColors[badge.rarity])}>
                      {badge.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(user.categoryStats).map(([category, stats]) => (
                <Card key={category} className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {CATEGORY_LABELS[category as TriviaCategory]}
                      <Badge variant="secondary">{stats.accuracy}% accuracy</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{stats.correct}/{stats.answered}</span>
                    </div>
                    <Progress value={stats.accuracy} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-semibold">{stats.answered}</div>
                        <div className="text-muted-foreground">Answered</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-500">{stats.correct}</div>
                        <div className="text-muted-foreground">Correct</div>
                      </div>
                      <div>
                        <div className="font-semibold text-red-500">{stats.answered - stats.correct}</div>
                        <div className="text-muted-foreground">Wrong</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Completed Daily Mission', points: '+50 points', time: '2 hours ago', type: 'mission' },
                    { action: 'Answered 10 Science questions', points: '+180 points', time: '4 hours ago', type: 'game' },
                    { action: 'Earned "Hot Streak" badge', points: '+25 coins', time: '6 hours ago', type: 'achievement' },
                    { action: 'Reached Level 23', points: '+100 points', time: '1 day ago', type: 'level' },
                    { action: 'Completed Movie category quiz', points: '+95 points', time: '2 days ago', type: 'game' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          activity.type === 'mission' ? 'bg-blue-500' :
                          activity.type === 'game' ? 'bg-green-500' :
                          activity.type === 'achievement' ? 'bg-yellow-500' :
                          'bg-purple-500'
                        )} />
                        <div>
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">{activity.time}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-500">{activity.points}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
