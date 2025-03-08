import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

// 🔹 Función para generar Access Token
export const generateAccessToken = (payload: object, expiresIn = "15m") => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn });
};

// 🔹 Función para generar Refresh Token
export const generateRefreshToken = (payload: object, expiresIn = "7d") => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });
};

// 🔹 Verifica si un Access Token es válido
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

// 🔹 Verifica si un Refresh Token es válido
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
