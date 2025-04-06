import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey
} from 'sequelize-typescript';
import DepartamentoModel from './departamento.model';
import FuenteFinanciamientoModel from './fuenteFinanciamiento.model';
import CargoModel from './cargo.model';

@Table({ tableName: 'Empleados' })
export default class EmpleadoModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  empleadoId!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  codigoEmpleado!: string;

  @Column(DataType.STRING)
  nombre!: string;

  @Column(DataType.STRING)
  apellidoPaterno!: string;

  @Column(DataType.STRING)
  apellidoMaterno?: string;

  @Column(DataType.STRING)
  telefonoCelular?: string;

  @Column(DataType.STRING)
  profesion?: string;

  @Column(DataType.STRING)
  direccion?: string;

  @Column(DataType.STRING)
  correo?: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  carnetIdentidad!: string;

  @Column(DataType.DATE)
  fechaIngreso!: Date;

  @ForeignKey(() => DepartamentoModel)
  @Column({ field: 'departamentoId', type: DataType.INTEGER })
  departamentoId!: number;

  @ForeignKey(() => FuenteFinanciamientoModel)
  @Column({ field: 'fuenteFinanciamientoId', type: DataType.INTEGER })
  fuenteFinanciamientoId!: number;

  @ForeignKey(() => CargoModel)
  @Column({ field: 'cargoId', type: DataType.INTEGER })
  cargoId!: number;

  @Column(DataType.STRING)
  codigoContrato?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  activo!: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  fechaCreacion!: Date;
}
