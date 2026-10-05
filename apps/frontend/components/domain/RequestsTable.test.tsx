import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RequestsTable } from './RequestsTable';
import { PaginatedResponse, RequestItem } from '@/lib/api/types';

vi.mock('gsap', () => ({
  default: {
    fromTo: vi.fn(),
  },
}));

const request: RequestItem = {
  id: '3',
  title: 'Liberar acesso',
  description: 'Liberar acesso ao sistema financeiro.',
  category: 'FINANCEIRO',
  status: 'OPEN',
  createdAt: '2026-01-02T10:00:00.000Z',
  updatedAt: '2026-01-02T10:00:00.000Z',
  requesterId: 1,
};

const data: PaginatedResponse<RequestItem> = {
  data: [request],
  total: 21,
  page: 2,
  pageSize: 10,
};

describe('RequestsTable', () => {
  it('renders formatted request ids and links to details', () => {
    render(
      <RequestsTable
        data={data}
        onPageChange={vi.fn()}
        onSortChange={vi.fn()}
        sortBy="createdAt"
        sortOrder="desc"
      />,
    );

    expect(screen.getByText('SOL-000003')).toBeInTheDocument();
    expect(screen.getByText('Liberar acesso')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/lista/3');
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
  });

  it('calls pagination callbacks', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RequestsTable
        data={data}
        onPageChange={onPageChange}
        onSortChange={vi.fn()}
        sortBy="createdAt"
        sortOrder="desc"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Página anterior' }));
    await user.click(screen.getByRole('button', { name: 'Próxima página' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it('hides impossible pagination actions', () => {
    render(
      <RequestsTable
        data={{ ...data, page: 1, total: 2 }}
        onPageChange={vi.fn()}
        onSortChange={vi.fn()}
        sortBy="createdAt"
        sortOrder="desc"
      />,
    );

    expect(screen.queryByRole('button', { name: 'Página anterior' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Próxima página' })).not.toBeInTheDocument();
  });

  it('requests sorting from column headings', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RequestsTable
        data={data}
        onPageChange={vi.fn()}
        onSortChange={onSortChange}
        sortBy="createdAt"
        sortOrder="desc"
      />,
    );
    await user.click(screen.getByRole('button', { name: /Título/i }));

    expect(onSortChange).toHaveBeenCalledWith('title');
  });
});
