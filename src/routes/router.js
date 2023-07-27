import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import AuthentiCate from "./Authenticate";
import LoginPage from "../pages/LoginPage";
import MoviesPage from "../pages/admin/MoviesPage";
import AddMoviePage from "../pages/admin/AddMoviePage";
import UpdateMoviePage from "../pages/admin/UpdateMoviePage";
import ShowsPage from "../pages/admin/ShowsPage";
import EditShowPage from "../pages/admin/EditShowPage";
import Users from "../pages/user/Users";
import UserMovieBooking from "../pages/user/Booking";
import SeatPage from "../components/admin/SeatPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "login",
        element: <LoginPage />,
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
                <Users />
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
            <UserMovieBooking />
        </AuthentiCate>,
        errorElement: <ErrorPage />,
    },


]);
export default router