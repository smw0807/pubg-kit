const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

export class RateLimiter {
  private remaining: number = RATE_LIMIT_MAX;
  private resetAt: number = Date.now() + RATE_LIMIT_WINDOW_MS;
  private queue: Array<() => void> = [];
  private processing = false;

  async throttle(): Promise<void> {
    return new Promise((resolve) => {
      this.queue.push(resolve);
      if (!this.processing) {
        void this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();

      if (now >= this.resetAt) {
        this.remaining = RATE_LIMIT_MAX;
        this.resetAt = now + RATE_LIMIT_WINDOW_MS;
      }

      if (this.remaining > 0) {
        this.remaining--;
        const resolve = this.queue.shift()!;
        resolve();
      } else {
        const waitMs = this.resetAt - Date.now();
        await new Promise((r) => setTimeout(r, waitMs));
        this.remaining = RATE_LIMIT_MAX;
        this.resetAt = Date.now() + RATE_LIMIT_WINDOW_MS;
      }
    }

    this.processing = false;
  }

  updateFromHeaders(headers: Record<string, unknown>): void {
    const remaining = headers['x-ratelimit-remaining'];
    const reset = headers['x-ratelimit-reset'];

    if (remaining !== undefined) {
      this.remaining = Number(remaining);
    }
    if (reset !== undefined) {
      this.resetAt = Number(reset) * 1000;
    }
  }
}
