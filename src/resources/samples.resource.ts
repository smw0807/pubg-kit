import { BaseResource } from './base.resource';
import { type SampleResponse } from '../types/sample.types';

export class SamplesResource extends BaseResource {
  async get(createdAt?: string): Promise<SampleResponse> {
    const url = `${this.shardPath}/samples${createdAt ? `?filter[createdAt-start]=${createdAt}` : ''}`;
    return this.request<SampleResponse>(url);
  }
}
