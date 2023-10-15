import { useEffect, useState } from "react";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../lib/consts";
import { displayDate, isPastDate } from "../lib/utils";
import { Link } from "react-router-dom";
import { CustomDataTable as DataTable } from "./DataTable";
import { toast } from "react-toastify";
import { useAuth } from "../lib/hooks/useAuth";
import Axios from "../lib/axiosInstance";
import { AiOutlineDelete } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import SearchBox from "./UI/SearchBox";
import Modal from "../components//UI/Modal";
const DataTableMovie = ({ data, className }) => {
  const [moviesList, setMoviesList] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    movie: "",
    show: false,
  });
  const { token } = useAuth();

  const handleMovieStatusChange = (event, currentStatus, row) => {
    const newStatus =
      row.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE;
    Axios(
      "PUT",
      `movie/chnageMovieStatus/${row._id}`,
      { status: newStatus },
      { authRequest: true, token: token }
    )
      .then((res) => {
        if (res.data?.movie) {
          const newMovie = res.data?.movie;
          const newMovieList = moviesList.map((prevData) => {
            return prevData._id === newMovie._id
              ? { ...prevData, ...newMovie }
              : prevData;
          });
          setMoviesList(newMovieList);
          toast.dismiss();
          toast.success(`Movie updated successfully`);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 302) {
          toast.warning(`${err?.response?.data?.message}`);
        }
        if (err?.response?.status === 500) {
          toast.error(`${err?.response?.data?.message}`);
        }
        event.target.checked = currentStatus === STATUS_ACTIVE ? true : false;
      });
  };
  useEffect(() => {
    // Update ticket status checkboxes when moviesList changes
    setIsLoading(true);
    if (moviesList.length > 0) {
      setIsLoading(false);
    }
  }, [moviesList]);

  const onOkConfirmDelete = () => {
    closeConfirmModal();
  };
  const confirmConfig = {
    title: "Are you sure you want to remove this movie ?",
    buttonText: "Ok",
    text: showDeleteConfirm ? `Movie Name : ${showDeleteConfirm.movie}` : "",
    buttonHandler: onOkConfirmDelete,
  };
  const handeMovieRefundStatusChange = (id, value) => {
    Axios(
      "PUT",
      `movie/chnage-properties/${id}`,
      { isRefundable: value },
      { authRequest: true, token: token }
    )
      .then((res) => {
        if (res.status === 200 && res.data) {
          const newMovie = res.data;
          const newMovieList = moviesList.map((prevData) => {
            return prevData._id === newMovie._id
              ? { ...prevData, ...newMovie }
              : prevData;
          });
          setMoviesList(newMovieList);
          toast.dismiss();
          toast.success(
            value ? "Money Refund is allowed!" : "Money Refund is canceled."
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status === 302) {
          toast.warning(`${err?.response?.data?.message}`);
        }
        if (err?.response?.status === 500) {
          toast.error(`${err?.response?.data?.message}`);
        }
      });
  };
  const handeMovieTicketStatusChange = (id, value) => {
    Axios(
      "PUT",
      `movie/chnage-properties/${id}`,
      { isAllowTicketBooking: value },
      { authRequest: true, token: token }
    )
      .then((res) => {
        if (res.status === 200 && res.data) {
          const newMovie = res.data;
          const newMovieList = moviesList.map((prevData) => {
            return prevData._id === newMovie._id
              ? { ...prevData, ...newMovie }
              : prevData;
          });
          setMoviesList(newMovieList);
          toast.dismiss();
          toast.success(
            value ? "Tickets are released!" : "Ticket release is canceled."
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status === 302) {
          toast.warning(`${err?.response?.data?.message}`);
        }
        if (err?.response?.status === 500) {
          toast.error(`${err?.response?.data?.message}`);
        }
      });
  };
  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Release Date",
      minWidth: "150px",
      sortable: true,
      selector: (row) => `${displayDate(row.releaseDate)}`,
    },
    {
      name: "Show Times",
      minWidth: "150px",
      cell: (row) => (
        <Link
          to={`/admin/shows?movie=${row._id}`}
          className="text-xs inline-block py-2 px-4 rounded-lg transition duration-200  font-semibold border border-blue-800 text-blue-800 hover:text-white hover:bg-blue-700"
        >
          All Shows
        </Link>
      ),
    },
    {
      name: "Enable",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "150px",
      cell: (row) => (
        <button
          title={`${
            row.status === STATUS_ACTIVE
              ? "Deactive this movie"
              : "Active this movie"
          } `}
          name={`enable-movie--${row._id}`}
          className={`text-xs ${
            row.status === STATUS_ACTIVE
              ? "border border-green-700 hover:bg-green-800 text-green-800 hover:text-white"
              : "border text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
          } inline-block py-2 px-4 rounded-lg transition duration-200 text-black cursor-pointer w-28 font-semibold`}
          defaultChecked={row.status === STATUS_ACTIVE ? true : false}
          onClick={(e) => handleMovieStatusChange(e, row.status, row)}
        >
          {row.status}
        </button>
      ),
    },
    {
      name: "Refundable",
      minWidth: "150px",
      cell: (row) => (
        <div className="space-x-4 flex justify-center items-center">
          <input
            type="checkbox"
            className="w-5 h-5 accent-green-600"
            defaultChecked={row?.isRefundable === true ? true : false}
            onChange={(e) =>
              handeMovieRefundStatusChange(row?._id, e.target.checked)
            }
          />
        </div>
      ),
    },
    {
      name: "Ticket Status",
      minWidth: "150px",
      cell: (row) => (
        <>
          <div className="space-x-4 flex justify-center items-center ">
            <input
              type="checkbox"
              className="w-5 h-5 accent-green-600"
              checked={row?.isAllowTicketBooking}
              onChange={(e) =>
                handeMovieTicketStatusChange(row?._id, e.target.checked)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "Actions",
      minWidth: "50px",
      cell: (row) => {
        return (
          <div className="space-x-4 flex justify-center">
            {!isPastDate(row?.releaseDate) && (
              <Link
                to={`/admin/movies/${row._id}`}
                className="inline-block p-2 rounded-lg transition duration-200 border border-skin-base text-center text-skin-base font-serif hover:bg-skin-base hover:text-white"
                title="Edit Movie Details"
              >
                <MdEdit size={15} />
              </Link>
            )}
          </div>
        );
      },
    },
  ];
  const closeConfirmModal = () => {
    setShowDeleteConfirm({
      movie: "",
      show: false,
    });
  };
  const openConfirmModal = (text) => {
    setShowDeleteConfirm({
      movie: text,
      show: true,
    });
  };
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
        title="Movie List"
        progressPending={isLoading}
      />
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm.show}
          closeHandler={closeConfirmModal}
          config={confirmConfig}
        />
      )}
    </>
  );
};

export default DataTableMovie;
