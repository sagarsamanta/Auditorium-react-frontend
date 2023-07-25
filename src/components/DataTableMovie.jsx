"use client";
import Axios from "../lib/axiosInstance";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../lib/consts";
import { displayDate } from "../lib/utils";
import { Link } from "react-router-dom";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const DataTableMovie = ({ data, className }) => {
    const [moviesList, setMoviesList] = useState(data);
    const authUser = useSelector((state) => state.auth);
    const handleMovieStatusChange = (event, currentStatus, row) => {
        console.log("row", row);
        const newStatus =
            row.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE;

        Axios('PUT', `movie/chnageMovieStatus/${row._id}`, { status: newStatus }, { authRequest: true, token: authUser?.token })
            .then((res) => {
                console.log('res', res);
                if (res.data?.movie) {
                    const newMovie = res.data?.movie;
                    const newMovieList = moviesList.map(prevData => {
                        return (prevData._id == newMovie._id) ? { ...prevData, status: newMovie.status } : prevData;
                    });
                    console.log('newMovieList', newMovieList);
                    setMoviesList(newMovieList);
                    toast.success(`Movie updated successfully`);
                }
            })
            .catch(err => {
                if (err?.response?.status === 302) {
                    toast.warning(`${err?.response?.data?.message}`);
                }
                if (err?.response?.status === 500) {
                    toast.error(`${err?.response?.data?.message}`);
                }
                event.target.checked = currentStatus === STATUS_ACTIVE ? true : false;
            });
    }
    const columns = [
        {
            name: 'Title',
            selector: row => <Link href={`/admin/movies/${row._id}`} className="underline text-blue-500">{row.title}</Link>,
        },
        {
            name: 'Release Date',
            selector: row => `${displayDate(row.releaseDate)}`,
        },
        {
            name: 'Show Times',
            selector: row => <Link href={`/admin/shows?movie=${row._id}`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 bg-blue-300 hover:bg-blue-400">All Show</Link>,
        },
        {
            name: "Enable",
            selector: (row) => (
                <button
                    title={`${row.status === STATUS_ACTIVE
                        ? "Deactive this movie"
                        : "Active this movie"
                        } `}
                    name={`enable-movie--${row._id}`}
                    className={`text-xs ${row.status === STATUS_ACTIVE ? "bg-green-300 hover:bg-green-600 hover:text-white" : "bg-yellow-300 hover:bg-yellow-600 hover:text-white"
                        } inline-block py-2 px-4 rounded-lg transition duration-200 text-black cursor-pointer w-24`}
                    defaultChecked={row.status === STATUS_ACTIVE ? true : false}
                    onClick={(e) => handleMovieStatusChange(e, row.status, row)}
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
                data={moviesList}
                className={className}
            />
        </>
    )
}

export default DataTableMovie;
