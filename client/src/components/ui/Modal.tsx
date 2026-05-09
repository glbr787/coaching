import { useEffect, type ReactNode } from 'react';
import Button from './Button';

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ open, title, children, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ui-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="ui-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="ui-modal-header">
          <h3>{title}</h3>
          <Button variant="ghost" onClick={onClose}>Fermer</Button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
