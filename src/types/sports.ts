
export type SportType = 'soccer' | 'basketball' | 'volleyball' | 'tennis' | 'football' | 'baseball';

export interface Team {
  id: string;
  name: string;
  logo: string;
  sport: SportType;
  league: string;
  country: string;
}

export interface StreamingPlatform {
  id: string;
  name: string;
  logo: string;
  url: string;
  type: 'tv' | 'streaming' | 'radio';
  isFree: boolean;
}

export interface GamePredictions {
  homeWinProbability: number;
  awayWinProbability: number;
  drawProbability: number;
  keyFactors: string[];
  expertTip: string;
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
  homeScore?: number;
  awayScore?: number;
  streamingPlatforms: StreamingPlatform[];
  ticketUrl?: string;
  predictions?: GamePredictions;
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  favoriteTeams: Team[];
  favoriteSports: SportType[];
  preferredStreamingPlatforms: string[];
  notifications: {
    gameReminders: boolean;
    newsUpdates: boolean;
    scoreUpdates: boolean;
  };
}

export interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
}
