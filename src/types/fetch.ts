export interface FetchWithTimeoutOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  instagramUserId?: string;
}

export interface FetchResult<T = any> {
  data: T;
  status: number;
  statusText: string;
}
