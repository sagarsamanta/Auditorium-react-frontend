import { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SearchBox from "./UI/SearchBox";
import Axios from "../lib/axiosInstance";
import { CustomDataTable as DataTable } from "./DataTable";

import { MdOutlineVerified } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  BOOKING_STATUS,
  PAYMENTS_STATUS,
  PAYMENT_METHOS,
  SEATS_STATUS,
} from "../lib/consts";
import Modal from "./UI/Modal";
import { displayDate } from "../lib/utils";
const UsersCheckInTable = ({ show, showStartTime }) => {
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [confirmButtonLoading, setConfirmLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showRecord,setShowRecords]=useState()
  const { token } = useAuth();

  const handleMarkAsVisited = () => {
    setConfirmLoading(true);
    Axios(
      "PUT",
      `booking/seats-status/${selectedSeat?._id}`,
      { newStatus: SEATS_STATUS.VISITED },
      { authRequest: true, token: token }
    )
      .then((res) => {
        if (res.status === 200) {
          // Find the index of the updated row in your state
          const rowIndex = data.findIndex((r) => r._id === selectedSeat._id);

          if (rowIndex !== -1) {
            // Create a new copy of the rows array with the updated row
            const updatedRows = [...data];
            updatedRows[rowIndex] = {
              ...selectedSeat,
              status: SEATS_STATUS.VISITED,
            };

            // Update the state with the new array
            setData(updatedRows);
          }
          setSelectedSeat(null);
          setConfirmModal(false);
          setConfirmLoading(false);
        }
      })
      .finally(() => {
        setSelectedSeat(null);
        setConfirmModal(false);
        setConfirmLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBookedSeats = () => {
    setLoading(true);
    Axios("GET", `booking/all-booked-seats/${show?._id}`, null, {
      authRequest: true,
      token: token,
    })
      .then((res) => {
        setData(res.data?.data);
        setTempData(res.data?.data);
        console.log(res.data.record);
        setShowRecords(res?.data?.record)
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setInterval(() => {
      getBookedSeats();
    }, 5 * 60000); //1 minute = 60,000 milliseconds
    getBookedSeats();
  }, [show]);
  const handleRequestUpdatePayStatus = (clientTxnId, bookingId) => {
    let requestedData = {
      clientTxnId,
      bookingId,
    };
    Axios(
      "POST",
      `payment/transactionEnquery`,
      { ...requestedData },
      { authRequest: true, token: token }
    )
      .then((res) => {
        if (res.status === 200) {
          const { status, sabpaisaMessage, bankMessage } = res.data;
          const rowIndex = data.findIndex(
            (r) => r.bookingId.bookingId === bookingId
          );
          if (rowIndex !== -1) {
            const updatedRows = [...data];
            updatedRows[rowIndex] = {
              ...updatedRows[rowIndex],
              bookingId: {
                ...updatedRows[rowIndex].bookingId,
                paymentStatus: status,
                bankMessage,
                sabpaisaMessage,
              },
            };
            setData(updatedRows);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const columns = [
    {
      name: <>Seat No</>,
      selector: (row) => (
        <div className="text-lg font-semibold text-blue-700">{row?.seatNo}</div>
      ),
    },
    {
      name: <>Visited</>,
      minWidth: "100px",
      cell: (row) => (
        <>
          <button
            className={`shadow disabled:cursor-not-allowed transition duration-300 ease-in-out  focus:shadow-outline focus:outline-none rounded disabled:opacity-50 ${
              row.status === SEATS_STATUS.BOOKED &&
              "text-red-700 border border-red-700 p-2 rounded-sm"
            } ${
              row.status === SEATS_STATUS.VISITED &&
              "text-green-700 p-2 rounded-sm border border-green-700"
            }`}
            onClick={() => {
              openConfirmModalHandelar();
              setSelectedSeat(row);
            }}
            disabled={row.status !== BOOKING_STATUS.BOOKED}
          >
            {row.status === SEATS_STATUS.BOOKED ? (
              <RxCrossCircled size={20} />
            ) : (
              <MdOutlineVerified size={20} />
            )}
          </button>
        </>
      ),
    },
    {
      name: <>Seats Status</>,
      minWidth: "150px",
      cell: (row) => {
        return (
          <div className="flex flex-wrap gap-2">
            {
              <div className="flex gap-[2px] justify-center items-center font-semibold">
                <div
                  className={`${
                    row.status === SEATS_STATUS.BOOKED &&
                    "text-red-700 p-2 rounded-lg"
                  } ${
                    row.status === SEATS_STATUS.VISITED &&
                    "text-green-700 p-2  rounded-lg"
                  }`}
                >
                  {row?.status}
                </div>
              </div>
            }
          </div>
        );
      },
    },

    {
      name: "Booking Id",
      minWidth: "150px",
      selector: (row) => (
        <div className="flex gap-1 text-red-600 font-semibold cursor-pointer items-center">
          <span>{row?.bookingId?.bookingId}</span>
        </div>
      ),
    },
    {
      name: "Payment Mode",
      minWidth: "180px",
      sortable: true,
      selector: (row) => <div>{row?.bookingId?.paymentMode}</div>,
    },
    {
      name: <>Payment Status</>,
      minWidth: "200px",
      cell: (row) => (
        <div className="flex gap-2 justify-center items-center font-bold">
          <div
            className={`${
              row?.bookingId?.paymentStatus === PAYMENTS_STATUS.INITIATED &&
              "text-yellow-400   p-2 rounded-sm"
            } ${
              row?.bookingId?.paymentStatus === PAYMENTS_STATUS.SUCCESS &&
              "text-green-700 p-2 rounded-sm "
            }
            
            ${
              row?.bookingId?.paymentStatus === PAYMENTS_STATUS.FAILED &&
              "text-red-500 p-2 rounded-sm "
            }
            ${
              row?.bookingId?.paymentStatus ===
                PAYMENTS_STATUS.REFUND_REQUESTED &&
              "text-yellow-500 p-2 rounded-sm "
            }
            `}
          >
            {row?.bookingId?.paymentStatus}
          </div>
          {row?.bookingId?.paymentMode !== PAYMENT_METHOS.CASH &&
            row?.bookingId?.paymentStatus === PAYMENTS_STATUS.INITIATED && (
              <button
                className="border border-gray-400 p-2 rounded-md"
                onClick={() => {
                  handleRequestUpdatePayStatus(
                    row?.bookingId?.clientTxnId,
                    row?.bookingId?.bookingId
                  );
                }}
              >
                <HiOutlineRefresh />
              </button>
            )}
        </div>
      ),
    },
    {
      name: "Booked User",
      minWidth: "150px",
      selector: (row) => row.userId?.name,
    },
    {
      name: "Amount",
      minWidth: "120px",
      sortable: true,
      selector: (row) => <div className="text-green-700">₹ {row?.price}</div>,
    },
    {
      name: "Paid Amount",
      minWidth: "160px",
      sortable: true,
      selector: (row) => (
        <div className="text-green-700">₹ {row?.paidAmount || row?.price}</div>
      ),
    },
    {
      name: "Guest Name",
      minWidth: "200px",
      selector: (row) => <>{row?.guestName ? row?.guestName : "--"}</>,
    },
    {
      name: "Guest Children Count",
      minWidth: "200px",
      selector: (row) => <>{row?.guestChildren ? row?.guestChildren : "--"}</>,
    },
    {
      name: "Guest Mobile No",
      minWidth: "200px",
      selector: (row) => row?.guestMobile,
      selector: (row) => <>{row?.guestMobile ? row?.guestMobile : "--"}</>,
    },
    {
      name: "EmpId",
      minWidth: "200px",
      selector: (row) => row?.userId?.empId,
    },
    {
      name: "Bank Name",
      minWidth: "200px",
      selector: (row) =>
        row?.bookingId?.paymentMode !== PAYMENT_METHOS.CASH
          ? row?.bookingId?.bankName
          : "--",
    },
    {
      name: "Bank Message",
      minWidth: "200px",
      selector: (row) =>
        row?.bookingId?.paymentMode !== PAYMENT_METHOS.CASH
          ? row?.bookingId?.bankMessage
          : "--",
    },
    {
      name: "Trasaction Date",
      minWidth: "200px",
      selector: (row) =>
        row?.bookingId?.paymentMode 
          ? displayDate(row?.bookingId?.transDate) ||
            displayDate(row?.createdAt)
          : "--",
    },
  ];
  const openConfirmModalHandelar = () => {
    setConfirmModal(true);
  };
  const closeConfirmModalHandelar = () => {
    setConfirmModal(false);
  };
  return (
    <>
    <div className="flex gap-1 lg:gap-2 my-3">
      <div  className="font-semibold">Booked  - <sapn className="text-blue-700">{showRecord?.numTotalBookedSeats || 0}</sapn></div>
      <div className="font-semibold">Visited - <sapn className="text-green-600">{showRecord?.numVisitedSeats || 0}</sapn></div>
      <div className="font-semibold">Non-Visited  - <sapn className="text-red-700">{showRecord?.numBookedSeats || 0}</sapn></div>
      <div className="font-semibold">Reserved  - <sapn className="text-yellow-500">{showRecord?.numReservedSeats || 0}</sapn></div>

    </div>
      <SearchBox
        placeholder="Enter Seat No."
        data={tempData}
        setIsLoading={setLoading}
        setData={setData}
        filterKey="seatNo"
      />
      <DataTable
        columns={columns}
        data={data}
        // className={className}
        pagination
        paginationPerPage={20}
        title="All Booked seats"
        progressPending={isLoading}
      />
      <Modal
        isOpen={confirmModal}
        closeHandler={closeConfirmModalHandelar}
        config={{
          title: (
            <span>
              Make{" "}
              <span className="text-green-500">{selectedSeat?.seatNo}</span> as
              VISITED !
            </span>
          ),
          text: "This will make the seats status as VISITED.",
          buttonText: "Ok",
          buttonHandler: handleMarkAsVisited,
          loading: confirmButtonLoading,
          buttonClassName:
            "bg-red-600 text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed",
        }}
      />
    </>
  );
};

export default UsersCheckInTable;
