import { displayDate, getCurrencyFormat } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";

const DataTableAdminReports = ({ data, className }) => {
    const columns = [
        {
            name: 'Booking Date',
            cell: row => `${displayDate(row?._id?.date)}`,
        },
        {
            name: 'Total Bookings',
            selector: row => row?.totalBookings,
        },
        {
            name: 'No.of Shows',
            selector: row => row?.totalShows,
        },
        {
            name: 'Online Amount',
            selector: row => row?.totalAmountOnline,
            cell: row => getCurrencyFormat(row?.totalAmountOnline),
            sortable: true,
        },

        {
            name: 'Cash Amount',
            selector: row => row?.totalAmountCash,
            cell: row => getCurrencyFormat(row?.totalAmountCash),
        },
        {
            name: 'Total Amount',
            selector: row => row?.totalAmount,
            cell: row => getCurrencyFormat(row?.totalAmount),
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

            {/* <Modal
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
            /> */}
        </>
    )
}

export default DataTableAdminReports;
