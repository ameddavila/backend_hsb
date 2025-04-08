import { Sequelize } from "sequelize-typescript";
import ZonaModel from "@modules/biometrico/models/zona.model";
import ConfigBiometricaModel from "@modules/biometrico/models/configBiometrica.model";

interface DbConnectionInput {
  servidor: string;
  puerto: number;
  baseDatos: string;
  usuario: string;
  contrasena: string;
  ssl: boolean;
}

export const insertDefaultData = async (
  sequelize: Sequelize,
  config: DbConnectionInput
): Promise<void> => {
  const Zona = sequelize.models.ZonaModel;
  const TipoHorario = sequelize.models.TipoHorarioModel;
  const Departamento = sequelize.models.DepartamentoModel;
  const Cargo = sequelize.models.CargoModel;
  const FuenteFinanciamiento = sequelize.models.FuenteFinanciamientoModel;
  const ConfigBiometrica = sequelize.models.ConfigBiometricaModel;

  if (!Zona || !TipoHorario || !Departamento || !Cargo || !FuenteFinanciamiento || !ConfigBiometrica) {
    throw new Error("❌ Uno o más modelos están indefinidos al insertar datos por defecto.");
  }

  // Configuración biométrica base
  const configBio = await ConfigBiometrica.create({
    descripcion: "Configuración biométrica compartida",
    tipoConexion: "mssql",
    nombreBD: config.baseDatos,
    usuarioBD: config.usuario,
    contrasenaBD: Buffer.from(config.contrasena),
    servidorBD: config.servidor,
    puertoBD: config.puerto,
    sslHabilitado: config.ssl,
  }) as ConfigBiometricaModel;

  // Zonas con FK a ConfigBiometrica
  if (await Zona.count() === 0) {
    await Zona.bulkCreate([
      { nombre: "Zona G3", descripcion: "Puertas controladas por G3", configId: configBio.configId },
      { nombre: "Zona G2", descripcion: "Puertas controladas por G2", configId: configBio.configId },
      { nombre: "Zona K4", descripcion: "Puertas controladas por K4", configId: configBio.configId },
    ]);
  }

  // Resto de los datos (horarios, departamentos, etc.)
  if (await TipoHorario.count() === 0) {
    await TipoHorario.bulkCreate([
      { nombre: "Horario Regular", descripcion: "8:30 AM a 14:30 PM" },
      { nombre: "Horario Nocturno", descripcion: "19:00 PM a 7:00 AM" },
    ]);
  }

  if (await Departamento.count() === 0) {
    await Departamento.bulkCreate([
      { nombre: "Administración" },
      { nombre: "Sistemas" },
      { nombre: "Recursos Humanos" },
    ]);
  }

  if (await Cargo.count() === 0) {
    await Cargo.bulkCreate([
      { nombre: "Analista de Sistemas", descripcion: "Responsable de TI" },
      { nombre: "Encargado de RRHH", descripcion: "Manejo del personal" },
    ]);
  }

  if (await FuenteFinanciamiento.count() === 0) {
    await FuenteFinanciamiento.bulkCreate([
      { nombre: "Fondos Propios", codigo: "FP" },
      { nombre: "Tesoro General", codigo: "TGN" },
      { nombre: "Ministeriales", codigo: "MIN" },
    ]);
  }

  console.log("✅ Datos base insertados correctamente (incluyendo ConfigBiometrica y Zonas).");
};
