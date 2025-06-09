
import React, { useState, useEffect } from 'react';
import { Newspaper, Filter, Search, TrendingUp, Clock, User, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSportsDataStore } from '../../store/sportsDataStore';
import { useUserStore } from '../../store/userStore';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const NewsScreen = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('trending');
  const [bookmarkedNews, setBookmarkedNews] = useState<string[]>([]);
  
  const { profile } = useUserStore();
  const { 
    news, 
    isLoadingNews,
    fetchNews,
    refreshAllData
  } = useSportsDataStore();

  useEffect(() => {
    refreshAllData();
    // Carregar bookmarks salvos
    const saved = localStorage.getItem('bookmarkedNews');
    if (saved) {
      setBookmarkedNews(JSON.parse(saved));
    }
  }, []);

  const filterNews = (articles: any[]) => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = selectedSport === 'all' || article.sport === selectedSport;
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      
      return matchesSearch && matchesSport && matchesCategory;
    });
  };

  const getNewsWithBookmarks = () => {
    return filterNews(news).map(article => ({
      ...article,
      isBookmarked: bookmarkedNews.includes(article.id)
    }));
  };

  const getTrendingNews = () => {
    return getNewsWithBookmarks()
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
  };

  const getRecentNews = () => {
    return getNewsWithBookmarks()
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  };

  const getBookmarkedNews = () => {
    return getNewsWithBookmarks().filter(article => article.isBookmarked);
  };

  const handleBookmark = (articleId: string) => {
    const newBookmarks = bookmarkedNews.includes(articleId)
      ? bookmarkedNews.filter(id => id !== articleId)
      : [...bookmarkedNews, articleId];
    
    setBookmarkedNews(newBookmarks);
    localStorage.setItem('bookmarkedNews', JSON.stringify(newBookmarks));
    
    toast({
      title: bookmarkedNews.includes(articleId) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: "Artigo atualizado na sua lista de favoritos.",
    });
  };

  const handleShare = (article: any) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: article.url || window.location.href,
      });
    } else {
      navigator.clipboard.writeText(article.url || window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link do artigo foi copiado para a área de transferência.",
      });
    }
  };

  const handleReadMore = (article: any) => {
    if (article.url) {
      window.open(article.url, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Há alguns minutos';
    if (hours < 24) return `Há ${hours}h`;
    return date.toLocaleDateString('pt-BR');
  };

  const NewsCard = ({ article }: { article: any }) => (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 md:h-full object-cover rounded-l-lg"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                {article.sport}
              </Badge>
            </div>
          </div>
          
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{article.source}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmark(article.id)}
                    className={article.isBookmarked ? "text-yellow-500" : ""}
                  >
                    <Bookmark className={`h-4 w-4 ${article.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(article)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              
              <p className="text-muted-foreground line-clamp-3">
                {article.summary}
              </p>
              
              {article.tags && (
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {article.views && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{article.views.toLocaleString()} visualizações</span>
                  </div>
                )}
              </div>
              
              <Button 
                size="sm" 
                onClick={() => handleReadMore(article)}
                className="group-hover:bg-primary group-hover:text-primary-foreground"
              >
                Ler mais
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoadingNews) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Carregando notícias..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Newspaper className="h-8 w-8 text-primary" />
            <span>Notícias</span>
          </h1>
          <p className="text-muted-foreground">
            Fique por dentro das últimas notícias do mundo esportivo
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Esporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os esportes</SelectItem>
                <SelectItem value="soccer">Futebol</SelectItem>
                <SelectItem value="basketball">Basquete</SelectItem>
                <SelectItem value="volleyball">Vôlei</SelectItem>
                <SelectItem value="tennis">Tênis</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="transfers">Transferências</SelectItem>
                <SelectItem value="results">Resultados</SelectItem>
                <SelectItem value="interviews">Entrevistas</SelectItem>
                <SelectItem value="rumors">Rumores</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('all');
                setSelectedCategory('all');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* News Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Em Alta</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Recentes</span>
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="flex items-center space-x-2">
            <Bookmark className="h-4 w-4" />
            <span>Favoritos ({bookmarkedNews.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          {getTrendingNews().length > 0 ? (
            getTrendingNews().map(article => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma notícia em alta</h3>
                <p className="text-muted-foreground text-center">
                  Não há notícias populares com os filtros selecionados.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {getRecentNews().length > 0 ? (
            getRecentNews().map(article => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma notícia encontrada</h3>
                <p className="text-muted-foreground text-center">
                  Não há notícias recentes com os filtros selecionados.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bookmarked" className="space-y-6">
          {getBookmarkedNews().length > 0 ? (
            getBookmarkedNews().map(article => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma notícia salva</h3>
                <p className="text-muted-foreground text-center">
                  Você ainda não salvou nenhuma notícia nos seus favoritos.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsScreen;
