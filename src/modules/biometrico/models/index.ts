import { Sequelize } from "sequelize-typescript";

// Modelos
import DepartamentoModel from "./departamento.model";
import FuenteFinanciamientoModel from "./fuenteFinanciamiento.model";
import CargoModel from "./cargo.model";
import {EmpleadoModel} from "./empleado.model";
import DispositivoModel from "./dispositivo.model";
import CredencialBiometricaModel from "./credencialBiometrica.model";
import TipoPermisoModel from "./tipoPermiso.model";
import PermisoModel from "./permiso.model";
import MarcacionModel from "./marcacion.model";
import AsignacionTurnoModel from "./asignacionTurno.model";
import DiaFestivoModel from "./diaFestivo.model";
import AuditoriaModel from "./auditoria.model";
import ConfigBiometricaModel from "./configBiometrica.model";
import DetalleHorarioModel from "./detalleHorario.model";
import TipoHorarioModel from "./tipoHorario.model";
import { ZonaModel } from "./zona.model";

export const rrhhModels = [
  DepartamentoModel,
  FuenteFinanciamientoModel,
  CargoModel,
  EmpleadoModel,
  DispositivoModel,
  CredencialBiometricaModel,
  TipoPermisoModel,
  PermisoModel,
  MarcacionModel,
  AsignacionTurnoModel,
  DiaFestivoModel,
  AuditoriaModel,
  ConfigBiometricaModel,
  DetalleHorarioModel,
  TipoHorarioModel,
  ZonaModel,
];

// Asociaciones manuales (opcional si no usas decorators @HasOne/@BelongsTo)

export const associateRRHHModels = () => {
  // Empleado -> Departamento, Cargo, FuenteFinanciamiento
  EmpleadoModel.belongsTo(DepartamentoModel, { foreignKey: "departamentoId" });
  EmpleadoModel.belongsTo(FuenteFinanciamientoModel, { foreignKey: "fuenteFinanciamientoId" });
  EmpleadoModel.belongsTo(CargoModel, { foreignKey: "cargoId" });

  // Empleado -> Permiso, Credenciales, Marcaciones, Turnos
  PermisoModel.belongsTo(EmpleadoModel, { foreignKey: "empleadoId" });
  CredencialBiometricaModel.belongsTo(EmpleadoModel, { foreignKey: "empleadoId" });
  MarcacionModel.belongsTo(EmpleadoModel, { foreignKey: "empleadoId" });
  AsignacionTurnoModel.belongsTo(EmpleadoModel, { foreignKey: "empleadoId" });

  // Permiso -> TipoPermiso
  PermisoModel.belongsTo(TipoPermisoModel, { foreignKey: "tipoPermisoId" });

  // Turnos -> TiposHorario
  AsignacionTurnoModel.belongsTo(TipoHorarioModel, { foreignKey: "tipoHorarioId" });
  DetalleHorarioModel.belongsTo(TipoHorarioModel, { foreignKey: "tipoHorarioId" });

  // Marcación -> Dispositivo
  MarcacionModel.belongsTo(DispositivoModel, { foreignKey: "dispositivoId" });

  // ConfigBiometrica -> Dispositivo
  ConfigBiometricaModel.belongsTo(DispositivoModel, { foreignKey: "dispositivoId" });
};
