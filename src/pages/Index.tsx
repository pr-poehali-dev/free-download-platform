import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
}

const API_URL = 'https://functions.poehali.dev/1a5a056d-57ae-42eb-8427-9ff10a399f52';

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newGame, setNewGame] = useState({
    title: '',
    genre: '',
    rating: 0,
    image: '',
    trailer: '',
    description: '',
    releaseDate: '2025'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddGame = async () => {
    try {
      const gameData: any = { ...newGame };

      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          gameData.imageFile = reader.result as string;
          gameData.imageType = selectedFile.type.split('/')[1];

          await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
          });

          setIsAdminOpen(false);
          setNewGame({
            title: '',
            genre: '',
            rating: 0,
            image: '',
            trailer: '',
            description: '',
            releaseDate: '2025'
          });
          setSelectedFile(null);
          loadGames();
        };
        reader.readAsDataURL(selectedFile);
      } else if (newGame.image) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gameData)
        });

        setIsAdminOpen(false);
        setNewGame({
          title: '',
          genre: '',
          rating: 0,
          image: '',
          trailer: '',
          description: '',
          releaseDate: '2025'
        });
        loadGames();
      }
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  const handleDeleteGame = async (gameId: number) => {
    try {
      await fetch(`${API_URL}?id=${gameId}`, { method: 'DELETE' });
      loadGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const toggleFavorite = (gameId: number) => {
    setFavorites(prev => 
      prev.includes(gameId) ? prev.filter(id => id !== gameId) : [...prev, gameId]
    );
  };

  const filteredGames = games.filter(game => {
    const matchesTab = activeTab === 'favorites' ? favorites.includes(game.id) : true;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
            <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  <Icon name="Plus" className="mr-2" size={20} />
                  Добавить игру
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-primary/30 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Добавить новую игру</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Название игры</Label>
                    <Input
                      placeholder="Название"
                      value={newGame.title}
                      onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Жанр</Label>
                    <Input
                      placeholder="RPG / Action"
                      value={newGame.genre}
                      onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Рейтинг (0-10)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={newGame.rating}
                      onChange={(e) => setNewGame({ ...newGame, rating: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Обложка игры</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-1">или укажите URL изображения:</p>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={newGame.image}
                      onChange={(e) => setNewGame({ ...newGame, image: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Ссылка на трейлер (YouTube embed)</Label>
                    <Input
                      placeholder="https://www.youtube.com/embed/..."
                      value={newGame.trailer}
                      onChange={(e) => setNewGame({ ...newGame, trailer: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Описание</Label>
                    <Textarea
                      placeholder="Описание игры"
                      value={newGame.description}
                      onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Год выхода</Label>
                    <Input
                      placeholder="2025"
                      value={newGame.releaseDate}
                      onChange={(e) => setNewGame({ ...newGame, releaseDate: e.target.value })}
                    />
                  </div>
                  <Button 
                    onClick={handleAddGame} 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!newGame.title || !newGame.genre || !newGame.description || (!selectedFile && !newGame.image)}
                  >
                    <Icon name="Plus" className="mr-2" size={20} />
                    Добавить игру
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </nav>
        </div>
      </header>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 neon-glow">
              ЛУЧШИЕ ИГРЫ 2025
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
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Поиск игр по названию или жанру..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card border-border focus:border-primary transition-colors"
              />
              {searchQuery && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <Icon name="X" size={20} />
                </Button>
              )}
            </div>
          </div>
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
              {isLoading ? (
                <div className="text-center py-20">
                  <Icon name="Loader2" className="mx-auto text-primary mb-4 animate-spin" size={64} />
                  <p className="text-muted-foreground">Загрузка игр...</p>
                </div>
              ) : (
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
                              name="Heart"
                              className={favorites.includes(game.id) ? "fill-accent text-accent" : ""}
                              size={20} 
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="bg-destructive/80 backdrop-blur-sm hover:bg-destructive hover:scale-110 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Удалить эту игру?')) {
                                handleDeleteGame(game.id);
                              }
                            }}
                          >
                            <Icon name="Trash2" size={20} />
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
                          {game.trailer && (
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
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {filteredGames.length === 0 && !isLoading && (
                <div className="text-center py-20">
                  <Icon name={searchQuery ? "SearchX" : "HeartCrack"} className="mx-auto text-muted-foreground mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-muted-foreground mb-2">
                    {searchQuery ? 'Ничего не найдено' : 'Пока нет избранных игр'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Попробуйте изменить запрос' : 'Добавьте игры в избранное, нажав на иконку сердца'}
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
            Ваш портал в мир лучших игр © 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
