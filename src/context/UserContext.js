import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole || '');
    }, []);

    const login = (newRole) => {
        localStorage.setItem('role', newRole);
        setRole(newRole);
    };

    const logout = () => {
        localStorage.removeItem('role');
        setRole('');
    };

    return (
        <UserContext.Provider value={{ role, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;