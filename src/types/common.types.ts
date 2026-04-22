export type PlatformShard =
  | 'kakao'
  | 'stadia'
  | 'steam'
  | 'tournament'
  | 'psn'
  | 'xbox'
  | 'console';

export type GameMode =
  | 'solo'
  | 'solo-fpp'
  | 'duo'
  | 'duo-fpp'
  | 'squad'
  | 'squad-fpp';

export interface ApiResponse<T> {
  data: T;
  links?: {
    self: string;
  };
  meta?: Record<string, unknown>;
}

export interface JsonApiResource {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, unknown>;
  links?: Record<string, string>;
}
