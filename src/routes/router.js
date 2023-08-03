import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

import AuthentiCate from "./Authenticate";

import MoviesPage from "../pages/admin/movie/MoviesPage";
import AddMoviePage from "../pages/admin/movie/AddMoviePage";
import UpdateMoviePage from "../pages/admin/movie/UpdateMoviePage";
import ShowsPage from "../pages/admin/movie/ShowsPage";
import EditShowPage from "../pages/admin/movie/EditShowPage";
import BookingPage from "../pages/admin/user/BookingPage";
import SeatPage from "../pages/admin/movie/SeatPage";
import Bookings from "../pages/booking/Bookings";
import UsersPage from "../pages/admin/user/UsersPage";
import Layout from "../pages/Layout";
import ProfilePage from "../pages/users/ProfilePage";
import BookingsPage from "../pages/users/BookingsPage";
import BookingDetails from "../pages/users/BookingDetails";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout><HomePage /></Layout>,
        errorElement: <ErrorPage />,
    },
    {
        path: "login",
        element: <Layout><LoginPage /></Layout>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin",
        element: <AuthentiCate><div>admin</div></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/movies",
        element: <AuthentiCate><MoviesPage /></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/movies/:id",
        element: <AuthentiCate><UpdateMoviePage /></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/movies/add",
        element: <AuthentiCate><AddMoviePage /></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/shows",
        element: <AuthentiCate><ShowsPage /></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/shows/edit-show",
        element: <AuthentiCate><EditShowPage /></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/shows/edit-show/seats",
        element: <AuthentiCate ><SeatPage /></AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/users",
        element: (
            <AuthentiCate>
                <UsersPage />
            </AuthentiCate>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/users/:userId",
        element: <AuthentiCate>sets</AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/users/booking/:userId",
        element: <AuthentiCate>
            <BookingPage />
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin/users/bookings/movie/:bookingId",
        element: <AuthentiCate>
            <Bookings />
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/user/bookings",
        element: <AuthentiCate>
            <BookingsPage />
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/user/bookings/:bookingId",
        element: <AuthentiCate>
            <BookingDetails />
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "/user/profile",
        element: <AuthentiCate>
            <ProfilePage />
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },



]);
export default router