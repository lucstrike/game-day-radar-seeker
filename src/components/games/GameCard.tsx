
import React from 'react';
import { Clock, MapPin, Tv, Ticket, TrendingUp, Radio, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../../types/sports';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TeamLogo from '../teams/TeamLogo';

interface GameCardProps {
  game: Game;
  variant?: 'default' | 'featured' | 'compact';
}

const GameCard = ({ game, variant = 'default' }: GameCardProps) => {
  const navigate = useNavigate();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  };

  const getSportColor = (sport: string) => {
    const colors = {
      soccer: 'bg-sport-lime-green',
      basketball: 'bg-sport-sport-red',
      tennis: 'bg-sport-lime-green',
      volleyball: 'bg-sport-link-blue',
      football: 'bg-sport-sport-red'
    };
    return colors[sport as keyof typeof colors] || 'bg-sport-lime-green';
  };

  const getSportIcon = (sport: string) => {
    const icons = {
      soccer: '⚽',
      basketball: '🏀',
      tennis: '🎾',
      volleyball: '🏐',
      football: '🏈'
    };
    return icons[sport as keyof typeof icons] || '🏆';
  };

  const getStatusBadge = () => {
    switch (game.status) {
      case 'live':
        return (
          <Badge className="live-indicator bg-sport-sport-red text-sport-ice-white border-0">
            <Radio className="h-3 w-3 mr-1 animate-pulse" />
            AO VIVO
          </Badge>
        );
      case 'finished':
        return (
          <Badge className="bg-sport-light-gray/20 text-sport-light-gray border-sport-light-gray/30">
            ENCERRADO
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleGameClick = () => {
    navigate(`/game/${game.id}`);
  };

  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/watch/${game.id}`);
  };

  const handleTicketClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/ticket/${game.id}`);
  };

  const handleTeamClick = (teamId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/team/${teamId}`);
  };

  const renderCompactVersion = () => (
    <div 
      className={`sport-card p-4 cursor-pointer group hover:shadow-lg hover:shadow-sport-lime-green/20 ${
        game.status === 'live' ? 'game-live border-sport-sport-red shadow-sport-sport-red/30' : ''
      }`} 
      onClick={handleGameClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <TeamLogo 
              teamName={game.homeTeam.name}
              teamId={game.homeTeam.id}
              sport={game.sport}
              size="sm"
              className="cursor-pointer hover:scale-110 transition-transform team-logo-container"
              onClick={(e) => handleTeamClick(game.homeTeam.id, e)}
            />
            <span className="font-semibold text-sport-ice-white text-sm">{game.homeTeam.name}</span>
          </div>
          
          <div className="text-sport-light-gray text-xs font-medium px-2">VS</div>
          
          <div className="flex items-center space-x-3">
            <TeamLogo 
              teamName={game.awayTeam.name}
              teamId={game.awayTeam.id}
              sport={game.sport}
              size="sm"
              className="cursor-pointer hover:scale-110 transition-transform team-logo-container"
              onClick={(e) => handleTeamClick(game.awayTeam.id, e)}
            />
            <span className="font-semibold text-sport-ice-white text-sm">{game.awayTeam.name}</span>
          </div>
        </div>
        
        <div className="text-right flex items-center space-x-3">
          {getStatusBadge()}
          <div>
            <p className="text-lg font-bold text-sport-lime-green">{game.time}</p>
            <p className="text-xs text-sport-light-gray">{formatDate(game.date)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeaturedVersion = () => (
    <div 
      className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer group transition-all duration-500 hover:scale-[1.02] ${
        game.status === 'live' 
          ? 'bg-gradient-to-br from-sport-sport-red/20 to-sport-petrol-blue border-2 border-sport-sport-red shadow-2xl shadow-sport-sport-red/30 animate-pulse-glow' 
          : 'sport-card bg-gradient-to-br from-sport-petrol-blue/90 to-sport-dark-blue/90'
      }`} 
      onClick={handleGameClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-sports opacity-10" />
      
      {/* Status and Sport Badge */}
      <div className="absolute top-6 right-6 flex space-x-3">
        {getStatusBadge()}
        <Badge className={`${getSportColor(game.sport)} text-sport-dark-blue border-0 font-bold px-3 py-1 text-xs`}>
          {getSportIcon(game.sport)} {game.sport.toUpperCase()}
        </Badge>
      </div>

      <div className="relative z-10">
        {/* Teams */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <TeamLogo 
              teamName={game.homeTeam.name}
              teamId={game.homeTeam.id}
              sport={game.sport}
              size="lg"
              className="cursor-pointer hover:scale-110 transition-transform animate-float team-logo-container"
              onClick={(e) => handleTeamClick(game.homeTeam.id, e)}
            />
            <div>
              <h3 className="font-bold text-2xl text-sport-ice-white group-hover:text-sport-lime-green transition-colors">{game.homeTeam.name}</h3>
              <p className="text-sm text-sport-light-gray">{game.homeTeam.league} • {game.homeTeam.country}</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold gradient-text sport-title">VS</div>
            <div className="text-sm text-sport-light-gray mt-2 bg-sport-petrol-blue/50 rounded-lg px-3 py-1">
              {formatDate(game.date)} • <span className="text-sport-lime-green font-semibold">{game.time}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <h3 className="font-bold text-2xl text-sport-ice-white group-hover:text-sport-lime-green transition-colors">{game.awayTeam.name}</h3>
              <p className="text-sm text-sport-light-gray">{game.awayTeam.league} • {game.awayTeam.country}</p>
            </div>
            <TeamLogo 
              teamName={game.awayTeam.name}
              teamId={game.awayTeam.id}
              sport={game.sport}
              size="lg"
              className="cursor-pointer hover:scale-110 transition-transform animate-float team-logo-container"
              style={{ animationDelay: '0.5s' }}
              onClick={(e) => handleTeamClick(game.awayTeam.id, e)}
            />
          </div>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="flex items-center space-x-4 bg-sport-petrol-blue/30 rounded-lg p-4">
            <div className="p-3 bg-sport-lime-green/20 rounded-lg">
              <Clock className="h-6 w-6 text-sport-lime-green" />
            </div>
            <div>
              <p className="text-sport-ice-white font-semibold text-lg">{game.time}</p>
              <p className="text-sport-light-gray text-sm">Horário de Brasília</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-sport-petrol-blue/30 rounded-lg p-4">
            <div className="p-3 bg-sport-lime-green/20 rounded-lg">
              <MapPin className="h-6 w-6 text-sport-lime-green" />
            </div>
            <div>
              <p className="text-sport-ice-white font-semibold text-lg truncate">{game.venue}</p>
              <p className="text-sport-light-gray text-sm">Local da partida</p>
            </div>
          </div>
        </div>

        {/* Predictions */}
        {game.predictions && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-sport-dark-blue/70 to-sport-petrol-blue/70 border border-sport-lime-green/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-sport-lime-green/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-sport-lime-green" />
              </div>
              <span className="text-xl font-bold text-sport-ice-white">Análise dos Especialistas</span>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center bg-sport-lime-green/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-sport-lime-green">{game.predictions.homeWinProbability}%</div>
                <div className="text-sm text-sport-light-gray mt-1">Vitória Casa</div>
              </div>
              {game.predictions.drawProbability && (
                <div className="text-center bg-sport-light-gray/10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-sport-light-gray">{game.predictions.drawProbability}%</div>
                  <div className="text-sm text-sport-light-gray mt-1">Empate</div>
                </div>
              )}
              <div className="text-center bg-sport-sport-red/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-sport-sport-red">{game.predictions.awayWinProbability}%</div>
                <div className="text-sm text-sport-light-gray mt-1">Vitória Visitante</div>
              </div>
            </div>
            
            <div className="bg-sport-petrol-blue/50 rounded-lg p-4">
              <p className="text-sport-ice-white italic text-center">
                💡 <span className="font-semibold">{game.predictions.expertTip}</span>
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4">
          <Button 
            className="flex-1 sport-button text-lg py-4"
            onClick={handleWatchClick}
          >
            <Tv className="h-5 w-5 mr-3" />
            Onde Assistir
          </Button>
          {game.ticketUrl && (
            <Button 
              className="flex-1 sport-button-secondary text-lg py-4"
              onClick={handleTicketClick}
            >
              <Ticket className="h-5 w-5 mr-3" />
              Ingressos
            </Button>
          )}
          <Button 
            variant="outline" 
            size="lg"
            className="border-sport-lime-green/50 text-sport-lime-green hover:border-sport-lime-green hover:bg-sport-lime-green/10" 
            onClick={(e) => { e.stopPropagation(); handleGameClick(); }}
          >
            <ExternalLink className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDefaultVersion = () => (
    <div 
      className={`sport-card group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-sport-lime-green/20 ${
        game.status === 'live' ? 'border-sport-sport-red shadow-sport-sport-red/30 animate-pulse-glow' : ''
      }`} 
      onClick={handleGameClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <Badge 
            className={`${getSportColor(game.sport)} text-sport-dark-blue border-0 cursor-pointer font-bold px-3 py-1`}
            onClick={(e) => { e.stopPropagation(); navigate(`/sport/${game.sport}`); }}
          >
            {getSportIcon(game.sport)} {game.league}
          </Badge>
          {getStatusBadge()}
        </div>
        <span className="text-sm text-sport-light-gray bg-sport-petrol-blue/30 px-3 py-1 rounded-lg">
          {formatDate(game.date)}
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <TeamLogo 
            teamName={game.homeTeam.name}
            teamId={game.homeTeam.id}
            sport={game.sport}
            size="md"
            className="cursor-pointer hover:scale-110 transition-transform team-logo-container"
            onClick={(e) => handleTeamClick(game.homeTeam.id, e)}
          />
          <div>
            <span className="font-bold text-sport-ice-white text-lg">{game.homeTeam.name}</span>
            <p className="text-sport-light-gray text-xs">{game.homeTeam.country}</p>
          </div>
        </div>

        <div className="text-center px-6">
          <div className="text-2xl font-bold text-sport-lime-green mb-1">{game.time}</div>
          <div className="text-xs text-sport-light-gray bg-sport-petrol-blue/50 rounded px-2 py-1">vs</div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="font-bold text-sport-ice-white text-lg">{game.awayTeam.name}</span>
            <p className="text-sport-light-gray text-xs">{game.awayTeam.country}</p>
          </div>
          <TeamLogo 
            teamName={game.awayTeam.name}
            teamId={game.awayTeam.id}
            sport={game.sport}
            size="md"
            className="cursor-pointer hover:scale-110 transition-transform team-logo-container"
            onClick={(e) => handleTeamClick(game.awayTeam.id, e)}
          />
        </div>
      </div>

      {/* Venue and Streaming */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-sm bg-sport-petrol-blue/20 rounded-lg p-3">
          <div className="p-2 bg-sport-lime-green/20 rounded">
            <MapPin className="h-4 w-4 text-sport-lime-green" />
          </div>
          <span className="text-sport-ice-white">{game.venue}</span>
        </div>

        <div className="flex items-center justify-between bg-sport-petrol-blue/20 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sport-lime-green/20 rounded">
              <Tv className="h-4 w-4 text-sport-lime-green" />
            </div>
            <span className="text-sm text-sport-ice-white">
              {game.streamingPlatforms.length} plataforma{game.streamingPlatforms.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <Button 
            size="sm" 
            className="sport-button-secondary text-xs"
            onClick={(e) => { e.stopPropagation(); handleGameClick(); }}
          >
            Ver Detalhes
          </Button>
        </div>
      </div>
    </div>
  );

  if (variant === 'compact') return renderCompactVersion();
  if (variant === 'featured') return renderFeaturedVersion();
  return renderDefaultVersion();
};

export default GameCard;
