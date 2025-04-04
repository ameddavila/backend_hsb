export interface LoginSuccess {
  success: true;
  userId: string;
  username: string;       // ✅ añadido
  email: string;          // ✅ añadido
  userRole: string;       // ✅ añadido
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

export interface LoginFailure {
  success: false;
  status: number;
  message: string;
}

export type LoginResult = LoginSuccess | LoginFailure;
