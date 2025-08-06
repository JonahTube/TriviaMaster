import { Link, useLocation } from 'react-router-dom';
import { Brain, Home, Play, Trophy, User, Target, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function Navigation() {
  const location = useLocation();
  
  const navigationItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/play', label: 'Play', icon: Play },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/missions', label: 'Missions', icon: Target },
    { href: '/profile', label: 'Profile', icon: User }
  ];

  const NavItems = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
              mobile ? "text-base" : "text-sm",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
            {item.label === 'Missions' && (
              <Badge variant="secondary" className="ml-auto">3</Badge>
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TriviaMaster
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItems />
        </nav>

        {/* User Stats (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">1,247</span>
            <span className="text-muted-foreground">pts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span className="font-semibold">45</span>
            <span className="text-muted-foreground">coins</span>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                {/* User Stats (Mobile) */}
                <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Points</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Coins</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rank</span>
                    <span className="font-semibold">#156</span>
                  </div>
                </div>
                
                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                  <NavItems mobile />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
