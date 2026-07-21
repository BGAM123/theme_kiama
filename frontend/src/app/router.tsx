import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

// Lazy imports for code-splitting
const LoginPage = lazy(() => import('@/features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ChatPage = lazy(() => import('@/features/chat/ChatPage').then(m => ({ default: m.ChatPage })));
const DocumentTypesPage = lazy(() => import('@/features/document-types/DocumentTypesPage').then(m => ({ default: m.DocumentTypesPage })));
const ImportPage = lazy(() => import('@/features/document-types/ImportPage').then(m => ({ default: m.ImportPage })));
const StructurePage = lazy(() => import('@/features/document-types/StructurePage').then(m => ({ default: m.StructurePage })));
const EditorPage = lazy(() => import('@/features/generation/EditorPage').then(m => ({ default: m.EditorPage })));
const HistoryPage = lazy(() => import('@/features/history/HistoryPage').then(m => ({ default: m.HistoryPage })));
const NotificationsPage = lazy(() => import('@/features/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const AdminUsersPage = lazy(() => import('@/features/admin/users/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminRolesPage = lazy(() => import('@/features/admin/roles/AdminRolesPage').then(m => ({ default: m.AdminRolesPage })));
const AdminModelsPage = lazy(() => import('@/features/admin/models/AdminModelsPage').then(m => ({ default: m.AdminModelsPage })));
const ActivityPage = lazy(() => import('@/features/admin/activity/ActivityPage').then(m => ({ default: m.ActivityPage })));

/** Page content loader skeleton */
function PageLoader() {
    return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse p-8">
            <div className="h-8 w-64 bg-slate-100 rounded-lg" />
            <div className="h-4 w-48 bg-slate-100 rounded-lg" />
        </div>
    );
}

/** Wraps all authenticated pages in AppShell */
function AuthenticatedLayout() {
    return (
        <ProtectedRoute>
            <AppShell>
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </AppShell>
        </ProtectedRoute>
    );
}

/** Full-screen pages (login, editor) without shell */
function BlankLayout() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Outlet />
        </Suspense>
    );
}

export const router = createBrowserRouter([
    {
        // Public routes
        element: <BlankLayout />,
        children: [
            { path: '/login', element: <LoginPage /> },
        ],
    },
    {
        // Generation editor: full-screen, authenticated but no sidebar
        path: '/documents/:id/edit',
        element: (
            <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                    <EditorPage />
                </Suspense>
            </ProtectedRoute>
        ),
    },
    {
        // Authenticated shell routes
        element: <AuthenticatedLayout />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: '/dashboard', element: <DashboardPage /> },
            { path: '/chat', element: <ChatPage /> },
            { path: '/chat/:conversationId', element: <ChatPage /> },
            // Document Types
            { path: '/document-types', element: <DocumentTypesPage /> },
            { path: '/document-types/new', element: <ImportPage /> },
            { path: '/document-types/:id/structure', element: <StructurePage /> },
            // History & Notifications
            { path: '/history', element: <HistoryPage /> },
            { path: '/notifications', element: <NotificationsPage /> },
            // Admin
            { path: '/admin/users', element: <AdminUsersPage /> },
            { path: '/admin/roles', element: <AdminRolesPage /> },
            { path: '/admin/models', element: <AdminModelsPage /> },
            { path: '/admin/activity', element: <ActivityPage /> },
        ],
    },
    // Catch-all: redirect unknown paths to dashboard
    { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
