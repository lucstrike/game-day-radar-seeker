
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfileEditorProps, SportType, Team } from '../../types/sports';
import { useSportsDataStore } from '../../store/sportsDataStore';

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onCancel }) => {
  const [editedProfile, setEditedProfile] = useState(profile);
  const [teamSearch, setTeamSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const { searchTeams } = useSportsDataStore();

  const sportOptions: { value: SportType; label: string }[] = [
    { value: 'soccer', label: 'Futebol' },
    { value: 'basketball', label: 'Basquete' },
    { value: 'volleyball', label: 'Vôlei' },
    { value: 'tennis', label: 'Tênis' },
    { value: 'football', label: 'Futebol Americano' },
    { value: 'baseball', label: 'Baseball' },
  ];

  const handleSportChange = (sport: SportType, checked: boolean) => {
    const updatedSports = checked
      ? [...editedProfile.favoriteSports, sport]
      : editedProfile.favoriteSports.filter(s => s !== sport);
    
    setEditedProfile(prev => ({ ...prev, favoriteSports: updatedSports }));
  };

  const handleTeamSearch = async (query: string) => {
    setTeamSearch(query);
    if (query.length > 2) {
      const results = await searchTeams(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addTeam = (team: Team) => {
    if (!editedProfile.favoriteTeams.find(t => t.id === team.id)) {
      setEditedProfile(prev => ({
        ...prev,
        favoriteTeams: [...prev.favoriteTeams, team]
      }));
    }
    setTeamSearch('');
    setSearchResults([]);
  };

  const removeTeam = (teamId: string) => {
    setEditedProfile(prev => ({
      ...prev,
      favoriteTeams: prev.favoriteTeams.filter(t => t.id !== teamId)
    }));
  };

  const handleSave = () => {
    onSave(editedProfile);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editedProfile.email}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={editedProfile.location || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: São Paulo, SP"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Esportes Favoritos</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {sportOptions.map((sport) => (
                <div key={sport.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={sport.value}
                    checked={editedProfile.favoriteSports.includes(sport.value)}
                    onCheckedChange={(checked) => handleSportChange(sport.value, checked as boolean)}
                  />
                  <Label htmlFor={sport.value} className="text-sm">{sport.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>Times Favoritos</Label>
        <div className="mt-2">
          <Input
            placeholder="Buscar times..."
            value={teamSearch}
            onChange={(e) => handleTeamSearch(e.target.value)}
          />
          
          {searchResults.length > 0 && (
            <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
              {searchResults.map((team) => (
                <div
                  key={team.id}
                  className="p-3 hover:bg-muted cursor-pointer flex items-center space-x-3"
                  onClick={() => addTeam(team)}
                >
                  <img src={team.logo} alt={team.name} className="h-6 w-6" />
                  <span>{team.name} - {team.league}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 space-y-2">
            {editedProfile.favoriteTeams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  <img src={team.logo} alt={team.name} className="h-6 w-6" />
                  <span>{team.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeTeam(team.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditor;
