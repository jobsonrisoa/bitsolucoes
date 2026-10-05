import { Request } from './request.entity';

export interface RequestRepository {
  save(request: Request): Promise<Request>;
  findById(id: bigint): Promise<Request | null>;
  delete(id: bigint): Promise<void>;
  list(filters: any): Promise<{ data: Request[]; total: number }>;
  getSummary(): Promise<{ total: number; open: number; inProgress: number; done: number }>;
}