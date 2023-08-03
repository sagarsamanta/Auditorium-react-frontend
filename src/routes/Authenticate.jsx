import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import Layout from '../pages/Layout';

const AuthentiCate = ({ children }) => {
    const { isAuthenticated } = useAuth();
    // TODO: Roal check
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='app-wrapper'>
            <Layout>{children}</Layout>
        </div>
    )
}

export default AuthentiCate