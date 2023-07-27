import { useEffect, useState } from "react";
import Axios from "../lib/axiosInstance";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../lib/consts";
import DataTable from "react-data-table-component";
import { useAuth } from "../lib/hooks/useAuth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEdit } from "react-icons/ai";
import { MdAirlineSeatReclineExtra } from "react-icons/md";

const DataTableShow = ({ data, movieId, className }) => {
    const { token } = useAuth();
    const [showsData, setShowsData] = useState(data);
    const handleShowStatusChange = (row) => {
        const newStatus = row.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE;

        Axios('PUT', `show/chnageShowStatus/${movieId}/${row._id}`, { status: newStatus }, { authRequest: true, token: token })
            .then((res) => {
                if (res.data?.show) {
                    const newShow = res.data?.show;
                    const newShowList = showsData.map(prevData => {
                        return (prevData.title == newShow.title) ? { ...prevData, status: newShow.status } : prevData;
                    });
                    setShowsData(newShowList);
                    toast.success(`${newShow.title} status changed to ${newShow.status}`)
                }
            }).catch(err => {
                toast.error(`${err.message}`);
            });
    }
    const columns = [
        {
            name: 'Show',
            selector: row => row.title,
        },
        {
            name: 'Start Time',
            selector: row => row.showStartTime,
        },
        {
            name: 'End Time',
            selector: row => row.showEndTime,
        },
        {
            name: 'Action',
            cell: row => (
                <div className="space-x-4">
                    <Link to={`/admin/shows/edit-show?showId=${row._id}&showTitle=${row.title}&movieId=${movieId}`} className="text-lg inline-block py-2 px-4 rounded-lg transition duration-200 border border-blue-600 text-center text-blue-600 font-serif hover:bg-blue-600 hover:text-white"><AiOutlineEdit /></Link>

                    {(row?.status === STATUS_ACTIVE && row?.showStartTime !== '--:--' && row?.showEndTime !== '--:--') && <Link to={`/admin/shows/edit-show/seats?movieId=${movieId}&showId=${row._id}`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 border border-pink-600 text-pink-600 hover:text-white hover:bg-pink-600 w-20 text-center font-serif"><MdAirlineSeatReclineExtra /></Link>}
                </div>
            ),
        },
        {
            name: "Enable",
            selector: 'status',
            sortable: true,
            cell: (row) => (
                <button
                    title={`${row.status === STATUS_ACTIVE
                        ? "Deactive this show"
                        : "Active this show"
                        } `}
                    name={`enable-show--${row._id}`}
                    className={`text-xs ${row.status === STATUS_ACTIVE ? "bg-green-300 hover:bg-green-600 hover:text-white" : "bg-yellow-300 hover:bg-yellow-600 hover:text-white"
                        } inline-block py-2 px-4 rounded-lg transition duration-200 text-black cursor-pointer w-24`}
                    defaultChecked={row.status === STATUS_ACTIVE ? true : false}
                    onClick={(e) => handleShowStatusChange(row)}
                >
                    {row.status}
                </button>
            ),
        }
    ];

    useEffect(() => {
        setShowsData(data);
    }, [data]);

    return (
        <>
            <DataTable
                columns={columns}
                data={showsData}
                className={className}
            />
        </>
    )
}

export default DataTableShow;