import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from 'store';

export default function LoginRequiredPage({ props }) {
    const location = useLocation();

    const {
        store: { isAuthenticated },
    } = useAppContext();

    if (isAuthenticated) {
        return <Outlet {...props} />;
    } else {
        // 해당 주소로 from: location 값을 가지고 이동`
        return <Navigate to="/accounts/login" state={{ from: location }} />;
    }
}
