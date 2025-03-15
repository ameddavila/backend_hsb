// src/modules/auth/types/auth.types.ts
export interface LoginFailure {
    success: false;
    status: number;
    message: string;
  }
  
  export interface LoginSuccess {
    success: true;
    userId: string;
    accessToken: string;
    refreshToken: string;
    csrfToken: string;
  }
  
  export type LoginResult = LoginFailure | LoginSuccess;
  