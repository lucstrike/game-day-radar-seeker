
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Calendar } from 'lucide-react';
import { useGamesStore } from '../store/gamesStore';
import { SportType } from '../types/sports';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GameCard from '../components/games/GameCard';
import Header from '../components/common/Header';

const SportCategoryScreen = () => {
  const { sportType } = useParams<{ sportType: string }>();
  const navigate = useNavigate();
  const { games, filterBySport, filteredGames } = useGamesStore();
  const [selectedSport, setSelectedSport] = useState<SportType | 'all'>('all');

  const sportLabels = {
    soccer: 'Futebol',
    basketball: 'Basquete',
    tennis: 'Tênis',
    volleyball: 'Vôlei',
    football: 'Futebol Americano',
    baseball: 'Baseball',
    all: 'Todos os Esportes'
  };

  const availableSports = ['all', ...Array.from(new Set(games.map(game => game.sport)))];

  useEffect(() => {
    if (sportType && sportType !== 'all') {
      setSelectedSport(sportType as SportType);
      filterBySport(sportType as SportType);
    } else {
      setSelectedSport('all');
      filterBySport('all');
    }
  }, [sportType, filterBySport]);

  const handleSportFilter = (sport: SportType | 'all') => {
    setSelectedSport(sport);
    filterBySport(sport);
    navigate(`/sport/${sport}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 pt-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {sportLabels[selectedSport as keyof typeof sportLabels] || 'Esportes'}
          </h1>
          <p className="text-muted-foreground">
            {filteredGames.length} jogo{filteredGames.length !== 1 ? 's' : ''} encontrado{filteredGames.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Sport Filters */}
        <div className="bg-card rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Filtrar por Esporte</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {availableSports.map((sport) => (
              <Badge
                key={sport}
                variant={selectedSport === sport ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1"
                onClick={() => handleSportFilter(sport as SportType | 'all')}
              >
                {sportLabels[sport as keyof typeof sportLabels] || sport}
              </Badge>
            ))}
          </div>
        </div>

        {/* Games List */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>
                {selectedSport === 'all' ? 'Todos os Jogos' : `Jogos de ${sportLabels[selectedSport as keyof typeof sportLabels]}`}
              </span>
            </h3>
          </div>
          
          {filteredGames.length > 0 ? (
            <div className="grid gap-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Nenhum jogo encontrado</h4>
              <p className="text-muted-foreground mb-4">
                Não há jogos disponíveis para {sportLabels[selectedSport as keyof typeof sportLabels]?.toLowerCase()} no momento.
              </p>
              <Button onClick={() => handleSportFilter('all')}>
                Ver todos os esportes
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SportCategoryScreen;
