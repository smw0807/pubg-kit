export interface GameModeStats {
  assists: number;
  boosts: number;
  dBNOs: number;
  dailyKills: number;
  dailyWins: number;
  damageDealt: number;
  days: number;
  headshotKills: number;
  heals: number;
  killPoints: number;
  kills: number;
  longestKill: number;
  longestTimeSurvived: number;
  losses: number;
  maxKillStreaks: number;
  mostSurvivalTime: number;
  rankPoints: number;
  rankPointsTitle: string;
  revives: number;
  rideDistance: number;
  roadKills: number;
  roundMostKills: number;
  roundsPlayed: number;
  suicides: number;
  swimDistance: number;
  teamKills: number;
  timeSurvived: number;
  top10s: number;
  vehicleDestroys: number;
  walkDistance: number;
  weaponsAcquired: number;
  weeklyKills: number;
  weeklyWins: number;
  winPoints: number;
  wins: number;
}

export interface PlayerSeasonStats {
  gameModeStats: {
    solo?: GameModeStats;
    'solo-fpp'?: GameModeStats;
    duo?: GameModeStats;
    'duo-fpp'?: GameModeStats;
    squad?: GameModeStats;
    'squad-fpp'?: GameModeStats;
  };
}

export interface PlayerSeasonResponse {
  data: {
    type: 'playerSeason';
    id: string;
    attributes: {
      gameModeStats: PlayerSeasonStats['gameModeStats'];
    };
    relationships?: Record<string, unknown>;
  };
}

export interface RankedTier {
  tier: string;
  subTier: string;
}

export interface RankedGameModeStats {
  currentRankPoint: number;
  bestRankPoint: number;
  currentTier: RankedTier;
  bestTier: RankedTier;
  roundsPlayed: number;
  avgRank: number;
  avgSurvivalTime: number;
  deaths: number;
  kda: number;
  kdr: number;
  kills: number;
  wins: number;
  top10Ratio: number;
  winRatio: number;
}

export interface PlayerRankedSeasonResponse {
  data: {
    type: 'playerRankedSeason';
    id: string;
    attributes: {
      rankedGameModeStats: {
        solo?: RankedGameModeStats;
        'solo-fpp'?: RankedGameModeStats;
        duo?: RankedGameModeStats;
        'duo-fpp'?: RankedGameModeStats;
        squad?: RankedGameModeStats;
        'squad-fpp'?: RankedGameModeStats;
      };
    };
  };
}

export interface BatchPlayerStatsResponse {
  data: Array<{
    type: 'playerSeason';
    id: string;
    attributes: {
      gameModeStats: PlayerSeasonStats['gameModeStats'];
    };
  }>;
}
