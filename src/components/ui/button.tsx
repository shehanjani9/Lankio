import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { 
      className, 
      variant = 'default', 
      size = 'default', 
      fullWidth = false,
      type = 'button',
      children, 
      ...props 
    },
    ref
  ) {
    // Layout එක කඩාගෙන වැටෙන එක නතර කරන Rigid Layout Classes
    const baseStyles =
      'relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0 select-none cursor-pointer';

    const variants = {
      default: 'bg-primary text-white hover:opacity-90',
      secondary: 'bg-secondary text-white hover:scale-[1.01]',
      outline:
        'border border-[color:var(--glass-border)] bg-transparent text-[color:var(--text-primary)] hover:bg-white/5',
      ghost:
        'bg-transparent text-[color:var(--text-primary)] hover:bg-white/5',
    };

    const sizes = {
      default: 'h-11 px-6 text-sm rounded-2xl',
      sm: 'h-9 px-4 text-xs rounded-xl',
      lg: 'h-13 px-8 text-base rounded-2xl',
      icon: 'h-10 w-10 rounded-xl justify-center',
    };

    return (
      <button
        ref={ref}
        type={type}
        suppressHydrationWarning
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);