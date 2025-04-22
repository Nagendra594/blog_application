import React from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '../types/Role.type';
interface ProtectedRouteProps {
    children: React.ReactNode;
    roles: Role[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
    const isAuth = localStorage.getItem("isLogged");
    const role = localStorage.getItem("role") as Role;
    return isAuth && roles?.includes(role) ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;