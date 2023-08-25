export const OPGC = "IB THERMAL CLUB"
export const API_ROOT = process.env.API_ROOT || "http://localhost:5000/api";
export const BASE_DOMAIN = process.env.BASE_DOMAIN || "http://localhost:5000/api/payment/decrypt-data";

export const AUTH_USER_LOCALSTORAGE = 'IWS-AUTHUSER';

export const USER_ADMIN_ROLE = "ADMIN";
export const USER_EMPLOYEE_ROLE = "USER";
export const AUTH_USER_COOKIE = "IWS-AUTHUSER";
export const STATUS_ACTIVE = "ACTIVE";
export const STATUS_INACTIVE = "IN-ACTIVE";
export const SEAT_AVAILABLE = "AVAILABLE";
export const SEAT_BOOKED = "BOOKED";
export const SEAT_RESERVED = "RESERVED";

export const MOVIE_LOCALSTORAGE_KEY = "iws-movie-data";
export const MAX_SEATS_PER_BOOKING = 5;
export const PAYMENT_METHOS = {
    CASH: 'CASH',
    ONLINE: 'ONLINE',
    DEFAULT: 'ONLINE'
};
export const PAYMENTS_STATUS = {
    SUCCESS: 'SUCCESS',
    PENDING: 'PENDING',
    FAILED:'FAILED',
    REFUND_INITIATED: 'REFUND_INITIATED',
    REFUND_REQUESTED: 'REFUND_REQUESTED',
  }
export const SEATS = {
    a_to_c: {
        A: ["12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        B: ["24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        C: ["26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
    },
    d_to_h: {
        D: ["28", "27", "26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        E: ["30", "29", "28", "27", "26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        F: ["32", "31", "30", "29", "28", "27", "26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        G: ["34", "33", "32", "31", "30", "29", "28", "27", "26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        H: ["34", "33", "32", "31", "30", "29", "28", "27", "26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
    },
    i_to_n: {
        I: ["22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        J: ["22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        K: ["22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        L: ["24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        M: ["22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
        N: ["20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"],
    },
};

export const BOOKING_STATUS = {
    PENDING: "PENDING",
    BOOKED: "BOOKED",
    VISITED: "VISITED",
    CANCEL: "CANCEL"
};
export const SEATS_STATUS = {
    BOOKED: "BOOKED",
    VISITED: "VISITED",
    CANCEL: "CANCEL"
};

export const PAYMENT = {
    spURL: "https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1", // Staging environment
};

export const MESSAGE = {
    USER_CASH_PAY_WARNING_MESSAGE: `Please seek authority for "Pay with Cash" option.`,
    FORGOT_PASSWORD: `Please seek authority to change your password!`,
};