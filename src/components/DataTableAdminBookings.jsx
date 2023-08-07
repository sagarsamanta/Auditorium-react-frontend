import { React } from 'react';
import { CustomDataTable as DataTable } from "./DataTable";
import { displayDate, displayTime, getCurrencyFormat } from "../lib/utils";
import { useState } from "react";
import TicketModal from "./UI/TicketModal";
import { IoTicketOutline } from "react-icons/io5";
import { BOOKING_STATUS } from '../lib/consts';

const DataTableAdminBookings = ({ data, className }) => {
    const [ticket, setTicket] = useState(null);
    const [openTicketModal, setOpenTicketModal] = useState(false);

    const viewTicket = (row) => {
        setTicket({
            title: row?.movie?.title,
            poster: row?.movie?.poster,
            releaseDate: row?.movie?.releaseDate,
            showTitle: row?.showtime?.showTitle,
            showTime: row?.showtime?.showStartTime,
            noOfSeatsBook: row?.seats?.length,
            bookingId: row?.bookingId,
            seatNo: row?.seats?.map((a) => a.seatNo).join(", "),
            amount: row?.totalPrice,
            language: row?.movie?.language
        })
        setOpenTicketModal(true)
    }
    const closeTicketModal = () => {
        setOpenTicketModal(false)
    }

    const columns = [
        {
            name: 'Date',
            cell: row => displayDate(row?.showtime?.movie?.releaseDate),
        },
        {
            name: 'Movie',
            cell: row => (
                <span title={row?.movie?.title}>
                    {row?.movie?.title}
                </span>
            ),
        },
        {
            name: 'Start Time',
            cell: row => displayTime(row?.showtime?.showStartTime),
        },
        {
            name: 'Total Seats',
            cell: row => row?.seats.length,
        },
        {
            name: 'Booked seats',
            cell: row => {
                const allSeats = row?.seats?.map((a) => a.seatNo).join(", ")
                return <span title={allSeats}>{allSeats}</span>
            },
        },
        {
            name: 'Total Amount',
            sortable: true,
            selector: row => row?.totalPrice,
            cell: row => getCurrencyFormat(row?.totalPrice),
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Ticket',
            cell: (row) => (
                <>
                    <button className={`shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded flex justify-between items-center gap-x-2 disabled:opacity-50`} onClick={() => viewTicket(row)} disabled={row.status !== BOOKING_STATUS.BOOKED}><IoTicketOutline size={15} title='View Ticket' /> View Ticket</button>
                </>
            )
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        className={`shadow transition duration-300 ease-in-out bg-red-600 hover:bg-red-600/80 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded disabled:opacity-50 flex justify-between items-center gap-x-2`}
                        onClick={() => viewTicket(row)}
                        title='Cancel Ticket'
                        disabled={row.status === BOOKING_STATUS.VISITED}
                    >
                        <IoTicketOutline size={15} /> Cancel Ticket
                    </button>
                </>
            ),
        },
    ];
    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                className={className}
                pagination
            />

            {/* Modals */}
            {openTicketModal && <TicketModal
                isOpen={openTicketModal}
                closeHandler={closeTicketModal}
                ticket={ticket}
            />}
        </>
    )
}

export default DataTableAdminBookings;
