import React, { useEffect, useState } from 'react';
import SearchBox from '../../components/UI/SearchBox';
import UsersCheckInTable from '../../components/UsersCheckInTable';
import { FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../lib/hooks/useAuth';
import { displayTime } from '../../lib/utils';
import Axios from '../../lib/axiosInstance';
import { MdRadioButtonUnchecked } from 'react-icons/md';

const CheckIn = () => {
    // Replace these values with your actual data

    const [shows, setAllShows] = useState([])
    const [activeMovie, setActiveMovie] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedShow, setSelectedShow] = useState({})
    const { token } = useAuth();
    const getShowsRecords = (id) => {
        const show = shows.filter((show) => show._id === id)
        setSelectedShow(show[0])
    }
    useEffect(() => {
        setLoading(true);

        Axios('GET', `movie/movie-shows-timings`, null, { authRequest: true, token: token })
            .then((res) => {
                setAllShows(res.data?.show);
                setActiveMovie(res.data?.movie);
            })
            .finally(() => {
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });

    }, []);
    return (
        <div className="container">
            <h2 className="text-xl font-semibold">Shows Records</h2>
            <div className="bg-white rounded-lg  py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Total Seats</span>
                    <span className="text-sm ">{selectedShow?.totalSeats || 0}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Available Seats</span>
                    <span className="test-sm ">{(selectedShow?.totalSeats - (selectedShow?.reservedSeats + selectedShow?.bookedSeats)) || 0}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Reserved Seats</span>
                    <span className="test-sm ">{selectedShow?.reservedSeats || 0}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Booked Seats</span>
                    <span className="test-sm ">{selectedShow?.bookedSeats || 0}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">People Inside Auditorium</span>
                    <span className="test-sm ">{selectedShow?.peopleInsideAuditorium || 0}</span>
                </div>

            </div>
            <div className='font-semibold text-xl'>Available Show Timings</div>
            <div className='my-3'>
                {shows?.map((show, index) => (
                    <button
                        key={index}
                        className={`${true ? 'text-skin-inverted border border-green-800/70 hover:bg-green-800/20 focus:ring-green-800/70 bg-green-800/40' : 'text-skin-inverted border border-skin-base hover:bg-skin-base/20 focus:ring-skin-muted'} focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                        onClick={() => getShowsRecords(show?._id)}
                    >
                        {selectedShow?._id === show?._id ? <FiCheckCircle size={15} /> : <MdRadioButtonUnchecked size={15} />}
                        {displayTime(show?.showStartTime)}
                    </button>
                ))}

            </div>
            <div>
                {Object.keys(selectedShow).length > 0 && <UsersCheckInTable show={selectedShow} showStartTime={selectedShow?.showStartTime} />}
            </div>
        </div>
    );
};

export default CheckIn;
