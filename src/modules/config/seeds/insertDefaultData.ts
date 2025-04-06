import { Sequelize } from "sequelize-typescript";

export const insertDefaultData = async (sequelize: Sequelize): Promise<void> => {
  const Zona = sequelize.models.ZonaModel;
  const TipoHorario = sequelize.models.TipoHorarioModel;
  const Departamento = sequelize.models.DepartamentoModel;
  const Cargo = sequelize.models.CargoModel;
  const FuenteFinanciamiento = sequelize.models.FuenteFinanciamientoModel;

  if (!Zona || !TipoHorario || !Departamento || !Cargo || !FuenteFinanciamiento) {
    throw new Error("❌ Uno o más modelos están indefinidos al insertar datos por defecto.");
  }

  // Zonas
  if (await Zona.count() === 0) {
    await Zona.bulkCreate([
      { nombre: "Zona G3", descripcion: "Puertas controladas por G3" },
      { nombre: "Zona G2", descripcion: "Puertas controladas por G2" },
      { nombre: "Zona K4", descripcion: "Puertas controladas por K4" },
    ]);
  }

  // Tipos de horario
  if (await TipoHorario.count() === 0) {
    await TipoHorario.bulkCreate([
      { nombre: "Horario Regular", descripcion: "8:30 AM a 14:30 PM" },
      { nombre: "Horario Nocturno", descripcion: "19:00 PM a 7:00 AM" },
    ]);
  }

  // Departamentos
  if (await Departamento.count() === 0) {
    await Departamento.bulkCreate([
      { nombre: "Administración" },
      { nombre: "Sistemas" },
      { nombre: "Recursos Humanos" },
    ]);
  }

  // Cargos
  if (await Cargo.count() === 0) {
    await Cargo.bulkCreate([
      { nombre: "Analista de Sistemas", descripcion: "Responsable de TI" },
      { nombre: "Encargado de RRHH", descripcion: "Manejo del personal" },
    ]);
  }

  // Fuentes de Financiamiento
  if (await FuenteFinanciamiento.count() === 0) {
    await FuenteFinanciamiento.bulkCreate([
      { nombre: "Fondos Propios", codigo: "FP" },
      { nombre: "Tesoro General", codigo: "TGN" },
      { nombre: "Ministeriales", codigo: "MIN" },
    ]);
  }

  console.log("✅ Datos base insertados correctamente.");
};
