import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

// 🔹 Función para generar Access Token
export const generateAccessToken = (payload: object, expiresIn = "15m") => {
  console.log("🔐 Generando Access Token con clave:", ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn });
};

// 🔹 Función para generar Refresh Token
export const generateRefreshToken = (payload: object, expiresIn = "7d") => {
  console.log("🔐 Generando Refresh Token con clave:", REFRESH_TOKEN_SECRET);
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });
};

// 🔹 Verifica un Access Token
export const verifyAccessToken = (token: string) => {
  console.log("🔍 Verificando Access Token con clave:", ACCESS_TOKEN_SECRET);
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

// 🔹 Verifica un Refresh Token
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
