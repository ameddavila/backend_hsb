import crypto from "crypto";

// 🔐 Genera un token CSRF usando HMAC con SHA-256
export const generateCsrfToken = (userId: string): string => {
  const secret = process.env.CSRF_SECRET || "default_csrf_secret";
  const hmac = crypto.createHmac("sha256", secret);
  const token = hmac.update(userId).digest("hex");

  console.log("🔐 Generando CSRF Token:");
  console.log("➡️ userId:", userId);
  console.log("🔑 secret (oculto):", secret.slice(0, 6) + "..."); // muestra parcial
  console.log("🔒 token generado:", token);

  return token;
};

// ✅ Compara el token recibido con el token esperado
export const validateCsrfToken = (userId: string, token: string): boolean => {
  const expectedToken = generateCsrfToken(userId);

  const isValid = crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expectedToken)
  );

  console.log("🧪 Validando CSRF Token:");
  console.log("➡️ userId:", userId);
  console.log("📨 token recibido:", token);
  console.log("✅ token esperado:", expectedToken);
  console.log("🎯 CSRF válido:", isValid);

  return isValid;
};
