import { useState } from "react";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../lib/consts";
import { displayDate } from "../lib/utils";
import { Link } from "react-router-dom";
import { CustomDataTable as DataTable } from "./DataTable";
import { toast } from "react-toastify";
import { useAuth } from "../lib/hooks/useAuth";
import Axios from "../lib/axiosInstance";
import { AiOutlineDelete } from 'react-icons/ai'
import { MdEdit } from "react-icons/md";
import { BiHide } from "react-icons/bi";

const DataTableMovie = ({ data, className }) => {
    const [moviesList, setMoviesList] = useState(data);
    const { token } = useAuth();
    const handleMovieStatusChange = (event, currentStatus, row) => {
        const newStatus = row.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE;

        Axios('PUT', `movie/chnageMovieStatus/${row._id}`, { status: newStatus }, { authRequest: true, token: token })
            .then((res) => {
                if (res.data?.movie) {
                    const newMovie = res.data?.movie;
                    const newMovieList = moviesList.map(prevData => {
                        return (prevData._id === newMovie._id) ? { ...prevData, status: newMovie.status } : prevData;
                    });
                    setMoviesList(newMovieList);
                    toast.success(`Movie updated successfully`);
                }
            })
            .catch(err => {
                if (err?.response?.status === 302) {
                    console.log(`${err?.response?.data?.message}`);
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
            selector: row => row.title,
        },
        {
            name: 'Release Date',
            sortable: true,
            selector: row => `${displayDate(row.releaseDate)}`,
        },
        {
            name: 'Show Times',
            cell: row => <Link to={`/admin/shows?movie=${row._id}`} className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200 bg-blue-300 hover:bg-blue-400 border border-blue-500">All Show</Link>,
        },
        {
            name: "Enable",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <button
                    title={`${row.status === STATUS_ACTIVE
                        ? "Deactive this movie"
                        : "Active this movie"
                        } `}
                    name={`enable-movie--${row._id}`}
                    className={`text-xs ${row.status === STATUS_ACTIVE ? "bg-green-300 hover:bg-green-600 hover:text-white" : "bg-yellow-300 hover:bg-yellow-600 hover:text-white"
                        } inline-block py-2 px-4 rounded-lg transition duration-200 text-black cursor-pointer w-24 border border-gray-400`}
                    defaultChecked={row.status === STATUS_ACTIVE ? true : false}
                    onClick={(e) => handleMovieStatusChange(e, row.status, row)}
                >
                    {row.status}
                </button>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="space-x-4">
                    <Link to={`/admin/movies/${row._id}`} className="inline-block p-2 rounded-lg transition duration-200 border border-skin-base text-center text-skin-base font-serif hover:bg-skin-base hover:text-white" title="Edit"><MdEdit size={15} /></Link>
                    <Link to={`/admin/movies/${row._id}`} className="hidden p-2 rounded-lg transition duration-200 border border-red-500 text-center text-red-500 font-serif hover:bg-red-500 hover:text-white" title="Remove"><AiOutlineDelete size={15} /></Link>
                </div>
            ),
        }
    ];
    return (
        <>
            <DataTable
                columns={columns}
                data={moviesList}
                className={className}
                pagination
            />
        </>
    )
}

export default DataTableMovie;
