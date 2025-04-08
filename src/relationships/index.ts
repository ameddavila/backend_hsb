import { Sequelize } from "sequelize-typescript";
import { initializeUserRelationships } from "@modules/users/relationships/users.relations";
import { associateBiometricoModels } from "@modules/biometrico/relationships/biometrico.relations";
import { associateConfigModels } from "@modules/config/relationships/config.relations";

export const setupAllRelationships = (sequelize: Sequelize): void => {
  initializeUserRelationships(sequelize);
  associateConfigModels(sequelize);
  associateBiometricoModels(sequelize);
};
