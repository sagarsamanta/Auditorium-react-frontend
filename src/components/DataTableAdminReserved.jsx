import { TbLockOpen } from "react-icons/tb";
import Axios from "../lib/axiosInstance";
import { useAuth } from "../lib/hooks/useAuth";
import { displayDate, displayTime, getCurrencyFormat } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";
import { useState } from "react";
import Modal from "./UI/Modal";
import { toast } from "react-toastify";

const DataTableAdminReserved = ({ data, className }) => {
    const { token } = useAuth();
    const [reservedSeats, setReservedSeats] = useState(data);
    const [selectedReservedSeat, setSelecterReservedSeat] = useState(null);
    const [isOpenReserveSeatModal, setIsOpenReserveSeatModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const askFormConfirmation = (row) => {
        setIsOpenReserveSeatModal(true);
        setSelecterReservedSeat(row);
    }
    const handleMakeAvailable = () => {
        setLoading(true);
        const movieId = selectedReservedSeat?.movieId?._id;
        const showId = selectedReservedSeat?.showId?._id;
        const seatNo = selectedReservedSeat?.seatNo;
        Axios('DELETE', `/show/${movieId}/${showId}/${seatNo}`, null, { authRequest: true, token: token })
            .then((res) => {
                const newData = reservedSeats.filter(seat => seat.seatNo !== res?.data?.seat?.seatNo);
                setReservedSeats(newData);
                toast.success(res?.data?.message);
            })
            .finally(() => {
                setLoading(false);
                setIsOpenReserveSeatModal(false);
            })
            .catch((err) => {
                console.log('err', err);
                toast.error(err.message);
            });
    }
    const columns = [
        {
            name: <>Movie Date</>,
            maxWidth: '150px',
            cell: row => displayDate(row?.movieId?.releaseDate),
        },
        {
            name: <>Movie</>,
            minWidth: '200px',
            cell: row => (
                <span title={row?.movieId?.title}>
                    {row?.movieId?.title}
                </span>
            ),
        },
        {
            name: <>Seat No.</>,
            maxWidth: '100px',
            cell: row => row?.seatNo,
        },
        {
            name: <>Show</>,
            maxWidth: '100px',
            cell: row => row?.showId?.title,
        },
        {
            name: <>Start Time</>,
            maxWidth: '150px',
            cell: row => displayTime(row?.showId?.showStartTime),
        },
        {
            name: <>Cost</>,
            maxWidth: '150px',
            selector: row => row?.price,
            cell: row => getCurrencyFormat(row?.price),
        },
        {
            name: <>Status</>,
            maxWidth: '150px',
            cell: row => row?.status,
        },
        {
            name: <>Action</>,
            maxWidth: '150px',
            cell: (row) => (
                <>
                    <button
                        className={`transition duration-150 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white text-xs py-2 px-4 rounded disabled:opacity-50`}
                        disabled={isOpenReserveSeatModal}
                        onClick={() => { askFormConfirmation(row) }}
                    >
                        <TbLockOpen size={15} title='View Ticket' />
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

            <Modal
                isOpen={isOpenReserveSeatModal}
                closeHandler={setIsOpenReserveSeatModal}
                config={{
                    title: `Mark seat no. "${selectedReservedSeat?.seatNo}" as Available`,
                    text: 'This will mark this seat as Available for everyone',
                    buttonText: 'Make Available',
                    buttonHandler: handleMakeAvailable,
                    loading: loading,
                    buttonClassName: 'bg-skin-base text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed'
                }}
            />
        </>
    )
}

export default DataTableAdminReserved;
