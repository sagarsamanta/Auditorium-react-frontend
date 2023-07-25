"use client";
import { logout } from '@/redux/slice/auth';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { BiLogOutCircle } from 'react-icons/bi'
const LogoutBtn = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    }
    return (
        <>
            <button
                className="flex items-center w-full space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white"
                onClick={handleLogout}
            >
                <span><BiLogOutCircle size={20} /></span>
                <span>Logout</span>
            </button>
        </>
    )
}

export default LogoutBtn