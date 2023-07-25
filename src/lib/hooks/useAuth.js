import { cookies } from 'next/headers';
import { AUTH_USER_COOKIE, USER_ADMIN_ROLE } from '../consts';

export const useAuth = (args) => {
    try {
        const request = args ? { ...args } : null;
        const cookieStore = request ? request?.cookies : cookies();
        const authUserCookie = cookieStore.get(AUTH_USER_COOKIE);
        const authUser = authUserCookie?.value ? JSON.parse(authUserCookie?.value) : null;
        const isAdmin = authUser?.user?.role === USER_ADMIN_ROLE;
        return { authUser, isAdmin };
    } catch (err) {
        return { authUser: null, isAdmin: false };
    }
}