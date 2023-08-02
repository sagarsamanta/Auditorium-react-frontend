import { useEffect, useState } from "react";
import Axios from "../lib/axiosInstance";
import Loader from "../components/UI/Loader";
import { toast } from "react-toastify";
import { useAuth } from "../lib/hooks/useAuth";
import { FiCheckCircle } from "react-icons/fi";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { STATUS_ACTIVE } from "../lib/consts";
import { displayDate, displayTime } from "../lib/utils";
import { Link } from "react-router-dom";
import ShowSeats from "../components/admin/ShowSeats";

const HomePage = () => {
    const [movie, setMovie] = useState({});
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState({});
    const [loading, setLoading] = useState({ movie: true, shows: true });
    const { isAuthenticated, token, user } = useAuth();

    // Frath Movie
    useEffect(() => {
        Axios('GET', '/movie/active')
            .then((res) => {
                if (res.status === 200) {
                    setMovie(res.data?.movie[0]);
                }
            })
            .finally(() => {
                setLoading({ ...loading, movie: false });
            })
            .catch((err) => {
                toast.error(`${err.message}`);
            });
    }, []);

    // Fetch Show
    useEffect(() => {
        if (isAuthenticated && token && movie?._id) {
            Axios('GET', `user/getAllShowsForMovie/${movie._id}`, null, { authRequest: true, token: token })
                .then((res) => {
                    setShows(res.data?.shows);
                    setSelectedShow(res.data?.shows[0]);
                })
                .finally(() => {
                    setLoading({ ...loading, movie: false, shows: false });
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }, [movie, isAuthenticated, token]);

    return (
        <>
            <div className="relative">
                {
                    loading.movie ? (
                        <Loader className='absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10' />
                    ) : (
                        <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-4 space-y-4">
                            <div className="bg-gray-800 text-skin-inverted rounded-lg p-4 flex flex-col md:flex-row gap-4 md:gap-8">
                                <div className="w-full md:w-1/3">
                                    <img src={movie?.poster} alt={movie?.title} className="w-full h-auto rounded-lg" />
                                </div>
                                <div className="w-full md:w-2/3 space-y-6">
                                    <h2 className="text-3xl font-semibold">{movie?.title}</h2>
                                    <div className="mt-4 space-y-2">
                                        <span className="text-xl font-semibold">Description</span>
                                        <p className="line-clamp-3">{movie?.description}</p>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <span className="text-xl font-semibold">Date</span>
                                        <p className="line-clamp-3">{displayDate(movie?.releaseDate)}</p>
                                    </div>

                                    {/* Shows */}
                                    <div className="mt-4 space-y-2">
                                        <span className="text-xl font-semibold">Shows</span>
                                        {
                                            !isAuthenticated ? (
                                                <div className={`bg-gray-800 z-10 p-5 flex justify-center items-center relative`}>
                                                    <div className="flex flex-col justify-center items-center gap-4">
                                                        <img src={`/blurBg.png`} alt="" className="absolute inset-0 -z-10 select-none pointer-events-none md:opacity-50" />
                                                        <Link
                                                            to="/login"
                                                            className="text-skin-inverted bg-skin-base focus:ring-skin-muted focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2"
                                                        >
                                                            Login to Book ticket
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {
                                                        loading.shows ? (
                                                            <Loader className="w-[14px] h-[14px]" />
                                                        ) : (
                                                            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
                                                                {
                                                                    shows.map((show) => {
                                                                        if (show?.status === STATUS_ACTIVE) {
                                                                            return (
                                                                                <button
                                                                                    className={`${selectedShow._id === show._id ? 'text-skin-inverted border border-green-800/70 hover:bg-green-800/20 focus:ring-green-800/70 bg-green-800/40' : 'text-skin-inverted border border-skin-base hover:bg-skin-base/20 focus:ring-skin-muted'} focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                                                                                    onClick={() => setSelectedShow(show)}
                                                                                >
                                                                                    {selectedShow._id === show._id ? <FiCheckCircle size={15} /> : <MdRadioButtonUnchecked size={15} />}
                                                                                    {displayTime(show?.showStartTime)}
                                                                                </button>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                isAuthenticated && (
                                    <div className=" bg-gray-800 text-skin-inverted rounded-lg p-4">
                                        <span className="text-xl font-semibold">Seats</span>
                                        {
                                            loading.shows ? (
                                                <div className="py-4">
                                                    <Loader className="block" />
                                                </div>
                                            ) : (
                                                <ShowSeats movieId={movie._id} showId={selectedShow._id} authUser={{ user: user, token: token }} priceList={selectedShow.price} />
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default HomePage;