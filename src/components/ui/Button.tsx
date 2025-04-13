import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'text';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'px-6 py-2 rounded-md text-sm font-medium transition-colors',
        {
          'bg-[#1a73e8] text-white hover:bg-[#1557b0] focus:ring-2 focus:ring-offset-2 focus:ring-[#1a73e8] focus:ring-offset-[#202124]': variant === 'primary',
          'text-[#8ab4f8] hover:bg-[#8ab4f8]/10': variant === 'text',
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}; 