import { type DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PubgService } from './pubg.service';
import { PUBG_CLIENT_OPTIONS } from './pubg.constants';
import { type PubgClientOptions } from '../client/client.options';

export interface PubgModuleAsyncOptions {
  imports?: DynamicModule['imports'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => Promise<PubgClientOptions> | PubgClientOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
}

@Global()
@Module({})
export class PubgModule {
  static forRoot(options: PubgClientOptions): DynamicModule {
    return {
      global: true,
      module: PubgModule,
      providers: [
        {
          provide: PUBG_CLIENT_OPTIONS,
          useValue: options,
        },
        PubgService,
      ],
      exports: [PubgService],
    };
  }

  static forRootAsync(asyncOptions: PubgModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: PubgModule,
      imports: asyncOptions.imports ?? [],
      providers: [
        {
          provide: PUBG_CLIENT_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: (asyncOptions.inject ?? []) as never[],
        },
        PubgService,
      ],
      exports: [PubgService],
    };
  }

  /**
   * @example
   * PubgModule.forRootAsync({
   *   imports: [ConfigModule],
   *   useFactory: (config: ConfigService) => ({
   *     apiKey: config.getOrThrow('PUBG_API_KEY'),
   *   }),
   *   inject: [ConfigService],
   * })
   */
  static withConfig(): DynamicModule {
    return PubgModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        apiKey: config.getOrThrow<string>('PUBG_API_KEY'),
        rateLimit: config.get('PUBG_RATE_LIMIT', 'true') !== 'false',
        cache: config.get('PUBG_CACHE', 'true') !== 'false',
        cacheTtl: Number(config.get('PUBG_CACHE_TTL', '60000')),
        timeout: Number(config.get('PUBG_TIMEOUT', '10000')),
      }),
      inject: [ConfigService],
    });
  }
}
