
import React from 'react';
import { Clock, ExternalLink, Tag, TrendingUp } from 'lucide-react';
import { NewsArticle } from '../../types/sports';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NewsCardProps {
  article: NewsArticle;
  variant?: 'default' | 'featured' | 'compact';
}

const NewsCard = ({ article, variant = 'default' }: NewsCardProps) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return `${Math.floor(diffInHours / 24)} dias atrás`;
  };

  const getSportColor = (sport: string) => {
    const colors = {
      soccer: 'bg-sports-soccer',
      basketball: 'bg-sports-basketball',
      tennis: 'bg-sports-tennis',
      volleyball: 'bg-sports-volleyball',
      football: 'bg-sports-football'
    };
    return colors[sport as keyof typeof colors] || 'bg-primary';
  };

  const renderCompactVersion = () => (
    <div className="flex space-x-3 p-4 rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer group">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{formatTimeAgo(article.publishedAt)}</span>
          <Badge variant="secondary" className="text-xs">
            {article.sport}
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderFeaturedVersion = () => (
    <div className="relative overflow-hidden rounded-2xl bg-card group hover-lift cursor-pointer">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <Badge className={`${getSportColor(article.sport)} text-white border-0`}>
            {article.sport.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
            <TrendingUp className="h-3 w-3 mr-1" />
            Em Alta
          </Badge>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {article.title}
          </h2>
          <div className="flex items-center space-x-2 text-white/80 text-sm">
            <Clock className="h-4 w-4" />
            <span>{formatTimeAgo(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {article.summary}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action */}
        <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ler Matéria Completa
        </Button>
      </div>
    </div>
  );

  const renderDefaultVersion = () => (
    <div className="sport-card group cursor-pointer">
      {/* Image */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getSportColor(article.sport)} text-white border-0`}>
            {article.sport}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3">
          {article.summary}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
          <span>{article.author}</span>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Teams */}
        {article.teams.length > 0 && (
          <div className="flex items-center space-x-2">
            {article.teams.slice(0, 2).map((team) => (
              <div key={team.id} className="flex items-center space-x-1">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="h-5 w-5 object-contain"
                />
                <span className="text-xs font-medium">{team.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        <Button variant="outline" size="sm" className="w-full mt-4 hover-glow">
          <ExternalLink className="h-4 w-4 mr-2" />
          Ler Mais
        </Button>
      </div>
    </div>
  );

  if (variant === 'compact') return renderCompactVersion();
  if (variant === 'featured') return renderFeaturedVersion();
  return renderDefaultVersion();
};

export default NewsCard;
