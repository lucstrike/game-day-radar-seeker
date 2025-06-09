import React, { useState } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 md:ml-64 p-4 md:p-6 mt-16">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
