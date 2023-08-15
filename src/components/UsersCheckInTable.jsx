import { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SearchBox from "./UI/SearchBox";
import Axios from "../lib/axiosInstance";
import { CustomDataTable as DataTable } from "./DataTable";

import { MdOutlineVerified } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import { BOOKING_STATUS, SEATS_STATUS } from "../lib/consts";
import Modal from "./UI/Modal";
const UsersCheckInTable = ({ show, showStartTime }) => {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [confirmButtonLoading, setConfirmLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null)
    const { token } = useAuth();

    const handleMarkAsVisited = () => {
        setConfirmLoading(true)
        Axios(
            "PUT",
            `booking/seats-status/${selectedSeat?._id}`,
            { newStatus: SEATS_STATUS.VISITED },
            { authRequest: true, token: token }
        )
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    // Find the index of the updated row in your state
                    const rowIndex = data.findIndex((r) => r._id === selectedSeat._id);

                    if (rowIndex !== -1) {
                        // Create a new copy of the rows array with the updated row
                        const updatedRows = [...data];
                        updatedRows[rowIndex] = { ...selectedSeat, status: SEATS_STATUS.VISITED };

                        // Update the state with the new array
                        setData(updatedRows);
                    }
                    setSelectedSeat(null)
                    setConfirmModal(false)
                    setConfirmLoading(false)
                }
            })
            .finally(() => {
                setSelectedSeat(null)
                setConfirmModal(false)
                setConfirmLoading(false)
            })
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
            selector: (row) => <div className="text-lg font-semibold text-blue-700">{row?.seatNo}</div>,
        },
        {
            name: 'Visited',
            minWidth: '100px',
            cell: (row) => (
                <>
                    <button
                        className={`shadow disabled:cursor-not-allowed transition duration-300 ease-in-out  focus:shadow-outline focus:outline-none rounded disabled:opacity-50 ${row.status === SEATS_STATUS.BOOKED && 'text-red-700 border border-red-700 p-2 rounded-sm'} ${row.status === SEATS_STATUS.VISITED && 'text-green-700 p-2 rounded-sm border border-green-700'}`}
                        onClick={() => {
                            openConfirmModalHandelar()
                            setSelectedSeat(row)
                        }}
                        disabled={row.status !== BOOKING_STATUS.BOOKED}
                    >
                        {row.status === SEATS_STATUS.BOOKED ? <RxCrossCircled size={20} /> : <MdOutlineVerified size={20} />}

                    </button>
                </>
            ),
        },
        {
            name: "Seats Status",
            minWidth: "150px",
            cell: (row) => {
                return (
                    <div className="flex flex-wrap gap-2">
                        {
                            <div className="flex gap-[2px] justify-center items-center font-semibold">
                                <div className={`${row.status === SEATS_STATUS.BOOKED && 'text-red-700 p-2 rounded-lg'} ${row.status === SEATS_STATUS.VISITED && 'text-green-700 p-2  rounded-lg'}`}>{row?.status}</div>
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


    ];
    const openConfirmModalHandelar = () => {
        setConfirmModal(true)
    }
    const closeConfirmModalHandelar = () => {
        setConfirmModal(false)
    }
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
            <Modal
                isOpen={confirmModal}
                closeHandler={closeConfirmModalHandelar}
                config={{
                    title: <span >Make <span className="text-green-500">{selectedSeat?.seatNo}</span> as VISITED !</span>,
                    text: 'This will make the seats stats as VISITED.',
                    buttonText: 'Ok',
                    buttonHandler: handleMarkAsVisited,
                    loading: confirmButtonLoading,
                    buttonClassName: 'bg-red-600 text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed'
                }}
            />
        </>
    );
};

export default UsersCheckInTable;
