export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}