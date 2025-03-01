import type { SystemError, ApiError, ErrorResponse } from "../types/error";

export const handleApiError = (error: unknown): ErrorResponse => {
  if (error instanceof Error) {
    return {
      error: error.message,
      status: (error as ApiError).status || 500,
      details: (error as SystemError).details,
    };
  }
  return {
    error: String(error),
    status: 500,
  };
};

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof Error && "status" in error;
};
