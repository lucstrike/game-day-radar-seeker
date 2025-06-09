
import React, { useState } from 'react';
import { User, Settings, Bell, Shield, Camera, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '../../store/userStore';
import ProfileEditor from './ProfileEditor';
import { useToast } from '@/hooks/use-toast';

const ProfileScreen = () => {
  const { toast } = useToast();
  const { profile, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSaveProfile = (updatedProfile: any) => {
    updateProfile(updatedProfile);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notificações Push</h3>
        <div className="space-y-3">
          {[
            { id: 'liveGames', label: 'Jogos ao vivo dos seus times', enabled: true },
            { id: 'gameResults', label: 'Resultados dos jogos', enabled: true },
            { id: 'news', label: 'Notícias dos seus esportes favoritos', enabled: false },
            { id: 'transfers', label: 'Transferências e contratações', enabled: true },
          ].map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">{setting.label}</span>
              <Badge variant={setting.enabled ? "default" : "secondary"}>
                {setting.enabled ? "Ativado" : "Desativado"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PrivacySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configurações de Privacidade</h3>
        <div className="space-y-3">
          {[
            { id: 'profilePublic', label: 'Perfil público', enabled: false },
            { id: 'shareActivity', label: 'Compartilhar atividade', enabled: true },
            { id: 'allowMessages', label: 'Permitir mensagens', enabled: false },
            { id: 'showOnline', label: 'Mostrar quando online', enabled: true },
          ].map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">{setting.label}</span>
              <Badge variant={setting.enabled ? "default" : "secondary"}>
                {setting.enabled ? "Ativado" : "Desativado"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AccountSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Conta</h3>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
              <Button variant="outline" size="sm">Alterar</Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Senha</p>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              <Button variant="outline" size="sm">Alterar</Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autenticação de dois fatores</p>
                <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
              </div>
              <Button variant="outline" size="sm">Configurar</Button>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t">
          <h4 className="text-md font-semibold text-destructive mb-3">Zona de Perigo</h4>
          <div className="space-y-3">
            <Button variant="destructive" className="w-full">
              Desativar Conta
            </Button>
            <Button variant="outline" className="w-full border-destructive text-destructive">
              Excluir Conta Permanentemente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <User className="h-8 w-8 text-primary" />
            <span>Meu Perfil</span>
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="h-24 w-24 rounded-full object-cover border-4 border-primary/20"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <Badge variant="secondary">Membro desde 2024</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{profile.email}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.favoriteSports.map((sport) => (
                  <Badge key={sport} variant="outline" className="text-xs">
                    {sport === 'soccer' ? 'Futebol' : 
                     sport === 'basketball' ? 'Basquete' : 
                     sport === 'volleyball' ? 'Vôlei' : 
                     sport === 'tennis' ? 'Tênis' : sport}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{profile.favoriteTeams.length} times favoritos</span>
                <span>•</span>
                <span>Localização: {profile.location || 'Não informado'}</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "secondary" : "default"}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Mode or Tabs */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileEditor 
              profile={profile} 
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Privacidade</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Conta</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Esportes Favoritos</h4>
                    <div className="space-y-2">
                      {profile.favoriteSports.map((sport) => (
                        <div key={sport} className="flex items-center justify-between p-2 border rounded">
                          <span>{sport === 'soccer' ? 'Futebol' : 
                                sport === 'basketball' ? 'Basquete' : 
                                sport === 'volleyball' ? 'Vôlei' : 
                                sport === 'tennis' ? 'Tênis' : sport}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Times Favoritos</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {profile.favoriteTeams.map((team) => (
                        <div key={team.id} className="flex items-center space-x-3 p-2 border rounded">
                          <img src={team.logo} alt={team.name} className="h-6 w-6 object-contain" />
                          <span className="text-sm">{team.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificação</CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
              </CardHeader>
              <CardContent>
                <PrivacySettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <AccountSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ProfileScreen;
