import React from 'react';
import type { FormHTMLAttributes } from 'react';

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
    ({ className, ...props }, ref) => (
        <form ref={ref} className={className} {...props} />
    ),
);
Form.displayName = 'Form';

export interface FormFieldProps {
    control?: unknown;
    name: string;
    render: (props: { field: any }) => React.ReactNode;
}

export const FormField = ({ render }: FormFieldProps) => render({ field: {} as any });

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={['space-y-2', className].filter(Boolean).join(' ')} {...props} />
    ),
);
FormItem.displayName = 'FormItem';

export const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label ref={ref} className={['block text-sm font-medium text-slate-700', className].filter(Boolean).join(' ')} {...props} />
    ),
);
FormLabel.displayName = 'FormLabel';

export const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={['rounded-md border border-slate-200 bg-white p-0', className].filter(Boolean).join(' ')} {...props}>
            {children}
        </div>
    ),
);
FormControl.displayName = 'FormControl';

export const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={['text-sm text-red-600', className].filter(Boolean).join(' ')} {...props} />
    ),
);
FormMessage.displayName = 'FormMessage';
