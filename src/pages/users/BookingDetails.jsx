
import React, { useEffect, useState } from 'react'
import { displayDate, displayTime } from '../../lib/utils';
import Axios from '../../lib/axiosInstance';
import { useAuth } from '../../lib/hooks/useAuth';
import { useParams } from 'react-router-dom';
import TicketModal from '../../components/UI/TicketModal';
const BookingDetails = (props) => {
    const [bookingDetails, setBookingDetails] = useState([])
    const [viewTicket, setViewTicket] = useState(false)
    const { token } = useAuth();
    const { bookingId } = useParams()
    const bookedSeats = bookingDetails?.seats?.map((a) => a.seatNo).join(' , ')
    const getShowsDetails = () => {
        Axios('GET', `/user/get-booking-details/${bookingId}`, null, { authRequest: true, token: token })
            .then((response) => {
                console.log('response', response);
                if (response?.status === 201) {
                    // toast.success('Movie Added Sucessfully');
                }
                if (response?.status === 200) {
                    setBookingDetails(response?.data?.booking)
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
        getShowsDetails()

    }, [])

    const closeTicketModal = () => {
        setViewTicket(false)
    }
    const openTicketModal = () => {
        setViewTicket(true)
    }
    const ticketDeatils = {
        title: bookingDetails?.movie?.title,
        poster: bookingDetails?.movie?.poster,
        releaseDate: bookingDetails?.movie?.releaseDate,
        showTime: bookingDetails?.showtime?.showStartTime,
        noOfSeatsBook: bookingDetails?.seats?.length,
        bookingId: bookingDetails?.bookingId,
        seatNo: bookedSeats,
        amount: bookingDetails?.totalPrice,
        language: bookingDetails?.movie?.language
    }

    return (
        <div>
            <div className="bg-gray-800 text-skin-inverted rounded-lg p-4 flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="w-full md:w-1/3">
                    <img src={bookingDetails?.movie?.poster} alt={bookingDetails?.movie?.title} className="w-full h-auto rounded-lg" />
                </div>
                <div className="w-full md:w-2/3 space-y-6">
                    <h2 className="text-3xl font-semibold">{bookingDetails?.movie?.title}</h2>
                    <div className="mt-4 space-y-2">
                        <span className="text-xl font-semibold">Description</span>
                        <p className="line-clamp-3">{bookingDetails?.movie?.description}</p>
                    </div>

                    <div className="mt-4 space-y-2">
                        <span className="text-xl font-semibold">Date</span>
                        <p className="line-clamp-3">{displayDate(bookingDetails?.movie?.releaseDate)}</p>
                    </div>

                    {/* Shows */}
                    <div className="mt-4 space-y-2">
                        <span className="text-xl font-semibold">Shows</span>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">


                            <button
                                className={`text-skin-inverted border border-green-800/70 hover:bg-green-800/20 focus:ring-green-800/70 bg-green-800/40  focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}

                            >
                                {displayTime(bookingDetails?.showtime?.showStartTime)}
                            </button>


                        </div>


                    </div>
                    <div className="mt-4 space-y-2">
                        <span className="text-xl font-semibold">No Of Seats</span>
                        <p className="line-clamp-3">{bookingDetails?.seats?.length}</p>
                    </div>
                    <div className="mt-4 space-y-2">
                        <span className="text-xl font-semibold">Booked Seats</span>
                        <p className="line-clamp-3">{bookedSeats}</p>
                    </div>
                    <div className="mt-4 space-y-2">
                        <span className="text-xl font-semibold">Amount</span>
                        <p className="line-clamp-3">₹ {bookingDetails?.totalPrice}</p>
                    </div>
                    <div className="mt-4 space-y-2">
                        <span className="text-xl font-semibold">Movie status</span>
                        <p className="line-clamp-3"> {bookingDetails?.movie?.status}</p>
                    </div>
                    <div className="mt-4 space-y-2">
                        <span className="text-xl font-semibold">Payment status</span>
                        <p className="line-clamp-3">Not found</p>
                    </div>
                    <button
                        className={`text-skin-inverted border border-green-800/70 hover:bg-green-800/20 focus:ring-green-800/70 bg-green-800/40  focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                        onClick={openTicketModal}
                    >
                        View ticket
                    </button>
                    <button
                        className={`text-skin-inverted border border-green-800/70 hover:bg-green-800/20 focus:ring-green-800/70 bg-green-800/40  focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}

                    >
                        Download ticket
                    </button>
                </div>
            </div>
            {viewTicket && (<TicketModal closeHandler={closeTicketModal} isOpen={viewTicket} ticket={ticketDeatils} />)}
        </div>
    );
};


export default BookingDetails