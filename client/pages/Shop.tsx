import { useState } from 'react';
import { Coins, ShoppingCart, Zap, Clock, Lightbulb, SkipForward, Star, Package, Crown, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { POWER_UPS } from '@shared/trivia';
import { cn } from '@/lib/utils';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'power-up' | 'cosmetic' | 'bundle';
  icon: React.ComponentType<{ className?: string }>;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  discount?: number;
  bundle?: {
    items: string[];
    savings: number;
  };
}

const shopItems: ShopItem[] = [
  // Power-ups
  {
    id: 'hint_pack_5',
    name: 'Hint Pack (5x)',
    description: 'Get 5 hints to eliminate wrong answers',
    price: 100,
    category: 'power-up',
    icon: Lightbulb,
    rarity: 'common'
  },
  {
    id: 'skip_pack_3',
    name: 'Skip Pack (3x)',
    description: 'Skip 3 difficult questions without penalty',
    price: 120,
    category: 'power-up',
    icon: SkipForward,
    rarity: 'common'
  },
  {
    id: 'extra_time_pack_5',
    name: 'Extra Time Pack (5x)',
    description: 'Add 10 seconds to your timer 5 times',
    price: 80,
    category: 'power-up',
    icon: Clock,
    rarity: 'common'
  },
  {
    id: 'double_points_pack_3',
    name: 'Double Points Pack (3x)',
    description: 'Double your points for the next 3 questions',
    price: 200,
    category: 'power-up',
    icon: Zap,
    rarity: 'uncommon'
  },
  
  // Cosmetics
  {
    id: 'premium_avatar_1',
    name: 'Golden Crown Avatar',
    description: 'Show your royal status with this premium avatar',
    price: 500,
    category: 'cosmetic',
    icon: Crown,
    rarity: 'epic'
  },
  {
    id: 'theme_dark_purple',
    name: 'Dark Purple Theme',
    description: 'Customize your game with this sleek purple theme',
    price: 300,
    category: 'cosmetic',
    icon: Palette,
    rarity: 'rare'
  },
  {
    id: 'theme_neon_green',
    name: 'Neon Green Theme',
    description: 'Stand out with this vibrant neon theme',
    price: 350,
    category: 'cosmetic',
    icon: Palette,
    rarity: 'rare'
  },
  
  // Bundles
  {
    id: 'starter_bundle',
    name: 'Starter Power Bundle',
    description: 'Perfect for new players - includes hints, skips, and extra time',
    price: 250,
    category: 'bundle',
    icon: Package,
    rarity: 'uncommon',
    bundle: {
      items: ['5x Hints', '3x Skips', '5x Extra Time'],
      savings: 50
    }
  },
  {
    id: 'premium_bundle',
    name: 'Premium Player Bundle',
    description: 'Everything you need to dominate - includes rare power-ups and cosmetics',
    price: 800,
    category: 'bundle',
    icon: Crown,
    rarity: 'legendary',
    discount: 20,
    bundle: {
      items: ['10x Hints', '5x Skips', '3x Double Points', 'Premium Avatar', 'Custom Theme'],
      savings: 200
    }
  }
];

const mockUserData = {
  currency: 450,
  ownedItems: ['hint_pack_5', 'theme_dark_purple'],
  powerUps: {
    hint: 12,
    skip: 3,
    extraTime: 8,
    doublePoints: 2
  }
};

const rarityColors = {
  common: 'border-gray-500 bg-gray-500/10',
  uncommon: 'border-green-500 bg-green-500/10',
  rare: 'border-blue-500 bg-blue-500/10',
  epic: 'border-purple-500 bg-purple-500/10',
  legendary: 'border-yellow-500 bg-yellow-500/10'
};

export default function Shop() {
  const [userData, setUserData] = useState(mockUserData);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const handlePurchase = (item: ShopItem) => {
    if (userData.currency >= item.price) {
      setUserData(prev => ({
        ...prev,
        currency: prev.currency - item.price,
        ownedItems: [...prev.ownedItems, item.id]
      }));
      setSelectedItem(null);
    }
  };

  const ShopItemCard = ({ item }: { item: ShopItem }) => {
    const isOwned = userData.ownedItems.includes(item.id);
    const canAfford = userData.currency >= item.price;
    const discountPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

    return (
      <Card className={cn(
        "bg-card/80 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105",
        rarityColors[item.rarity],
        isOwned && "opacity-60"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn("capitalize", rarityColors[item.rarity])}>
              {item.rarity}
            </Badge>
            {item.discount && (
              <Badge variant="destructive" className="bg-red-500">
                -{item.discount}%
              </Badge>
            )}
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <item.icon className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {item.bundle && (
            <div className="bg-secondary/50 rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-2">Bundle Includes:</h4>
              <ul className="text-xs space-y-1">
                {item.bundle.items.map((bundleItem, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {bundleItem}
                  </li>
                ))}
              </ul>
              <div className="text-green-500 text-xs mt-2 font-medium">
                Save {item.bundle.savings} coins!
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-accent" />
              <div className="flex items-center gap-2">
                {item.discount ? (
                  <>
                    <span className="text-lg font-bold">{Math.floor(discountPrice)}</span>
                    <span className="text-sm line-through text-muted-foreground">{item.price}</span>
                  </>
                ) : (
                  <span className="text-lg font-bold">{item.price}</span>
                )}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  disabled={isOwned}
                  variant={canAfford ? "default" : "outline"}
                  onClick={() => setSelectedItem(item)}
                >
                  {isOwned ? 'Owned' : canAfford ? 'Buy' : 'Not enough coins'}
                </Button>
              </DialogTrigger>
              
              {selectedItem && (
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Purchase</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <selectedItem.icon className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                      <p className="text-muted-foreground">{selectedItem.description}</p>
                    </div>
                    
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-accent" />
                          <span className="font-semibold">{selectedItem.price}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Your balance:</span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-accent" />
                          <span className="font-semibold">{userData.currency}</span>
                        </div>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>After purchase:</span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-accent" />
                          <span className="font-semibold">{userData.currency - selectedItem.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedItem(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handlePurchase(selectedItem)}
                        disabled={userData.currency < selectedItem.price}
                      >
                        Confirm Purchase
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TriviaMaster Shop
            </h1>
            <p className="text-xl text-muted-foreground">
              Enhance your trivia experience with power-ups and cosmetics
            </p>
          </div>
          
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <Coins className="w-6 h-6 text-accent" />
              <div>
                <div className="text-2xl font-bold">{userData.currency}</div>
                <div className="text-sm text-muted-foreground">Coins</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Power-ups */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Your Power-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{userData.powerUps.hint}</div>
                <div className="text-sm text-muted-foreground">Hints</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <SkipForward className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{userData.powerUps.skip}</div>
                <div className="text-sm text-muted-foreground">Skips</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{userData.powerUps.extraTime}</div>
                <div className="text-sm text-muted-foreground">Extra Time</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg">
                <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{userData.powerUps.doublePoints}</div>
                <div className="text-sm text-muted-foreground">Double Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shop Tabs */}
        <Tabs defaultValue="power-ups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="power-ups" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Power-ups
            </TabsTrigger>
            <TabsTrigger value="cosmetics" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Cosmetics
            </TabsTrigger>
            <TabsTrigger value="bundles" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Bundles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="power-ups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopItems.filter(item => item.category === 'power-up').map((item) => (
                <ShopItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cosmetics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shopItems.filter(item => item.category === 'cosmetic').map((item) => (
                <ShopItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bundles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shopItems.filter(item => item.category === 'bundle').map((item) => (
                <ShopItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
