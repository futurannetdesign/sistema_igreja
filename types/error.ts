export interface SystemError extends Error {
  code?: string;
  details?: string;
  hint?: string;
  message: string;
  status?: number;
}

export interface ApiError extends SystemError {
  response?: {
    data?: unknown;
    status?: number;
  };
}

export interface ErrorResponse {
  error: string;
  details?: string;
  status: number;
}
