
import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import LoadingSpinner from './LoadingSpinner';

interface AppLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-400 mx-auto animate-pulse">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <LoadingSpinner size="lg" text="Carregando sua experiência esportiva..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Navigation />
      <main className="md:ml-64 p-4 md:p-6 mt-16 pb-20 md:pb-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
