import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-semibold mb-4">Oops! {error.statusText || error.message}</h1>
                    <p className="text-gray-600">We apologize for the inconvenience.</p>
                    <Link to={'/login'} className="inline-block mt-4 transition bg-skin-base text-white px-4 py-2 rounded-md hover:bg-skin-base/90 focus:outline-none focus:ring focus:ring-blue-300">
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    );
}