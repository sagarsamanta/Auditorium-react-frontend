import { displayDate, getCurrencyFormat } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";

const DataTableMoviesReports = ({ data, className, isLoading }) => {
  const columns = [
    {
      name: "Movie",
      selector: (row) => row?.movie?.title,
    },
    {
      name: "Realesed Date",
      cell: (row) => `${displayDate(row?.movie?.releaseDate)}`,
    },
    {
      name: "Amount Collected",
      selector: (row) => row?.totalAmountCollected,
      cell: (row) => getCurrencyFormat(row?.totalAmountCollected),
      sortable: true,
    },
    {
      name: "Booked Seats",
      selector: (row) => row?.bookedSeats,
    },
    {
      name: "Reserved Seats",
      selector: (row) => row?.reservedSeats,
    },
  ];
  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        className={className}
        pagination
        progressPending={isLoading}
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
  );
};

export default DataTableMoviesReports;
