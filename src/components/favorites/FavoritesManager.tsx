
import React, { useState } from 'react';
import { Star, StarOff, Heart, HeartOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '../../store/userStore';
import { Team, NewsArticle, Game } from '../../types/sports';
import { useToast } from '@/hooks/use-toast';

interface FavoritesManagerProps {
  favoriteTeams: Team[];
  favoriteNews: NewsArticle[];
  favoriteGames: Game[];
}

const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  favoriteTeams,
  favoriteNews,
  favoriteGames
}) => {
  const { toast } = useToast();
  const { updateFavoriteTeams } = useUserStore();
  const [activeTab, setActiveTab] = useState('teams');

  const removeFavoriteTeam = (teamId: string) => {
    const updatedTeams = favoriteTeams.filter(team => team.id !== teamId);
    updateFavoriteTeams(updatedTeams);
    toast({
      title: "Time removido dos favoritos",
      description: "O time foi removido da sua lista de favoritos.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span>Meus Favoritos</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teams">Times</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="games">Jogos</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-4">
            {favoriteTeams.length > 0 ? (
              <div className="grid gap-4">
                {favoriteTeams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src={team.logo} alt={team.name} className="h-8 w-8 object-contain" />
                      <div>
                        <h4 className="font-medium">{team.name}</h4>
                        <p className="text-sm text-muted-foreground">{team.league}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFavoriteTeam(team.id)}
                    >
                      <HeartOff className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum time favorito</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            {favoriteNews.length > 0 ? (
              <div className="grid gap-4">
                {favoriteNews.map((article) => (
                  <div key={article.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">{article.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{article.sport}</Badge>
                      <span className="text-sm text-muted-foreground">{article.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma notícia favorita</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            {favoriteGames.length > 0 ? (
              <div className="grid gap-4">
                {favoriteGames.map((game) => (
                  <div key={game.id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="h-6 w-6" />
                      <span className="text-sm">{game.homeTeam.name}</span>
                      <span className="text-muted-foreground">vs</span>
                      <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="h-6 w-6" />
                      <span className="text-sm">{game.awayTeam.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{game.date} - {game.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum jogo favorito</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FavoritesManager;
