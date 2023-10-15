import { React } from "react";
import { CustomDataTable as DataTable } from "./DataTable";
import { displayDate, displayTime, getCurrencyFormat } from "../lib/utils";
import { useState } from "react";
import TicketModal from "./UI/TicketModal";
import { BOOKING_STATUS, PAYMENTS_STATUS, SEATS_STATUS } from "../lib/consts";
import { TbTicketOff } from "react-icons/tb";
import { IoTicketOutline } from "react-icons/io5";
import Modal from "./UI/Modal";
import Axios from "../lib/axiosInstance";
import { useAuth } from "../lib/hooks/useAuth";
import { toast } from "react-toastify";

const DataTableAdminBookings = ({ data, className }) => {
  const [tableRecords, setTableRecords] = useState(data);
  const [ticket, setTicket] = useState(null);
  const [openTicketModal, setOpenTicketModal] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [isOpenCancelBookingModal, setIsOpenCancelBookingModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const askFormConfirmation = (row) => {
    setIsOpenCancelBookingModal(true);
    setSelectedBookingToCancel(row);
  };

  const handleBookingCancelation = () => {
    setLoading(true);
    Axios("DELETE", `/show/${selectedBookingToCancel?._id}`, null, {
      authRequest: true,
      token: token,
    })
      .then((response) => {
        if (response?.status === 200) {
          toast.success("Booking cancelled successfully");
          const updatedData = tableRecords.map((a) =>
            a._id === selectedBookingToCancel?._id
              ? { ...a, status: BOOKING_STATUS.CANCEL }
              : { ...a }
          );
          setTableRecords(updatedData);
          setIsOpenCancelBookingModal(false);
        }
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error) => {
        // setError(true);
        // toast.error(`${error.message}`);
      });
  };

  const viewTicket = (row) => {
    setTicket({
      title: row?.movie?.title,
      poster: row?.movie?.poster,
      releaseDate: row?.movie?.releaseDate,
      showTitle: row?.showtime?.title,
      showTime: row?.showtime?.showStartTime,
      noOfSeatsBook: row?.seats?.length,
      bookingId: row?.bookingId,
      seatsPriceObj: row?.seats,
      amount: row?.totalPrice,
      language: row?.movie?.language,
    });
    setOpenTicketModal(true);
  };
  const closeTicketModal = () => {
    setOpenTicketModal(false);
  };

  const columns = [
    {
      name: <>Movie Date/time</>,
      minWidth: "200px",
      cell: (row) => (
        <div className="flex gap-[4px]">
          <div>{displayDate(row?.showtime?.movie?.releaseDate)}</div>
          <div>|</div>
          <div> {displayTime(row?.showtime?.showStartTime)}</div>
        </div>
      ),
    },
    {
      name: <>Movie</>,
      minWidth: "200px",
      cell: (row) => <span title={row?.movie?.title}>{row?.movie?.title}</span>,
    },
    {
      name: <>Booking Date</>,
      minWidth: "150px",
      cell: (row) => <div>{displayDate(row?.createdAt)}</div>,
    },

    {
      name: <>Total Seats</>,
      minWidth: "150px",
      cell: (row) => row?.seats.length,
    },
    {
      name: <>Booked seats</>,
      maxWidth: "350px",
      minWidth: "150px",
      cell: (row) => {
        return (
          <div className="w-full">
            <div className="w-max flex items-center gap-2">
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
      name: <>Total Amount</>,
      minWidth: "150px",
      sortable: true,
      selector: (row) => row?.totalPrice,
      cell: (row) => getCurrencyFormat(row?.totalPrice),
    },
    {
      name: <>Paymeny Mode</>,
      minWidth: "150px",
      cell: (row) => <div>{row?.paymentMode}</div>,
    },
    {
      name: "Status",
      minWidth: "100px",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Booked For",
      minWidth: "150px",
      selector: (row) => row?.user?.name,
    },
    {
      name: "Booked By",
      minWidth: "150px",
      selector: (row) => row?.bookedBy?.name,
    },
    {
      name: <>Payment Status</>,
      minWidth: "150px",
      selector: (row) => (
        <div
          className={`${
            row?.paymentStatus === PAYMENTS_STATUS.SUCCESS && "text-green-700"
          } ${
            row?.paymentStatus === PAYMENTS_STATUS.REFUND_REQUESTED &&
            "text-yellow-400"
          } 
                ${
                  row?.paymentStatus === PAYMENTS_STATUS.FAILED &&
                  "text-red-400"
                } 
                font-semibold `}
        >
          {row?.paymentStatus}
        </div>
      ),
    },

    {
      name: "Ticket",
      minWidth: "100px",
      cell: (row) => (
        <>
          <button
            className={`shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded disabled:opacity-50`}
            onClick={() => viewTicket(row)}
            disabled={row.status !== BOOKING_STATUS.BOOKED}
            title="View Ticket"
          >
            <IoTicketOutline size={15} />
          </button>
        </>
      ),
    },
    {
      name: <>Cancel Ticket</>,
      minWidth: "100px",
      cell: (row) => (
        <>
          <button
            className={`shadow transition duration-300 ease-in-out bg-red-600 hover:bg-red-600/80 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={() => askFormConfirmation(row)}
            title="Cancel Ticket"
            disabled={
              row.status !== BOOKING_STATUS.BOOKED || !row?.movie?.isRefundable
            }
          >
            <TbTicketOff size={15} />
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <DataTable
        columns={columns}
        data={tableRecords}
        className={className}
        pagination
      />

      {/* Modals */}
      {openTicketModal && (
        <TicketModal
          isOpen={openTicketModal}
          closeHandler={closeTicketModal}
          ticket={ticket}
        />
      )}

      <Modal
        isOpen={isOpenCancelBookingModal}
        closeHandler={setIsOpenCancelBookingModal}
        config={{
          title: `Cancel this show for "${selectedBookingToCancel?.movie?.title}"`,
          text: "This will cancel your booking for the show",
          buttonText: "Cancel Booking",
          buttonHandler: handleBookingCancelation,
          loading: loading,
          buttonClassName:
            "bg-red-600 text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed",
        }}
      />
    </>
  );
};

export default DataTableAdminBookings;
