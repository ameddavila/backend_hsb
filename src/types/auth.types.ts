export interface LoginSuccess {
  success: true;
  userId: string;
  username: string;     // ✅ Añadir esta propiedad
  email: string;        // ✅ Añadir esta propiedad
  userRole: string;     // ✅ Añadir esta propiedad
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
