import { useEffect, useState } from "react";
import DataTableMovie from "../../../components/DataTableMovie";
import { getAllMovies } from "../../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../components/UI/Loader";
import { useAuth } from "../../../lib/hooks/useAuth";
import Axios from "../../../lib/axiosInstance";

const MoviesPage = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const movieTitle = queryParameters.get('title') || null;
    const [movies, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const response = async () => {
            // const data = await getAllMovies(token);
            Axios("GET", `/movie/all-movie-by-title/${movieTitle}`, null, { authRequest: true, token: token })
                .then(res => {
                    console.log('res', res);
                    const movies = res?.data?.movies;
                    setResponse(movies);
                })
                .finally(() => {
                    setLoading(false);
                })
                .catch(err => {
                    console.log('err', err);
                })
        };
        response();
    }, []);
    return (
        <>
            <main className="movies-page  ">
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                    <h1 className="text-xl md:text-2xl lg:text:3xl">Movies</h1>
                    <button
                        to="/admin/movies/add"
                        className="text-sm inline-block px-2 py-2 md:px-4 md:py-3 rounded-lg bg-skin-base text-skin-inverted"
                        onClick={() => navigate("/admin/movies/add", { state: { movie: movies[0] } })}
                    >
                        <div className="flex gap-2 items-center">
                            <div>Repeat Movie</div>
                        </div>
                    </button>
                </div>

                <div className="movies-table-wrapper p-4 shadow-md mt-5">
                    {loading ? (
                        <Loader className={'m-auto'} />
                    ) : (
                        <DataTableMovie data={movies} />
                    )}
                </div>
            </main>
        </>
    );
};

export default MoviesPage;
