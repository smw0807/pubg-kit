import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://api.pubg.com';

export const handlers = [
  http.get(`${BASE_URL}/shards/:shard/players`, () => {
    return HttpResponse.json({
      data: [
        {
          type: 'player',
          id: 'account.test123',
          attributes: {
            name: 'TestPlayer',
            shardId: 'steam',
          },
          relationships: {
            matches: { data: [] },
          },
        },
      ],
    });
  }),

  http.get(`${BASE_URL}/shards/:shard/matches/:matchId`, ({ params }) => {
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
        },
      },
    });
  }),

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
];
