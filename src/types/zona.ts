// ✅ src/types/zona.ts
export interface Zona {
  zonaId: number;
  nombre: string;
  descripcion?: string;
  configId?: number;
  configBiometrica?: ConfigBiometrica | null;
}

export interface ZonaInput {
  nombre: string;
  descripcion?: string;
  configId?: number;
}

export interface ZonaAttributes extends ZonaInput {
  zonaId?: number;
}

export interface ConfigBiometrica {
  configId: number;
  descripcion: string;
  tipoConexion: string;
  nombreBD: string;
  usuarioBD: string;
  servidorBD: string;
  puertoBD: number;
  sslHabilitado: boolean;
  ultimaSincronizacion?: Date;
}

// 👇 Fuerza a TS a tratarlo como módulo
export {};
