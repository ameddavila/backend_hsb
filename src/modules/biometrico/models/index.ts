// src/modules/biometrico/models/index.ts
import EmpleadoModel from "./empleado.model";
import DepartamentoModel from "./departamento.model";
import FuenteFinanciamientoModel from "./fuenteFinanciamiento.model";
import CargoModel from "./cargo.model";
import CredencialBiometricaModel from "./credencialBiometrica.model";
import PermisoModel from "./permiso.model";
import TipoPermisoModel from "./tipoPermiso.model";
import AsignacionTurnoModel from "./asignacionTurno.model";
import TipoHorarioModel from "./tipoHorario.model";
import DetalleHorarioModel from "./detalleHorario.model";
import MarcacionModel from "./marcacion.model";
import DispositivoModel from "./dispositivo.model";
import ConfigBiometricaModel from "./configBiometrica.model";
import ZonaModel from "./zona.model";
import AuditoriaModel from "./auditoria.model";
import DiaFestivoModel from "./diaFestivo.model";

export const rrhhModels = [
  EmpleadoModel,
  DepartamentoModel,
  FuenteFinanciamientoModel,
  CargoModel,
  CredencialBiometricaModel,
  PermisoModel,
  TipoPermisoModel,
  AsignacionTurnoModel,
  TipoHorarioModel,
  DetalleHorarioModel,
  MarcacionModel,
  DispositivoModel,
  ConfigBiometricaModel,
  ZonaModel,
  AuditoriaModel,
  DiaFestivoModel,
];
