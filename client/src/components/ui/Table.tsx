import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Table({ children }: Props) {
  return (
    <div className="ui-table-wrap">
      <table className="ui-table">{children}</table>
    </div>
  );
}
