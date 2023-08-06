import { useEffect, useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SearchBox from "./UI/SearchBox";
import Axios from "../lib/axiosInstance";
import Clipboard from "clipboard";
import { displayDate } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";

import { AiOutlineCopy } from 'react-icons/ai'
import { toast } from "react-toastify";
const UsersCheckInTable = ({ show, showStartTime }) => {
    const [data, setData] = useState([])
    const [tempData, setTempData] = useState([])
    const [isLoading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        setLoading(true);
        Axios('GET', `show/show-info/${show?._id}`, null, { authRequest: true, token: token })
            .then((res) => {
                setData(res.data?.bookings);
                setTempData(res.data?.bookings);
                console.log(res?.data?.bookings);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });

    }, [show]);
    // Function to handle copy button click
    const handleCopyClick = (event, bookingId) => {
        // Copy the bookingId to the clipboard
        const clipboard = new Clipboard('.copy-button', {
            text: () => bookingId
        });

        // Trigger the copy action
        clipboard.onClick(event);
        toast.success("Copied")
    };

    const columns = [
        {
            name: 'user',
            selector: row => row.user,
        },
        {
            name: 'Booking Id',
            selector: row => (
                <div className="flex gap-1 cursor-pointer items-center" onClick={(e) => handleCopyClick(e, row.bookingId)}>
                    <span>{row.bookingId}</span>
                    <AiOutlineCopy title="Copy" className="copy-button" >Copy</AiOutlineCopy>
                </div>
            ),
        },
        {
            name: 'Time',
            sortable: true,
            selector: row => `${displayDate(showStartTime)}`,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },

        {
            name: 'Actions',
            minWidth:'150px',
            cell: row => (
                <div className="space-x-4 flex justify-center">
                    <button  className="p-2 rounded-lg transition duration-200 border border-red-500 text-center text-red-500 font-serif hover:bg-red-500 hover:text-white" title="Remove">Mark As Verified</button>
                </div>
            ),
        },
    ];

    return (
        <>
            <SearchBox placeholder="Enter booking id ....." data={tempData} setIsLoading={setLoading} setData={setData} />
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
    )
}

export default UsersCheckInTable;
