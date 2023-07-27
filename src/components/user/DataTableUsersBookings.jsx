import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { displayDate } from "../../lib/utils";

const DataTableUsersBookings = ({ data, className }) => {    
    const columns = [
        {
            name: 'Date',
            selector: row => <div>{displayDate(row?.showtime?.movie?.releaseDate)}</div>,
        },
        {
            name: 'Movie',
            selector: row => <div>{row?.movie?.title}</div>,
        },
        {
            name: 'Show Start Time',
            selector: row => <div>{row?.showtime?.showStartTime}</div>,
        },
        {
            name: 'Show End Time',
            selector: row => <div>{row?.showtime?.showEndTime}</div>,
        },
        {
            name: 'Booked seats',
            selector: row => <div>{row?.showtime?.bookedSeats}</div>,
        },
        
        {
            name: 'Action',
            selector: row => (
                <div className="space-x-4">
                    <Link href={`/admin/users/`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 border border-blue-600 w-24 text-center text-blue-600 font-serif hover:bg-blue-600 hover:text-white">View</Link>


                </div>
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
        </>
    )
}

export default DataTableUsersBookings;
