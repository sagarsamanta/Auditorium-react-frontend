import { useEffect, useState } from "react";
import DataTableMovie from "../../components/DataTableMovie";
import { getAllMovies } from "../../lib/utils";
import { Link } from "react-router-dom";
import Loader from "../../components/UI/Loader";

const MoviesPage = () => {
    const [data, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const response = async () => {
            const data = await getAllMovies()
            setResponse(data?.movies);
            setLoading(false);
        };
        response();

    }, []);
    return (
        <>
            <main className="movies-page  ">
                <div className="flex justify-between items-center p-4 pt-0 shadow-lg">
                    <h1 className="text-3xl">Movies</h1>
                    <Link
                        to="/admin/movies/add"
                        className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted"
                    >
                        <div className="flex gap-2 items-center">
                            <div>Add New Movie</div>
                        </div>
                    </Link>
                </div>

                <div className="movies-table-wrapper p-4 shadow-md mt-5">
                    {loading ? (
                        <Loader className={'m-auto'} />
                    ) : (
                        <DataTableMovie data={data} />
                    )}
                </div>
            </main>
        </>
    );
};

export default MoviesPage;
