export type Status = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'COMPLETED';

export type Category =
  | 'TI'
  | 'RH'
  | 'COMPRAS'
  | 'FINANCEIRO'
  | 'INFRAESTRUTURA'
  | 'IT'
  | 'HR'
  | 'FACILITIES'
  | 'MAINTENANCE'
  | 'OTHER';

export interface User {
  id: string | number;
  name?: string | null;
  username?: string;
  email?: string;
}

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  status: Status;
  category: Category;
  createdAt: string;
  updatedAt: string;
  requesterId?: string | number;
}

export interface DashboardSummary {
  total: number;
  open: number;
  inProgress: number;
  done?: number;
  completed?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  total?: number;
  page?: number;
  pageSize?: number;
}
