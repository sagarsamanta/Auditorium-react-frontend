import { useEffect, useState } from 'react';
import AddMovieForm from '../../components/admin/AddMovieForm';
import { getMovieById } from '../../lib/utils';
import { Link, useParams } from 'react-router-dom';
import Loader from '../../components/UI/Loader';

const UpdateMoviePage = () => {
    const { id } = useParams();
    const [movieResponse, setMovieResponse] = useState({ movie: null, message: '', status: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMovie = async () => {
            const response = await getMovieById(id);
            console.log('response', { ...response });
            setMovieResponse({ ...response });
            setLoading(false);
        }
        getMovie();
    }, []);

    if (loading) {
        return (
            <div className='w-full h-96 flex justify-center items-center'>
                <Loader />
            </div>
        )
    };
    return (
        <>
            <main className='movies-page'>
                {
                    movieResponse?.status !== 200 ? (
                        <>
                            <div className="h-96 flex justify-center items-center">
                                <div className='text-center space-y-4'>
                                    <h1 className='text-2xl'>{movieResponse?.message}</h1>
                                    <Link to="../movies/" className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">Back to All Movie</Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center">
                                <h1 className='text-3xl'>Update Movie</h1>
                                <Link to="/admin/movies/" className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">See All Movie</Link>
                            </div >
                            <div className="movies-table-wrapper">
                                <AddMovieForm movie={movieResponse.movie} />
                            </div>
                        </>
                    )
                }
            </main >
        </>
    )
}

export default UpdateMoviePage;