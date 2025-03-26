import { Request } from 'express';
export interface ModReq extends Request {
  userId?: string
}