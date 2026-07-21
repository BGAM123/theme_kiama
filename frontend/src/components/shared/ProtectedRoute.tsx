import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('accessToken');
    const location = useLocation();

    if (!token) {
        // Save current location so we can redirect back after a successful login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
