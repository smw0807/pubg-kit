export class PubgApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly title: string,
    public readonly detail: string,
  ) {
    super(detail);
    this.name = 'PubgApiError';
  }
}

export class PubgNotFoundError extends PubgApiError {
  constructor(detail: string) {
    super(404, 'Not Found', detail);
    this.name = 'PubgNotFoundError';
  }
}

export class PubgRateLimitError extends PubgApiError {
  constructor(detail: string) {
    super(429, 'Too Many Requests', detail);
    this.name = 'PubgRateLimitError';
  }
}

export class PubgUnauthorizedError extends PubgApiError {
  constructor(detail: string) {
    super(401, 'Unauthorized', detail);
    this.name = 'PubgUnauthorizedError';
  }
}

export function handleAxiosError(error: unknown): never {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as { response: { status: number; data: { errors?: Array<{ title: string; detail: string }> } } }).response;
    const status = response.status;
    const apiError = response.data?.errors?.[0];
    const title = apiError?.title ?? 'Unknown Error';
    const detail = apiError?.detail ?? 'An unknown error occurred';

    switch (status) {
      case 401:
        throw new PubgUnauthorizedError(detail);
      case 404:
        throw new PubgNotFoundError(detail);
      case 429:
        throw new PubgRateLimitError(detail);
      default:
        throw new PubgApiError(status, title, detail);
    }
  }
  throw error;
}
