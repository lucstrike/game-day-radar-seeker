
import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Search, Play, Clock, Trophy, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSportsDataStore } from '../../store/sportsDataStore';
import { useUserStore } from '../../store/userStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const GamesScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const { profile } = useUserStore();
  const { 
    liveGames, 
    upcomingGames, 
    completedGames,
    isLoadingGames,
    fetchLiveGames,
    fetchUpcomingGames,
    fetchCompletedGames,
    refreshAllData
  } = useSportsDataStore();

  useEffect(() => {
    refreshAllData();
  }, []);

  const filterGames = (games: any[]) => {
    return games.filter(game => {
      const matchesSearch = searchQuery === '' || 
        game.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.league.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = selectedSport === 'all' || game.sport === selectedSport;
      const matchesLeague = selectedLeague === 'all' || game.league === selectedLeague;
      
      return matchesSearch && matchesSport && matchesLeague;
    });
  };

  const getUniqueLeagues = () => {
    const allGames = [...liveGames, ...upcomingGames, ...completedGames];
    return [...new Set(allGames.map(game => game.league))];
  };

  const handleGameClick = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleWatchGame = (gameId: string) => {
    navigate(`/watch/${gameId}`);
  };

  const handleBuyTickets = (gameId: string) => {
    navigate(`/ticket/${gameId}`);
  };

  const GameCard = ({ game, showActions = true }: { game: any; showActions?: boolean }) => (
    <Card 
      key={game.id} 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
      onClick={() => handleGameClick(game.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">{game.sport}</Badge>
            <Badge variant="secondary" className="text-xs">{game.league}</Badge>
            {game.status === 'live' && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                AO VIVO
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{game.date}</div>
            <div className="text-sm text-muted-foreground">{game.time}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-3 flex-1">
              <img
                src={game.homeTeam.logo}
                alt={game.homeTeam.name}
                className="h-12 w-12 object-contain"
              />
              <div className="text-center">
                <div className="font-semibold">{game.homeTeam.name}</div>
                {game.score && <div className="text-2xl font-bold text-primary">{game.score.home}</div>}
              </div>
            </div>
            
            <div className="text-center px-4">
              <div className="text-muted-foreground font-medium">VS</div>
              {game.status === 'live' && (
                <div className="text-xs text-primary font-medium">{game.minute}'</div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 flex-1 justify-end">
              <div className="text-center">
                <div className="font-semibold">{game.awayTeam.name}</div>
                {game.score && <div className="text-2xl font-bold text-primary">{game.score.away}</div>}
              </div>
              <img
                src={game.awayTeam.logo}
                alt={game.awayTeam.name}
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>
        </div>

        {game.venue && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span>{game.venue}</span>
          </div>
        )}

        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              {game.status === 'live' && (
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWatchGame(game.id);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Assistir
                </Button>
              )}
              {game.status === 'upcoming' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyTickets(game.id);
                  }}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Ingressos
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span>Detalhes</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoadingGames) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Carregando jogos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span>Jogos</span>
          </h1>
          <p className="text-muted-foreground">
            Acompanhe todos os jogos ao vivo e futuros dos seus esportes favoritos
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar times ou ligas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Esporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os esportes</SelectItem>
                <SelectItem value="soccer">Futebol</SelectItem>
                <SelectItem value="basketball">Basquete</SelectItem>
                <SelectItem value="volleyball">Vôlei</SelectItem>
                <SelectItem value="tennis">Tênis</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLeague} onValueChange={setSelectedLeague}>
              <SelectTrigger>
                <SelectValue placeholder="Liga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ligas</SelectItem>
                {getUniqueLeagues().map(league => (
                  <SelectItem key={league} value={league}>{league}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('all');
                setSelectedLeague('all');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Games Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Ao Vivo ({liveGames.length})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Próximos ({upcomingGames.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Finalizados ({completedGames.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {filterGames(liveGames).length > 0 ? (
            filterGames(liveGames).map(game => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum jogo ao vivo</h3>
                <p className="text-muted-foreground text-center">
                  Não há jogos acontecendo no momento com os filtros selecionados.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {filterGames(upcomingGames).length > 0 ? (
            filterGames(upcomingGames).map(game => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum jogo encontrado</h3>
                <p className="text-muted-foreground text-center">
                  Não há jogos futuros com os filtros selecionados.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterGames(completedGames).length > 0 ? (
            filterGames(completedGames).map(game => (
              <GameCard key={game.id} game={game} showActions={false} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum jogo finalizado</h3>
                <p className="text-muted-foreground text-center">
                  Não há jogos finalizados com os filtros selecionados.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamesScreen;
