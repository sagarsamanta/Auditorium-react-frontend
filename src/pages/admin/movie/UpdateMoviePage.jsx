import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from '../../../components/UI/Loader';
import AddMovieForm from '../../../components/admin/AddMovieForm';
import { getMovieById } from '../../../lib/utils';
import { useAuth } from '../../../lib/hooks/useAuth';
import { RiArrowGoBackLine } from 'react-icons/ri';

const UpdateMoviePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movieResponse, setMovieResponse] = useState({ movie: null, message: '', status: 0 });
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const getMovie = async () => {
            const response = await getMovieById(id, token);
            setMovieResponse({ ...response });
            setLoading(false);
        }
        getMovie();
    }, [id]);

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
                                <h1 className="text-xl md:text-2xl lg:text:3xl">Update Movie</h1>
                                <div className='flex items-center gap-2'>
                                    <button
                                        className="text-sm px-2 py-2 md:px-4 md:py-3 rounded-lg border border-skin-base bg-skin-inverted text-skin-base flex items-center gap-2"
                                        onClick={() => navigate(-1)}
                                    >
                                        <RiArrowGoBackLine /> Back
                                    </button>
                                    <Link to="/admin/movies/" className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">See All Movie</Link>
                                </div>
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