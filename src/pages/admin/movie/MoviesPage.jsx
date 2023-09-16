import { useEffect, useState } from "react";
import DataTableMovie from "../../../components/DataTableMovie";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/UI/Loader";
import { useAuth } from "../../../lib/hooks/useAuth";
import Axios from "../../../lib/axiosInstance";
import { RiArrowGoBackLine } from "react-icons/ri";

const MoviesPage = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const movieTitle = queryParameters.get('title') || null;
    const [movies, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const response = async () => {
            Axios("GET", `/movie/all-movie-by-title/${movieTitle}`, null, { authRequest: true, token: token })
                .then(res => {
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
                    <div className="flex items-center gap-2">
                        <button
                            className="text-sm px-2 py-2 md:px-4 md:py-3 rounded-lg border border-skin-base bg-skin-inverted text-skin-base flex items-center gap-2"
                            onClick={() => navigate(-1)}
                        >
                            <RiArrowGoBackLine /> Back
                        </button>
                        <button
                            className="text-sm inline-block px-2 py-2 md:px-4 md:py-3 rounded-lg bg-skin-base text-skin-inverted"
                            onClick={() => navigate("/admin/movies/add", { state: { movie: movies[0] } })}
                        >
                            Repeat Movie
                        </button>
                    </div>
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
