import moment from "moment";
import { ADMIN_TOKEN, API_ROOT } from "./consts";

export const getDataUriOfImage = (file = null) => {
    if (!file) return '';

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

export const displayDate = (dateString, format = "Do MMM, YYYY") => {
    return moment(dateString).format(format);
}

export const getPriceBySeatNumber = (seatNumber, priceList) => {
    const firstChar = seatNumber?.charAt(0)?.toUpperCase();

    if (['A', 'B', 'C'].includes(firstChar)) {
        return priceList.priceRow_a_to_c;
    } else if (['D', 'E', 'F', 'G', 'H'].includes(firstChar)) {
        return priceList.priceRow_d_to_h;
    } else if (['I', 'J', 'K', 'L', 'M', 'N'].includes(firstChar)) {
        return priceList.priceRow_i_to_n;
    }
    return 0;
}

export const getSeatPriceObj = (selectedSeats, priceList) => {
    if (!selectedSeats || !priceList) return {};
    console.log('selectedSeats', selectedSeats);
    const seatPriceObj = selectedSeats.map((seat) => {
        return {
            seatNo: seat,
            price: getPriceBySeatNumber(seat, priceList),
        }
    });
    return seatPriceObj;
}

export const organizeSeatsByStatus = (seats = []) => {
    const result = {};

    seats.forEach((seat) => {
        const { status, seatNo, price } = seat;

        if (!result[status]) {
            result[status] = {
                seatNo: [],
                totalPrice: 0,
            };
        }

        result[status].seatNo.push(seatNo);
        result[status].totalPrice += price;
    });

    return result;
}


/** API methods */
export const getAllMovies = async () => {
    const res = await fetch(`${API_ROOT}/movie/`, {
        headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        movies: data.movies,
    }
}

export const getMovieById = async (movieId) => {
    if (!movieId) return {};
    const res = await fetch(`${API_ROOT}/movie/${movieId}`, {
        headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        statusText: res.statusText,
        message: data.message,
        error: data.error,
        movie: data.movie || null,
    }
}

export const getShowsByMovieId = async (movieId) => {
    if (!movieId) return {};
    const res = await fetch(`${API_ROOT}/user/getAllShowsForMovie/${movieId}`, {
        headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        showStatus: res.status,
        showMessage: res.statusText,
        message: data.message,
        error: data.error,
        shows: data.shows || null,
    }
}

export const getShowsDetails = async (movieId, showId) => {
    if (!movieId || !showId) return {};
    const res = await fetch(`${API_ROOT}/user/getShow/${movieId}/${showId}`, {
        headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        statusText: res.statusText,
        message: data.message,
        error: data.error,
        show: data.show || null,
    }
}

export const getSeatsForShow = async (movieId, showId, token) => {
    if (!movieId || !showId) return [];
    const res = await fetch(`${API_ROOT}/user/get-all-seats-details/${movieId}/${showId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store',
    });
    const data = await res.json();
    return {
        status: res.status,
        ...data,
    }
}