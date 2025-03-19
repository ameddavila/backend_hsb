import { Op } from "sequelize";
import RefreshTokenModel from "@modules/auth/models/refreshToken.model";

export const cleanExpiredTokens = async () => {
  try {
    const now = new Date();
    
    // Eliminar tokens expirados y desactivados
    const deletedTokens = await RefreshTokenModel.destroy({
      where: {
        expiresAt: { [Op.lt]: now },  // Menor que la fecha actual
        isActive: false,              // Solo los inactivos
      },
      force: true, // Forzar la eliminación sin marcar como soft delete
    });

    console.log(`🗑️ Tokens expirados eliminados: ${deletedTokens}`);

  } catch (error) {
    console.error("❌ Error al limpiar tokens expirados:", error);
  }
};