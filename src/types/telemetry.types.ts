export interface TelemetryEventBase {
  _D: string;
  _T: string;
}

export interface LogPlayerKillV2 extends TelemetryEventBase {
  _T: 'LogPlayerKillV2';
  attackId: number;
  dBNOId: number;
  victimGameResult: {
    gameResultOnFinished: string;
    rank: number;
    teamId: number;
    stats: Record<string, unknown>;
  };
  victim: TelemetryCharacter;
  killerDamageInfo: {
    causedBy: string;
    additionalInfo: string[];
    damageTypeCategory: string;
    damageReason: string;
    distance: number;
    isThroughPenetrableWall: boolean;
  };
  killer: TelemetryCharacter | null;
  assists_AccountId: string[];
  teamKillers_AccountId: string[];
  isSuicide: boolean;
}

export interface TelemetryCharacter {
  name: string;
  teamId: number;
  health: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
  ranking: number;
  accountId: string;
  isInBlueZone: boolean;
  isInRedZone: boolean;
  zone: string[];
}

export type TelemetryEvent = TelemetryEventBase & Record<string, unknown>;
