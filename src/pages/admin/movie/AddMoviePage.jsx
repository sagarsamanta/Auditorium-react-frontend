import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import AddMovieForm from '../../../components/admin/AddMovieForm';
import { RiArrowGoBackLine } from 'react-icons/ri';

const AddMoviePage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    return (
        <>
            <main className='movies-page'>
                <div className="flex justify-between items-center">
                    <h1 className="text-xl md:text-2xl lg:text:3xl">{state?.movie ? 'Repeat Movie' : 'Add New Movie'}</h1>
                    <div className='flex items-center gap-2'>
                        <button
                            className="text-sm px-2 py-2 md:px-4 md:py-3 rounded-lg border border-skin-base bg-skin-inverted text-skin-base flex items-center gap-2"
                            onClick={() => navigate(-1)}
                        >
                            <RiArrowGoBackLine /> Back
                        </button>
                        <button
                            className="text-sm inline-block px-2 py-2 md:px-4 md:py-3 rounded-lg bg-skin-base text-skin-inverted"
                            onClick={() => navigate(-1)}
                        >
                            See All Movie
                        </button>
                    </div>
                </div>
                <div className="movies-table-wrapper">
                    <AddMovieForm addMovie={state?.movie} />
                </div>
            </main>
        </>
    )
}

export default AddMoviePage