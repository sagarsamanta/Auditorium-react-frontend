import { Navigate } from 'react-router-dom';
import AdminPanelLayout from '../components/admin/AdminPanelLayout';
import { useAuth } from '../lib/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import UserPanelLayout from '../components/user/UserPanelLayout';
import 'react-toastify/dist/ReactToastify.css';

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
                    <UserPanelLayout>{children}</UserPanelLayout>
                )
            }
            <ToastContainer
                position="top-right"
                autoClose={4000}
                limit={1}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </div>
    )
}

export default AuthentiCate