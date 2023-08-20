import { CustomDataTable as DataTable } from "./DataTable";
import { displayDate, displayTime } from "../lib/utils";
import { BOOKING_STATUS, SEATS_STATUS } from "../lib/consts";

const DataTableUsersBookings = ({ data, className }) => {
  console.log(data);
  const columns = [
    {
      name: "Date",
      minWidth:'150px',
      cell: (row) => displayDate(row?.showtime?.movie?.releaseDate),
    },
    {
      name: "Movie",
      minWidth: "250px",
      cell: (row) => <span title={row?.movie?.title}>{row?.movie?.title}</span>,
    },
    {
      name: "Show Start Time",
      minWidth: "150px",
      cell: (row) => displayTime(row?.showtime?.showStartTime),
    },
    {
      name: "Show End Time",
      minWidth: "150px",
      cell: (row) => displayTime(row?.showtime?.showEndTime),
    },
    {
      name: "Booking Status",
      minWidth: "150px",
      cell: (row) => (
        <div
          className={`${
            row?.status === BOOKING_STATUS.BOOKED && "text-green-700"
          } ${row?.status === BOOKING_STATUS.CANCEL && "text-red-600"} font-semibold `}
        >
          {row?.status}
        </div>
      ),
    },
    {
      name: "Payment Mode",
      minWidth: "150px",
      cell: (row) => <div className="font-semibold">{row?.paymentMode}</div>,
    },

    {
      name: <>Booked seats</>,
      minWidth: "250px",
      cell: (row) => {
        return (
          <div className="w-full overflow-x-auto scrollbar-w-1">
            <div className="w-max flex items-center gap-2">
              {row?.seats?.length === 0 && "No Record to show"}
              {row?.seats?.map((seat) => (
                 <span
                 className={`${
                   seat.status === SEATS_STATUS.BOOKED &&
                   "bg-green-400 p-1 rounded-md"
                 } ${
                   seat.status === SEATS_STATUS.VISITED &&
                   "bg-yellow-600 text-white p-1 rounded-lg"
                 } font-semibold`}
               >
                  {seat?.seatNo}
                </span>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      name: "Total Amount",
      sortable: true,
      selector: (row) => row?.totalPrice,
      cell: (row) => row?.totalPrice,
      minWidth: "300px",
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
  );
};

export default DataTableUsersBookings;
