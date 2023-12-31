import { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SearchBox from "./UI/SearchBox";
import Axios from "../lib/axiosInstance";
import { displayDate, displayTime, getCurrencyFormat } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";

import { BOOKING_STATUS, PAYMENTS_STATUS, SEATS_STATUS } from "../lib/consts";
const LiveBookingsTable = ({ show, showStartTime, setTotalAmountCollectedOnShow }) => {
  const [data, setData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { token } = useAuth();


  useEffect(() => {
    setLoading(true);
    Axios("GET", `show/show-info/${show?._id}`, null, {
      authRequest: true,
      token: token,
    })
      .then((res) => {
        setData(res.data?.bookings);
        setTempData(res.data?.bookings);
        setTotalAmountCollectedOnShow(res?.data?.amountCollectedOnShow);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [show]);


  const columns = [
    {
      name: <>Name</>,
      selector: (row) => row.user?.name,
    },
    {
      name: <>Booking Id</>,
      selector: (row) => (
        <div
          className="flex gap-1 text-red-600 font-semibold cursor-pointer items-center"
        >
          <span>{row.bookingId}</span>
        </div>
      ),
    },
    {
      name: <>Time</>,
      sortable: true,
      selector: (row) => `${displayTime(showStartTime)}`,
    },
    {
      name: <>Amount</>,
      sortable: true,
      selector: (row) => (
        <div className="text-green-600">
          {getCurrencyFormat(row.totalPrice)}
        </div>
      ),
    },
    {
      name: <>Payment Mode</>,
      minWidth: "200px",
      selector: (row) => row?.paymentMode,
    },
    {
      name: <>Payment Status</>,
      minWidth: "200px",
      selector: (row) => (
        <div
          className={`${row?.paymentStatus === PAYMENTS_STATUS.SUCCESS && "text-green-700"
            } ${row?.paymentStatus === PAYMENTS_STATUS.REFUND_REQUESTED &&
            "text-yellow-400"
            }
          ${row?.paymentStatus === PAYMENTS_STATUS.FAILED &&
            "text-red-400"
            }
          font-semibold `}
        >
          {row?.paymentStatus}
        </div>
      ),
    },
    {
      name: <>Booking Status</>,
      minWidth: "200px",
      selector: (row) => (
        <div
          className={`${row?.status === BOOKING_STATUS.BOOKED && "text-green-700"
            } ${row?.status === BOOKING_STATUS.CANCEL && "text-red-600"
            } font-semibold `}
        >
          {row?.status}
        </div>
      ),
    },
    {
      name: <>Booked seats & Status</>,
      minWidth: "300px",
      cell: (row) => {
        return (
          <div className="flex flex-wrap gap-2">
            {row?.seats?.length === 0 && <div>No Record to show</div>}
            {row?.seats?.map((seat) => (
              <div className="flex gap-[2px] justify-center items-center ">
                <span
                  className={`${seat.status === SEATS_STATUS.BOOKED &&
                    "bg-green-400 p-1 rounded-md"
                    } ${seat.status === SEATS_STATUS.VISITED &&
                    "bg-yellow-600 text-white p-1 rounded-lg"
                    } font-semibold`}
                >
                  {seat?.seatNo}
                </span>
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <SearchBox
        placeholder="Enter booking id ....."
        data={tempData}
        setIsLoading={setLoading}
        setData={setData}
      />
      <DataTable
        columns={columns}
        data={data}
        // className={className}
        pagination
        paginationPerPage={20}
        title="Shows All Bookings"
        progressPending={isLoading}
      />
    </>
  );
};

export default LiveBookingsTable;
