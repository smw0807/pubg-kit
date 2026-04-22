import { BaseResource } from './base.resource';

export class SamplesResource extends BaseResource {
  async get(createdAt?: string): Promise<unknown> {
    const url = `${this.shardPath}/samples${createdAt ? `?filter[createdAt-start]=${createdAt}` : ''}`;
    return this.request(url);
  }
}
