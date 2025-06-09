import React, { useEffect, useState } from 'react';
import { Calendar, Filter, Clock, Tv, MapPin, Zap, RefreshCw, TrendingUp } from 'lucide-react';
import { useGamesStore } from '../../store/gamesStore';
import { useUserStore } from '../../store/userStore';
import GameCard from './GameCard';
import DatePicker from '../common/DatePicker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SportType } from '../../types/sports';

const GamesScreen = () => {
  const { profile } = useUserStore();
  const { 
    filteredGames, 
    isLoading, 
    selectedSport, 
    fetchGames,
    filterBySport,
    getFavoriteTeamGames,
    getLiveGames,
    refreshData 
  } = useGamesStore();

  const [viewMode, setViewMode] = useState<'all' | 'favorites' | 'live'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Efeito para buscar dados quando a data mudar
  useEffect(() => {
    const dateString = currentDate.toISOString().split('T')[0];
    fetchGames(dateString);
  }, [currentDate, fetchGames]);

  const sports = [
    { id: 'all' as const, name: 'Todos', icon: '🏆', color: 'bg-sport-lime-green' },
    { id: 'soccer' as const, name: 'Futebol', icon: '⚽', color: 'bg-sport-lime-green' },
    { id: 'basketball' as const, name: 'Basquete', icon: '🏀', color: 'bg-sport-sport-red' },
    { id: 'volleyball' as const, name: 'Vôlei', icon: '🏐', color: 'bg-sport-link-blue' },
    { id: 'tennis' as const, name: 'Tênis', icon: '🎾', color: 'bg-sport-lime-green' },
    { id: 'football' as const, name: 'NFL', icon: '�', color: 'bg-sport-sport-red' },
  ];

  const favoriteTeamGames = profile ? getFavoriteTeamGames(profile.favoriteTeams) : [];
  const liveGames = getLiveGames();

  const getGamesToShow = () => {
    switch (viewMode) {
      case 'favorites':
        return favoriteTeamGames;
      case 'live':
        return liveGames;
      default:
        return filteredGames;
    }
  };

  const gamesToShow = getGamesToShow();

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    // O useEffect já cuidará da busca quando currentDate mudar
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const dateString = currentDate.toISOString().split('T')[0];
    await refreshData(dateString);
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-sport-petrol-blue/30 rounded-lg w-1/2"></div>
        <div className="flex space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 bg-sport-petrol-blue/30 rounded-lg"></div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-sport-petrol-blue/30 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <section className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold gradient-text sport-title mb-3">Agenda Esportiva</h1>
            <p className="text-sport-light-gray text-xl">
              Acompanhe todos os jogos com dados em tempo real 🚀
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-sport-lime-green/50 text-sport-lime-green hover:border-sport-lime-green hover:bg-sport-lime-green/10"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-sport-lime-green/50 text-sport-lime-green hover:border-sport-lime-green hover:bg-sport-lime-green/10"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="mb-8 bg-sport-petrol-blue/20 rounded-xl p-6 border border-sport-lime-green/20">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-6 w-6 text-sport-lime-green" />
            <h3 className="text-xl font-bold text-sport-ice-white">Selecionar Data</h3>
          </div>
          <DatePicker 
            selectedDate={currentDate}
            onDateChange={handleDateChange}
            className="w-full"
          />
        </div>

        {/* View Mode Selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={viewMode === 'all' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('all')}
            className={viewMode === 'all' 
              ? "sport-button text-lg" 
              : "sport-button-secondary text-lg"
            }
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Todos os Jogos
            <Badge className="ml-3 bg-sport-petrol-blue/50 text-sport-ice-white">
              {filteredGames.length}
            </Badge>
          </Button>
          
          <Button
            variant={viewMode === 'live' ? 'default' : 'outline'}
            size="lg"
            onClick={() => setViewMode('live')}
            className={viewMode === 'live' 
              ? "bg-sport-sport-red text-sport-ice-white hover:bg-sport-sport-red/90 text-lg" 
              : "border-sport-sport-red/50 text-sport-sport-red hover:border-sport-sport-red hover:bg-sport-sport-red/10 text-lg"
            }
            disabled={liveGames.length === 0}
          >
            <Zap className="h-5 w-5 mr-2 animate-pulse" />
            Ao Vivo
            <Badge className="ml-3 bg-sport-sport-red/30 text-sport-ice-white">
              {liveGames.length}
            </Badge>
          </Button>

          {profile && (
            <Button
              variant={viewMode === 'favorites' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setViewMode('favorites')}
              className={viewMode === 'favorites' 
                ? "sport-button text-lg" 
                : "sport-button-secondary text-lg"
              }
              disabled={favoriteTeamGames.length === 0}
            >
              ⭐ Meus Times
              <Badge className="ml-3 bg-sport-petrol-blue/50 text-sport-ice-white">
                {favoriteTeamGames.length}
              </Badge>
            </Button>
          )}
        </div>

        {/* Sport Filters */}
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {sports.map((sport) => (
            <Button
              key={sport.id}
              variant={selectedSport === sport.id ? "default" : "outline"}
              size="lg"
              onClick={() => filterBySport(sport.id)}
              className={
                selectedSport === sport.id
                  ? `${sport.color} text-sport-dark-blue hover:${sport.color}/90 whitespace-nowrap text-lg font-bold`
                  : "border-sport-lime-green/50 text-sport-lime-green hover:border-sport-lime-green hover:bg-sport-lime-green/10 whitespace-nowrap text-lg"
              }
            >
              <span className="text-xl mr-3">{sport.icon}</span>
              {sport.name}
            </Button>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="animate-slide-up grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="sport-card text-center bg-gradient-to-br from-sport-lime-green/20 to-sport-lime-green/5">
          <div className="text-4xl font-bold text-sport-lime-green mb-2">{gamesToShow.length}</div>
          <div className="text-sport-light-gray font-medium">Jogos Total</div>
        </div>
        <div className="sport-card text-center bg-gradient-to-br from-sport-sport-red/20 to-sport-sport-red/5">
          <div className="text-4xl font-bold text-sport-sport-red mb-2">
            {liveGames.length}
          </div>
          <div className="text-sport-light-gray font-medium">Ao Vivo</div>
        </div>
        <div className="sport-card text-center bg-gradient-to-br from-sport-link-blue/20 to-sport-link-blue/5">
          <div className="text-4xl font-bold text-sport-link-blue mb-2">
            {gamesToShow.filter(g => g.streamingPlatforms.some(p => p.isFree)).length}
          </div>
          <div className="text-sport-light-gray font-medium">Grátis</div>
        </div>
        <div className="sport-card text-center bg-gradient-to-br from-sport-lime-green/20 to-sport-lime-green/5">
          <div className="text-4xl font-bold text-sport-lime-green mb-2">
            {Array.from(new Set(gamesToShow.map(g => g.sport))).length}
          </div>
          <div className="text-sport-light-gray font-medium">Esportes</div>
        </div>
      </section>

      {/* Games List */}
      <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {gamesToShow.length > 0 ? (
          <div className="space-y-8">
            {liveGames.length > 0 && viewMode === 'all' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 border-b-2 border-sport-sport-red/30 pb-4">
                  <div className="p-3 bg-sport-sport-red/20 rounded-xl">
                    <Zap className="h-8 w-8 text-sport-sport-red animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-bold text-sport-ice-white">Jogos Ao Vivo</h3>
                  <Badge className="live-indicator text-lg px-4 py-2">
                    {liveGames.length} jogo{liveGames.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {liveGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}

            {gamesToShow.filter(g => g.status !== 'live').length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 border-b-2 border-sport-lime-green/30 pb-4">
                  <div className="p-3 bg-sport-lime-green/20 rounded-xl">
                    <Calendar className="h-8 w-8 text-sport-lime-green" />
                  </div>
                  <h3 className="text-3xl font-bold text-sport-ice-white">
                    {viewMode === 'live' ? 'Sem Jogos Ao Vivo' : 
                     viewMode === 'favorites' ? 'Jogos dos Seus Times' : 
                     'Próximos Jogos'}
                  </h3>
                  <Badge className="bg-sport-petrol-blue/50 text-sport-ice-white text-lg px-4 py-2">
                    {gamesToShow.filter(g => g.status !== 'live').length} jogo{gamesToShow.filter(g => g.status !== 'live').length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {gamesToShow.filter(g => g.status !== 'live').map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="h-32 w-32 bg-sport-petrol-blue/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <Calendar className="h-16 w-16 text-sport-light-gray" />
            </div>
            <h3 className="text-3xl font-bold text-sport-ice-white mb-4">Nenhum jogo encontrado</h3>
            <p className="text-sport-light-gray mb-8 text-xl max-w-md mx-auto">
              {viewMode === 'favorites' 
                ? 'Adicione times favoritos para ver jogos personalizados'
                : viewMode === 'live'
                ? 'Não há jogos ao vivo no momento. Volte mais tarde!'
                : 'Tente alterar os filtros ou data selecionada'
              }
            </p>
            {viewMode === 'favorites' && !profile && (
              <Button className="sport-button text-xl px-8 py-4">
                Fazer Login
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Button className="sport-card h-24 flex-col space-y-3 hover:scale-105 transition-transform bg-gradient-to-br from-sport-petrol-blue/50 to-sport-dark-blue/50">
            <Tv className="h-10 w-10 text-sport-lime-green" />
            <span className="font-semibold text-sport-ice-white">Onde Assistir</span>
          </Button>
          <Button className="sport-card h-24 flex-col space-y-3 hover:scale-105 transition-transform bg-gradient-to-br from-sport-petrol-blue/50 to-sport-dark-blue/50">
            <MapPin className="h-10 w-10 text-sport-lime-green" />
            <span className="font-semibold text-sport-ice-white">Locais</span>
          </Button>
          <Button className="sport-card h-24 flex-col space-y-3 hover:scale-105 transition-transform bg-gradient-to-br from-sport-petrol-blue/50 to-sport-dark-blue/50">
            <Clock className="h-10 w-10 text-sport-lime-green" />
            <span className="font-semibold text-sport-ice-white">Lembretes</span>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default GamesScreen;