import type { ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

export default function FormField({ label, children }: Props) {
  return (
    <label className="ui-field">
      <span className="ui-label">{label}</span>
      {children}
    </label>
  );
}
