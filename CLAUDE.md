# pubg-kit — Claude Code Guide

## 프로젝트 개요

PUBG 공식 REST API를 TypeScript로 추상화한 NPM 패키지.
순수 TypeScript SDK + NestJS Module을 단일 패키지로 제공한다.

- **패키지명**: `pubg-kit`
- **런타임**: Node.js 18+
- **빌드 도구**: tsup (ESM + CJS 동시 출력)
- **테스트**: vitest + msw

---

## 디렉토리 구조

```
src/
├── index.ts                    # 전체 public export 진입점
├── errors.ts                   # 커스텀 에러 클래스
├── client/
│   ├── pubg.client.ts          # 메인 클라이언트 (shard 팩토리)
│   ├── shard.client.ts         # 특정 shard가 고정된 조회 클라이언트
│   └── client.options.ts       # PubgClientOptions 타입 + 기본값
├── resources/                  # API 엔드포인트별 Resource 클래스
│   ├── base.resource.ts        # BaseResource (HTTP + 캐시 공통 로직)
│   ├── players.resource.ts
│   ├── matches.resource.ts
│   ├── seasons.resource.ts
│   ├── season-stats.resource.ts
│   ├── lifetime.resource.ts
│   ├── leaderboards.resource.ts
│   ├── samples.resource.ts
│   ├── telemetry.resource.ts
│   ├── status.resource.ts
│   ├── clans.resource.ts
│   └── mastery.resource.ts
├── nestjs/                     # NestJS 통합 모듈
│   ├── index.ts
│   ├── pubg.module.ts          # DynamicModule (forRoot / forRootAsync / withConfig)
│   ├── pubg.service.ts         # Injectable Service
│   ├── pubg.decorator.ts       # @InjectPubgClient()
│   └── pubg.constants.ts       # DI 토큰
├── types/                      # Zod 스키마 + TypeScript 타입
│   ├── index.ts
│   ├── common.types.ts         # PlatformShard, GameMode
│   ├── player.types.ts
│   ├── match.types.ts
│   ├── season.types.ts
│   ├── leaderboard.types.ts
│   ├── telemetry.types.ts
│   ├── clan.types.ts
│   └── mastery.types.ts
└── utils/
    ├── rate-limiter.ts         # 10 req/60s 자동 제어
    └── cache.ts                # LRU 캐시 래퍼

tests/
├── setup.ts                    # MSW 서버 setup
├── mocks/
│   ├── server.ts               # MSW Node 서버
│   └── handlers.ts             # API mock handlers
├── unit/                       # 단위 테스트
└── integration/                # 통합 테스트
```

---

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run build        # tsup 빌드 (dist/ 생성)
npm run build:watch  # 개발 중 watch 빌드
npm test             # vitest 단위 테스트
npm run typecheck    # tsc 타입 체크 (빌드 없이)
```

---

## 핵심 아키텍처 패턴

### 1. PubgClient → ShardClient 팩토리 패턴
```ts
// PubgClient가 shard 인스턴스를 캐싱하여 동일 플랫폼은 재사용
const client = new PubgClient({ apiKey: '...' });
client.shard('steam').players.getByNames(['홍길동']);
client.shard('kakao').seasons.getAll();
```

### 2. Resource 클래스 — BaseResource 상속
- 모든 Resource는 `BaseResource`를 상속
- `this.shardPath` = `/shards/{shard}` 자동 제공
- `this.request(url, cacheKey?, cacheTtl?)` 로 캐시 통합 HTTP 요청
- 응답은 Zod 스키마로 런타임 검증 후 반환

### 3. NestJS 모듈 등록 방식 (3가지)
```ts
// A. 직접 값 주입
PubgModule.forRoot({ apiKey: 'key' })

// B. 비동기 팩토리 (ConfigService 등 DI 사용)
PubgModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService) => ({
    apiKey: config.getOrThrow('PUBG_API_KEY'),
  }),
  inject: [ConfigService],
})

// C. ConfigModule 자동 연결 (env 변수만 설정하면 동작)
PubgModule.withConfig()
```

### 4. 환경 변수 (withConfig 사용 시)
| 변수명 | 설명 | 기본값 |
|---|---|---|
| `PUBG_API_KEY` | API 키 (필수) | — |
| `PUBG_RATE_LIMIT` | Rate Limiter 활성화 | `true` |
| `PUBG_CACHE` | 응답 캐싱 활성화 | `true` |
| `PUBG_CACHE_TTL` | 캐시 TTL (ms) | `60000` |
| `PUBG_TIMEOUT` | HTTP 타임아웃 (ms) | `10000` |

---

## 에러 처리

| 클래스 | HTTP | 설명 |
|---|---|---|
| `PubgUnauthorizedError` | 401 | API 키 오류 |
| `PubgNotFoundError` | 404 | 리소스 없음 |
| `PubgRateLimitError` | 429 | Rate Limit 초과 |
| `PubgApiError` | 기타 | 그 외 API 오류 |

---

## 캐시 TTL 전략

| 엔드포인트 | TTL |
|---|---|
| `seasons.getAll()` | 1시간 |
| `players.getById()` | 5분 |
| `matches.get()` | 영구 (매치는 불변) |
| `leaderboards.get()` | 10분 |
| `status.get()` | 30초 |

---

## Rate Limiter 규칙

- 기본 제한: **10 req / 60초**
- `/matches`, `/telemetry` 엔드포인트는 Rate Limit 미적용
- SDK가 응답 헤더 `X-RateLimit-*` 파싱하여 정밀 제어
- `rateLimit: false` 옵션으로 비활성화 가능

---

## 빌드 출력 (tsup)

```
dist/
├── index.js      # ESM
├── index.cjs     # CommonJS
├── index.d.ts    # 타입 선언
├── nestjs.js
├── nestjs.cjs
└── nestjs.d.ts
```

## 코딩 컨벤션

- 모든 API 응답은 **Zod 스키마로 런타임 검증** 후 타입 캐스팅
- Resource 파일은 **단일 책임 원칙** — 엔드포인트 그룹별 1파일
- NestJS 의존성은 **peerDependencies** — 번들에 포함하지 않음
- 테스트는 **vitest + msw** 조합 (실제 API 호출 금지)
- `tsup`으로 CJS/ESM 동시 빌드 — `exports` 필드 양쪽 모두 검증

## 개발 마일스톤

- **Phase 1**: PubgClient, HTTP 클라이언트, Rate Limiter, 공통 타입
- **Phase 2**: Players, Matches, Seasons, Leaderboards, Samples, Status
- **Phase 3**: Telemetry, Mastery, Clans, 캐싱 유틸리티
- **Phase 4**: NestJS Module, Service, Decorator
- **Phase 5**: 단위 테스트 (vitest), README
- **Phase 6**: tsup 빌드 설정 및 NPM 배포
