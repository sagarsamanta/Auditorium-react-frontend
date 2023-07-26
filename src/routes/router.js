import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import AuthentiCate from "./Authenticate";
import LoginPage from "../pages/LoginPage";
import MoviesPage from "../pages/admin/MoviesPage";
import AddMoviePage from "../pages/admin/AddMoviePage";
import UpdateMoviePage from "../pages/admin/UpdateMoviePage";
import ShowsPage from "../pages/admin/ShowsPage";

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
        path: "admin/shows/edit-shows",
        element: <AuthentiCate >edit shows</AuthentiCate>,
        errorElement: <ErrorPage />,
    },
    {
        path: "admin/shows/sets",
        element: <AuthentiCate >sets</AuthentiCate>,
        errorElement: <ErrorPage />,
    },


]);
export default router