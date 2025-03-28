import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
    roleId?: number;
    roleName?: string;
  };
}
