import Axios from "./axiosInstance";
import { API_ROOT } from "./consts";

function randomStr(len, arr) {
    var ans = "";
    for (var i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}
const clientCode = "TM001";

export const redirectToPaymentGateway = (user, totalAmount, bookingData, paymentFormRefs) => {
    if (!user || !bookingData?._id) return;

    console.log('user', user);
    console.log('totalAmount', totalAmount);
    console.log('bookingData', bookingData?._id);
    console.log('paymentFormRefs', paymentFormRefs);

    // Axios("POST", "/payment/encryot-data", {
    //     payerName: user.name,
    //     payerEmail: user.email,
    //     payerMobile: "9876543210",
    //     clientTxnId: randomStr(20, "12345abcdefghujklmnopqrstuvwxyz"),
    //     amount: totalAmount,
    //     clientCode: "TM001",
    //     transUserName: "spuser_2013",
    //     transUserPassword: "RIADA_SP336",
    //     callbackUrl: `${API_ROOT}/payment/decrypt-data`,
    //     channelId: "W",
    //     mcc: "5666",
    //     transData: new Date(),
    //     udf1: bookingData?._id, // Booking Id
    //     udf2: 'showtimeId',
    //     udf3: 'seatIds',
    //     udf4: 'paymentMode',
    // }).then(async (res) => {
    //     if (res.status === 200) {
    //         paymentFormRefs.encDataRef.current.value = res?.data?.data
    //         paymentFormRefs.clientCodeRef.current.value = clientCode
    //         paymentFormRefs.paymentFormRef.current.submit();
    //     }
    //     console.log('res', res);
    // }).catch((err) => {
    //     console.log('err', err);
    // });
}