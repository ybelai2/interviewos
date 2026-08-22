import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} className={`input ${className}`} {...props} />;
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`input resize-none ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <label className={`label ${className}`}>{children}</label>;
}
