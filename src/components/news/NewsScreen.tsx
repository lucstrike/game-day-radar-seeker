
import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter, Search, Clock, Star } from 'lucide-react';
import { NewsArticle, SportType } from '../../types/sports';
import NewsCard from './NewsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '../../store/userStore';

const NewsScreen = () => {
  const { profile } = useUserStore();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<SportType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock news data
  const mockNews: NewsArticle[] = [
    {
      id: '1',
      title: 'Palmeiras anuncia contratação de novo técnico para temporada 2024',
      summary: 'Verdão confirma chegada do comandante português que estava no futebol europeu. Apresentação deve acontecer na próxima semana.',
      content: 'O Palmeiras oficializou hoje a contratação do novo técnico...',
      author: 'João Santos',
      publishedAt: '2024-06-10T08:30:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop',
      tags: ['Contratação', 'Palmeiras', 'Técnico'],
      sport: 'soccer',
      teams: [{
        id: 'palm',
        name: 'Palmeiras',
        logo: 'https://logoeps.com/wp-content/uploads/2013/03/palmeiras-vector-logo.png',
        sport: 'soccer',
        league: 'Brasileirão',
        country: 'Brasil'
      }],
      source: 'Globo Esporte',
      url: 'https://globoesporte.globo.com'
    },
    {
      id: '2',
      title: 'NBA: Lakers vencem Warriors em jogo emocionante nos playoffs',
      summary: 'Em partida decidida nos últimos segundos, Lakers conseguem virada histórica contra os Warriors e avançam na pós-temporada.',
      content: 'Os Los Angeles Lakers conseguiram uma vitória...',
      author: 'Maria Silva',
      publishedAt: '2024-06-09T23:45:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800&h=400&fit=crop',
      tags: ['NBA', 'Playoffs', 'Lakers', 'Warriors'],
      sport: 'basketball',
      teams: [
        {
          id: 'lakers',
          name: 'LA Lakers',
          logo: 'https://logoeps.com/wp-content/uploads/2013/03/los-angeles-lakers-vector-logo.png',
          sport: 'basketball',
          league: 'NBA',
          country: 'EUA'
        },
        {
          id: 'warriors',
          name: 'Golden State Warriors',
          logo: 'https://logoeps.com/wp-content/uploads/2013/03/golden-state-warriors-vector-logo.png',
          sport: 'basketball',
          league: 'NBA',
          country: 'EUA'
        }
      ],
      source: 'ESPN',
      url: 'https://espn.com.br'
    },
    {
      id: '3',
      title: 'Seleção Brasileira de Vôlei conquista medalha de ouro em torneio internacional',
      summary: 'Brasil vence final contra a Itália e mostra força para os próximos compromissos internacionais.',
      content: 'A Seleção Brasileira de Vôlei masculino...',
      author: 'Carlos Oliveira',
      publishedAt: '2024-06-09T16:20:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop',
      tags: ['Seleção', 'Vôlei', 'Ouro', 'Internacional'],
      sport: 'volleyball',
      teams: [],
      source: 'CBV',
      url: 'https://cbv.com.br'
    },
    {
      id: '4',
      title: 'Wimbledon 2024: Brasileiros avançam para as oitavas de final',
      summary: 'Três tenistas brasileiros conseguem classificação histórica para as oitavas em Wimbledon.',
      content: 'O tênis brasileiro vive momento especial...',
      author: 'Ana Costa',
      publishedAt: '2024-06-08T14:15:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop',
      tags: ['Wimbledon', 'Brasil', 'Tênis'],
      sport: 'tennis',
      teams: [],
      source: 'UOL Esporte',
      url: 'https://esporte.uol.com.br'
    },
    {
      id: '5',
      title: 'NFL: Draft 2024 traz surpresas e novos talentos para a liga',
      summary: 'Jovens quarterbacks chamam atenção e podem revolucionar a nova temporada da NFL.',
      content: 'O Draft da NFL 2024 foi marcado...',
      author: 'Pedro Lima',
      publishedAt: '2024-06-07T20:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=400&fit=crop',
      tags: ['NFL', 'Draft', 'Novatos'],
      sport: 'football',
      teams: [],
      source: 'ESPN',
      url: 'https://espn.com.br'
    }
  ];

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNews(mockNews);
      setFilteredNews(mockNews);
      setIsLoading(false);
    };

    loadNews();
  }, []);

  useEffect(() => {
    let filtered = news;

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter(article => article.sport === selectedSport);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Prioritize favorite teams if user is logged in
    if (profile?.favoriteTeams.length) {
      const favoriteTeamIds = profile.favoriteTeams.map(team => team.id);
      filtered.sort((a, b) => {
        const aHasFavorite = a.teams.some(team => favoriteTeamIds.includes(team.id));
        const bHasFavorite = b.teams.some(team => favoriteTeamIds.includes(team.id));
        
        if (aHasFavorite && !bHasFavorite) return -1;
        if (!aHasFavorite && bHasFavorite) return 1;
        return 0;
      });
    }

    setFilteredNews(filtered);
  }, [selectedSport, searchQuery, news, profile]);

  const sports = [
    { id: 'all' as const, name: 'Todos', count: news.length },
    { id: 'soccer' as const, name: 'Futebol', count: news.filter(n => n.sport === 'soccer').length },
    { id: 'basketball' as const, name: 'Basquete', count: news.filter(n => n.sport === 'basketball').length },
    { id: 'volleyball' as const, name: 'Vôlei', count: news.filter(n => n.sport === 'volleyball').length },
    { id: 'tennis' as const, name: 'Tênis', count: news.filter(n => n.sport === 'tennis').length },
    { id: 'football' as const, name: 'NFL', count: news.filter(n => n.sport === 'football').length },
  ];

  const featuredNews = filteredNews[0];
  const regularNews = filteredNews.slice(1);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-muted rounded-2xl"></div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <section className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Notícias Esportivas</h1>
            <p className="text-muted-foreground mt-1">
              Fique por dentro das últimas notícias do mundo dos esportes
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Sport Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {sports.map((sport) => (
            <Button
              key={sport.id}
              variant={selectedSport === sport.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSport(sport.id)}
              className="whitespace-nowrap"
            >
              {sport.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {sport.count}
              </Badge>
            </Button>
          ))}
        </div>
      </section>

      {/* Featured News */}
      {featuredNews && (
        <section className="animate-slide-up">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-xl font-bold">Destaque</h2>
          </div>
          <NewsCard article={featuredNews} variant="featured" />
        </section>
      )}

      {/* Personalized Recommendations */}
      {profile?.favoriteTeams.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Para Você</h2>
          </div>
          <div className="grid gap-4">
            {filteredNews
              .filter(article => 
                article.teams.some(team => 
                  profile.favoriteTeams.some(favTeam => favTeam.id === team.id)
                )
              )
              .slice(0, 3)
              .map((article) => (
                <NewsCard key={article.id} article={article} variant="compact" />
              ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Últimas Notícias</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regularNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Load More */}
      <div className="flex justify-center pt-8">
        <Button variant="outline" className="hover-lift">
          Carregar Mais Notícias
        </Button>
      </div>
    </div>
  );
};

export default NewsScreen;
