import React from 'react';
import { Bell, User, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '../../store/userStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { profile, isAuthenticated, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="text-2xl font-bold gradient-text-brand">SportSync</span>
        </div>

        {isAuthenticated && (
          <>
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="text" placeholder="Buscar jogos, times ou notícias..." className="pl-10 h-10" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
              <div className="flex items-center space-x-3">
                <span className="hidden md:inline-block text-sm font-medium">{profile?.name.split(' ')[0]}</span>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img src={profile?.avatar} alt="Avatar" className="h-9 w-9 rounded-full object-cover" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;