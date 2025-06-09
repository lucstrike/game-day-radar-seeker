
export interface Team {
  id: string;
  name: string;
  logo: string;
  sport: SportType;
  league: string;
  country: string;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  venue: string;
  sport: SportType;
  league: string;
  status: 'upcoming' | 'live' | 'finished';
  streamingPlatforms: StreamingPlatform[];
  ticketUrl?: string;
  predictions?: GamePrediction;
}

export interface StreamingPlatform {
  id: string;
  name: string;
  logo: string;
  url: string;
  type: 'tv' | 'streaming' | 'radio';
  isFree: boolean;
}

export interface GamePrediction {
  homeWinProbability: number;
  awayWinProbability: number;
  drawProbability?: number;
  keyFactors: string[];
  expertTip: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  favoriteTeams: Team[];
  favoriteSports: SportType[];
  preferredStreamingPlatforms: string[];
  notifications: {
    gameReminders: boolean;
    newsUpdates: boolean;
    scoreUpdates: boolean;
  };
  avatar?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  tags: string[];
  sport: SportType;
  teams: Team[];
  source: string;
  url: string;
}

export interface Recommendation {
  id: string;
  type: 'game' | 'news' | 'team';
  title: string;
  description: string;
  relevanceScore: number;
  reason: string;
  data: Game | NewsArticle | Team;
}

export type SportType = 'football' | 'basketball' | 'soccer' | 'tennis' | 'volleyball' | 'baseball';

export interface Analytics {
  userId: string;
  event: string;
  data: Record<string, any>;
  timestamp: string;
}
