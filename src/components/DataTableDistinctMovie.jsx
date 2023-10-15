import { useState } from "react";
import { displayDate } from "../lib/utils";
import { CustomDataTable as DataTable } from "./DataTable";
import { useAuth } from "../lib/hooks/useAuth";
import SearchBox from "./UI/SearchBox";
import Modal from "./UI/Modal";
import { Link } from "react-router-dom";
import { RiExternalLinkLine } from "react-icons/ri";
import { STATUS_ACTIVE } from "../lib/consts";
const DataTableDistinctMovie = ({ data, className }) => {
  const [moviesList, setMoviesList] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    movie: "",
    show: false,
  });
  const { token } = useAuth();

  const columns = [
    {
      name: "Title",
      sortable: true,
      selector: (row) => row.title,
      cell: (row) => (
        <Link
          to={`/admin/movies-by-title?title=${row.title}`}
          className="flex justify-normal items-center gap-2 group hover:underline hover:text-skin-base"
        >
          {row.title}{" "}
          <RiExternalLinkLine className="transition opacity-0 group-hover:opacity-100" />
        </Link>
      ),
    },
    {
      name: "No.Of Realese Count",
      maxWidth: "200px",
      sortable: true,
      selector: (row) => row.count,
      cell: (row) => <span className="text-center">{row.count}</span>,
    },
    {
      name: "Status",
      maxWidth: "200px",
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              row.status === STATUS_ACTIVE ? "bg-green-700" : "bg-red-700"
            }`}
          />
          <span
            className={` font-semibold ${
              row.status === STATUS_ACTIVE ? "text-green-700" : "text-red-700"
            }`}
          >
            {row.status}
          </span>
        </div>
      ),
    },
  ];
  return (
    <>
      <SearchBox
        data={data}
        setData={setMoviesList}
        setIsLoading={setIsLoading}
      />
      <DataTable
        columns={columns}
        data={moviesList}
        className={className}
        pagination
        paginationPerPage={20}
        loading={true}
        title="All Movies List"
        progressPending={isLoading}
      />
    </>
  );
};

export default DataTableDistinctMovie;
