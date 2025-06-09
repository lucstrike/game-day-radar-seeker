import { create } from 'zustand';
import { UserProfile, SportType, Team } from '../types/sports';

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // ... outras ações podem ser adicionadas aqui
}

// Verifica o estado inicial de autenticação (ex: de um token salvo)
const getInitialState = () => {
  // Em uma aplicação real, você verificaria um token no localStorage
  return false; 
};

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isAuthenticated: getInitialState(),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulação de chamada de API para login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'joao@email.com' && password === 'senha123') {
        const mockProfile: UserProfile = {
          id: '1',
          name: 'João Silva',
          email,
          favoriteTeams: [],
          favoriteSports: [],
          preferredStreamingPlatforms: [],
          notifications: { gameReminders: true, newsUpdates: true, scoreUpdates: true },
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        };
        
        set({ profile: mockProfile, isAuthenticated: true, isLoading: false });
        console.log('Login bem-sucedido:', email);
        return true;
      } else {
        throw new Error('Credenciais inválidas.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Falha no login.';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  logout: () => {
    // Em uma aplicação real, você limparia o token salvo
    set({ profile: null, isAuthenticated: false, error: null });
    console.log('Usuário deslogado');
  },
}));