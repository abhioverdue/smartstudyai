import { cn } from '@/lib/utils';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-secondary-200 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('p-6 border-b border-secondary-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('p-6 border-t border-secondary-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;