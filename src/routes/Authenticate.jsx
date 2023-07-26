import { Navigate } from 'react-router-dom';
import AdminPanelLayout from '../components/admin/AdminPanelLayout';
import { useAuth } from '../lib/hooks/useAuth';

const AuthentiCate = ({ children }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    // TODO: Roal check
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            {
                isAdmin ? (
                    <AdminPanelLayout>{children}</AdminPanelLayout>
                ) : (
                    { children }
                )
            }
        </div>
    )
}

export default AuthentiCate