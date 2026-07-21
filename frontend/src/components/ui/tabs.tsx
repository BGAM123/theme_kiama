import React from 'react';

export const Tabs = ({ children }: { children: React.ReactNode }) => <div className="space-y-4">{children}</div>;
export const TabsList = ({ children }: { children: React.ReactNode }) => <div className="flex gap-2">{children}</div>;
export const TabsTrigger = ({ children, onClick }: { children: React.ReactNode; onClick?: React.MouseEventHandler }) => (
    <button type="button" onClick={onClick} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        {children}
    </button>
);
