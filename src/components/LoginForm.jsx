import Axios from "../lib/axiosInstance";
import { USER_ADMIN_ROLE, USER_EMPLOYEE_ROLE } from "../lib/consts";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const userContext = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            userName: '',
            password: '',
        },
        validationSchema: Yup.object({
            userName: Yup.string().required('Email Address / Employee ID / Mobile No. is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            Axios('POST', '/user/login', values).then((result) => {
                if (result?.status === 200 && result?.data?.token) {
                    userContext?.login(result.data); // Set user data in Context API
                }
            }).finally(() => {
                setLoading(false);
            }).catch((err) => {
                console.log('error', err.message);
            });
        }
    });


    if (userContext && userContext?.authUser?.isAuthenticated) {
        if (userContext?.authUser?.user?.role === USER_ADMIN_ROLE) navigate('/admin', { replace: true });
        if (userContext?.authUser?.user?.role === USER_EMPLOYEE_ROLE) navigate('/');
        return <p>Already Authenticated</p>;
    }

    return (
        <>
            <div className="p-5 bg-white md:flex-1">
                <h3 className="my-4 text-2xl font-semibold text-skin-base">Login</h3>
                <form action="#" className="flex flex-col space-y-5" onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="userName" className="text-sm font-semibold text-skin-base">Email Address / Employee ID / Mobile No.</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            tabIndex={1}
                            value={formik.values.userName}
                            onChange={formik.handleChange}
                            className={`px-4 py-2 transition duration-300 border ${(formik.touched.userName && formik.errors.userName) ? 'border-red-500' : ''} text-skin-text-body rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-skin-muted`}
                        />
                        <span className="text-xs text-red-500">{formik.touched.userName && formik.errors.userName}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-sm font-semibold text-skin-base">Password</label>
                            <a href="#" className="text-sm text-skin-base hover:underline">Forgot Password?</a>
                        </div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            tabIndex={2}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            className={`px-4 py-2 transition duration-300 border ${(formik.touched.password && formik.errors.password) ? 'border-red-500' : ''} text-skin-text-body rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-skin-muted`}
                        />
                        <span className="text-xs text-red-500">{formik.touched.password && formik.errors.password}</span>
                    </div>
                    <div>
                        <button
                            type="submit"
                            tabIndex={3}
                            className="relative w-full px-4 py-2 text-lg font-semibold transition-colors duration-300 bg-skin-fill text-skin-inverted rounded-md shadow hover:bg-skin-fill/95 focus:outline-none focus:ring-blue-200 focus:ring-4 disabled:opacity-80"
                            disabled={loading}
                        >
                            Log in
                            {loading && <span className="animate-spin absolute right-10 top-3 border-2 border-r-0 border-skin-inverted inline-block rounded-full w-5 h-5" />}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default LoginForm;