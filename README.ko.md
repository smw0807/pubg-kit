# pubg-kit

PUBG 공식 REST API를 위한 TypeScript SDK + NestJS Module 패키지입니다.

- **완전한 TypeScript 타입 지원** — Zod 기반 런타임 검증
- **Rate Limiter 내장** — 10 req/60s 자동 제어
- **LRU 응답 캐싱** — 엔드포인트별 최적 TTL 전략
- **NestJS 통합** — `forRoot` / `forRootAsync` / `withConfig` 3가지 등록 방식
- **ESM + CJS** — 동시 출력

[English Documentation](./README.md)

## ⚠️ API 키 및 요청 수 제한

> **신규 발급 API 키는 기본적으로 분당 10회 요청으로 제한됩니다.**
> 제한 해제가 필요한 경우 [https://developer.pubg.com](https://developer.pubg.com/?locale=en) 에 접속하여 Rate Limit 상향 요청을 별도로 제출해야 합니다.

이 SDK의 내장 Rate Limiter는 10 req/60s 제약을 자동으로 준수하도록 동작하지만, 더 높은 처리량이 필요하다면 반드시 PUBG 측에 먼저 요청 수 상향을 신청하세요.

## 설치

```bash
npm install pubg-kit
```

NestJS에서 사용하는 경우 peerDependency를 먼저 설치하세요:

```bash
npm install @nestjs/common @nestjs/core
```

## 빠른 시작

```ts
import {PubgClient} from 'pubg-kit';

const client = new PubgClient({apiKey: 'YOUR_API_KEY'});

// 플레이어 이름으로 조회
const players = await client.shard('steam').players.getByNames(['shroud']);
console.log(players[0].attributes.name);

// 매치 조회
const match = await client.shard('steam').matches.get('match-id');
console.log(match.data.attributes.gameMode);
```

## PubgClient 옵션

```ts
const client = new PubgClient({
  apiKey: 'YOUR_API_KEY', // 필수
  rateLimit: true, // Rate Limiter 활성화 (기본값: true)
  cache: true, // 응답 캐싱 활성화 (기본값: true)
  cacheTtl: 60_000, // 캐시 TTL ms (기본값: 60000)
  timeout: 10_000, // HTTP 타임아웃 ms (기본값: 10000)
});
```

## 플랫폼 샤드

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
client.shard('kakao'); // 카카오 (한국)
client.shard('psn'); // PlayStation
client.shard('xbox'); // Xbox
client.shard('console'); // 콘솔 (크로스 플랫폼)
```

## API 레퍼런스

### Players

```ts
const shard = client.shard('steam');

// 이름으로 복수 조회 (최대 10명)
const players = await shard.players.getByNames(['Player1', 'Player2']);

// Account ID로 복수 조회 (최대 10명)
const players = await shard.players.getByIds(['account.xxx', 'account.yyy']);

// Account ID로 단일 조회
const player = await shard.players.getById('account.xxx');
```

### Matches

```ts
const match = await shard.matches.get('match-id');
// match.data      — 매치 기본 정보
// match.included  — 로스터, 참가자, 에셋 등 관련 데이터
```

### Seasons

```ts
// 전체 시즌 목록
const seasons = await shard.seasons.getAll();

// 플레이어 일반 시즌 통계
const stats = await shard.seasons.getPlayerStats('account.xxx', 'season-id');

// 플레이어 랭크 시즌 통계 (Season 7 이후)
const ranked = await shard.seasons.getPlayerRankedStats(
  'account.xxx',
  'season-id',
);

// 라이프타임(누적) 통계
const lifetime = await shard.seasons.getLifetimeStats('account.xxx');

// 배치 일반 시즌 통계 — 최대 10명, 게임 모드 단위
const batch = await shard.seasons.getBatchPlayerStats('season-id', 'squad', [
  'account.xxx',
  'account.yyy',
]);

// 배치 라이프타임 통계 — 최대 10명, 게임 모드 단위
const batchLifetime = await shard.seasons.getBatchLifetimeStats('squad', [
  'account.xxx',
  'account.yyy',
]);
```

### Leaderboards

```ts
const lb = await shard.leaderboards.get('season-id', 'squad');
const lb = await shard.leaderboards.get('season-id', 'squad', 2); // 페이지 지정 (500명/페이지)
```

### Status

```ts
const status = await shard.status.get();
```

### Samples

```ts
// 무작위 매치 ID 목록 (24시간마다 갱신)
const samples = await shard.samples.get();

// 생성 시각 필터 적용
const samples = await shard.samples.get('2024-01-01T00:00:00Z');
```

### Telemetry

```ts
// 매치 에셋 URL로 텔레메트리 이벤트 전체 조회
const events = await shard.telemetry.get('https://telemetry-cdn.pubg.com/...');

// 이벤트 타입으로 필터링
const kills = await shard.telemetry.getEvents(telemetryUrl, 'LogPlayerKillV2');
```

### Mastery

```ts
// 무기 숙련도
const weapon = await shard.mastery.getWeapon('account.xxx');

// 생존 숙련도
const survival = await shard.mastery.getSurvival('account.xxx');
```

### Clans

```ts
const clan = await shard.clans.get('clan-id');
```

## 에러 처리

```ts
import {
  PubgUnauthorizedError, // 401 — API 키 오류
  PubgNotFoundError, // 404 — 리소스 없음
  PubgRateLimitError, // 429 — Rate Limit 초과
  PubgApiError, // 그 외 API 오류
} from 'pubg-kit';

try {
  const players = await client
    .shard('steam')
    .players.getByNames(['존재하지않는플레이어']);
} catch (error) {
  if (error instanceof PubgNotFoundError) {
    console.error('플레이어를 찾을 수 없습니다.');
  } else if (error instanceof PubgRateLimitError) {
    console.error('Rate Limit 초과. 잠시 후 다시 시도하세요.');
  } else if (error instanceof PubgUnauthorizedError) {
    console.error('API 키를 확인하세요.');
  }
}
```

## NestJS 통합

### A. forRoot — 직접 값 주입

```ts
import {PubgModule} from 'pubg-kit/dist/nestjs';

@Module({
  imports: [
    PubgModule.forRoot({
      apiKey: 'YOUR_API_KEY',
    }),
  ],
})
export class AppModule {}
```

### B. forRootAsync — ConfigService 등 DI 사용

```ts
import {PubgModule} from 'pubg-kit/dist/nestjs';
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

### C. withConfig — 환경 변수 자동 연결

`.env` 파일에 환경 변수만 설정하면 추가 설정 없이 동작합니다:

```env
PUBG_API_KEY=your_api_key
PUBG_RATE_LIMIT=true
PUBG_CACHE=true
PUBG_CACHE_TTL=60000
PUBG_TIMEOUT=10000
```

```ts
import {PubgModule} from 'pubg-kit/dist/nestjs';

@Module({
  imports: [PubgModule.withConfig()],
})
export class AppModule {}
```

### PubgService 사용

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

### @InjectPubgClient() 데코레이터

```ts
import {Injectable} from '@nestjs/common';
import {InjectPubgClient} from 'pubg-kit/nestjs';
import {PubgClient} from 'pubg-kit';

@Injectable()
export class PlayerService {
  constructor(@InjectPubgClient() private readonly client: PubgClient) {}
}
```

## 환경 변수 (withConfig)

| 변수명            | 설명                   | 기본값  |
| ----------------- | ---------------------- | ------- |
| `PUBG_API_KEY`    | PUBG API 키 (**필수**) | —       |
| `PUBG_RATE_LIMIT` | Rate Limiter 활성화    | `true`  |
| `PUBG_CACHE`      | 응답 캐싱 활성화       | `true`  |
| `PUBG_CACHE_TTL`  | 캐시 TTL (ms)          | `60000` |
| `PUBG_TIMEOUT`    | HTTP 타임아웃 (ms)     | `10000` |

## 캐시 TTL 전략

| 엔드포인트           | TTL                       |
| -------------------- | ------------------------- |
| `matches.get()`      | 영구 (매치 데이터는 불변) |
| `seasons.getAll()`   | 1시간                     |
| `leaderboards.get()` | 10분                      |
| `players.getById()`  | 5분                       |
| `status.get()`       | 30초                      |

## 개발

```bash
npm install          # 의존성 설치
npm run build        # tsup 빌드 (dist/ 생성)
npm run build:watch  # watch 모드 빌드
npm test             # vitest 테스트
npm run test:watch   # watch 모드 테스트
npm run typecheck    # 타입 체크 (emit 없음)
```

## 라이선스

MIT
