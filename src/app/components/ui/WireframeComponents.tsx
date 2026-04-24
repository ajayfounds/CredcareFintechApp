import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-[#007AFF] text-white hover:bg-[#0062cc] active:opacity-80 active:scale-[0.98] shadow-sm', // iOS Blue
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:opacity-70',
      ghost: 'bg-transparent text-[#007AFF] hover:bg-blue-50/50 active:opacity-60',
      destructive: 'bg-red-50 text-red-500 hover:bg-red-100 active:opacity-70',
      outline: 'bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-50 active:opacity-70',
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-lg',
      md: 'h-11 px-5 text-[15px] font-semibold rounded-xl', // 44px is standard min touch, but 48-50 is common for buttons
      lg: 'h-12 px-6 text-[17px] font-semibold rounded-xl',
      icon: 'h-10 w-10 p-2 flex items-center justify-center rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden", className)} {...props}>
    {children}
  </div>
);

export const Badge = ({ className, variant = 'default', children }: { className?: string, variant?: 'default' | 'success' | 'warning' | 'destructive' | 'neutral', children: React.ReactNode }) => {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-green-100 text-green-700",
    warning: "bg-orange-100 text-orange-700",
    destructive: "bg-red-100 text-red-600",
    neutral: "bg-gray-100 text-gray-500"
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-[13px] font-medium leading-none", variants[variant], className)}>
      {children}
    </span>
  );
};

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
        <input 
          type="checkbox" 
          className="sr-only peer" 
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div className="w-[51px] h-[31px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[27px] after:w-[27px] after:transition-all peer-checked:bg-[#34C759] after:shadow-sm"></div>
      </label>
    );
  }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-[17px] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
