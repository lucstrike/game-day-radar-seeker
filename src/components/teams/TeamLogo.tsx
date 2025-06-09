
import React, { useState, useEffect } from 'react';
import { Shield, Users } from 'lucide-react';

interface TeamLogoProps {
  teamName: string;
  teamId?: string;
  sport?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const TeamLogo = ({ teamName, teamId, sport, size = 'md', className = '', onClick, style }: TeamLogoProps) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  useEffect(() => {
    const fetchTeamLogo = async () => {
      setLoading(true);
      setError(false);

      try {
        // Cache key based on team name and sport
        const cacheKey = `team_logo_${teamName}_${sport}`;
        const cachedLogo = localStorage.getItem(cacheKey);

        if (cachedLogo) {
          setLogoUrl(cachedLogo);
          setLoading(false);
          return;
        }

        // Try multiple sources for team logos
        const logoSources = [
          // ESPN API (free tier)
          `https://a.espncdn.com/i/teamlogos/${sport}/${teamId}.png`,
          // Alternative generic sources based on team name
          `https://logoeps.com/wp-content/uploads/2013/03/${teamName.toLowerCase().replace(/\s+/g, '-')}-vector-logo.png`,
          // Fallback to search-based approach
          await searchTeamLogo(teamName, sport)
        ];

        for (const source of logoSources) {
          if (source && await validateImage(source)) {
            setLogoUrl(source);
            // Cache successful logo for 24 hours
            localStorage.setItem(cacheKey, source);
            localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
            setLoading(false);
            return;
          }
        }

        // If no logo found, set error state
        setError(true);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team logo:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchTeamLogo();
  }, [teamName, teamId, sport]);

  const searchTeamLogo = async (name: string, sportType?: string): Promise<string | null> => {
    try {
      // Simulate a search API call - in production, you would use:
      // - Wikipedia API
      // - Custom scraping service
      // - SerpAPI for Google Images
      
      // For now, return some common team logos based on name patterns
      const commonLogos: Record<string, string> = {
        'palmeiras': 'https://logoeps.com/wp-content/uploads/2013/03/palmeiras-vector-logo.png',
        'flamengo': 'https://logoeps.com/wp-content/uploads/2013/03/flamengo-vector-logo.png',
        'corinthians': 'https://logoeps.com/wp-content/uploads/2013/03/corinthians-vector-logo.png',
        'lakers': 'https://logoeps.com/wp-content/uploads/2013/03/los-angeles-lakers-vector-logo.png',
        'warriors': 'https://logoeps.com/wp-content/uploads/2013/03/golden-state-warriors-vector-logo.png'
      };

      const nameKey = name.toLowerCase();
      return commonLogos[nameKey] || null;
    } catch {
      return null;
    }
  };

  const validateImage = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const getTeamInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 3);
  };

  const getTeamColor = (name: string): string => {
    // Generate a consistent color based on team name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-yellow-600',
      'bg-purple-600', 'bg-indigo-600', 'bg-pink-600', 'bg-orange-600'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className={`team-logo ${sizeClasses[size]} ${className} animate-pulse`} onClick={onClick} style={style}>
        <div className="w-full h-full bg-sport-medium-gray/30 rounded-full"></div>
      </div>
    );
  }

  if (logoUrl && !error) {
    return (
      <div className={`team-logo ${sizeClasses[size]} ${className}`} onClick={onClick} style={style}>
        <img
          src={logoUrl}
          alt={`${teamName} logo`}
          className="w-full h-full object-contain"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  // Fallback: stylized team initials
  return (
    <div className={`team-logo ${sizeClasses[size]} ${className} ${getTeamColor(teamName)}`} onClick={onClick} style={style}>
      <div className="flex flex-col items-center justify-center text-white font-bold">
        {sport === 'soccer' ? (
          <Shield className="w-2/3 h-2/3" />
        ) : (
          <Users className="w-2/3 h-2/3" />
        )}
        <span className="text-xs mt-1">{getTeamInitials(teamName)}</span>
      </div>
    </div>
  );
};

export default TeamLogo;
