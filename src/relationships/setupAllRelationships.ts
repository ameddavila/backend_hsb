import { Sequelize } from "sequelize-typescript";
import { associateConfigModels } from "@modules/config/relationships/config.relations";
import { initializeUserRelationships } from "@modules/users/relationships/users.relations";

export const setupCentralRelationships = (sequelize: Sequelize): void => {
  associateConfigModels(sequelize);
  initializeUserRelationships(sequelize); // ✅ Aquí llamas relaciones de usuarios
};
