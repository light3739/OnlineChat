import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ setIsAuthenticated }) => {
    return setIsAuthenticated ? <Outlet /> : <Navigate to="/"  replace={true} />;
};

export default PrivateRoute;
