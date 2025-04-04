import EmpleadoModel  from "@modules/biometrico/models/empleado.model";
import DepartamentoModel from "@modules/biometrico/models/departamento.model";
import FuenteFinanciamientoModel from "@modules/biometrico/models/fuenteFinanciamiento.model";
import CargoModel from "@modules/biometrico/models/cargo.model";
import CredencialBiometricaModel from "@modules/biometrico/models/credencialBiometrica.model";
import PermisoModel from "@modules/biometrico/models/permiso.model";
import TipoPermisoModel from "@modules/biometrico/models/tipoPermiso.model";
import AsignacionTurnoModel from "@modules/biometrico/models/asignacionTurno.model";
import TipoHorarioModel from "@modules/biometrico/models/tipoHorario.model";
import DetalleHorarioModel from "@modules/biometrico/models/detalleHorario.model";
import MarcacionModel from "@modules/biometrico/models/marcacion.model";
import DispositivoModel from "@modules/biometrico/models/dispositivo.model";
import ConfigBiometricaModel from "@modules/biometrico/models/configBiometrica.model";
import ZonaModel from "@modules/biometrico/models/zona.model";

export const associateBiometricoModels = () => {
  // Empleado → Catálogos
  EmpleadoModel.belongsTo(DepartamentoModel, { foreignKey: "departamentoId" });
  EmpleadoModel.belongsTo(FuenteFinanciamientoModel, { foreignKey: "fuenteFinanciamientoId" });
  EmpleadoModel.belongsTo(CargoModel, { foreignKey: "cargoId" });

  // Empleado → Relacionados
  EmpleadoModel.hasMany(CredencialBiometricaModel, { foreignKey: "empleadoId" });
  EmpleadoModel.hasMany(PermisoModel, { foreignKey: "empleadoId" });
  EmpleadoModel.hasMany(AsignacionTurnoModel, { foreignKey: "empleadoId" });
  EmpleadoModel.hasMany(MarcacionModel, { foreignKey: "empleadoId" });

  // Permiso → TipoPermiso
  PermisoModel.belongsTo(TipoPermisoModel, { foreignKey: "tipoPermisoId" });

  // Turnos → Horarios
  AsignacionTurnoModel.belongsTo(TipoHorarioModel, { foreignKey: "tipoHorarioId" });
  DetalleHorarioModel.belongsTo(TipoHorarioModel, { foreignKey: "tipoHorarioId" });

  // Marcación → Dispositivo
  MarcacionModel.belongsTo(DispositivoModel, { foreignKey: "dispositivoId" });

  // ConfigBiometrica → Dispositivo
  ConfigBiometricaModel.belongsTo(DispositivoModel, { foreignKey: "dispositivoId" });

  // Dispositivo → Zona
  DispositivoModel.belongsTo(ZonaModel, { foreignKey: "zonaId" });
  ZonaModel.hasMany(DispositivoModel, { foreignKey: "zonaId" });
};
