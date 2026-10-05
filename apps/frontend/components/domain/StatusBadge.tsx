import React from 'react';
import { clsx } from 'clsx';

export type Status = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'DONE';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusMap: Record<Status, { label: string; badgeClass: string }> = {
  OPEN: { label: 'ABERTO', badgeClass: 'open' },
  IN_PROGRESS: { label: 'EM ATENDIMENTO', badgeClass: 'prog' },
  COMPLETED: { label: 'CONCLUÍDO', badgeClass: 'done' },
  DONE: { label: 'CONCLUÍDO', badgeClass: 'done' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { label, badgeClass } = statusMap[status] || statusMap['OPEN'];

  return (
    <span className={clsx('badge', badgeClass, className)}>
      {label}
    </span>
  );
};
