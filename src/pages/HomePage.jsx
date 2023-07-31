import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import NavBar from "../components/NavBar";
import Axios from "../lib/axiosInstance";

const HomePage = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        Axios('GET', '/movie/active').then((res) => {
            console.log('res', res);
            if (res.status === 200) {
                setMovies(res.data?.movie);
            }
        }).catch((err) => {
            console.log('err', err);
            return {
                status: 'Error',
                message: err.message,
            }
        });
    }, []);
    return (
        <>
            <NavBar />
            <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-4">
                <MovieCard movies={movies} />
            </div>
        </>
    )
}

export default HomePage;