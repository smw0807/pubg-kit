export interface PubgClientOptions {
  apiKey: string;
  rateLimit?: boolean;
  cache?: boolean;
  cacheTtl?: number;
  timeout?: number;
}

export const DEFAULT_OPTIONS = {
  rateLimit: true,
  cache: true,
  cacheTtl: 60_000,
  timeout: 10_000,
} as const satisfies Partial<PubgClientOptions>;
