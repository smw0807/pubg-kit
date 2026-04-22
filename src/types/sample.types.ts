export interface SampleResponse {
  data: {
    type: 'sample';
    id: string;
    attributes: {
      createdAt: string;
      shardId: string;
    };
    relationships: {
      matches: {
        data: Array<{ type: 'match'; id: string }>;
      };
    };
  };
  links?: {
    self: string;
  };
}
