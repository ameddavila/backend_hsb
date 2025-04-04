import {
    Column, Model, Table, DataType, ForeignKey, BelongsTo, HasMany,
  } from 'sequelize-typescript';
  import DepartamentoModel  from './departamento.model';
  import  FuenteFinanciamientoModel  from './fuenteFinanciamiento.model';
  import  CargoModel  from './cargo.model';
  import  CredencialBiometricaModel  from './credencialBiometrica.model';
  import  AsignacionTurnoModel  from './asignacionTurno.model';
  import  MarcacionModel  from './marcacion.model';
  import  PermisoModel  from './permiso.model';
  
  @Table({ tableName: 'Empleados' })
  export default class EmpleadoModel extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    EmpleadoId!: number;
  
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    CodigoEmpleado!: string;
  
    @Column(DataType.STRING)
    Nombre!: string;
  
    @Column(DataType.STRING)
    ApellidoPaterno!: string;
  
    @Column(DataType.STRING)
    ApellidoMaterno?: string;
  
    @Column(DataType.STRING)
    TelefonoCelular?: string;
  
    @Column(DataType.STRING)
    Profesion?: string;
  
    @Column(DataType.STRING)
    Direccion?: string;
  
    @Column(DataType.STRING)
    Correo?: string;
  
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    CarnetIdentidad!: string;
  
    @Column(DataType.DATE)
    FechaIngreso!: Date;
  
    @ForeignKey(() => DepartamentoModel)
    @Column
    DepartamentoId!: number;
  
    @ForeignKey(() => FuenteFinanciamientoModel)
    @Column
    FuenteFinanciamientoId!: number;
  
    @ForeignKey(() => CargoModel)
    @Column
    CargoId!: number;
  
    @Column(DataType.STRING)
    CodigoContrato?: string;
  
    @Column({ type: DataType.BOOLEAN, defaultValue: true })
    Activo!: boolean;
  
    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    FechaCreacion!: Date;
  
    @BelongsTo(() => DepartamentoModel)
    departamento?: DepartamentoModel;
  
    @BelongsTo(() => FuenteFinanciamientoModel)
    fuenteFinanciamiento?: FuenteFinanciamientoModel;
  
    @BelongsTo(() => CargoModel)
    cargo?: CargoModel;
  
    @HasMany(() => CredencialBiometricaModel)
    credenciales?: CredencialBiometricaModel[];
  
    @HasMany(() => AsignacionTurnoModel)
    turnos?: AsignacionTurnoModel[];
  
    @HasMany(() => MarcacionModel)
    marcaciones?: MarcacionModel[];
  
    @HasMany(() => PermisoModel)
    permisos?: PermisoModel[];
  }
  