// src/types/express.d.ts
import "express";

declare module "express" {
  export interface Request {
    user?: {
      userId: string;
      roleId?: number;
      roleName?: string;
    };
  }
}
