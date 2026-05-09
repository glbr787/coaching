import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

interface Props {
  children: ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = 'default' }: Props) {
  return <span className={`ui-badge ui-badge-${variant}`}>{children}</span>;
}
