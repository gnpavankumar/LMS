import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setIsAuthenticated(true);
                setUserRole(decodedToken.role);
            } catch (e) {
                localStorage.clear();
                setIsAuthenticated(false);
                setUserRole(null);
            }
        }
    }, []);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        const decodedToken = jwtDecode(accessToken);
        setIsAuthenticated(true);
        setUserRole(decodedToken.role);
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <UserContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};