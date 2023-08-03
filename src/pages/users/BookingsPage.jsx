import React, { useEffect, useState } from 'react'
import Axios from '../../lib/axiosInstance'
import { useAuth } from '../../lib/hooks/useAuth'
import { displayDate, displayTime } from '../../lib/utils'
import { useNavigate } from 'react-router-dom'

const BookingsPage = () => {
  const navigate = useNavigate()

  const [movieList, setAllMovieList] = useState([])
  const { user, token } = useAuth();
  console.log(token);
  const getBookedMovies = () => {
    Axios('GET', `/user/get-all-booked-movie/${user?._id}`, null, { authRequest: true, token: token })
      .then((response) => {
        console.log('response', response);
        if (response?.status === 201) {
          // toast.success('Movie Added Sucessfully');
        }
        if (response?.status === 200) {
          setAllMovieList(response?.data?.bookings)
        }
      })
      .finally(() => {
        // setLoading(false);
      })
      .catch((error) => {
        // toast.error(`${error.message}`);
      });
  }
  useEffect(() => {
    getBookedMovies()

  }, [])

  const handleNavigate = (path) => {
    navigate(path)
  }
  return (
    <div className="text-sm container lg:mx-auto px-3 mt-3 pb-14">
      <h1 className="text-xl md:text-2xl lg:text-3xl p-3 bg-[#1272a2e0] text-white rounded-sm font-semibold mb-4">My Booked Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
        {movieList?.map((movie, index) => (
          <div onClick={()=>handleNavigate(`/user/bookings/${movie?._id}`)} className=" rounded w-full shadow-md p-4 bg-gray-800 text-gray-100 hover:bg-[#5355b447] cursor-pointer transition-all">
            <div className='flex gap-4'><img height={80} width={80} src={movie?.movie?.poster} alt='not-found' />
              <div className='flex w-full flex-col justify-end'>
                <div className="font-semibold mb-2 w-full text-xl line-clamp-1">{movie?.movie?.title}</div>
                <p className="">Date : <span>{displayDate(movie?.movie?.releaseDate)}</span></p>
                <p className="">Time : <span>{displayTime(movie?.showtime?.showStartTime)}</span></p>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default BookingsPage