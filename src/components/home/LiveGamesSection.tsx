
import React from 'react';
import { Play, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Game } from '../../types/sports';
import { useNavigate } from 'react-router-dom';

interface LiveGamesSectionProps {
  liveGames: Game[];
}

const LiveGamesSection: React.FC<LiveGamesSectionProps> = ({ liveGames }) => {
  const navigate = useNavigate();

  if (liveGames.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            <Play className="h-5 w-5 text-primary" />
            <span>Jogos ao Vivo</span>
          </div>
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            {liveGames.length} {liveGames.length === 1 ? 'jogo' : 'jogos'}
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
                  {game.homeScore !== undefined && (
                    <span className="text-lg font-bold">{game.homeScore}</span>
                  )}
                </div>
                <span className="text-muted-foreground">vs</span>
                <div className="flex items-center space-x-2">
                  {game.awayScore !== undefined && (
                    <span className="text-lg font-bold">{game.awayScore}</span>
                  )}
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
  );
};

export default LiveGamesSection;
