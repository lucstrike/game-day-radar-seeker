
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Trophy, Users, MapPin } from 'lucide-react';
import { useGamesStore } from '../store/gamesStore';
import { Team, Game } from '../types/sports';
import { Button } from '@/components/ui/button';
import GameCard from '../components/games/GameCard';
import Header from '../components/common/Header';

const TeamScreen = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { games } = useGamesStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [teamGames, setTeamGames] = useState<Game[]>([]);

  useEffect(() => {
    // Find team from games data
    const foundTeam = games.find(game => 
      game.homeTeam.id === teamId || game.awayTeam.id === teamId
    );
    
    if (foundTeam) {
      const teamData = foundTeam.homeTeam.id === teamId ? foundTeam.homeTeam : foundTeam.awayTeam;
      setTeam(teamData);
      
      // Get all games for this team
      const relatedGames = games.filter(game => 
        game.homeTeam.id === teamId || game.awayTeam.id === teamId
      );
      setTeamGames(relatedGames);
    }
  }, [teamId, games]);

  if (!team) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Time não encontrado</h2>
            <Button onClick={() => navigate('/')}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-4 pt-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Team Header */}
        <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-6 mb-6">
            <img 
              src={team.logo} 
              alt={team.name}
              className="h-24 w-24 object-contain animate-float"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold gradient-text mb-2">{team.name}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>{team.league}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{team.country}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{team.sport.charAt(0).toUpperCase() + team.sport.slice(1)}</span>
                </div>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-primary to-purple-600">
              <Star className="h-4 w-4 mr-2" />
              Seguir Time
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{teamGames.length}</div>
              <div className="text-sm text-muted-foreground">Jogos</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {teamGames.filter(g => g.status === 'upcoming').length}
              </div>
              <div className="text-sm text-muted-foreground">Próximos</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Vitórias</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Ranking</div>
            </div>
          </div>
        </div>

        {/* Team Games */}
        <div className="bg-card rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Próximos Jogos</span>
            </h3>
            <Button variant="ghost" size="sm">
              Ver todos
            </Button>
          </div>
          
          {teamGames.length > 0 ? (
            <div className="grid gap-4">
              {teamGames.filter(g => g.status === 'upcoming').slice(0, 5).map((game) => (
                <GameCard key={game.id} game={game} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum jogo encontrado para este time</p>
            </div>
          )}
        </div>

        {/* Team Info */}
        <div className="bg-card rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Informações do Time</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Liga Principal</h4>
              <p className="text-muted-foreground">{team.league}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">País</h4>
              <p className="text-muted-foreground">{team.country}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Modalidade</h4>
              <p className="text-muted-foreground">
                {team.sport.charAt(0).toUpperCase() + team.sport.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamScreen;
