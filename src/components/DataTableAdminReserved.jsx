import { IoTicketOutline } from "react-icons/io5";
import Axios from "../lib/axiosInstance";
import { useAuth } from "../lib/hooks/useAuth";
import { displayDate, displayTime, getCurrencyFormat, getSeatPriceObj } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";
import { BOOKING_STATUS } from "../lib/consts";
import { useState } from "react";

const DataTableAdminReserved = ({ data, className }) => {
    const { token } = useAuth();
    const [reservedSeats, setReservedSeats] = useState(data);

    const handleMakeAvailable = async (row) => {
        const movieId = row?.movieId?._id;
        const showId = row?.showId?._id;
        const selectedReservedSeate = row?.seatNo;
        Axios('DELETE', `/show/${movieId}/${showId}/${selectedReservedSeate}`, null, { authRequest: true, token: token })
            .then((res) => {
                console.log('res', res?.data?.seat?.seatNo);
                const newData = reservedSeats.filter(seat => seat.seatNo !== res?.data?.seat?.seatNo);
                console.log('newData', newData);
                setReservedSeats(newData);
            })
            .catch((err) => {
                console.log('err', err);
            });
    }
    const columns = [
        {
            name: 'Date',
            cell: row => displayDate(row?.movieId?.releaseDate),
        },
        {
            name: 'Movie',
            cell: row => (
                <span title={row?.movieId?.title}>
                    {row?.movieId?.title}
                </span>
            ),
        },
        {
            name: 'Start Time',
            cell: row => displayTime(row?.showId?.showStartTime),
        },
        {
            name: 'Seat No.',
            cell: row => row?.seatNo,
        },
        {
            name: 'Cost',
            selector: row => row?.price,
            cell: row => getCurrencyFormat(row?.price),
        },
        {
            name: 'Status',
            cell: row => row?.status,
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <button 
                        className={`shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded flex justify-between items-center gap-x-2 disabled:opacity-50`}
                        onClick={() => handleMakeAvailable(row)}
                    >
                        <IoTicketOutline size={15} title='View Ticket' /> Mark Available
                    </button>
                </>
            )
        },
    ];
    return (
        <>
            <DataTable
                columns={columns}
                data={reservedSeats}
                className={className}
                pagination
            />
        </>
    )
}

export default DataTableAdminReserved;
