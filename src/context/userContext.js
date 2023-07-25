// UserContext.js
import React, { createContext, useState } from 'react';
const UserContext = createContext();
const defaultUser = {
    isAuthenticated: false,
    user: null,
    token: null,
};
const UserProvider = ({ children }) => {
    const [userCredentials, setUserCredentials] = useState(defaultUser);
    // Handler function to set user credentials
    const handleSetUserCredentials = (credentials) => {
        setUserCredentials(credentials);
    };
    const logout = () => {
        setUserCredentials(defaultUser);
    }
    return (
        <UserContext.Provider value={{ userCredentials, handleSetUserCredentials, logout }}>
            {children}
        </UserContext.Provider>
    );
};
export { UserContext, UserProvider };
