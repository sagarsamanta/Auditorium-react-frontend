import Axios from "./axiosInstance";
import { API_ROOT } from "./consts";

function randomStr(len, arr) {
    let ans = "";
    for (var i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

export const redirectToPaymentGateway = (user, seats, paymentFormRefs) => {
    if (!user) return;

    const udf = {
        udf1: seats.movieId || '',    // movie Id
        udf2: seats.showtimeId || '',     // showtimeId
        udf3: JSON.stringify(seats.seatIds),     // Array of seats object [{price: Number, seatNo: String}]
        udf4: seats.userId || '',     // Booking User Id
        udf5: `${seats.totalPrice}` || '',       // totalPrice
        udf6: seats.paymentMode || '',       // paymentMode
    };


    Axios("POST", "/payment/encryot-data", {
        payerName: user.name,
        payerEmail: user.email,
        payerMobile: user.mobile,
        clientTxnId: randomStr(20, "12345abcdefghujklmnopqrstuvwxyz"),
        amount: seats.totalPrice,
        clientCode: process.env.REACT_APP_PAYMENT_SPCLIENTCODE,
        transUserName: process.env.REACT_APP_PAYMENT_SPTRANSUSERNAME,
        transUserPassword: process.env.REACT_APP_PAYMENT_SPTRANSUSERPASSWORD,
        callbackUrl: `${API_ROOT}/payment/decrypt-data`,
        channelId: process.env.REACT_APP_PAYMENT_SPCHANNELID,
        mcc: process.env.REACT_APP_PAYMENT_SPMCC,
        transData: new Date(),
        ...udf,
    }).then(async (res) => {
        if (res.status === 200) {
            // Submit all data to SubPaisa
            paymentFormRefs.encDataRef.current.value = res?.data?.data
            paymentFormRefs.clientCodeRef.current.value = process.env.REACT_APP_PAYMENT_SPCLIENTCODE
            paymentFormRefs.paymentFormRef.current.submit();
        }
    }).catch((err) => {
        console.log('err', err);
    });
}