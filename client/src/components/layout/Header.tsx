import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export default function Header({ title, subtitle, rightSlot }: Props) {
  return (
    <header className="ui-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {rightSlot && <div>{rightSlot}</div>}
    </header>
  );
}
