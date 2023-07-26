import { Link } from 'react-router-dom';
import AddMovieForm from '../../components/admin/AddMovieForm';
import { useEffect, useState } from 'react';

const AddMoviePage = () => {
    return (
        <>
            <main className='movies-page'>
                <div className="flex justify-between items-center">
                    <h1 className='text-3xl'>Add New Movie</h1>
                    <Link to="/admin/movies" className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted">See All Movie</Link>
                </div>
                <div className="movies-table-wrapper">
                    <AddMovieForm />
                </div>
            </main>
        </>
    )
}

export default AddMoviePage