
import { create } from 'zustand';
import { Game, Team, NewsArticle, SportType } from '../types/sports';

interface SportsDataState {
  // Real-time data
  liveGames: Game[];
  upcomingGames: Game[];
  finishedGames: Game[];
  news: NewsArticle[];
  teams: Team[];
  
  // Loading states
  isLoadingGames: boolean;
  isLoadingNews: boolean;
  isLoadingTeams: boolean;
  
  // Errors
  gamesError: string | null;
  newsError: string | null;
  teamsError: string | null;
  
  // Actions
  fetchLiveGames: () => Promise<void>;
  fetchUpcomingGames: (sport?: SportType) => Promise<void>;
  fetchNews: (sport?: SportType) => Promise<void>;
  fetchTeams: (sport: SportType) => Promise<void>;
  searchTeams: (query: string) => Promise<Team[]>;
  refreshAllData: () => Promise<void>;
}

// APIs reais que podemos usar
const SPORTS_APIS = {
  // API gratuita para futebol
  FOOTBALL: 'https://api.football-data.org/v4',
  // API para esportes em geral
  SPORTS_API: 'https://www.thesportsdb.com/api/v1/json/3',
  // API para notícias esportivas
  NEWS_API: 'https://newsapi.org/v2/everything',
};

const MOCK_TEAMS: Record<SportType, Team[]> = {
  soccer: [
    {
      id: 'palmeiras',
      name: 'Palmeiras',
      logo: 'https://logoeps.com/wp-content/uploads/2013/03/palmeiras-vector-logo.png',
      sport: 'soccer',
      league: 'Brasileirão Série A',
      country: 'Brasil'
    },
    {
      id: 'flamengo',
      name: 'Flamengo',
      logo: 'https://logoeps.com/wp-content/uploads/2013/03/flamengo-vector-logo.png',
      sport: 'soccer',
      league: 'Brasileirão Série A',
      country: 'Brasil'
    },
    {
      id: 'corinthians',
      name: 'Corinthians',
      logo: 'https://logoeps.com/wp-content/uploads/2013/03/corinthians-vector-logo.png',
      sport: 'soccer',
      league: 'Brasileirão Série A',
      country: 'Brasil'
    }
  ],
  basketball: [
    {
      id: 'lakers',
      name: 'Los Angeles Lakers',
      logo: 'https://logoeps.com/wp-content/uploads/2013/03/los-angeles-lakers-vector-logo.png',
      sport: 'basketball',
      league: 'NBA',
      country: 'USA'
    },
    {
      id: 'warriors',
      name: 'Golden State Warriors',
      logo: 'https://logoeps.com/wp-content/uploads/2013/03/golden-state-warriors-vector-logo.png',
      sport: 'basketball',
      league: 'NBA',
      country: 'USA'
    }
  ],
  volleyball: [],
  tennis: [],
  football: [],
  baseball: []
};

export const useSportsDataStore = create<SportsDataState>((set, get) => ({
  liveGames: [],
  upcomingGames: [],
  finishedGames: [],
  news: [],
  teams: [],
  
  isLoadingGames: false,
  isLoadingNews: false,
  isLoadingTeams: false,
  
  gamesError: null,
  newsError: null,
  teamsError: null,

  fetchLiveGames: async () => {
    set({ isLoadingGames: true, gamesError: null });
    
    try {
      // Em produção, usaria APIs reais:
      // const response = await fetch(`${SPORTS_APIS.SPORTS_API}/livescore.php?sport=Soccer`);
      // const data = await response.json();
      
      // Por agora, simula dados reais
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLiveGames: Game[] = [
        {
          id: 'live-1',
          homeTeam: MOCK_TEAMS.soccer[0],
          awayTeam: MOCK_TEAMS.soccer[1],
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          venue: 'Allianz Parque',
          sport: 'soccer',
          league: 'Brasileirão Série A',
          status: 'live',
          streamingPlatforms: [
            {
              id: 'globo',
              name: 'Globo',
              logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Rede_Globo_logo.svg/200px-Rede_Globo_logo.svg.png',
              url: 'https://globoplay.globo.com',
              type: 'tv',
              isFree: false
            }
          ],
          predictions: {
            homeWinProbability: 55,
            awayWinProbability: 30,
            drawProbability: 15,
            keyFactors: ['Mando de campo', 'Histórico recente favorável'],
            expertTip: 'Casa vence por 2x1'
          }
        }
      ];
      
      set({ liveGames: mockLiveGames, isLoadingGames: false });
      console.log('🔴 Jogos ao vivo carregados:', mockLiveGames.length);
      
    } catch (error) {
      set({ gamesError: 'Erro ao carregar jogos ao vivo', isLoadingGames: false });
      console.error('❌ Erro ao buscar jogos ao vivo:', error);
    }
  },

  fetchUpcomingGames: async (sport?: SportType) => {
    set({ isLoadingGames: true, gamesError: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const mockUpcomingGames: Game[] = [
        {
          id: 'upcoming-1',
          homeTeam: MOCK_TEAMS.soccer[0],
          awayTeam: MOCK_TEAMS.soccer[2],
          date: tomorrow.toISOString().split('T')[0],
          time: '16:00',
          venue: 'Allianz Parque',
          sport: 'soccer',
          league: 'Brasileirão Série A',
          status: 'upcoming',
          streamingPlatforms: [
            {
              id: 'premiere',
              name: 'Premiere',
              logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Premiere_FC_logo.svg/200px-Premiere_FC_logo.svg.png',
              url: 'https://globoplay.globo.com/premiere',
              type: 'streaming',
              isFree: false
            }
          ],
          ticketUrl: 'https://www.palmeiras.com.br/ingressos',
          predictions: {
            homeWinProbability: 60,
            awayWinProbability: 25,
            drawProbability: 15,
            keyFactors: ['Palmeiras em casa', 'Corinthians com desfalques'],
            expertTip: 'Palmeiras favorito para vencer'
          }
        }
      ];
      
      const filteredGames = sport 
        ? mockUpcomingGames.filter(game => game.sport === sport)
        : mockUpcomingGames;
      
      set({ upcomingGames: filteredGames, isLoadingGames: false });
      console.log('📅 Próximos jogos carregados:', filteredGames.length);
      
    } catch (error) {
      set({ gamesError: 'Erro ao carregar próximos jogos', isLoadingGames: false });
      console.error('❌ Erro ao buscar próximos jogos:', error);
    }
  },

  fetchNews: async (sport?: SportType) => {
    set({ isLoadingNews: true, newsError: null });
    
    try {
      // Em produção, usaria:
      // const response = await fetch(`${SPORTS_APIS.NEWS_API}?q=${sport || 'sports'}&apiKey=${API_KEY}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNews: NewsArticle[] = [
        {
          id: 'news-1',
          title: 'Palmeiras anuncia contratação de novo atacante',
          summary: 'Clube paulista fecha acordo com jogador europeu por três temporadas.',
          content: 'O Palmeiras oficializou hoje a contratação do atacante...',
          author: 'Redação ESPN',
          publishedAt: new Date().toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
          tags: ['Palmeiras', 'Contratação', 'Futebol'],
          sport: 'soccer',
          teams: [MOCK_TEAMS.soccer[0]],
          source: 'ESPN',
          url: 'https://www.espn.com.br'
        },
        {
          id: 'news-2',
          title: 'NBA: Lakers vencem mais uma e se aproximam dos playoffs',
          summary: 'Time de Los Angeles conquista vitória importante contra Warriors.',
          content: 'Os Lakers conseguiram uma vitória crucial...',
          author: 'John Sports',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
          tags: ['Lakers', 'NBA', 'Basketball'],
          sport: 'basketball',
          teams: [MOCK_TEAMS.basketball[0]],
          source: 'ESPN',
          url: 'https://www.espn.com'
        }
      ];
      
      const filteredNews = sport 
        ? mockNews.filter(article => article.sport === sport)
        : mockNews;
      
      set({ news: filteredNews, isLoadingNews: false });
      console.log('📰 Notícias carregadas:', filteredNews.length);
      
    } catch (error) {
      set({ newsError: 'Erro ao carregar notícias', isLoadingNews: false });
      console.error('❌ Erro ao buscar notícias:', error);
    }
  },

  fetchTeams: async (sport: SportType) => {
    set({ isLoadingTeams: true, teamsError: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const teams = MOCK_TEAMS[sport] || [];
      set({ teams, isLoadingTeams: false });
      console.log(`🏆 Times de ${sport} carregados:`, teams.length);
      
    } catch (error) {
      set({ teamsError: 'Erro ao carregar times', isLoadingTeams: false });
      console.error('❌ Erro ao buscar times:', error);
    }
  },

  searchTeams: async (query: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allTeams = Object.values(MOCK_TEAMS).flat();
      const results = allTeams.filter(team => 
        team.name.toLowerCase().includes(query.toLowerCase()) ||
        team.league.toLowerCase().includes(query.toLowerCase())
      );
      
      console.log(`🔍 Busca por "${query}":`, results.length, 'resultados');
      return results;
      
    } catch (error) {
      console.error('❌ Erro na busca de times:', error);
      return [];
    }
  },

  refreshAllData: async () => {
    const actions = get();
    console.log('🔄 Atualizando todos os dados...');
    
    await Promise.all([
      actions.fetchLiveGames(),
      actions.fetchUpcomingGames(),
      actions.fetchNews()
    ]);
    
    console.log('✅ Todos os dados atualizados!');
  },
}));
