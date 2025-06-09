import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from "./components/home/HomeScreen";
import GamesScreen from "./components/games/GamesScreen";
import NewsScreen from "./components/news/NewsScreen";
import ProfileScreen from "./components/profile/ProfileScreen";
import GameDetailScreen from "./pages/GameDetailScreen";
import TeamScreen from "./pages/TeamScreen";
import TicketScreen from "./pages/TicketScreen";
import WatchScreen from "./pages/WatchScreen";
import SportCategoryScreen from "./pages/SportCategoryScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Rota pública de Login */}
            <Route path="/login" element={<LoginScreen />} />

            {/* Rotas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/games" element={<GamesScreen />} />
              <Route path="/news" element={<NewsScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/game/:gameId" element={<GameDetailScreen />} />
              <Route path="/team/:teamId" element={<TeamScreen />} />
              <Route path="/ticket/:gameId" element={<TicketScreen />} />
              <Route path="/watch/:gameId" element={<WatchScreen />} />
              <Route path="/sport/:sportType" element={<SportCategoryScreen />} />
            </Route>

            {/* Rota de Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;