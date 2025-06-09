
import React, { useEffect } from 'react';
import { Calendar, TrendingUp, Users, Trophy, Play, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '../../store/userStore';
import { useSportsDataStore } from '../../store/sportsDataStore';
import AppLayout from '../common/Layout';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated } = useUserStore();
  const { 
    liveGames, 
    upcomingGames, 
    news, 
    isLoadingGames, 
    isLoadingNews,
    fetchLiveGames,
    fetchUpcomingGames,
    fetchNews,
    refreshAllData
  } = useSportsDataStore();

  useEffect(() => {
    // Carregar dados iniciais
    refreshAllData();
  }, []);

  const personalizedSports = profile?.favoriteSports || ['soccer'];
  const personalizedTeams = profile?.favoriteTeams || [];

  const getPersonalizedContent = () => {
    if (!profile) return { games: upcomingGames, news };

    const personalizedGames = upcomingGames.filter(game => 
      personalizedSports.includes(game.sport) ||
      personalizedTeams.some(team => 
        team.id === game.homeTeam.id || team.id === game.awayTeam.id
      )
    );

    const personalizedNews = news.filter(article =>
      personalizedSports.includes(article.sport) ||
      article.teams.some(team => 
        personalizedTeams.some(userTeam => userTeam.id === team.id)
      )
    );

    return { 
      games: personalizedGames.length > 0 ? personalizedGames : upcomingGames, 
      news: personalizedNews.length > 0 ? personalizedNews : news 
    };
  };

  const { games: personalizedGames, news: personalizedNewsData } = getPersonalizedContent();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl p-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">
              {isAuthenticated ? `Bem-vindo, ${profile?.name}!` : 'Bem-vindo ao Sport Sync!'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isAuthenticated 
                ? 'Aqui estão suas atualizações esportivas personalizadas'
                : 'Sua central de informações esportivas em tempo real'
              }
            </p>
            {!isAuthenticated && (
              <Button className="mt-4" onClick={() => navigate('/login')}>
                Fazer Login para Personalizar
              </Button>
            )}
          </div>
        </div>

        {/* Live Games */}
        {liveGames.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                  <Play className="h-5 w-5 text-primary" />
                  <span>Jogos ao Vivo</span>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {liveGames.length} jogos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {liveGames.map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 bg-background/50 rounded-lg border hover:bg-background/80 transition-colors cursor-pointer"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={game.homeTeam.logo}
                          alt={game.homeTeam.name}
                          className="h-8 w-8 object-contain"
                        />
                        <span className="font-medium">{game.homeTeam.name}</span>
                      </div>
                      <span className="text-muted-foreground">vs</span>
                      <div className="flex items-center space-x-2">
                        <img
                          src={game.awayTeam.logo}
                          alt={game.awayTeam.name}
                          className="h-8 w-8 object-contain"
                        />
                        <span className="font-medium">{game.awayTeam.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{game.league}</Badge>
                      <Button size="sm" variant="ghost">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{personalizedGames.length}</div>
              <div className="text-sm text-muted-foreground">Próximos Jogos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{liveGames.length}</div>
              <div className="text-sm text-muted-foreground">Ao Vivo</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profile?.favoriteTeams.length || 0}</div>
              <div className="text-sm text-muted-foreground">Times Favoritos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{personalizedNewsData.length}</div>
              <div className="text-sm text-muted-foreground">Notícias</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Games */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Próximos Jogos</span>
                {isAuthenticated && (
                  <Badge variant="secondary">Personalizados</Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/games')}>
                Ver Todos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingGames ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="Carregando jogos..." />
              </div>
            ) : personalizedGames.length > 0 ? (
              <div className="grid gap-4">
                {personalizedGames.slice(0, 3).map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{game.date}</div>
                        <div className="text-sm text-muted-foreground">{game.time}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <img
                            src={game.homeTeam.logo}
                            alt={game.homeTeam.name}
                            className="h-6 w-6 object-contain"
                          />
                          <span className="font-medium text-sm">{game.homeTeam.name}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">vs</span>
                        <div className="flex items-center space-x-2">
                          <img
                            src={game.awayTeam.logo}
                            alt={game.awayTeam.name}
                            className="h-6 w-6 object-contain"
                          />
                          <span className="font-medium text-sm">{game.awayTeam.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">{game.league}</Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum jogo próximo encontrado</p>
                {!isAuthenticated && (
                  <p className="text-sm">Faça login para ver jogos personalizados</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Últimas Notícias</span>
                {isAuthenticated && (
                  <Badge variant="secondary">Personalizadas</Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/news')}>
                Ver Todas
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingNews ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="Carregando notícias..." />
              </div>
            ) : personalizedNewsData.length > 0 ? (
              <div className="grid gap-4">
                {personalizedNewsData.slice(0, 3).map((article) => (
                  <div
                    key={article.id}
                    className="flex space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="h-16 w-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2 mb-1">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">{article.sport}</Badge>
                        <span className="text-xs text-muted-foreground">{article.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma notícia encontrada</p>
                {!isAuthenticated && (
                  <p className="text-sm">Faça login para ver notícias personalizadas</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default HomeScreen;
