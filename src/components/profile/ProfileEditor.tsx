
import React, { useState } from 'react';
import { User, Camera, Save, X, Plus, Trash2 } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { useSportsDataStore } from '../../store/sportsDataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { SportType, Team } from '../../types/sports';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditorProps {
  onClose: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
  const { profile, updateProfile, updateFavoriteSports, updateFavoriteTeams, setNotificationPreferences, saveProfileChanges } = useUserStore();
  const { teams, searchTeams, isLoadingTeams } = useSportsDataStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    avatar: profile?.avatar || '',
  });
  
  const [selectedSports, setSelectedSports] = useState<SportType[]>(profile?.favoriteSports || []);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>(profile?.favoriteTeams || []);
  const [notifications, setNotifications] = useState(profile?.notifications || {
    gameReminders: true,
    newsUpdates: true,
    scoreUpdates: true
  });
  
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [teamSearchResults, setTeamSearchResults] = useState<Team[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const sports: { id: SportType; name: string; emoji: string }[] = [
    { id: 'soccer', name: 'Futebol', emoji: '⚽' },
    { id: 'basketball', name: 'Basquete', emoji: '🏀' },
    { id: 'volleyball', name: 'Vôlei', emoji: '🏐' },
    { id: 'tennis', name: 'Tênis', emoji: '🎾' },
    { id: 'football', name: 'Futebol Americano', emoji: '🏈' },
    { id: 'baseball', name: 'Baseball', emoji: '⚾' },
  ];

  const handleSportToggle = (sportId: SportType) => {
    if (selectedSports.includes(sportId)) {
      setSelectedSports(selectedSports.filter(s => s !== sportId));
    } else {
      setSelectedSports([...selectedSports, sportId]);
    }
  };

  const handleTeamSearch = async (query: string) => {
    setTeamSearchQuery(query);
    
    if (query.length >= 2) {
      const results = await searchTeams(query);
      setTeamSearchResults(results);
    } else {
      setTeamSearchResults([]);
    }
  };

  const handleAddTeam = (team: Team) => {
    if (!selectedTeams.find(t => t.id === team.id)) {
      setSelectedTeams([...selectedTeams, team]);
      setTeamSearchQuery('');
      setTeamSearchResults([]);
    }
  };

  const handleRemoveTeam = (teamId: string) => {
    setSelectedTeams(selectedTeams.filter(t => t.id !== teamId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Atualizar dados do perfil
      updateProfile(formData);
      updateFavoriteSports(selectedSports);
      updateFavoriteTeams(selectedTeams);
      setNotificationPreferences(notifications);
      
      // Salvar no backend
      const success = await saveProfileChanges();
      
      if (success) {
        toast({
          title: "Perfil salvo!",
          description: "Suas alterações foram salvas com sucesso.",
        });
        onClose();
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as alterações. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao salvar o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <Label htmlFor="avatar">URL do Avatar</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://exemplo.com/avatar.jpg"
                  />
                </div>
              </div>

              {/* Nome */}
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Esportes Favoritos */}
          <Card>
            <CardHeader>
              <CardTitle>Esportes Favoritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sports.map((sport) => {
                  const isSelected = selectedSports.includes(sport.id);
                  return (
                    <button
                      key={sport.id}
                      onClick={() => handleSportToggle(sport.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/10 scale-105'
                          : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-2xl">{sport.emoji}</div>
                        <div className="text-sm font-medium">{sport.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Times Favoritos */}
          <Card>
            <CardHeader>
              <CardTitle>Times Favoritos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Busca de Times */}
              <div className="relative">
                <Input
                  value={teamSearchQuery}
                  onChange={(e) => handleTeamSearch(e.target.value)}
                  placeholder="Buscar times..."
                  className="pr-10"
                />
                <Plus className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                
                {/* Resultados da Busca */}
                {teamSearchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                    {teamSearchResults.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => handleAddTeam(team)}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="h-8 w-8 object-contain"
                        />
                        <div className="text-left">
                          <div className="font-medium">{team.name}</div>
                          <div className="text-sm text-muted-foreground">{team.league}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Times Selecionados */}
              <div className="space-y-2">
                {selectedTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="h-8 w-8 object-contain"
                      />
                      <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground">{team.league}</div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveTeam(team.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Lembretes de Jogos</div>
                  <div className="text-sm text-muted-foreground">
                    Receba notificações antes dos jogos começarem
                  </div>
                </div>
                <Switch
                  checked={notifications.gameReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, gameReminders: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Atualizações de Notícias</div>
                  <div className="text-sm text-muted-foreground">
                    Fique por dentro das últimas notícias dos seus times
                  </div>
                </div>
                <Switch
                  checked={notifications.newsUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, newsUpdates: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Placares ao Vivo</div>
                  <div className="text-sm text-muted-foreground">
                    Receba atualizações de placares em tempo real
                  </div>
                </div>
                <Switch
                  checked={notifications.scoreUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, scoreUpdates: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="sticky bottom-0 bg-background border-t p-6 flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
