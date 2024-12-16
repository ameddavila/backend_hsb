import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        roleId: number;
        roleName: string;
      };
    }
  }
}
