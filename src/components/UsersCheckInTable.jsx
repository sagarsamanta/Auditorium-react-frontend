import { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SearchBox from "./UI/SearchBox";
import Axios from "../lib/axiosInstance";
import Clipboard from "clipboard";
import { displayDate, displayTime } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";

import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-toastify";
import { BOOKING_STATUS, SEATS_STATUS } from "../lib/consts";
import { TbTicketOff } from "react-icons/tb";
const UsersCheckInTable = ({ show, showStartTime }) => {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { token } = useAuth();

    const chnageSeatsStatus = (id, status) => {
        Axios(
            "PUT",
            `booking/seats-status/${id}`,
            { newStatus: status },
            { authRequest: true, token: token }
        )
            .then((res) => {
                if (res.status === 200) {
                    const updatedBookings = data.map((booking) => {
                        if (booking.bookingId === id) {
                            console.log(booking.bookingId, id);
                            return { ...booking, status: res?.data?.status };
                        }
                        return booking;
                    });
                    setData(updatedBookings);
                }
            })
            .finally(() => { })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        setLoading(true);
        Axios("GET", `booking/all-booked-seats/${show?._id}`, null, {
            authRequest: true,
            token: token,
        })
            .then((res) => {
                setData(res.data?.data);
                console.log(res.data);
                setTempData(res.data?.data);
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
            name: "Seat No",
            selector: (row) => <div className="text-lg font-semibold text-red-500">{row?.seatNo}</div>,
        },
        {
            name: 'Mark As Visited',
            minWidth:'150px',
            cell: (row) => (
                <>
                    <button
                        className={`shadow transition duration-300 ease-in-out bg-red-600 hover:bg-red-600/80 focus:shadow-outline focus:outline-none text-white py-2 px-4 rounded disabled:opacity-50`}
                        onClick={() => chnageSeatsStatus(row)}
                        title='Cancel Ticket'
                        disabled={row.status !== BOOKING_STATUS.BOOKED}
                    >
                        <TbTicketOff size={15} />
                    </button>
                </>
            ),
        },
        {
            name: "Seats Status",
            minWidth: "300px",
            cell: (row) => {
                return (
                    <div className="flex flex-wrap gap-2">
                        {
                            <div className="flex gap-[2px] justify-center items-center ">
                                <div className={`${row.status === SEATS_STATUS.BOOKED && 'bg-red-400 p-2 rounded-sm'} ${row.status === SEATS_STATUS.VISITED && 'bg-green-500 p-2 rounded-sm'}`}>{row?.status}</div>
                            </div>
                        }
                    </div>
                );
            },
        },
       
        {
            name: "Booking Id",
            selector: (row) => (
                <div
                    className="flex gap-1 text-red-600 font-semibold cursor-pointer items-center"
                >
                    <span>{row?.bookingId?.bookingId}</span>
                </div>
            ),
        },
        {
            name: "Payment Mode",
            sortable: true,
            selector: (row) => <div>{row?.bookingId?.paymentMode}</div>,
        },
        {
            name: "Booked User",
            selector: (row) => row.userId?.name,
        },
        {
            name: "Amount",
            sortable: true,
            selector: (row) => (
                <div className="text-green-600">₹ {row?.price}</div>
            ),
        },
        {
            name: "EmpId",
            minWidth: "200px",
            selector: (row) => row?.userId?.empId,
        },
       
        // {
        //     name: "Status",
        //     selector: (row) => row.status,
        //     cell: (row) => (
        //         <div className="space-x-4 flex justify-center">
        //             <div
        //                 className={`${row.status === BOOKING_STATUS.VISITED &&
        //                     "bg-green-400 text-black "
        //                     } ${row.status === BOOKING_STATUS.BOOKED &&
        //                     "bg-yellow-300 text-black "
        //                     } ${row.status === BOOKING_STATUS.CANCEL && "bg-red-400 text-black"
        //                     } p-2 rounded-lg transition duration-200 border text-center `}
        //             >
        //                 {row?.status}
        //             </div>
        //         </div>
        //     ),
        // },

        // {
        //     name: "Actions",
        //     minWidth: "150px",
        //     cell: (row) => (
        //         <div className="space-x-4 flex justify-center">
        //             <button
        //                 disabled={row.status === BOOKING_STATUS.CANCEL}
        //                 onClick={() => {
        //                     const status =
        //                         row.status === BOOKING_STATUS.VISITED
        //                             ? BOOKING_STATUS.BOOKED
        //                             : BOOKING_STATUS.VISITED;
        //                     chnageBookingStatus(row?.bookingId, status);
        //                 }}
        //                 className={`${row.status === BOOKING_STATUS.VISITED &&
        //                     "border-red-400 text-red-700 hover:bg-red-500 hover:text-white "
        //                     }  ${row.status === BOOKING_STATUS.BOOKED &&
        //                     "border-green-600 text-green-700 hover:bg-green-300 disabled:opacity-50 hover:text-black "
        //                     } p-2 disabled:opacity-50 rounded-lg transition duration-200 border  text-center`}
        //             >
        //                 {row.status === BOOKING_STATUS.VISITED
        //                     ? "Mark As Booked"
        //                     : "Mark As Visited"}
        //             </button>
        //         </div>
        //     ),
        // },
    ];
   
    return (
        <>
            <SearchBox
                placeholder="Enter Seat No."
                data={tempData}
                setIsLoading={setLoading}
                setData={setData}
                filterKey='seatNo'

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
        </>
    );
};

export default UsersCheckInTable;
