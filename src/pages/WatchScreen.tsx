
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tv, Radio, Smartphone, ExternalLink, AlertCircle } from 'lucide-react';
import { useGamesStore } from '../store/gamesStore';
import { Game } from '../types/sports';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../components/common/Header';

const WatchScreen = () => {
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

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'tv': return Tv;
      case 'radio': return Radio;
      case 'streaming': return Smartphone;
      default: return Tv;
    }
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

        {/* Game Info */}
        <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-primary text-white">
              {game.league}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(game.date).toLocaleDateString('pt-BR')} • {game.time}
            </span>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-4">
            <div className="text-center">
              <img 
                src={game.homeTeam.logo} 
                alt={game.homeTeam.name}
                className="h-16 w-16 object-contain mx-auto mb-2"
              />
              <p className="font-semibold">{game.homeTeam.name}</p>
            </div>
            
            <div className="text-2xl font-bold gradient-text">VS</div>
            
            <div className="text-center">
              <img 
                src={game.awayTeam.logo} 
                alt={game.awayTeam.name}
                className="h-16 w-16 object-contain mx-auto mb-2"
              />
              <p className="font-semibold">{game.awayTeam.name}</p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Onde Assistir</h1>
          <p className="text-muted-foreground">
            Todas as opções para acompanhar o jogo
          </p>
        </div>

        {/* Streaming Platforms */}
        <div className="bg-card rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Plataformas Disponíveis</h3>
          
          <div className="grid gap-4">
            {game.streamingPlatforms.map((platform) => {
              const IconComponent = getPlatformIcon(platform.type);
              
              return (
                <div key={platform.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{platform.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={platform.isFree ? "default" : "secondary"} className="text-xs">
                          {platform.isFree ? 'Gratuito' : 'Pago'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {platform.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Assistir
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-card rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold mb-2">Informações Importantes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Verifique se você tem acesso às plataformas pagas</li>
                <li>• Algumas transmissões podem ter restrições geográficas</li>
                <li>• Chegue com antecedência para não perder o início</li>
                <li>• Confirme os horários, pois podem sofrer alterações</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WatchScreen;
