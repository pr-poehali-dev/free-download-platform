import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Game {
  id: number;
  title: string;
  genre: string;
  rating: number;
  image: string;
  trailer: string;
  description: string;
  releaseDate: string;
  isFavorite?: boolean;
}

const mockGames: Game[] = [
  {
    id: 1,
    title: 'Cyber Nexus 2077',
    genre: 'RPG / Action',
    rating: 9.2,
    image: 'https://cdn.poehali.dev/projects/a786bdb9-5d1f-4bd5-8347-dff577f3dd67/files/3405c5d9-ba4f-4761-bb10-91060e2f21f8.jpg',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Футуристическая киберпанк RPG с открытым миром, где ваш выбор определяет судьбу города',
    releaseDate: '2024',
  },
  {
    id: 2,
    title: 'Dragon Legacy',
    genre: 'RPG / Fantasy',
    rating: 9.5,
    image: 'https://cdn.poehali.dev/projects/a786bdb9-5d1f-4bd5-8347-dff577f3dd67/files/6b1b4a95-cf38-4a93-a94d-648fe4549706.jpg',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Эпическое средневековое фэнтези приключение с драконами и магией',
    releaseDate: '2024',
  },
  {
    id: 3,
    title: 'Stellar Conflict',
    genre: 'Shooter / Sci-Fi',
    rating: 8.9,
    image: 'https://cdn.poehali.dev/projects/a786bdb9-5d1f-4bd5-8347-dff577f3dd67/files/f71b6c35-2eeb-405f-93e7-b55f2399493c.jpg',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Космический шутер с невероятной графикой и динамичным геймплеем',
    releaseDate: '2024',
  },
];

const Index = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const toggleFavorite = (gameId: number) => {
    setFavorites(prev => 
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const filteredGames = activeTab === 'favorites' 
    ? mockGames.filter(game => favorites.includes(game.id))
    : mockGames;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Gamepad2" className="text-primary" size={32} />
            <h1 className="text-3xl font-bold neon-glow">GAME ZONE</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Icon name="Home" className="mr-2" size={20} />
              Главная
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Icon name="TrendingUp" className="mr-2" size={20} />
              Новинки
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Icon name="Trophy" className="mr-2" size={20} />
              Топ
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Icon name="User" className="mr-2" size={20} />
              Профиль
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 neon-glow">
              ЛУЧШИЕ ИГРЫ 2024
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Откройте мир невероятных приключений с нашим каталогом топовых игр
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground neon-border">
                <Icon name="Play" className="mr-2" size={20} />
                Смотреть трейлеры
              </Button>
              <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
                <Icon name="Star" className="mr-2" size={20} />
                Топ игр
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-card">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon name="Grid3x3" className="mr-2" size={18} />
                Все игры
              </TabsTrigger>
              <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon name="Sparkles" className="mr-2" size={18} />
                Новинки
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Icon name="Heart" className="mr-2" size={18} />
                Избранное
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGames.map((game) => (
                  <Card 
                    key={game.id} 
                    className="bg-card border-border overflow-hidden group cursor-pointer card-glow transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative">
                      <img 
                        src={game.image} 
                        alt={game.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-card/80 backdrop-blur-sm hover:bg-primary hover:scale-110 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(game.id);
                          }}
                        >
                          <Icon 
                            name={favorites.includes(game.id) ? "Heart" : "Heart"} 
                            className={favorites.includes(game.id) ? "fill-accent text-accent" : ""}
                            size={20} 
                          />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <Badge className="bg-primary/80 text-primary-foreground mb-2">
                          {game.genre}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {game.title}
                        </h3>
                        <div className="flex items-center gap-1 bg-secondary/20 px-3 py-1 rounded-full">
                          <Icon name="Star" className="text-secondary fill-secondary" size={16} />
                          <span className="text-secondary font-bold">{game.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {game.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Icon name="Calendar" size={16} />
                          {game.releaseDate}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                              <Icon name="Play" className="mr-2" size={18} />
                              Трейлер
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl bg-card border-primary/30">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">{game.title}</DialogTitle>
                            </DialogHeader>
                            <div className="aspect-video">
                              <iframe
                                width="100%"
                                height="100%"
                                src={game.trailer}
                                title={game.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg"
                              ></iframe>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-bold text-lg mb-2 text-primary">Описание</h4>
                                <p className="text-muted-foreground">{game.description}</p>
                              </div>
                              <div className="flex gap-4">
                                <div>
                                  <span className="text-muted-foreground">Жанр: </span>
                                  <Badge className="bg-primary/20 text-primary">{game.genre}</Badge>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Рейтинг: </span>
                                  <span className="text-secondary font-bold">{game.rating}/10</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {activeTab === 'favorites' && filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <Icon name="HeartCrack" className="mx-auto text-muted-foreground mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-muted-foreground mb-2">
                    Пока нет избранных игр
                  </h3>
                  <p className="text-muted-foreground">
                    Добавьте игры в избранное, нажав на иконку сердца
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="border-t border-border bg-card/50 backdrop-blur-lg py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Gamepad2" className="text-primary" size={28} />
            <span className="text-2xl font-bold neon-glow">GAME ZONE</span>
          </div>
          <p className="text-muted-foreground">
            Ваш портал в мир лучших игр © 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
