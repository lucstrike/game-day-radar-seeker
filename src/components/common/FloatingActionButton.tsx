
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';

interface FloatingActionButtonProps {
  action?: 'add' | 'search' | 'filter';
  onClick: () => void;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  action = 'add', 
  onClick,
  className = ''
}) => {
  const getIcon = () => {
    switch (action) {
      case 'search':
        return <Search className="h-6 w-6" />;
      case 'filter':
        return <Filter className="h-6 w-6" />;
      default:
        return <Plus className="h-6 w-6" />;
    }
  };

  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 z-40 transition-all duration-300 hover:scale-110 ${className}`}
      size="icon"
    >
      {getIcon()}
    </Button>
  );
};

export default FloatingActionButton;
