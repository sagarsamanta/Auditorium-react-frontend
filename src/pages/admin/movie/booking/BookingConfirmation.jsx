import React, { useRef, useState } from 'react';
import { displayDate, displayTime, getCurrencyFormat } from '../../../../lib/utils';
import { MdClose } from 'react-icons/md';
import { API_ROOT, BASE_DOMAIN, PAYMENT, PAYMENT_METHOS, USER_CASH_PAY_WARNING_MESSAGE, USER_EMPLOYEE_ROLE } from '../../../../lib/consts';
import { useAuth } from '../../../../lib/hooks/useAuth';
import SabpaisaPaymentGateway from '../../../../payments/Payment';
import Axios from '../../../../lib/axiosInstance';

const BookingConfirmation = ({ selectedSeats, show, totalAmount, closeModal, handlePay }) => {

    const { showStartTime, movie, showEndTime } = show;
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOS.DEFAULT);
    const [payerName, setPayerName] = useState("Tanuj Patra");
    const [payerEmail, setPayerEmail] = useState("anand.kumar@sabpaisa.in");
    const [payerMobile, setPayerMobile] = useState("6291312929");
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const clientCode = "TM001"

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };
    const proceedToPay = (payMode) => {
        // POST request to backend
        // Axios("POST", "/payment/encryot-data", {
        //     payerName: user.name,
        //     payerEmail: user.email,
        //     payerMobile: "9876543210",
        //     clientTxnId: randomStr(20, "12345abcde"),
        //     amount: totalAmount,
        //     clientCode: "TM001",
        //     transUserName: "spuser_2013",
        //     transUserPassword: "RIADA_SP336",
        //     callbackUrl: `${API_ROOT}/payment/decrypt-data`,
        //     channelId: "W",
        //     mcc: "5666",
        //     transData: new Date(),
        //     udf1:'userId',
        //     udf2:'showtimeId',
        //     udf3:'seatIds',
        //     udf4:'paymentMode',
        // }).then(async (res) => {
        //     if (res.status === 200) {
        //         encDataRef.current.value = res?.data?.data
        //         clientCodeRef.current.value = clientCode
        //         paymentFormRef.current.submit();
        //     }
        //     console.log('res', res);
        // }).catch((err) => {
        //     console.log('err', err);
        // });
        setIsOpen(true);
        handlePay(payMode);
    }

    const isNotValidPayment = user?.role === USER_EMPLOYEE_ROLE && paymentMethod === PAYMENT_METHOS.CASH
    return (
        <div className="relative  flex justify-center items-center p-0 md:p-0">
            <button className='absolute top-[-10px] right-[-15px]' onClick={closeModal}>
                <MdClose className='' size={20} />
            </button>
            <div className="bg-white md:mt-3 md:p-8 md:rounded-lg md:shadow-md w-full max-w-screen-md">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Booking Confirmation</h2>
                <div className="border-t-2 border-gray-200 pt-4">
                    <div className="grid grid-cols-3 mb-1">
                        <p className="text-gray-600 text-sm md:text-base">Movie Name</p>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className='text-sm md:text-base'>{movie?.title}</p>
                    </div>
                    <div className="grid grid-cols-3 mb-1">
                        <p className="text-gray-600 text-sm md:text-base">Release Date</p>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className='text-sm md:text-base'>{displayDate(movie?.releaseDate)}</p>
                    </div>
                    <div className="grid grid-cols-3 mb-1">
                        <p className="text-gray-600 text-sm md:text-base">Show Time</p>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className='text-sm md:text-base'>{displayTime(showStartTime)}</p>
                    </div>
                    <div className="grid grid-cols-3 mb-1">
                        <p className="text-gray-600 text-sm md:text-base">Seats</p>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className='text-sm md:text-base'>{selectedSeats}</p>
                    </div>
                    <div className="text-lg md:text-xl font-semibold mb-2 border-t-2 border-gray-200 pt-4">Payment Method</div>
                    <label className="flex items-center">
                        <input checked={paymentMethod === PAYMENT_METHOS.CASH} onChange={handlePaymentMethodChange} type="radio" name="paymentMethod" value={PAYMENT_METHOS.CASH} className="mr-2" />
                        <span className='text-sm md:text-base'>Pay with Cash</span>
                    </label>
                    <label className="flex items-center">
                        <input checked={paymentMethod === PAYMENT_METHOS.ONLINE} onChange={handlePaymentMethodChange} type="radio" name="paymentMethod" value={PAYMENT_METHOS.ONLINE} className="mr-2" />
                        <span className='text-sm md:text-base'>Pay Online</span>
                    </label>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <h3 className="text-sm md:text-lg font-semibold">Pay Amount</h3>
                        <p className="text-lg text-center md:text-base">:</p>
                        <p className="text-sm md:text-xl font-semibold">{getCurrencyFormat(totalAmount)}</p>
                    </div>
                    {<div className={`text-sm bg-yellow-200 px-3 py-1 rounded-full transition ${isNotValidPayment ? 'opacity-100' : 'opacity-0'}`}>{USER_CASH_PAY_WARNING_MESSAGE}</div>}

                    <button disabled={isNotValidPayment} onClick={() => proceedToPay(paymentMethod)} className="bg-blue-500 hover:bg-blue-600  text-white py-2 px-4 rounded-full w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                        Proceed to Pay
                    </button>
                </div>
            </div>
            {/* <SabpaisaPaymentGateway payerName={payerName} payerEmail={payerEmail} payerMobile={payerMobile} isOpen={isOpen} /> */}
        </div>
    );
};

export default BookingConfirmation;
