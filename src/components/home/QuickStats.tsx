
import React from 'react';
import { Calendar, TrendingUp, Users, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickStatsProps {
  upcomingGamesCount: number;
  liveGamesCount: number;
  favoriteTeamsCount: number;
  newsCount: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  upcomingGamesCount,
  liveGamesCount,
  favoriteTeamsCount,
  newsCount
}) => {
  const stats = [
    {
      icon: Calendar,
      value: upcomingGamesCount,
      label: 'Próximos Jogos',
      color: 'text-primary'
    },
    {
      icon: TrendingUp,
      value: liveGamesCount,
      label: 'Ao Vivo',
      color: 'text-green-500'
    },
    {
      icon: Users,
      value: favoriteTeamsCount,
      label: 'Times Favoritos',
      color: 'text-blue-500'
    },
    {
      icon: Trophy,
      value: newsCount,
      label: 'Notícias',
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="text-center hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
