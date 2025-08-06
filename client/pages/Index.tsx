import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Trophy, Target, Zap, Users, Star, Play, Timer, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Index() {
  const [animatedStats, setAnimatedStats] = useState({
    players: 0,
    questions: 0,
    points: 0
  });

  useEffect(() => {
    // Animate stats on load
    const targetStats = { players: 12547, questions: 50000, points: 2847593 };
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 fps
    const stepTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        players: Math.floor(targetStats.players * easeOut),
        questions: Math.floor(targetStats.questions * easeOut),
        points: Math.floor(targetStats.points * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats(targetStats);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Multiple Categories',
      description: 'Test your knowledge across Science, History, Sports, Movies, and more'
    },
    {
      icon: Target,
      title: 'Daily Missions',
      description: 'Complete personalized challenges and earn bonus rewards every day'
    },
    {
      icon: Trophy,
      title: 'Global Leaderboards',
      description: 'Compete with players worldwide in daily, weekly, and all-time rankings'
    },
    {
      icon: Zap,
      title: 'Power-Ups & Strategy',
      description: 'Use hints, skip questions, or double your points with strategic power-ups'
    }
  ];

  const categories = [
    { name: 'General Knowledge', color: 'bg-purple-500', questions: '8.2k' },
    { name: 'Science', color: 'bg-blue-500', questions: '6.1k' },
    { name: 'Sports', color: 'bg-green-500', questions: '4.8k' },
    { name: 'Movies', color: 'bg-red-500', questions: '7.3k' },
    { name: 'History', color: 'bg-yellow-500', questions: '5.9k' },
    { name: 'Pop Culture', color: 'bg-pink-500', questions: '6.7k' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-50" />
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-75 animate-pulse" />
              <Brain className="relative w-20 h-20 text-primary mx-auto" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            TriviaMaster
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Challenge your mind, climb the leaderboards, and earn rewards in the ultimate trivia experience
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/play">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105">
                <Play className="w-6 h-6 mr-2" />
                Start Playing
              </Button>
            </Link>
            
            <Link to="/leaderboard">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Trophy className="w-6 h-6 mr-2" />
                View Leaderboard
              </Button>
            </Link>
          </div>
          
          {/* Live Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary mr-2" />
                <span className="text-2xl font-bold text-foreground">
                  {animatedStats.players.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Active Players</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-center mb-2">
                <Brain className="w-6 h-6 text-accent mr-2" />
                <span className="text-2xl font-bold text-foreground">
                  {animatedStats.questions.toLocaleString()}+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-foreground">
                  {animatedStats.points.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Points Awarded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose TriviaMaster?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              More than just trivia - it's a complete gaming experience designed to challenge and reward you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trivia Categories</h2>
            <p className="text-xl text-muted-foreground">
              Explore diverse topics and find your expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-4 h-4 rounded-full ${category.color}`} />
                    <Badge variant="secondary">{category.questions} questions</Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <Timer className="w-4 h-4 mr-1" />
                    <span className="text-sm">15-30s per question</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Test Your Knowledge?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players competing daily. Earn points, unlock achievements, and climb the leaderboards!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/play">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105">
                <Play className="w-6 h-6 mr-2" />
                Play Now - It's Free!
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Coins className="w-6 h-6 mr-2" />
                Create Profile
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
