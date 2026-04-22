import { Injectable, Inject } from '@nestjs/common';
import { PubgClient } from '../client/pubg.client';
import { type PubgClientOptions } from '../client/client.options';
import { type PlatformShard } from '../types/common.types';
import { type ShardClient } from '../client/shard.client';
import { PUBG_CLIENT_OPTIONS } from './pubg.constants';

@Injectable()
export class PubgService {
  private readonly client: PubgClient;

  constructor(
    @Inject(PUBG_CLIENT_OPTIONS) options: PubgClientOptions,
  ) {
    this.client = new PubgClient(options);
  }

  shard(platform: PlatformShard): ShardClient {
    return this.client.shard(platform);
  }

  getClient(): PubgClient {
    return this.client;
  }
}
