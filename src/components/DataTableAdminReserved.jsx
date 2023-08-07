import Axios from "../lib/axiosInstance";
import { useAuth } from "../lib/hooks/useAuth";
import { displayDate, displayTime, getCurrencyFormat, getSeatPriceObj } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";

const DataTableAdminReserved = ({ data, className }) => {
    const { token } = useAuth();

    // WIP
    const handleSaveReserve = async (row) => {
        if (selectedSeats.length > 0) {
            setLoading(prev => { return { ...prev, reserved: true } });
            const priceList = row?.showId?.price;
            const seatPriceObj = getSeatPriceObj(selectedSeats, priceList);
            const seats = {
                movieId: row?.movieId?._id,
                showtimeId: showId,
                seatIds: seatPriceObj,
                userId: authUser.user._id,
                totalPrice: getTotalSelectedPrice(seatPriceObj)
            };

            // API call to save seats
            Axios('POST', `/booking/reserve-seats/${movieId}`, seats, { authRequest: true, token: token })
                .then((res) => {
                    if (res?.status === 201) {
                        toast.success(`${res?.data?.message}`);
                    }
                })
                .finally(() => {
                    setLoading(prev => { return { ...prev, reserved: false } });
                    fetchFreshData();
                })
                .catch((err) => {
                    console.log('err', err);
                });
        }
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
                    <button className={`shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded flex justify-between items-center gap-x-2 disabled:opacity-50`} onClick={() => handleSaveReserve(row)} disabled={row.status !== BOOKING_STATUS.BOOKED}><IoTicketOutline size={15} title='View Ticket' /> Mark Available</button>
                </>
            )
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
        </>
    )
}

export default DataTableAdminReserved;
