export type RoleType = "admin" | "secretary" | "pastor";

export interface UserRole {
  role: RoleType;
  user_id: string;
}

export interface AuthError {
  message: string;
  status: number;
}

export interface AuthResponse {
  success: boolean;
  error?: AuthError;
  role?: RoleType;
}

export interface AuthUser {
  id: string;
  email: string;
  role: RoleType;
}
