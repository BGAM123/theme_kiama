import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, History, Users, Shield, Box, Activity, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Tableau de bord', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Chat IA', to: '/chat', icon: MessageSquare },
    { name: 'Documents Types', to: '/document-types', icon: FileText },
    { name: 'Historique', to: '/history', icon: History },
];

const adminNavigation = [
    { name: 'Utilisateurs', to: '/admin/users', icon: Users },
    { name: 'Rôles & Permissions', to: '/admin/roles', icon: Shield },
    { name: 'Modèles IA', to: '/admin/models', icon: Box },
    { name: 'Journal d\'activité', to: '/admin/activity', icon: Activity },
];

export function Sidebar() {
    return (
        <div className="flex h-full w-56 flex-col bg-slate-800 text-slate-300 shadow-xl z-10 transition-all">
            <div className="flex shrink-0 items-center px-6 py-6 mb-2">
                <span className="text-2xl font-bold tracking-tight text-white select-none">
                    Docu<span className="text-indigo-500 font-extrabold">AI</span>
                </span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-6 flex flex-col custom-scrollbar">
                <nav className="space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "text-slate-300 hover:bg-slate-700/80 hover:text-white"
                                )
                            }
                        >
                            <item.icon className={cn("mr-3 h-5 w-5 shrink-0")} aria-hidden="true" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="space-y-2 mt-8">
                    <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Administration</h3>
                    <div className="space-y-1">
                        {adminNavigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.to}
                                className={({ isActive }) =>
                                    cn(
                                        "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-slate-700 text-white shadow-sm"
                                            : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                                    )
                                }
                            >
                                <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>

            <div className="shrink-0 border-t border-slate-700/50 p-4 mt-auto">
                <NavLink
                    to="/notifications"
                    className={({ isActive }) =>
                        cn(
                            "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            isActive ? "bg-slate-700 text-white shadow-sm" : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        )
                    }
                >
                    <Bell className="mr-3 h-5 w-5 shrink-0" />
                    Notifications
                </NavLink>
            </div>
        </div>
    );
}
