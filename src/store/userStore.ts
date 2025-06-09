
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, SportType, Team } from '../types/sports';

interface UserState {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Profile management
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateFavoriteSports: (sports: SportType[]) => void;
  updateFavoriteTeams: (teams: Team[]) => void;
  setNotificationPreferences: (notifications: UserProfile['notifications']) => void;
  
  // Personalization
  getPersonalizedContent: () => any;
  saveProfileChanges: () => Promise<boolean>;
}

// Função para simular salvamento no backend
const saveToBackend = async (profile: UserProfile): Promise<boolean> => {
  try {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Em uma aplicação real, faria:
    // const response = await fetch('/api/profile', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(profile)
    // });
    // return response.ok;
    
    console.log('✅ Perfil salvo no backend:', profile);
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar perfil:', error);
    return false;
  }
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (email === 'joao@email.com' && password === 'senha123') {
            const mockProfile: UserProfile = {
              id: '1',
              name: 'João Silva',
              email,
              favoriteTeams: [],
              favoriteSports: [],
              preferredStreamingPlatforms: [],
              notifications: { 
                gameReminders: true, 
                newsUpdates: true, 
                scoreUpdates: true 
              },
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
            };
            
            set({ profile: mockProfile, isAuthenticated: true, isLoading: false });
            console.log('✅ Login bem-sucedido:', email);
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
        set({ profile: null, isAuthenticated: false, error: null });
        console.log('👋 Usuário deslogado');
      },

      updateProfile: (updates: Partial<UserProfile>) => {
        const { profile } = get();
        if (profile) {
          const updatedProfile = { ...profile, ...updates };
          set({ profile: updatedProfile });
          console.log('🔄 Perfil atualizado:', updates);
        }
      },

      updateFavoriteSports: (sports: SportType[]) => {
        const { profile } = get();
        if (profile) {
          const updatedProfile = { ...profile, favoriteSports: sports };
          set({ profile: updatedProfile });
          console.log('⚽ Esportes favoritos atualizados:', sports);
        }
      },

      updateFavoriteTeams: (teams: Team[]) => {
        const { profile } = get();
        if (profile) {
          const updatedProfile = { ...profile, favoriteTeams: teams };
          set({ profile: updatedProfile });
          console.log('🏆 Times favoritos atualizados:', teams);
        }
      },

      setNotificationPreferences: (notifications: UserProfile['notifications']) => {
        const { profile } = get();
        if (profile) {
          const updatedProfile = { ...profile, notifications };
          set({ profile: updatedProfile });
          console.log('🔔 Preferências de notificação atualizadas:', notifications);
        }
      },

      getPersonalizedContent: () => {
        const { profile } = get();
        if (!profile) return null;

        return {
          recommendedSports: profile.favoriteSports,
          recommendedTeams: profile.favoriteTeams,
          personalizedTheme: profile.favoriteSports.length > 0 ? profile.favoriteSports[0] : 'soccer',
          showNotifications: profile.notifications.gameReminders
        };
      },

      saveProfileChanges: async () => {
        const { profile } = get();
        if (!profile) return false;

        set({ isLoading: true });
        
        try {
          const success = await saveToBackend(profile);
          set({ isLoading: false });
          
          if (success) {
            console.log('💾 Alterações salvas com sucesso!');
          }
          
          return success;
        } catch (error) {
          set({ isLoading: false, error: 'Erro ao salvar alterações' });
          return false;
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        profile: state.profile, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
