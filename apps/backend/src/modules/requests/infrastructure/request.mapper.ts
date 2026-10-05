import { RequestCategory, RequestStatus } from '@prisma/client';
import { Request } from '../domain/request.entity';
import { Category, CategoryEnum } from '../domain/category.value-object';
import { Status, StatusEnum } from '../domain/status.value-object';
import { RequestResponseDto } from '../presentation/dtos/request-response.dto';

type PrismaRequest = {
  id: bigint;
  title: string;
  description: string;
  category: RequestCategory;
  status: RequestStatus;
  requester_id: number;
  created_at: Date;
  updated_at: Date;
};

const STATUS_MAP: Record<RequestStatus, StatusEnum> = {
  OPEN: StatusEnum.OPEN,
  IN_PROGRESS: StatusEnum.IN_PROGRESS,
  DONE: StatusEnum.DONE,
};

const CATEGORY_MAP: Record<RequestCategory, CategoryEnum> = {
  TI: CategoryEnum.TI,
  RH: CategoryEnum.RH,
  COMPRAS: CategoryEnum.COMPRAS,
  FINANCEIRO: CategoryEnum.FINANCEIRO,
  INFRAESTRUTURA: CategoryEnum.INFRAESTRUTURA,
};

export class RequestMapper {
  static toDomain(raw: PrismaRequest): Request {
    return new Request(
      raw.id,
      raw.title,
      raw.description,
      new Category(CATEGORY_MAP[raw.category]),
      new Status(STATUS_MAP[raw.status]),
      raw.requester_id,
      raw.created_at,
      raw.updated_at,
    );
  }

  static toResponse(domain: Request): RequestResponseDto {
    const dto = new RequestResponseDto();
    dto.id = domain.requestCode;
    dto.title = domain.title;
    dto.description = domain.description;
    dto.category = domain.category.value;
    dto.status = domain.status.value;
    dto.createdAt = domain.createdAt;
    dto.updatedAt = domain.updatedAt;
    return dto;
  }
}