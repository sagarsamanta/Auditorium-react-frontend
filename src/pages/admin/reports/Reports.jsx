import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Axios from '../../../lib/axiosInstance'
import { useAuth } from '../../../lib/hooks/useAuth'


const Reports = () => {
  const [movieList, setmovieList] = useState([])
  const { token } = useAuth()
  const getAllMoviesTitle = () => {
    Axios('GET', '/movie/get-all-movie-title', null, { authRequest: true, token: token })
      .then((res) => {

        if (res.status === 200) {
          const allMovies = res.data?.movies
          const allOptions = allMovies?.map((movie) => {
            return {
              value: movie.title,
              label: movie.title
            }
          })
          console.log(allOptions);
          setmovieList(allOptions);
        }
      })
      .finally(() => {
        // setLoading({ ...loading, movie: false });
      })
      .catch((err) => {
        console.log(err)
      });
  }
  useEffect(() => {
    getAllMoviesTitle()
  }, [])
  const handleInputChange = (e) => {
    console.log(e);
  }
  return (
    <div>
      <div className="flex justify-between items-center p-4 mb-2 border border-slate-100 rounded-md shadow-md">
        <h1 className="text-xl md:text-2xl lg:text:3xl">All Reports</h1>
      </div>
      <div className=' w-full lg:w-1/3'>
        <Select onChange={handleInputChange} placeholder="Search movie name here..." options={movieList} isClearable />
      </div>
    </div>
  )
}

export default Reports