import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const Input = forwardRef(({
  className,
  type = 'text',
  error,
  label,
  required,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'block w-full px-3 py-2 border border-secondary-300 rounded-lg',
          'placeholder-secondary-400 focus:outline-none focus:ring-2',
          'focus:ring-primary-500 focus:border-primary-500',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;