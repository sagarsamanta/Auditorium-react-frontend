import React, { useEffect, useState } from "react";
import {
    displayDate,
    displayTime,
    getCurrencyFormat,
    getSeatPriceObj,
} from "../../../../lib/utils";
import { MdClose } from "react-icons/md";
import {
    MESSAGE,
    PAYMENT_METHOS,
    USER_ADMIN_ROLE,
    USER_EMPLOYEE_ROLE,
} from "../../../../lib/consts";
import { useAuth } from "../../../../lib/hooks/useAuth";
import LoadingButton from "../../../../components/UI/LoadingButton";
import Axios from "../../../../lib/axiosInstance";
import Select from "react-select";

const BookingConfirmation = ({
    selectedSeats,
    show,
    totalAmount,
    closeModal,
    handlePay,
    paymentMethod,
    setPaymentMethod,
    isLoading,
    selectedEmployee,
    setSelectedEmployee,
    employeeOptions,
    setEmployeeOptions
}) => {
    const { showStartTime, movie, showEndTime } = show;
    const [isEverythingOk, setIsEverythingOk] = useState(false);
    const [userType, setUserType] = useState("guest");
    
    const { user, token } = useAuth();

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };
    const proceedToPay = (payMode) => {
        if (isEverythingOk) handlePay(payMode);
    };

    useEffect(() => {
        const selectedSeatsArr = selectedSeats?.split(',') || [];
        const seatPriceObj = getSeatPriceObj(selectedSeatsArr, show?.price);
        const seats = {
            movieId: movie?._id,
            showtimeId: show?._id,
            seatIds: seatPriceObj,
            userId: user._id,
            totalPrice: totalAmount,
            paymentMode: paymentMethod
        };
        // API call to check seats
        Axios('POST', `/booking/check-seats-availability/${movie?._id}`, seats, { authRequest: true, token: token })
            .then(async (res) => {
                console.log('res', res);
                setIsEverythingOk(res?.status === 200);
            })
            .catch((err) => {
                console.log('err', err);
            });
    }, [selectedSeats, totalAmount]);

    const handleEmployeeSelect = (value) => {
        setSelectedEmployee(value);
    }
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        setSelectedEmployee(null);
    }

    const isNotValidPayment =
        user?.role === USER_EMPLOYEE_ROLE && paymentMethod === PAYMENT_METHOS.CASH;
    return (
        <div className="relative  flex justify-center items-center p-0 md:p-0">
            <button
                className="absolute top-[-10px] right-[-15px]"
                onClick={closeModal}
            >
                <MdClose className="" size={20} />
            </button>
            <div className="bg-white md:mt-3 md:p-8 md:rounded-lg md:shadow-md w-full max-w-screen-md">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
                    Booking Confirmation
                </h2>
                <div className="border-t-2 border-gray-200 pt-4">
                    <div className="grid grid-cols-3 mb-1">
                        <p className="text-gray-600 text-sm md:text-base">Movie Name</p>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className="text-sm md:text-base">{movie?.title}</p>
                    </div>
                    <div className="grid grid-cols-3 mb-1">
                        <p className="text-gray-600 text-sm md:text-base">Release Date</p>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className="text-sm md:text-base">
                            {displayDate(movie?.releaseDate)}
                        </p>
                    </div>
                    <div className="grid grid-cols-3 mb-1">
                        <p className="text-gray-600 text-sm md:text-base">Show Time</p>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className="text-sm md:text-base">{displayTime(showStartTime)}</p>
                    </div>
                    <div className="grid grid-cols-3 mb-1">
                        <p className="text-gray-600 text-sm md:text-base">Seats</p>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className="text-sm md:text-base">{selectedSeats}</p>
                    </div>
                    <div className="text-lg md:text-xl font-semibold mb-2 border-t-2 border-gray-200 pt-4">
                        Payment Method
                    </div>
                    <div className="flex gap-6  items-center mb-4">
                        <label className="flex items-center cursor-pointer">
                            <input
                                checked={paymentMethod === PAYMENT_METHOS.CASH}
                                onChange={handlePaymentMethodChange}
                                type="radio"
                                name="paymentMethod"
                                value={PAYMENT_METHOS.CASH}
                                className="mr-2"
                            />
                            <span className="text-sm md:text-base">Pay with Cash</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                checked={paymentMethod === PAYMENT_METHOS.ONLINE}
                                onChange={handlePaymentMethodChange}
                                type="radio"
                                name="paymentMethod"
                                value={PAYMENT_METHOS.ONLINE}
                                className="mr-2 "
                            />
                            <span className="text-sm md:text-base">Pay Online</span>
                        </label>
                    </div>
                </div>
                {
                    user?.role === USER_ADMIN_ROLE && (
                        <>
                            <div>
                                <div className="text-lg md:text-xl font-semibold mb-2 border-t-2 border-gray-200 pt-4">
                                    User Type
                                </div>
                                <div className="flex gap-20 items-center mb-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            checked={userType === "guest"}
                                            onChange={handleUserTypeChange}
                                            type="radio"
                                            name="userType"
                                            value="guest"
                                            className="mr-2"
                                        />
                                        <span className="text-sm md:text-base">Guest</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            checked={userType === "employee"}
                                            onChange={handleUserTypeChange}
                                            type="radio"
                                            name="userType"
                                            value="employee"
                                            className="mr-2"
                                        />
                                        <span className="text-sm md:text-base">Employee</span>
                                    </label>
                                </div>
                                {userType === "employee" && (
                                    <div className="mt-2">
                                        <label htmlFor="employeeSelect" className="block mb-1 text-base">
                                            Select Employee
                                        </label>
                                        <Select
                                            id="employeeSelect"
                                            options={employeeOptions}
                                            value={selectedEmployee}
                                            onChange={handleEmployeeSelect}
                                            isSearchable
                                            maxMenuHeight={150}
                                            closeMenuOnSelect
                                            isClearable={true}
                                            required={true}
                                        />
                                        {
                                            (userType === "employee" && !selectedEmployee) && (
                                                <p className="text-red-500 text-base">Select Employee to Proceed.</p>
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                        </>
                    )
                }
                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-3 gap-2">
                        <h3 className="text-sm md:text-lg font-semibold">Pay Amount</h3>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className="text-sm md:text-xl font-semibold">
                            {getCurrencyFormat(totalAmount)}
                        </p>
                    </div>
                    {
                        <div
                            className={`text-sm bg-yellow-200 px-3 py-1 mb-2 rounded-full transition ${isNotValidPayment ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            {MESSAGE.USER_CASH_PAY_WARNING_MESSAGE}
                        </div>
                    }

                    <LoadingButton
                        text="Proceed to Pay"
                        onClick={() => proceedToPay(paymentMethod)}
                        isLoading={isLoading}
                        className="w-full"
                        isDisable={
                            isNotValidPayment ||
                            !isEverythingOk ||
                            (user?.role === USER_ADMIN_ROLE && userType === "employee" && !selectedEmployee)
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
