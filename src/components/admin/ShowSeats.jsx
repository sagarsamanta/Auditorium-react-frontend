"use client";
import Axios from "@/lib/axiosInstance";
import { SEATS } from "@/lib/consts";
import { getSeatPriceObj, organizeSeatsByStatus } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";

const ShowSeats = ({ movieId, showId, show, seatsList, authUser, priceList }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState({ booking: false, reserved: false });
    const seatsByStatus = organizeSeatsByStatus(seatsList.seats);

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
                    window.location.reload();
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }
    const handleSaveReserve = async () => {
        console.log('handleSaveReserve selectedSeats', selectedSeats);
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
                    window.location.reload();
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
    }

    return (
        <>
            <div className="seats-wrapper">
                <div className="info-wrapper space-y-4 py-5">
                    {/* Info and color code elements */}
                    <div className="color-code-wrapper flex justify-center items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-skin-seat-available rounded-md" />
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-skin-seat-selected rounded-md" />
                            <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-skin-seat-booked rounded-md" />
                            <span>Booked</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-skin-seat-reserved rounded-md" />
                            <span>Reserved</span>
                        </div>
                    </div>
                </div>
                <div className="screen w-[95%] mx-auto h-6 bg-skin-muted/50 text-center">
                    Screen
                </div>
                <div className="seats overflow-hidden flex justify-center">
                    <div className="wrapper-1  overflow-x-auto">
                        <div className="seats-container mt-5 w-max">
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
            </div>
        </>
    );
};

export default ShowSeats;
