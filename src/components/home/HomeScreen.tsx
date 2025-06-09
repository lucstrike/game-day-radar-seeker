
import React, { useEffect } from 'react';
import { TrendingUp, Calendar, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useGamesStore } from '../../store/gamesStore';
import GameCard from '../games/GameCard';
import { Button } from '@/components/ui/button';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { profile, isAuthenticated } = useUserStore();
  const { games, isLoading, fetchGames, getFavoriteTeamGames, getUpcomingGames } = useGamesStore();

  useEffect(() => {
    if (games.length === 0) {
      fetchGames();
    }
  }, [fetchGames, games.length]);

  const favoriteTeamGames = profile ? getFavoriteTeamGames(profile.favoriteTeams) : [];
  const upcomingGames = getUpcomingGames(5);
  const featuredGame = upcomingGames[0];

  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Welcome Section */}
      <section className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {timeOfDay()}{isAuthenticated && profile ? `, ${profile.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-muted-foreground mt-1">
              {isAuthenticated 
                ? `${upcomingGames.length} jogos hoje • ${favoriteTeamGames.length} dos seus times favoritos`
                : 'Descubra os próximos jogos e acompanhe seus times favoritos'
              }
            </p>
          </div>
          <div className="hidden md:flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Calendar className="h-4 w-4 mr-2" />
              Agenda
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600">
              <Star className="h-4 w-4 mr-2" />
              Favoritos
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Game */}
      {featuredGame && (
        <section className="animate-slide-up">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-xl font-bold">Jogo em Destaque</h2>
          </div>
          <GameCard game={featuredGame} variant="featured" />
        </section>
      )}

      {/* Favorite Teams Games */}
      {isAuthenticated && favoriteTeamGames.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Seus Times</span>
            </h2>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          <div className="grid gap-4">
            {favoriteTeamGames.slice(0, 3).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Games */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Próximos Jogos</span>
          </h2>
          <Button variant="ghost" size="sm">
            Ver agenda completa
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {upcomingGames.slice(1, 5).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 hover-lift"
            onClick={() => navigate('/')}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-sm">Ver Agenda</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 hover-lift"
          >
            <Star className="h-6 w-6" />
            <span className="text-sm">Favoritos</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 hover-lift"
            onClick={() => navigate('/sport/all')}
          >
            <TrendingUp className="h-6 w-6" />
            <span className="text-sm">Estatísticas</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2 hover-lift"
          >
            <Zap className="h-6 w-6" />
            <span className="text-sm">Ao Vivo</span>
          </Button>
        </div>
      </section>

      {/* Call to Action for Unauthenticated Users */}
      {!isAuthenticated && (
        <section className="animate-slide-up bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Personalize sua Experiência</h3>
          <p className="text-muted-foreground mb-4">
            Entre e configure seus times favoritos para receber recomendações personalizadas
          </p>
          <Button className="bg-gradient-to-r from-primary to-purple-600">
            Criar Conta Grátis
          </Button>
        </section>
      )}
    </div>
  );
};

export default HomeScreen;
