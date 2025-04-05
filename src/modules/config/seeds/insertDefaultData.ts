import { Sequelize } from "sequelize-typescript";

export const insertDefaultData = async (sequelize: Sequelize): Promise<void> => {
  console.log("🌱 Insertando datos por defecto...");

  const Zona = sequelize.model("ZonaModel");
  const TipoHorario = sequelize.model("TipoHorarioModel");
  const Departamento = sequelize.model("DepartamentoModel");
  const Cargo = sequelize.model("CargoModel");
  const FuenteFinanciamiento = sequelize.model("FuenteFinanciamientoModel");

  try {
    // 🌍 Zonas
    const zonas = await Zona.count();
    if (zonas === 0) {
      await Zona.bulkCreate([
        { Nombre: "Zona G3", Descripcion: "Puertas controladas por G3" },
        { Nombre: "Zona G2", Descripcion: "Puertas controladas por G2" },
        { Nombre: "Zona K4", Descripcion: "Puertas controladas por K4" },
      ]);
    }

    // 🕒 Tipos de Horario
    const tiposHorario = await TipoHorario.count();
    if (tiposHorario === 0) {
      await TipoHorario.bulkCreate([
        { nombre: "Horario Regular", descripcion: "8:30 AM a 14:30 PM" },
        { nombre: "Horario Nocturno", descripcion: "19:00 PM a 7:00 AM" },
      ]);
    }

    // 🏢 Departamentos
    const departamentos = await Departamento.count();
    if (departamentos === 0) {
      await Departamento.bulkCreate([
        { nombre: "Administración" },
        { nombre: "Sistemas" },
        { nombre: "Recursos Humanos" },
      ]);
    }

    // 📌 Cargos
    const cargos = await Cargo.count();
    if (cargos === 0) {
      await Cargo.bulkCreate([
        { nombre: "Analista de Sistemas", descripcion: "Responsable de TI" },
        { nombre: "Encargado de RRHH", descripcion: "Manejo del personal" },
      ]);
    }

    // 💰 Fuentes de Financiamiento
    const fuentes = await FuenteFinanciamiento.count();
    if (fuentes === 0) {
      await FuenteFinanciamiento.bulkCreate([
        { nombre: "Fondos Propios", codigo: "FP" },
        { nombre: "Tesoro General", codigo: "TGN" },
        { nombre: "Ministeriales", codigo: "MIN" },
      ]);
    }

    console.log("✅ Datos base insertados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar datos por defecto:", error);
    throw error;
  }
};
