import { create } from 'zustand';
import { Game, SportType, Team } from '../types/sports';

interface GamesState {
  games: Game[];
  filteredGames: Game[];
  isLoading: boolean;
  error: string | null;
  selectedSport: SportType | 'all';
  
  fetchGames: (date: string) => Promise<void>; 
  filterBySport: (sport: SportType | 'all') => void;
  getFavoriteTeamGames: (favoriteTeams: Team[]) => Game[];
  getUpcomingGames: (limit?: number) => Game[];
  getLiveGames: () => Game[];
  refreshData: (date: string) => Promise<void>;
}

const BACKEND_URL = 'http://localhost:3001';

export const useGamesStore = create<GamesState>((set, get) => ({
  games: [],
  filteredGames: [],
  isLoading: false,
  error: null,
  selectedSport: 'all',

  fetchGames: async (date: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log(`🔄 Buscando jogos do backend para a data: ${date}...`);
      
      const response = await fetch(`${BACKEND_URL}/api/games?date=${date}`);
      if (!response.ok) {
        throw new Error('Falha ao conectar com o backend.');
      }
      const data = await response.json();
      
      const games = data.games || [];

      set(state => ({ 
        games,
        // Mantém o filtro de esporte aplicado após a busca
        filteredGames: state.selectedSport === 'all' 
          ? games 
          : games.filter(game => game.sport === state.selectedSport),
        isLoading: false 
      }));
      
      console.log(`✅ ${games.length} jogos carregados do backend para ${date}.`);
    } catch (error: any) {
      console.error('❌ Erro ao carregar jogos do backend:', error);
      set({ 
        error: 'Erro ao carregar jogos. Verifique se o servidor backend está rodando.', 
        isLoading: false 
      });
    }
  },

  filterBySport: (sport: SportType | 'all') => {
    const { games } = get();
    const filtered = sport === 'all' 
      ? games 
      : games.filter(game => game.sport === sport);
    
    set({ 
      selectedSport: sport,
      filteredGames: filtered 
    });
    
    console.log(`🏆 Filtro aplicado - Esporte: ${sport}, Jogos encontrados: ${filtered.length}`);
  },

  refreshData: async (date: string) => {
    console.log(`🔄 Atualizando dados para a data: ${date}...`);
    await get().fetchGames(date);
    console.log('✅ Frontend atualizado.');
  },

  getFavoriteTeamGames: (favoriteTeams: Team[]) => {
    const { games } = get();
    const favoriteTeamIds = favoriteTeams.map(team => team.id);
    
    return games.filter(game => 
      favoriteTeamIds.includes(game.homeTeam.id) || 
      favoriteTeamIds.includes(game.awayTeam.id)
    );
  },

  getUpcomingGames: (limit = 10) => {
    const { games } = get();
    return games
      .filter(game => game.status === 'upcoming')
      .slice(0, limit);
  },

  getLiveGames: () => {
    const { games } = get();
    return games.filter(game => game.status === 'live');
  },
}));

