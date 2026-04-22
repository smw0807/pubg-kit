export interface StatusResponse {
  data: {
    type: 'status';
    id: string;
    attributes: {
      releasedAt: string;
      version: string;
    };
  };
}
