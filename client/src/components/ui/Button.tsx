import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  block?: boolean;
}

export default function Button({ variant = 'primary', block = false, className = '', ...props }: Props) {
  return (
    <button
      className={`ui-button ui-button-${variant} ${block ? 'ui-button-block' : ''} ${className}`.trim()}
      {...props}
    />
  );
}
