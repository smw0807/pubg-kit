import { BaseResource } from './base.resource';
import { type TelemetryEvent } from '../types/telemetry.types';
import { handleAxiosError } from '../errors';

export class TelemetryResource extends BaseResource {
  async get(telemetryUrl: string): Promise<TelemetryEvent[]> {
    const cacheKey = `telemetry:${telemetryUrl}`;
    if (this.cache?.has(cacheKey)) {
      return this.cache.get<TelemetryEvent[]>(cacheKey)!;
    }

    try {
      const response = await this.http.get<TelemetryEvent[]>(telemetryUrl, {
        baseURL: '',
      });
      if (this.cache) {
        this.cache.set(cacheKey, response.data, Infinity);
      }
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async getEvents<T extends TelemetryEvent>(
    telemetryUrl: string,
    eventType?: string,
  ): Promise<T[]> {
    const events = await this.get(telemetryUrl);
    if (!eventType) return events as T[];
    return events.filter((e) => e._T === eventType) as T[];
  }
}
