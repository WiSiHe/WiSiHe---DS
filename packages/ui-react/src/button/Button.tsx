import { cn } from '@wisihe/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

export function Button({
  label = '',
  variant = 'primary',
  size = 'medium',
  ...other
}: ButtonProps): JSX.Element {
  const buttonColor = {
    primary: 'bg-blue-500 hover:bg-blue-700',
    secondary: 'bg-gray-500 hover:bg-gray-700',
    tertiary: 'bg-white hover:bg-gray-100',
  }[variant];

  const buttonSize = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }[size];

  return (
    <button
      className={cn(buttonColor, buttonSize)}
      style={{ border: '1px solid red' }}
      type="button"
      {...other}
    >
      {label}
    </button>
  );
}

Button.displayName = 'Button';
