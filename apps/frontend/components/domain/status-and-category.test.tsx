import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CategoryTag } from './CategoryTag';
import { StatusBadge } from './StatusBadge';

describe('domain labels', () => {
  it('renders backend status labels', () => {
    render(<StatusBadge status="IN_PROGRESS" />);

    expect(screen.getByText('EM ATENDIMENTO')).toBeInTheDocument();
  });

  it('renders current backend category labels', () => {
    render(<CategoryTag category="INFRAESTRUTURA" />);

    expect(screen.getByText('Infraestrutura')).toBeInTheDocument();
  });
});
