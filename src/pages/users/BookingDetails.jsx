
import React, { useEffect, useState } from 'react'
import { displayDate, displayTime, getCurrencyFormat } from '../../lib/utils';
import Axios from '../../lib/axiosInstance';
import { useAuth } from '../../lib/hooks/useAuth';
import { useParams } from 'react-router-dom';
import TicketModal from '../../components/UI/TicketModal';
import Loader from '../../components/UI/Loader';
import SomethingWentWrong from '../../components/UI/SomethingWentWrong';

const BookingDetails = (props) => {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [viewTicket, setViewTicket] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { token } = useAuth();
    const { bookingId } = useParams();
    const bookedSeats = bookingDetails?.seats?.map((a) => a.seatNo).join(', ');
    const getShowsDetails = () => {
        Axios('GET', `/user/get-booking-details/${bookingId}`, null, { authRequest: true, token: token })
            .then((response) => {
                if (response?.status === 200) {
                    setBookingDetails(response?.data?.booking)
                }
            })
            .finally(() => {
                setLoading(false);
            })
            .catch((error) => {
                setError(true);
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
        showTitle: bookingDetails?.showtime?.title,
        showTime: bookingDetails?.showtime?.showStartTime,
        noOfSeatsBook: bookingDetails?.seats?.length,
        bookingId: bookingDetails?.bookingId,
        seatNo: bookedSeats,
        amount: bookingDetails?.totalPrice,
        language: bookingDetails?.movie?.language
    }

    return (
        <div className="text-sm mx-auto container px-2 sm:px-6 lg:px-8 py-4 space-y-4 min-h-screen lg:mx-auto mt-3 pb-14 relative">
            {
                loading ? (
                    <Loader className='absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10' />
                ) : (
                    error ? (
                        <SomethingWentWrong className='absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10' />
                    ) : (
                        <div className={`bg-gray-800 text-skin-inverted rounded-lg p-4`}>
                            <div className={`block py-4 text-skin-inverted transition-all`}>
                                <div className='flex flex-col md:flex-row items-start gap-4'>
                                    <div className={`w-full md:w-1/3 h-[360px] max-h-[360px] relative overflow-hidden rounded-md shadow-lg border border-white/5`}>
                                        <img src={bookingDetails?.movie?.poster} alt={bookingDetails?.movie?.title} className="w-full h-full absolute inset-0 object-cover bg-center z-[0] blur-lg" />
                                        <img src={bookingDetails?.movie?.poster} alt={bookingDetails?.movie?.title} className="w-full h-full absolute inset-0 object-contain bg-center z-[2]" />
                                    </div>
                                    <div className='flex w-full flex-col justify-end'>
                                        <div className="">
                                            <h5 className="font-semibold w-full text-3xl uppercase line-clamp-1 leading-tight">
                                                {bookingDetails?.movie?.title}
                                            </h5>
                                            <span className="capitalize">({bookingDetails?.movie?.language})</span>
                                        </div>
                                        <div className="mt-4 space-y-1">
                                            <span className="text-lg font-semibold">Description</span>
                                            <p className="line-clamp-3">{bookingDetails?.movie?.description}</p>
                                        </div>
                                        <div className="mt-4 space-y-1">
                                            <span className="text-lg font-semibold">Movie Date</span>
                                            <p className="line-clamp-3">{displayDate(bookingDetails?.movie?.releaseDate)} | {displayTime(bookingDetails?.showtime?.showStartTime)}</p>
                                        </div>
                                        <div className="w-full md:w-1/3 grid grid-cols-2">
                                            <div className="mt-4 space-y-1">
                                                <span className="text-lg font-semibold">Seats</span>
                                                <p className="line-clamp-3">{`${bookingDetails?.seats?.map(seat => seat?.seatNo).join(', ')}`.trim()}</p>
                                            </div>
                                            <div className="mt-4 space-y-1">
                                                <span className="text-lg font-semibold">Total</span>
                                                <p className="line-clamp-3">{getCurrencyFormat(bookingDetails?.totalPrice)}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-1">
                                            <button
                                                className={`text-skin-inverted border border-skin-base/70 hover:bg-skin-base/20 focus:ring-skin-base/70 bg-skin-base/40  focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
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
                                </div>
                            </div>
                        </div>
                    )
                )
            }
            {!error && viewTicket && (<TicketModal closeHandler={closeTicketModal} isOpen={viewTicket} ticket={ticketDeatils} />)}
        </div>
    );
};


export default BookingDetails