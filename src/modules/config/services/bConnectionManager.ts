import DbConnectionModel from '../models/dbConnection.model';

export const getAllConnections = () => {
  return DbConnectionModel.findAll({ order: [['id', 'ASC']] });
};

export const getConnectionById = (id: number) => {
  return DbConnectionModel.findByPk(id);
};

export const createConnection = async (data: any) => {
  const exists = await DbConnectionModel.findOne({ where: { nombre: data.nombre } });
  if (exists) throw new Error('Ya existe una conexión con ese nombre');
  return DbConnectionModel.create(data);
};

export const updateConnection = async (id: number, data: any) => {
  const conn = await DbConnectionModel.findByPk(id);
  if (!conn) throw new Error('Conexión no encontrada');

  if (data.nombre && data.nombre !== conn.nombre) {
    const exists = await DbConnectionModel.findOne({ where: { nombre: data.nombre } });
    if (exists) throw new Error('Ya existe otra conexión con ese nombre');
  }

  await conn.update(data);
  return conn;
};

export const deleteConnection = async (id: number) => {
  const conn = await DbConnectionModel.findByPk(id);
  if (!conn) throw new Error('Conexión no encontrada');
  await conn.destroy();
  return { message: 'Conexión eliminada' };
};
