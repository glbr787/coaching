import type { ReactNode } from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

interface Props {
  children: ReactNode;
  variant?: AlertVariant;
}

export default function Alert({ children, variant = 'info' }: Props) {
  return <div className={`ui-alert ui-alert-${variant}`}>{children}</div>;
}
