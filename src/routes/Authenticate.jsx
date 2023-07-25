import React from 'react'
import { Navigate } from 'react-router-dom'
import { AUTH_USER_LOCALSTORAGE } from '../lib/consts';

const AuthentiCate = ({ children }) => {
    const isAdmin = localStorage.getItem(AUTH_USER_LOCALSTORAGE);
    // TODO: Roal check
    if (!isAdmin) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default AuthentiCate