import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
    const isAuthenticated = localStorage.getItem('user') !== null && localStorage.getItem('token') !== null ;
    const location = useLocation();
    if (!isAuthenticated || localStorage.getItem('user') === '' || localStorage.getItem('user') === null) {
        return <Navigate to="/" state={{ from: location }}  />;
    }

    return children;
}

export default PrivateRoute;