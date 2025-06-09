
import React from 'react';
import { Home, Calendar, Newspaper, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavigationProps {
  // A navegação agora é controlada pelas rotas, não mais por estado local.
}

const Navigation = (props: NavigationProps) => {
  const navItems = [
    { id: 'home', to: '/', label: 'Início', icon: Home },
    { id: 'games', to: '/games', label: 'Jogos', icon: Calendar },
    { id: 'news', to: '/news', label: 'Notícias', icon: Newspaper },
    { id: 'profile', to: '/profile', label: 'Perfil', icon: User },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent",
      isActive && "bg-primary/10 text-primary font-semibold"
    );

  return (
    <>
      {/* Desktop Navigation */}
      <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 flex-col border-r bg-card p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.id} to={item.to} className={navLinkClass} end>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-card/95 backdrop-blur">
        {navItems.map((item) => (
          <NavLink key={`mobile-${item.id}`} to={item.to} className={({isActive}) => cn("flex flex-col items-center justify-center space-y-1 p-2 transition-colors", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")} end>
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
