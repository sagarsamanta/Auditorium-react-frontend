import { useEffect, useState } from "react";
import Axios from "../lib/axiosInstance";
import { useAuth } from "../lib/hooks/useAuth";
import { Link } from "react-router-dom";
import SomethingWentWrong from "./UI/SomethingWentWrong";
import Loader from "./UI/Loader";
import { displayDate } from "../lib/utils";
import { USER_ADMIN_ROLE } from "../lib/consts";

const MoviesLoop = ({ cardClassName = 'bg-gray-800 text-skin-inverted' }) => {
    const [movies, setMovies] = useState({});
    const [loading, setLoading] = useState({ movie: true, shows: true });
    const [error, setError] = useState({ movie: false, shows: false });
    const { isAuthenticated, user } = useAuth();
    const bookTicketsLinkBase = user?.role === USER_ADMIN_ROLE ? '/admin/bookings/movie' : '/movie';

    // Frath Movie
    useEffect(() => {
        Axios("GET", "/movie/active-ticket")
            .then((res) => {
                console.log('res', res);
                if (res.status === 200) {
                    setMovies(res.data?.movie);
                }
            })
            .finally(() => {
                setLoading({ ...loading, movie: false });
            })
            .catch((err) => {
                console.log('err', err);
                setError({ movie: true, shows: true });
                // toast.error(`${err.response.statusText}`);
            });
    }, []);

    return (
        <>
            <div className="relative min-h-screen">
                {loading.movie ? (
                    <Loader className="absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10" />
                ) : error.movie ? (
                    <SomethingWentWrong
                        className="absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                        text="No Shows available!"
                    />
                ) : (
                    <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {
                            movies?.length > 0 && (
                                movies?.map((movie) => (
                                    <div key={movie?._id} className={`flex flex-col justify-between text-base rounded-lg p-4 ${cardClassName}`}>
                                        <div className="w-full space-y-2">
                                            <div className={`w-full h-[360px] max-h-[360px] relative overflow-hidden rounded-lg`}>
                                                <img
                                                    src={movie?.poster}
                                                    alt={movie?.title}
                                                    className="w-full h-full absolute inset-0 object-cover bg-center z-[0] blur-lg"
                                                />
                                                <img
                                                    src={movie?.poster}
                                                    alt={movie?.title}
                                                    className="w-full h-full absolute inset-0 object-contain bg-center z-[2]"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <h2 className="text-xl font-semibold uppercase line-clamp-2">{movie?.title}</h2>
                                                <p className="line-clamp-3">{movie?.description}</p>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-semibold">Date</span>
                                                    <p className="line-clamp-3">{displayDate(movie?.releaseDate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            {
                                                !isAuthenticated ? (
                                                    <Link
                                                        to="/login"
                                                        className="block text-center text-skin-inverted transition bg-skin-base hover:bg-skin-base/90 focus:ring-skin-muted focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                                                    >
                                                        Login to Book ticket
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`${bookTicketsLinkBase}/${movie?._id}`}
                                                        className="block text-center text-skin-inverted transition bg-skin-base hover:bg-skin-base/90 focus:ring-skin-muted focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                                                    >
                                                        Book Tickets
                                                    </Link>
                                                )
                                            }
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                )}
            </div>
        </>
    );
};

export default MoviesLoop;
