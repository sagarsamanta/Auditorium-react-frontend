import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../../components/UI/Loader";
import { useAuth } from "../../../lib/hooks/useAuth";
import Axios from "../../../lib/axiosInstance";
import DataTableDistinctMovie from "../../../components/DataTableDistinctMovie";

const DistinctMoviesPage = () => {
    const [data, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const response = async () => {
            const newData = await Axios("GET", '/movie/all-distinct-movie', null, { authRequest: true, token: token });
            setResponse(newData?.data);
            setLoading(false);
        };
        response();
    }, []);
    return (
        <>
            <main className="movies-page  ">
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                    <h1 className="text-xl md:text-2xl lg:text:3xl">All Movies</h1>
                    <Link
                        to="/admin/movies/add"
                        className="text-sm inline-block px-2 py-2 md:px-4 md:py-3 rounded-lg bg-skin-base text-skin-inverted"
                    >
                        <div className="flex gap-2 items-center">
                            <div>Add New Movie</div>
                        </div>
                    </Link>
                </div>

                <div className="movies-table-wrapper p-4 rounded-md shadow-md mt-3">
                    {loading ? (
                        <Loader className={'m-auto'} />
                    ) : (
                        <DataTableDistinctMovie data={data} />
                    )}
                </div>
            </main>
        </>
    );
};

export default DistinctMoviesPage;
