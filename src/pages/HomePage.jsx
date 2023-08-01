import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import Axios from "../lib/axiosInstance";
import Loader from "../components/UI/Loader";
import { toast } from "react-toastify";

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios('GET', '/movie/active')
            .then((res) => {
                if (res.status === 200) {
                    setMovies(res.data?.movie);
                }
            })
            .finally(() => {
                setLoading(false);
            })
            .catch((err) => {
                toast.error(`${err.message}`);
            });
    }, []);
    return (
        <>
            <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-4">
                {
                    loading ? (
                        <div className="w-full h-screen relative">
                            <Loader className='absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10' />
                        </div>
                    ) : <MovieCard movies={movies} />
                }
            </div>
        </>
    )
}

export default HomePage;