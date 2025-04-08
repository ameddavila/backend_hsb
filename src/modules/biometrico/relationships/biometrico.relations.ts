import { Sequelize } from "sequelize-typescript";

// ✅ Importa todos los modelos directamente
import EmpleadoModel from "../models/empleado.model";
import DepartamentoModel from "../models/departamento.model";
import FuenteFinanciamientoModel from "../models/fuenteFinanciamiento.model";
import CargoModel from "../models/cargo.model";
import CredencialBiometricaModel from "../models/credencialBiometrica.model";
import PermisoModel from "../models/permiso.model";
import TipoPermisoModel from "../models/tipoPermiso.model";
import AsignacionTurnoModel from "../models/asignacionTurno.model";
import TipoHorarioModel from "../models/tipoHorario.model";
import DetalleHorarioModel from "../models/detalleHorario.model";
import MarcacionModel from "../models/marcacion.model";
import DispositivoModel from "../models/dispositivo.model";
import ZonaModel from "../models/zona.model";
import ConfigBiometricaModel from "../models/configBiometrica.model";

/**
 * Establece relaciones entre modelos conectados dinámicamente
 */
export const associateBiometricoModels = (sequelize: Sequelize) => {
  // 📌 Relaciones del empleado
  EmpleadoModel.belongsTo(DepartamentoModel, { foreignKey: "departamentoId" });
  EmpleadoModel.belongsTo(FuenteFinanciamientoModel, { foreignKey: "fuenteFinanciamientoId" });
  EmpleadoModel.belongsTo(CargoModel, { foreignKey: "cargoId" });

  EmpleadoModel.hasMany(CredencialBiometricaModel, { foreignKey: "empleadoId" });
  EmpleadoModel.hasMany(PermisoModel, { foreignKey: "empleadoId" });
  EmpleadoModel.hasMany(AsignacionTurnoModel, { foreignKey: "empleadoId" });
  EmpleadoModel.hasMany(MarcacionModel, { foreignKey: "empleadoId" });

  // 📌 Relaciones de permisos y turnos
  PermisoModel.belongsTo(TipoPermisoModel, { foreignKey: "tipoPermisoId" });
  AsignacionTurnoModel.belongsTo(TipoHorarioModel, { foreignKey: "tipoHorarioId" });
  DetalleHorarioModel.belongsTo(TipoHorarioModel, { foreignKey: "tipoHorarioId" });

  // 📌 Marcaciones y dispositivos
  MarcacionModel.belongsTo(DispositivoModel, { foreignKey: "dispositivoId" });

  // 📌 Relación Zona ↔ Dispositivo
  DispositivoModel.belongsTo(ZonaModel, { foreignKey: "zonaId" });
  ZonaModel.hasMany(DispositivoModel, { foreignKey: "zonaId" });

  // 📌 Relación ConfigBiometrica ↔ Zona
  ConfigBiometricaModel.hasMany(ZonaModel, { foreignKey: "configId" });
  ZonaModel.belongsTo(ConfigBiometricaModel, {
    foreignKey: "configId",
    as: "configBiometrica",
  });
};
