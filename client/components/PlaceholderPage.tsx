import { Link } from 'react-router-dom';
import { Construction, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon = Construction 
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-muted to-muted/50 rounded-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl mb-2">{title}</CardTitle>
          <p className="text-muted-foreground text-lg">
            {description}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/50 rounded-lg p-6 text-center">
            <Construction className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
            <p className="text-muted-foreground">
              This feature is currently under development. Check back soon for updates!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <MessageCircle className="w-5 h-5 mr-2" />
              Request Feature
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            Want this feature implemented? Continue prompting to help build it out!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
