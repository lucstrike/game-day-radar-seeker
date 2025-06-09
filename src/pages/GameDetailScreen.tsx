
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Tv, Ticket, TrendingUp, Users, Star } from 'lucide-react';
import { useGamesStore } from '../store/gamesStore';
import { Game } from '../types/sports';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../components/common/Header';

const GameDetailScreen = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { games } = useGamesStore();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const foundGame = games.find(g => g.id === gameId);
    setGame(foundGame || null);
  }, [gameId, games]);

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Jogo não encontrado</h2>
            <Button onClick={() => navigate('/')}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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

        {/* Game Header */}
        <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-primary text-white">
              {game.league}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(game.date)}
            </span>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80" 
                 onClick={() => navigate(`/team/${game.homeTeam.id}`)}>
              <img 
                src={game.homeTeam.logo} 
                alt={game.homeTeam.name}
                className="h-20 w-20 object-contain"
              />
              <div>
                <h2 className="text-2xl font-bold">{game.homeTeam.name}</h2>
                <p className="text-muted-foreground">{game.homeTeam.country}</p>
              </div>
            </div>

            <div className="text-center px-6">
              <div className="text-4xl font-bold gradient-text mb-2">VS</div>
              <div className="text-xl font-semibold">{game.time}</div>
            </div>

            <div className="flex items-center space-x-4 cursor-pointer hover:opacity-80"
                 onClick={() => navigate(`/team/${game.awayTeam.id}`)}>
              <div className="text-right">
                <h2 className="text-2xl font-bold">{game.awayTeam.name}</h2>
                <p className="text-muted-foreground">{game.awayTeam.country}</p>
              </div>
              <img 
                src={game.awayTeam.logo} 
                alt={game.awayTeam.name}
                className="h-20 w-20 object-contain"
              />
            </div>
          </div>

          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>{game.venue}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Status: {game.status === 'upcoming' ? 'A realizar' : game.status}</span>
            </div>
          </div>
        </div>

        {/* Predictions */}
        {game.predictions && (
          <div className="bg-card rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Análise e Previsões</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {game.predictions.homeWinProbability}%
                </div>
                <div className="text-sm text-muted-foreground">Vitória Casa</div>
              </div>
              {game.predictions.drawProbability && (
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {game.predictions.drawProbability}%
                  </div>
                  <div className="text-sm text-muted-foreground">Empate</div>
                </div>
              )}
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {game.predictions.awayWinProbability}%
                </div>
                <div className="text-sm text-muted-foreground">Vitória Visitante</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Fatores Chave:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {game.predictions.keyFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">Dica do Expert:</p>
              <p className="text-sm text-muted-foreground mt-1">
                {game.predictions.expertTip}
              </p>
            </div>
          </div>
        )}

        {/* Streaming Platforms */}
        <div className="bg-card rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Tv className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Onde Assistir</h3>
          </div>
          
          <div className="grid gap-3">
            {game.streamingPlatforms.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={platform.logo} 
                    alt={platform.name}
                    className="h-8 w-8 object-contain"
                  />
                  <div>
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {platform.type} • {platform.isFree ? 'Gratuito' : 'Pago'}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => navigate(`/watch/${game.id}`)}
                >
                  Assistir
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="h-12 bg-gradient-to-r from-primary to-purple-600"
            onClick={() => navigate(`/watch/${game.id}`)}
          >
            <Tv className="h-4 w-4 mr-2" />
            Onde Assistir
          </Button>
          
          {game.ticketUrl && (
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => navigate(`/ticket/${game.id}`)}
            >
              <Ticket className="h-4 w-4 mr-2" />
              Comprar Ingressos
            </Button>
          )}
          
          <Button variant="outline" className="h-12">
            <Star className="h-4 w-4 mr-2" />
            Adicionar aos Favoritos
          </Button>
        </div>
      </main>
    </div>
  );
};

export default GameDetailScreen;
