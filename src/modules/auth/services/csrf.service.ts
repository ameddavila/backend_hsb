import crypto from "crypto";

export const generateCsrfToken = (userId: string): string => {
  const secret = process.env.CSRF_SECRET || "default_csrf_secret";
  return crypto.createHmac("sha256", secret).update(userId).digest("hex");
};

export const validateCsrfToken = (userId: string, token: string): boolean => {
  const expectedToken = generateCsrfToken(userId);
  return expectedToken === token;
};
