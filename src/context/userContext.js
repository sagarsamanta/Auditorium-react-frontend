// UserContext.js
import React, { createContext, useEffect, useState } from 'react';
import { AUTH_USER_LOCALSTORAGE } from '../lib/consts';
const UserContext = createContext();
const defaultUser = {
    isAuthenticated: false,
    user: null,
    token: null,
};
const UserProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(defaultUser);
    // Handler function to set user credentials
    const login = (credentials) => {
        const newUser = { ...credentials, isAuthenticated: true };
        setAuthUser(newUser);
        localStorage.setItem(AUTH_USER_LOCALSTORAGE, JSON.stringify(newUser));
    };
    const logout = () => {
        setAuthUser(defaultUser);
        localStorage.removeItem(AUTH_USER_LOCALSTORAGE);
    }

    useEffect(() => {
        if (authUser.token) return;
        const user = JSON.parse(localStorage.getItem(AUTH_USER_LOCALSTORAGE)) || defaultUser;
        setAuthUser(user);
    }, [authUser]);
    return (
        <UserContext.Provider value={{ authUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
export { UserContext, UserProvider };
