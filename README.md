# pubg-kit

TypeScript SDK + NestJS Module for the official PUBG REST API.

- **Full TypeScript support** — runtime validation powered by Zod
- **Built-in rate limiter** — automatic 10 req/60s throttling
- **LRU response cache** — per-endpoint TTL strategy
- **NestJS integration** — `forRoot` / `forRootAsync` / `withConfig`
- **ESM + CJS** — dual-format output

[한국어 문서](https://github.com/smw0807/pubg-kit/blob/main/README.ko.md)

## ⚠️ API Key & Rate Limit

> **New API keys are limited to 10 requests per minute by default.**
> If you need a higher rate limit, visit [https://developer.pubg.com](https://developer.pubg.com/?locale=en) and submit a rate limit increase request.

This SDK's built-in rate limiter automatically respects the 10 req/60s constraint, but if your application requires higher throughput you must request an elevated limit from PUBG first.

## Installation

```bash
npm install pubg-kit
```

If you are using NestJS, install the peer dependencies first:

```bash
npm install @nestjs/common @nestjs/core
```

## Quick Start

```ts
import {PubgClient} from 'pubg-kit';

const client = new PubgClient({apiKey: 'YOUR_API_KEY'});

// Look up players by name
const players = await client.shard('steam').players.getByNames(['shroud']);
console.log(players[0].attributes.name);

// Fetch a match
const match = await client.shard('steam').matches.get('match-id');
console.log(match.data.attributes.gameMode);
```

## Client Options

```ts
const client = new PubgClient({
  apiKey: 'YOUR_API_KEY', // required
  rateLimit: true, // enable rate limiter (default: true)
  cache: true, // enable response cache (default: true)
  cacheTtl: 60_000, // cache TTL in ms (default: 60000)
  timeout: 10_000, // HTTP timeout in ms (default: 10000)
});
```

## Platform Shards

```ts
type PlatformShard =
  | 'kakao'
  | 'stadia'
  | 'steam'
  | 'tournament'
  | 'psn'
  | 'xbox'
  | 'console';

client.shard('steam'); // Steam PC
client.shard('kakao'); // Kakao (Korea)
client.shard('psn'); // PlayStation
client.shard('xbox'); // Xbox
client.shard('console'); // Console (cross-platform)
```

## API Reference

### Players

```ts
const shard = client.shard('steam');

// Look up by player names (up to 10)
const players = await shard.players.getByNames(['Player1', 'Player2']);

// Look up by account IDs (up to 10)
const players = await shard.players.getByIds(['account.xxx', 'account.yyy']);

// Fetch a single player by account ID
const player = await shard.players.getById('account.xxx');
```

### Matches

```ts
const match = await shard.matches.get('match-id');
// match.data      — core match attributes
// match.included  — rosters, participants, and assets
```

### Seasons

```ts
// All seasons for the platform
const seasons = await shard.seasons.getAll();

// Normal season stats for a single player
const stats = await shard.seasons.getPlayerStats('account.xxx', 'season-id');

// Ranked season stats for a single player (Season 7+)
const ranked = await shard.seasons.getPlayerRankedStats(
  'account.xxx',
  'season-id',
);

// Lifetime (career) stats for a single player
const lifetime = await shard.seasons.getLifetimeStats('account.xxx');

// Batch normal season stats — up to 10 players, single game mode
const batch = await shard.seasons.getBatchPlayerStats('season-id', 'squad', [
  'account.xxx',
  'account.yyy',
]);

// Batch lifetime stats — up to 10 players, single game mode
const batchLifetime = await shard.seasons.getBatchLifetimeStats('squad', [
  'account.xxx',
  'account.yyy',
]);
```

### Leaderboards

```ts
const lb = await shard.leaderboards.get('season-id', 'squad');
const lb = await shard.leaderboards.get('season-id', 'squad', 2); // paginated (500 players/page)
```

### Status

```ts
const status = await shard.status.get();
```

### Samples

```ts
// Random sample of match IDs (refreshed every 24h)
const samples = await shard.samples.get();

// Filter by creation time
const samples = await shard.samples.get('2024-01-01T00:00:00Z');
```

### Telemetry

```ts
// Fetch all telemetry events from a match asset URL
const events = await shard.telemetry.get('https://telemetry-cdn.pubg.com/...');

// Filter by event type
const kills = await shard.telemetry.getEvents(telemetryUrl, 'LogPlayerKillV2');
```

### Mastery

```ts
// Weapon mastery stats
const weapon = await shard.mastery.getWeapon('account.xxx');

// Survival mastery stats
const survival = await shard.mastery.getSurvival('account.xxx');
```

### Clans

```ts
const clan = await shard.clans.get('clan-id');
```

## Error Handling

```ts
import {
  PubgUnauthorizedError, // 401 — invalid API key
  PubgNotFoundError, // 404 — resource not found
  PubgRateLimitError, // 429 — rate limit exceeded
  PubgApiError, // any other API error
} from 'pubg-kit';

try {
  const players = await client.shard('steam').players.getByNames(['unknown']);
} catch (error) {
  if (error instanceof PubgNotFoundError) {
    console.error('Player not found.');
  } else if (error instanceof PubgRateLimitError) {
    console.error('Rate limit exceeded. Please retry later.');
  } else if (error instanceof PubgUnauthorizedError) {
    console.error('Invalid API key.');
  }
}
```

## NestJS Integration

### A. forRoot — static options

```ts
import {PubgModule} from 'pubg-kit/nestjs';

@Module({
  imports: [
    PubgModule.forRoot({
      apiKey: 'YOUR_API_KEY',
    }),
  ],
})
export class AppModule {}
```

### B. forRootAsync — async factory (e.g. ConfigService)

```ts
import {PubgModule} from 'pubg-kit/nestjs';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
  imports: [
    PubgModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        apiKey: config.getOrThrow('PUBG_API_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### C. withConfig — auto-wired from environment variables

Set the environment variables and call `withConfig()` — no other configuration needed.

```env
PUBG_API_KEY=your_api_key
PUBG_RATE_LIMIT=true
PUBG_CACHE=true
PUBG_CACHE_TTL=60000
PUBG_TIMEOUT=10000
```

```ts
import {PubgModule} from 'pubg-kit/nestjs';

@Module({
  imports: [PubgModule.withConfig()],
})
export class AppModule {}
```

### Using PubgService

```ts
import {Injectable} from '@nestjs/common';
import {PubgService} from 'pubg-kit/nestjs';

@Injectable()
export class PlayerService {
  constructor(private readonly pubg: PubgService) {}

  async getPlayer(name: string) {
    const players = await this.pubg.shard('steam').players.getByNames([name]);
    return players[0];
  }
}
```

### @InjectPubgClient() decorator

```ts
import {Injectable} from '@nestjs/common';
import {InjectPubgClient} from 'pubg-kit/nestjs';
import {PubgClient} from 'pubg-kit';

@Injectable()
export class PlayerService {
  constructor(@InjectPubgClient() private readonly client: PubgClient) {}
}
```

## Environment Variables (`withConfig`)

| Variable          | Description                 | Default |
| ----------------- | --------------------------- | ------- |
| `PUBG_API_KEY`    | PUBG API key (**required**) | —       |
| `PUBG_RATE_LIMIT` | Enable rate limiter         | `true`  |
| `PUBG_CACHE`      | Enable response cache       | `true`  |
| `PUBG_CACHE_TTL`  | Cache TTL in ms             | `60000` |
| `PUBG_TIMEOUT`    | HTTP timeout in ms          | `10000` |

## Cache TTL Strategy

| Endpoint             | TTL                                 |
| -------------------- | ----------------------------------- |
| `matches.get()`      | Permanent (match data is immutable) |
| `seasons.getAll()`   | 1 hour                              |
| `leaderboards.get()` | 10 minutes                          |
| `players.getById()`  | 5 minutes                           |
| `status.get()`       | 30 seconds                          |

## Development

```bash
npm install          # install dependencies
npm run build        # tsup build (outputs to )
npm run build:watch  # build in watch mode
npm test             # run vitest tests
npm run test:watch   # run tests in watch mode
npm run typecheck    # TypeScript type check (no emit)
```

## License

MIT
