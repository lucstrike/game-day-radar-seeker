
import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import Header from '../components/common/Header';
import Navigation from '../components/common/Navigation';
import HomeScreen from '../components/home/HomeScreen';
import GamesScreen from '../components/games/GamesScreen';
import NewsScreen from '../components/news/NewsScreen';
import ProfileScreen from '../components/profile/ProfileScreen';
import LoginForm from '../components/auth/LoginForm';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated } = useUserStore();

  // Auto-login for demo purposes
  useEffect(() => {
    const autoLogin = async () => {
      const { login } = useUserStore.getState();
      if (!isAuthenticated) {
        await login('joao@email.com', 'senha123');
      }
    };
    
    // Delay to show the app loading
    setTimeout(autoLogin, 1500);
  }, [isAuthenticated]);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'games':
        return <GamesScreen />;
      case 'news':
        return <NewsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <LoginForm onClose={() => setShowLogin(false)} />
      )}

      {/* Loading Overlay for Demo */}
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 mx-auto animate-float">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">SportSync</h1>
            <p className="text-muted-foreground">Carregando sua experiência esportiva...</p>
            <div className="flex justify-center">
              <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
