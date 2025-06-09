
import React, { useState } from 'react';
import { Bell, User, Search, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '../../store/userStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { profile, isAuthenticated, logout } = useUserStore();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Pesquisando por:', searchQuery);
      // Aqui você pode implementar a lógica de busca
      alert(`Pesquisando por: "${searchQuery}"`);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-400 shadow-lg">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="text-2xl font-bold gradient-text-brand">SportSync</span>
        </div>

        {isAuthenticated && (
          <>
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Buscar jogos, times ou notícias..." 
                  className={`pl-10 h-10 transition-all duration-200 ${
                    isSearchFocused ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleNotificationClick}
                  className="relative hover:bg-accent"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </span>
                  <span className="sr-only">Notificações</span>
                </Button>
                
                {/* Dropdown de Notificações */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-semibold">Notificações</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-3 border-b border-border hover:bg-accent cursor-pointer">
                        <p className="text-sm font-medium">Jogo do Flamengo em 30 min!</p>
                        <p className="text-xs text-muted-foreground">Flamengo vs Palmeiras</p>
                      </div>
                      <div className="p-3 border-b border-border hover:bg-accent cursor-pointer">
                        <p className="text-sm font-medium">Nova notícia sobre o Santos</p>
                        <p className="text-xs text-muted-foreground">Transferência confirmada</p>
                      </div>
                      <div className="p-3 hover:bg-accent cursor-pointer">
                        <p className="text-sm font-medium">Resultado: São Paulo 2x1 Corinthians</p>
                        <p className="text-xs text-muted-foreground">Há 2 horas</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="hidden md:flex hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <span className="hidden md:inline-block text-sm font-medium">
                  {profile?.name.split(' ')[0]}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-accent"
                  onClick={() => navigate('/profile')}
                >
                  <img 
                    src={profile?.avatar} 
                    alt="Avatar" 
                    className="h-9 w-9 rounded-full object-cover border-2 border-primary/20" 
                  />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Search Bar */}
      {isAuthenticated && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-10 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;
