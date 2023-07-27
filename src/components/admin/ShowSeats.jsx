import Axios from "../../lib/axiosInstance";
import { SEATS } from "../../lib/consts";
import { getSeatPriceObj, getSeatsForShow, organizeSeatsByStatus } from "../../lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../UI/Loader";

const ShowSeats = ({ movieId, showId, show, authUser, priceList }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatsList, setSeats] = useState(null);
    const [loading, setLoading] = useState({ booking: false, reserved: false, seats: true });
    const seatsByStatus = organizeSeatsByStatus(seatsList?.seats);

    const fetchData = async () => {
        const seats = await getSeatsForShow(movieId, showId, authUser?.token);
        if (seats) setSeats(seats);
        setLoading({ ...loading, seats: false });
        setSelectedSeats([]);
    }

    const handleSelect = (e, seatNo) => {
        e.preventDefault();
        // If seat is booked, then do not allow to select
        if (seatsByStatus?.BOOKED?.seatNo?.includes(seatNo)) return;

        if (selectedSeats.includes(seatNo)) {
            const newSelectedSeats = selectedSeats.filter(
                (selectedSeat) => selectedSeat !== seatNo
            );
            setSelectedSeats(newSelectedSeats);
        } else {
            setSelectedSeats([...selectedSeats, seatNo]);
        }
    };

    const getSeatStatusColor = (seatNo) => {
        if (seatsList?.totalSeats) {
            if (seatsByStatus?.BOOKED?.seatNo.includes(seatNo)) {
                return 'bg-skin-seat-booked';
            }
            if (seatsByStatus?.RESERVED?.seatNo.includes(seatNo)) {
                return 'bg-skin-seat-reserved';
            }
        }
        if (selectedSeats.includes(seatNo)) {
            return 'bg-skin-seat-selected';
        }
        return 'bg-skin-seat-available';
    }

    const getTotalSelectedPrice = (seatsObj) => {
        return seatsObj.reduce((total, seat) => total + seat.price, 0);
    };

    const handleSave = async () => {
        if (selectedSeats.length > 0) {
            setLoading(prev => { return { ...prev, booking: true } });
            const seatPriceObj = getSeatPriceObj(selectedSeats, priceList);
            const seats = {
                movieId,
                showtimeId: showId,
                seatIds: seatPriceObj,
                userId: authUser.user._id,
                totalPrice: getTotalSelectedPrice(seatPriceObj)
            };

            // API call to save seats
            Axios('POST', `/booking/book-movie/${movieId}`, seats, { authRequest: true, token: authUser.token })
                .then((res) => {
                    if (res?.status === 201) {
                        toast.success(`${res?.data?.message}`);
                    }
                })
                .finally(() => {
                    setLoading(prev => { return { ...prev, booking: false } });
                    fetchData();
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }
    const handleSaveReserve = async () => {
        if (selectedSeats.length > 0) {
            setLoading(prev => { return { ...prev, reserved: true } });
            const seatPriceObj = getSeatPriceObj(selectedSeats, priceList);
            const seats = {
                movieId,
                showtimeId: showId,
                seatIds: seatPriceObj,
                userId: authUser.user._id,
                totalPrice: getTotalSelectedPrice(seatPriceObj)
            };

            // API call to save seats
            Axios('POST', `/booking/reserve-seats/${movieId}`, seats, { authRequest: true, token: authUser.token })
                .then((res) => {
                    if (res?.status === 201) {
                        toast.success(`${res?.data?.message}`);
                    }
                })
                .finally(() => {
                    setLoading(prev => { return { ...prev, reserved: false } });
                    fetchData();
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="seats-wrapper">
                <div className="info-wrapper py-3">
                    {/* Info and color code elements */}
                    <div className="w-[95%] mx-auto color-code-wrapper flex justify-center items-center gap-x-3 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-skin-seat-available rounded-sm" />
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-skin-seat-selected rounded-sm" />
                            <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-skin-seat-booked rounded-sm" />
                            <span>Booked</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-skin-seat-reserved rounded-sm" />
                            <span>Reserved</span>
                        </div>
                    </div>
                </div>

                {
                    loading.seats ? (
                        <div className="flex justify-center items-center h-96">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="seats overflow-hidden flex justify-center">
                                <div className="wrapper-1 overflow-x-auto">
                                    <div className="seats-container mt-5 w-max">
                                        <div className="screen mb-6 h-6 bg-skin-muted/50 text-center">
                                            Screen
                                        </div>
                                        {Object.keys(SEATS).map((row) => {
                                            const seats = SEATS[row];
                                            return (
                                                <div
                                                    key={row}
                                                    className={`row row-${row}  my-1 flex justify-center items-center gap-5`}
                                                >
                                                    {/* <div className="row-key">{row}</div> */}
                                                    <div
                                                        className={`seats-${row}  flex gap-2 justify-around items-center`}
                                                    >
                                                        {seats.map((seat) => {
                                                            const seatNo = `${row}${seat}`;
                                                            return (
                                                                <>
                                                                    <button
                                                                        key={seatNo}
                                                                        className={`seat w-7 h-7 ${getSeatStatusColor(seatNo)} p-1 rounded-md text-center text-xs seat-${seatNo} disabled:cursor-not-allowed`}
                                                                        onClick={(e) => handleSelect(e, seatNo)}
                                                                    >
                                                                        {seatNo}
                                                                    </button>
                                                                </>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-stretch md:justify-center items-stretch gap-2 w-full px-0 py-4 md:py-3">
                                <button
                                    className="shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed"
                                    type="submit"
                                    onClick={handleSave}
                                    disabled={selectedSeats.length === 0}
                                >
                                    {loading.booking && <span className="w-4 h-4 border border-r-0 border-skin-inverted inline-block rounded-full absolute top-3 left-4 animate-spin" />}
                                    Book Selected Seats
                                </button>
                                <button
                                    className="shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed"
                                    type="submit"
                                    onClick={handleSaveReserve}
                                    disabled={selectedSeats.length === 0}
                                >
                                    {loading.reserved && <span className="w-4 h-4 border border-r-0 border-skin-inverted inline-block rounded-full absolute top-3 left-4 animate-spin" />}
                                    Reserve Selected Seats
                                </button>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
};

export default ShowSeats;
