declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      roleId?: number;
      roleName?: string;
    };
  }
}
