
import React, { useState } from 'react';
import { User, Settings, Heart, Bell, Trophy, Calendar, Star, Edit } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { SportType } from '../../types/sports';

const ProfileScreen = () => {
  const { profile, isAuthenticated, updateProfile, updateFavoriteSports, setNotificationPreferences } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);

  const sports: { id: SportType; name: string; color: string; icon: string }[] = [
    { id: 'soccer', name: 'Futebol', color: 'bg-sports-soccer', icon: '⚽' },
    { id: 'basketball', name: 'Basquete', color: 'bg-sports-basketball', icon: '🏀' },
    { id: 'volleyball', name: 'Vôlei', color: 'bg-sports-volleyball', icon: '🏐' },
    { id: 'tennis', name: 'Tênis', color: 'bg-sports-tennis', icon: '🎾' },
    { id: 'football', name: 'Futebol Americano', color: 'bg-sports-football', icon: '🏈' },
  ];

  const handleSportToggle = (sportId: SportType) => {
    if (!profile) return;
    
    const currentSports = profile.favoriteSports;
    const newSports = currentSports.includes(sportId)
      ? currentSports.filter(s => s !== sportId)
      : [...currentSports, sportId];
    
    updateFavoriteSports(newSports);
  };

  const handleNotificationToggle = (key: keyof typeof profile.notifications, value: boolean) => {
    if (!profile) return;
    
    setNotificationPreferences({
      ...profile.notifications,
      [key]: value
    });
  };

  if (!isAuthenticated || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Entre para ver seu perfil</h2>
          <p className="text-muted-foreground">
            Acesse sua conta para personalizar suas preferências esportivas
          </p>
          <Button className="bg-gradient-to-r from-primary to-purple-600">
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Profile Header */}
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border-4 border-primary/20"
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
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{profile.favoriteTeams.length} times</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>{profile.favoriteSports.length} esportes</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Sports */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span>Esportes Favoritos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sports.map((sport) => {
              const isSelected = profile.favoriteSports.includes(sport.id);
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
                    <div className="text-2xl">{sport.icon}</div>
                    <div className="text-sm font-medium">{sport.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Teams */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Times Favoritos</span>
            </div>
            <Button variant="outline" size="sm">
              <span className="mr-2">+</span>
              Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile.favoriteTeams.length > 0 ? (
            <div className="grid gap-3">
              {profile.favoriteTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="h-10 w-10 object-contain"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{team.name}</h4>
                    <p className="text-sm text-muted-foreground">{team.league}</p>
                  </div>
                  <Badge variant="secondary">{team.sport}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum time favorito ainda</p>
              <p className="text-sm">Adicione times para receber recomendações personalizadas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Notificações</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Lembretes de Jogos</h4>
              <p className="text-sm text-muted-foreground">
                Receba notificações antes dos jogos começarem
              </p>
            </div>
            <Switch
              checked={profile.notifications.gameReminders}
              onCheckedChange={(checked) => handleNotificationToggle('gameReminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Atualizações de Notícias</h4>
              <p className="text-sm text-muted-foreground">
                Fique por dentro das últimas notícias dos seus times
              </p>
            </div>
            <Switch
              checked={profile.notifications.newsUpdates}
              onCheckedChange={(checked) => handleNotificationToggle('newsUpdates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Placares ao Vivo</h4>
              <p className="text-sm text-muted-foreground">
                Receba atualizações de placares em tempo real
              </p>
            </div>
            <Switch
              checked={profile.notifications.scoreUpdates}
              onCheckedChange={(checked) => handleNotificationToggle('scoreUpdates', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Configurações da Conta</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Bell className="h-4 w-4 mr-2" />
            Preferências de Notificação
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Sincronizar Calendário
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive">
            <User className="h-4 w-4 mr-2" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileScreen;
