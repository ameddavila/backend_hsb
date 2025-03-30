import { Request } from "express";

export interface AuthenticatedUser {
  id: number;
  email: string;
  roleName: string;
}

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}
