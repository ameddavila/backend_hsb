import { Sequelize } from "sequelize-typescript";
import { associateConfigModels } from "@modules/config/relationships/config.relations";
import { associateBiometricoModels } from "@modules/biometrico/relationships/biometrico.relations";
import { initializeUserRelationships } from "@modules/users/relationships/users.relations"; // si aplica

/**
 * Relaciones para bdCENTRAL
 */
export const setupCentralRelationships = (sequelize: Sequelize) => {
  associateConfigModels(sequelize);
  initializeUserRelationships(sequelize); // opcional
};

/**
 * Relaciones para bases biométricas remotas
 */
export const setupRemoteBiometricoRelationships = (sequelize: Sequelize) => {
  associateBiometricoModels(sequelize);
};
