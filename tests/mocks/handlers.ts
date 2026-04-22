import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://api.pubg.com';

export const handlers = [
  // Players
  http.get(`${BASE_URL}/shards/:shard/players`, ({ request }) => {
    const url = new URL(request.url);
    const names = url.searchParams.get('filter[playerNames]');
    const ids = url.searchParams.get('filter[playerIds]');

    if (names === 'NotFound') {
      return HttpResponse.json(
        { errors: [{ title: 'Not Found', detail: 'Player not found' }] },
        { status: 404 },
      );
    }

    const playerName = names?.split(',')[0] ?? 'TestPlayer';
    const playerId = ids?.split(',')[0] ?? 'account.test123';

    return HttpResponse.json({
      data: [
        {
          type: 'player',
          id: playerId,
          attributes: {
            name: playerName,
            shardId: 'steam',
          },
          relationships: {
            matches: { data: [{ type: 'match', id: 'match-abc-123' }] },
          },
        },
      ],
      links: { self: `${BASE_URL}/shards/steam/players` },
    });
  }),

  http.get(`${BASE_URL}/shards/:shard/players/:playerId`, ({ params }) => {
    if (params.playerId === 'account.notfound') {
      return HttpResponse.json(
        { errors: [{ title: 'Not Found', detail: 'Player not found' }] },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      data: {
        type: 'player',
        id: params.playerId,
        attributes: {
          name: 'TestPlayer',
          shardId: 'steam',
        },
        relationships: {
          matches: { data: [{ type: 'match', id: 'match-abc-123' }] },
        },
      },
    });
  }),

  // Matches
  http.get(`${BASE_URL}/shards/:shard/matches/:matchId`, ({ params }) => {
    if (params.matchId === 'not-found-match') {
      return HttpResponse.json(
        { errors: [{ title: 'Not Found', detail: 'Match not found' }] },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      data: {
        type: 'match',
        id: params.matchId,
        attributes: {
          createdAt: '2025-01-01T00:00:00Z',
          duration: 1800,
          gameMode: 'squad',
          mapName: 'Baltic_Main',
          shardId: 'steam',
          isCustomMatch: false,
          seasonState: 'progress',
          titleId: 'bluehole-pubg',
          patchVersion: '30.1',
        },
        relationships: {
          rosters: { data: [] },
          assets: { data: [] },
        },
      },
      included: [],
      links: { self: `${BASE_URL}/shards/steam/matches/${params.matchId}` },
    });
  }),

  // Seasons
  http.get(`${BASE_URL}/shards/:shard/seasons`, () => {
    return HttpResponse.json({
      data: [
        {
          type: 'season',
          id: 'division.bro.official.pc-2018-01',
          attributes: { isCurrentSeason: false, isOffseason: false },
        },
        {
          type: 'season',
          id: 'division.bro.official.pc-2024-season',
          attributes: { isCurrentSeason: true, isOffseason: false },
        },
      ],
      links: { self: `${BASE_URL}/shards/steam/seasons` },
    });
  }),

  http.get(`${BASE_URL}/shards/:shard/players/:playerId/seasons/:seasonId`, ({ params }) => {
    return HttpResponse.json({
      data: {
        type: 'playerSeason',
        id: `${params.playerId}-${params.seasonId}`,
        attributes: {
          gameModeStats: {
            squad: {
              assists: 10,
              kills: 50,
              wins: 5,
              roundsPlayed: 100,
            },
          },
        },
      },
    });
  }),

  http.get(`${BASE_URL}/shards/:shard/players/:playerId/seasons/lifetime`, ({ params }) => {
    return HttpResponse.json({
      data: {
        type: 'playerSeason',
        id: `${params.playerId}-lifetime`,
        attributes: {
          gameModeStats: {
            squad: {
              assists: 100,
              kills: 500,
              wins: 50,
              roundsPlayed: 1000,
            },
          },
        },
      },
    });
  }),

  // Leaderboards
  http.get(`${BASE_URL}/shards/:shard/leaderboards/:seasonId/:gameMode`, ({ params }) => {
    return HttpResponse.json({
      data: {
        type: 'leaderboard',
        id: `${params.seasonId}-${params.gameMode}`,
        attributes: {
          shardId: 'steam',
          seasonId: params.seasonId,
          gameMode: params.gameMode,
        },
        relationships: {
          players: {
            data: [{ type: 'player', id: 'account.top1' }],
          },
        },
      },
      included: [
        {
          type: 'player',
          id: 'account.top1',
          attributes: {
            name: 'TopPlayer',
            rank: 1,
            stats: {
              rankPoints: 5000,
              wins: 100,
              games: 500,
              winRatio: 0.2,
              averageDamage: 300,
              kills: 1000,
              killDeathRatio: 5.0,
              kda: 5.2,
              averageRank: 3,
            },
          },
        },
      ],
    });
  }),

  // Status
  http.get(`${BASE_URL}/status`, () => {
    return HttpResponse.json({
      data: {
        type: 'status',
        id: 'pubg-api',
        attributes: {
          releasedAt: '2018-01-01',
          version: '13.1',
        },
      },
    });
  }),

  // Unauthorized
  http.get(`${BASE_URL}/shards/unauthorized/*`, () => {
    return HttpResponse.json(
      { errors: [{ title: 'Unauthorized', detail: 'Invalid API key' }] },
      { status: 401 },
    );
  }),

  // Rate limit
  http.get(`${BASE_URL}/shards/ratelimited/*`, () => {
    return HttpResponse.json(
      { errors: [{ title: 'Too Many Requests', detail: 'Rate limit exceeded' }] },
      { status: 429 },
    );
  }),
];
