import RefreshTokenModel from "@modules/auth/models/refreshToken.model";
export const cleanExpiredTokens = async () => {
  try {
    const deletedTokens = await RefreshTokenModel.destroy({
      where: {
        expiresAt: { $lt: new Date() }, // Tokens expirados
      },
    });
    console.log(`🗑️ Tokens expirados eliminados: ${deletedTokens}`);
  } catch (error) {
    console.error("❌ Error al limpiar tokens expirados:", error);
  }
};
