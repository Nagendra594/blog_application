import React from 'react';
import { Navigate } from 'react-router-dom';


interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAuth = localStorage.getItem("isLogged");
    return isAuth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;