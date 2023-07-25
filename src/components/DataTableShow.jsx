"use client"
import Axios from "@/lib/axiosInstance";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "@/lib/consts";
import Link from "next/link";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

const DataTableShow = ({ data, movieId, className }) => {
    const authUser = useSelector((state) => state.auth);
    const [showsData, setShowsData] = useState(data);
    const handleShowStatusChange = (row) => {
        const newStatus = row.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE;

        Axios('PUT', `show/chnageShowStatus/${movieId}/${row._id}`, { status: newStatus }, { authRequest: true, token: authUser?.token })
        .then((res) => {
            if (res.data?.show) {
                const newShow = res.data?.show;
                const newShowList = showsData.map(prevData => {
                    return (prevData.title == newShow.title) ? {...prevData, status: newShow.status} : prevData;
                });
                setShowsData(newShowList);
            }
        })
        .catch(err => {
            console.log('err', err, err.message);
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
            name: 'End Status',
            selector: row => row.showEndTime,
        },
        {
            name: 'Action',
            selector: row => (
                <div className="space-x-4">
                    <Link href={`/admin/shows/edit-show?showId=${row._id}&showTitle=${row.title}&movieId=${movieId}`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 border border-blue-600 w-24 text-center text-blue-600 font-serif hover:bg-blue-600 hover:text-white">Edit</Link>

                    {(row?.status === STATUS_ACTIVE && row?.showStartTime !== '--:--' && row?.showEndTime !== '--:--') && <Link href={`/admin/shows/edit-show/seats?movieId=${movieId}&showId=${row._id}`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 border border-pink-600 text-pink-600 hover:text-white hover:bg-pink-600 w-20 text-center font-serif">Seats</Link>}
                </div>
            ),
        },
        // {
        //     name: 'Enable',
        //     selector: row => (<input title="Enable this show" type="checkbox" name={`enable-show-${row._id}`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 text-skin-inverted bg-skin-base hover:bg-skin-base/80" defaultChecked={row.status === STATUS_ACTIVE ? true : false} disabled={row?.showStartTime === '--:--' && row?.showEndTime === '--:--' ? true : false} onChange={() => handleShowStatusChange(row)} />),
        // },
        {
            name: "Enable",
            selector: (row) => (
              <button
                title={`${
                  row.status === STATUS_ACTIVE
                    ? "Deactive this show"
                    : "Active this show"
                } `}
                name={`enable-show--${row._id}`}
                className={`text-xs ${
                  row.status === STATUS_ACTIVE ? "bg-green-300 hover:bg-green-600 hover:text-white" : "bg-yellow-300 hover:bg-yellow-600 hover:text-white"
                } inline-block py-2 px-4 rounded-lg transition duration-200 text-black cursor-pointer w-24`}
                defaultChecked={row.status === STATUS_ACTIVE ? true : false}
                onClick={(e) => handleShowStatusChange(row)}
              >
                {row.status}
              </button>
            ),
          }
    ];
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