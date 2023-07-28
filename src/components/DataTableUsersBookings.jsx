import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { displayDate } from "../lib/utils";

const DataTableUsersBookings = ({ data, className }) => {
    const columns = [
        {
            name: 'Date',
            cell: row => <>{displayDate(row?.showtime?.movie?.releaseDate)}</>,
        },
        {
            name: 'Movie',
            // minWidth:'300px',
            cell: row => (
                <span className="">
                    {row?.movie?.title}
                </span>
            ),
        },
        {
            name: 'Start Time',
            cell: row => <>{row?.showtime?.showStartTime}</>,
        },
        {
            name: 'End Time',
            cell: row => <>{row?.showtime?.showEndTime}</>,
        },
        {
            name: 'Seats',
            cell: row => <>{row?.showtime?.bookedSeats}</>,
        },
        {
            name: 'Booked seats',
            // minWidth:'300px',
            cell: row => {
                const allSeats = row?.seats?.map((a) => a.seatNo).join(", ")
                return allSeats
            },
        },
        {
            name: 'Total Amount',
            cell: row => <>{row?.totalPrice}</>,
            minWidth: '300px'
        },

        // {
        //     name: 'Action',
        //     selector: row => (
        //         < className="space-x-4">
        //             <Link to={`/admin/users/bookings/movie/${row._id}`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 border border-skin-base w-24 text-center text-skin-base font-serif hover:bg-skin-base hover:text-white">View</Link>


        //         </>
        //     ),
        // },
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

export default DataTableUsersBookings;
