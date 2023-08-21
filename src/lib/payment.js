import Axios from "./axiosInstance";
import { API_ROOT } from "./consts";

function randomStr(len, arr) {
    let ans = "";
    for (var i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}
const clientCode = "TM001";

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

    console.log('udf', udf);

    Axios("POST", "/payment/encryot-data", {
        payerName: user.name,
        payerEmail: user.email,
        payerMobile: "9876543210",  // user.mobile
        clientTxnId: randomStr(20, "12345abcdefghujklmnopqrstuvwxyz"),
        amount: seats.totalPrice,
        clientCode: "TM001",
        transUserName: "spuser_2013",
        transUserPassword: "RIADA_SP336",
        callbackUrl: `${API_ROOT}/payment/decrypt-data`,
        channelId: "W",
        mcc: "5666",
        transData: new Date(),
        ...udf,
    }).then(async (res) => {
        if (res.status === 200) {
            // Submit all data to SubPaisa
            paymentFormRefs.encDataRef.current.value = res?.data?.data
            paymentFormRefs.clientCodeRef.current.value = clientCode
            paymentFormRefs.paymentFormRef.current.submit();
        }
        console.log('res', res);
    }).catch((err) => {
        console.log('err', err);
    });
}