import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RequestRepository } from '../domain/request-repository.port';
import { Request } from '../domain/request.entity';
import { StatusEnum } from '../domain/status.value-object';
import { CategoryEnum } from '../domain/category.value-object';
import { RequestMapper } from './request.mapper';
import { RequestStatus, RequestCategory } from '@prisma/client';

const STATUS_TO_PRISMA: Record<StatusEnum, RequestStatus> = {
  [StatusEnum.OPEN]: 'OPEN',
  [StatusEnum.IN_PROGRESS]: 'IN_PROGRESS',
  [StatusEnum.DONE]: 'DONE',
};

const CATEGORY_TO_PRISMA: Record<CategoryEnum, RequestCategory> = {
  [CategoryEnum.TI]: 'TI',
  [CategoryEnum.RH]: 'RH',
  [CategoryEnum.COMPRAS]: 'COMPRAS',
  [CategoryEnum.FINANCEIRO]: 'FINANCEIRO',
  [CategoryEnum.INFRAESTRUTURA]: 'INFRAESTRUTURA',
};

export interface ListFilters {
  page?: number;
  limit?: number;
  status?: StatusEnum;
  category?: CategoryEnum;
  q?: string;
  sortBy?: 'id' | 'title' | 'category' | 'requesterId' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class PrismaRequestRepository implements RequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(req: Request): Promise<Request> {
    const data = {
      title: req.title,
      description: req.description,
      category: CATEGORY_TO_PRISMA[req.category.value],
      status: STATUS_TO_PRISMA[req.status.value],
      updated_at: req.updatedAt,
    };

    if (req.id === 0n) {
      const created = await this.prisma.request.create({
        data: {
          ...data,
          requester_id: req.requesterId,
          created_at: req.createdAt,
        },
      });
      return RequestMapper.toDomain(created);
    } else {
      const updated = await this.prisma.request.update({ where: { id: req.id }, data });
      return RequestMapper.toDomain(updated);
    }
  }

  async findById(id: bigint): Promise<Request | null> {
    const raw = await this.prisma.request.findUnique({ where: { id } });
    if (!raw) return null;
    return RequestMapper.toDomain(raw);
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.request.delete({ where: { id } });
  }

  async list(filters: ListFilters): Promise<{ data: Request[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.status) where['status'] = STATUS_TO_PRISMA[filters.status];
    if (filters.category) where['category'] = CATEGORY_TO_PRISMA[filters.category];
    if (filters.q) where['title'] = { contains: filters.q, mode: 'insensitive' };
    const sortFieldMap = {
      id: 'id',
      title: 'title',
      category: 'category',
      requesterId: 'requester_id',
      createdAt: 'created_at',
      status: 'status',
    } as const;
    const sortBy = filters.sortBy ?? 'createdAt';
    const sortOrder = filters.sortOrder ?? 'desc';

    const [raws, total] = await this.prisma.$transaction([
      this.prisma.request.findMany({ where, skip, take: limit, orderBy: { [sortFieldMap[sortBy]]: sortOrder } }),
      this.prisma.request.count({ where }),
    ]);

    return { data: raws.map(RequestMapper.toDomain), total };
  }

  async getSummary(): Promise<{ total: number; open: number; inProgress: number; done: number }> {
    const [total, open, inProgress, done] = await this.prisma.$transaction([
      this.prisma.request.count(),
      this.prisma.request.count({ where: { status: 'OPEN' } }),
      this.prisma.request.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.request.count({ where: { status: 'DONE' } }),
    ]);
    return { total, open, inProgress, done };
  }
}
