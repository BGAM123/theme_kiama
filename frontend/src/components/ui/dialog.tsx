import React from 'react';

export const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void; }) => (
    <div className={`${open ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4' : 'hidden'}`}>
        {children}
    </div>
);

export const DialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl ${className ?? ''}`}>
        {children}
    </div>
);

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="space-y-2">{children}</div>
);

export const DialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h2 className={`text-lg font-semibold text-slate-900 ${className ?? ''}`}>{children}</h2>
);

export const DialogDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-sm text-slate-500 ${className ?? ''}`}>{children}</p>
);

export const DialogFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`mt-4 flex flex-wrap gap-2 ${className ?? ''}`}>{children}</div>
);
