import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import Axios from "../../../lib/axiosInstance";
import { useAuth } from "../../../lib/hooks/useAuth";
import { useFormik } from "formik";
import LoadingButton from "../../../components/UI/LoadingButton";
import { getShowsByMovieId } from "../../../lib/utils";
import { AiOutlineDownload } from "react-icons/ai";
import { downloadCSV, generateReportFileName } from "../../../lib/downloadCsv";
import DataTableAdminSeatWiseReports from "../../../components/DataTableAdminSeatWiseReports";
import { BiRefresh } from "react-icons/bi";
import { CustomDataTable as DataTable } from "../../../components/DataTable";
import { PAYMENTS_STATUS, SEATS_STATUS } from "../../../lib/consts";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineVerified } from "react-icons/md";

const ReportsPageSeatWise = () => {
  const [movieTitleList, setMovieList] = useState([]);
  const [showTitleList, setShowList] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAllSetsTable, setLoaadingAllSetsTable] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedShow, setSelectedShows] = useState("");
  const { token } = useAuth();
  const movieSelectRef = useRef(null);
  const showSelectRef = useRef(null);
  const [seatsDetailsData, setSeatDetailsData] = useState([])
  const getAllMoviesTitle = () => {
    Axios("GET", "/movie/get-all-movie-title", null, {
      authRequest: true,
      token: token,
    })
      .then((res) => {
        if (res.status === 200) {
          const allMovies = res.data?.movies;
          const allOptions = allMovies?.map((movie) => {
            return {
              value: movie._id,
              label: movie.title,
            };
          });
          setMovieList(allOptions);
        }
      })
      .finally(() => {
        // setLoading({ ...loading, movie: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAllShows = async (movieId) => {
    if (!movieId) {
      setShowList([
        {
          value: "Show 1",
          label: "Show 1",
        },
        {
          value: "Show 2",
          label: "Show 2",
        },
        {
          value: "Show 3",
          label: "Show 3",
        },
      ]);
      return;
    }
    const { shows } = await getShowsByMovieId(movieId, token);
    const showsList = shows?.map((show) => {
      return {
        value: show?.title,
        label: show?.title,
      };
    });
    setShowList(showsList);
    return;
  };

  const getAllMoviesSeatsReports = () => {
    Axios("GET", "/show/daily-seat-booking-reports/", null, {
      authRequest: true,
      token: token,
    })
      .then((res) => {
        if (res.status === 200) {
          setReport(res.data);
          setLoaadingAllSetsTable(false);
        }
      })
      .catch((err) => {
        setLoaadingAllSetsTable(false);
        console.log(err);
      })
      .finally(() => {
        setLoaadingAllSetsTable(false);
      });
  };

  useEffect(() => {
    getAllMoviesTitle();
    getAllShows();
    getAllMoviesSeatsReports();
    return () => {
      setSelectedMovie("");
      setSelectedShows("");
    };
  }, []);

  // Handle Form
  const formik = useFormik({
    initialValues: {
      movie: "",
      show: "",
      date: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      setLoaadingAllSetsTable(true)
      Axios(
        "GET",
        `/show/daily-seat-booking-reports/?movieId=${values?.movie}&showTitle=${values?.show}&date=${values?.date}`,
        null,
        { authRequest: true, token: token }
      )
        .then((res) => {
          if (res.status === 200) {
            setReport(res.data);
            setLoading(false);
            setLoaadingAllSetsTable(false)
            console.log("calll");

          }
        })
        .finally(() => {
          setLoading(false);
          setLoaadingAllSetsTable(false)
        })
        .catch((err) => {
          console.log("err", err);
        });
      if (selectedMovie) {
        getRecordOfSeatsInDetails()
      }
    },
  });

  const handleMovieChange = (e) => {
    formik.setFieldValue("movie", e?.value || "");
    setSelectedMovie(e?.label);
    if (!e) {
      setReport([]);
      setSelectedShows("");
    }
    getAllShows(e?.value);
  };
  const handleShowChange = (e) => {
    setSelectedShows(e?.label);
    formik.setFieldValue("show", e?.value || "");
  };
  const downloadReports = () => {
    const reportFileTitle = generateReportFileName(
      selectedMovie,
      selectedShow,
      formik.values.date
    );
    downloadCSV(report, reportFileTitle);
  };
  const handleRefresh = () => {
    formik.resetForm();
    setSelectedMovie("");
    setSelectedShows("");
    formik.setFieldValue("movie", ""); // Clear movie selection
    formik.setFieldValue("show", ""); // Clear show selection
    setSeatDetailsData([])
  };

  const getRecordOfSeatsInDetails = () => {
    setLoading(true);
    Axios("GET", `show/get-seats-bookig-record/?movieId=${formik.values.movie}&showtimeId=${formik.values.show}&date=${formik.values?.date}`, null, {
      authRequest: true,
      token: token,
    })
      .then((res) => {
        console.log(res);
        setSeatDetailsData(res?.data?.data)
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });

  }
  const columns = [
    {
      name: <>Seat No</>,
      selector: (row) => (
        <div className="text-sm  text-blue-700">{row?.seatNo}</div>
      ),
    },

    {
      name: <>Seats Status</>,
      minWidth: "150px",
      cell: (row) => {
        return (
          <div className="flex flex-wrap gap-2">
            {
              <div className="flex gap-[2px] justify-center items-center">
                <div
                  className={`${row.status === SEATS_STATUS.BOOKED &&
                    "text-red-700 p-2 rounded-lg"
                    } ${row.status === SEATS_STATUS.VISITED &&
                    "text-green-700 p-2  rounded-lg"
                    }`}
                >
                  {row?.status}
                </div>
              </div>
            }
          </div>
        );
      },
    },

    {
      name: "Booking Id",
      minWidth: "150px",
      selector: (row) => (
        <div className="flex gap-1 text-red-600 font-semibold cursor-pointer items-center">
          <span>{row?.bookingId?.bookingId}</span>
        </div>
      ),
    },
    {
      name: "Payment Mode",
      minWidth: "180px",
      sortable: true,
      selector: (row) => <div>{row?.bookingId?.paymentMode}</div>,
    },
    {
      name: <>Payment Status</>,
      minWidth: "200px",
      selector: (row) => (
        <div
          className={`${row?.bookingId?.paymentStatus === PAYMENTS_STATUS.SUCCESS && "text-green-700"
            } ${row?.bookingId?.paymentStatus === PAYMENTS_STATUS.REFUND_REQUESTED &&
            "text-yellow-400"
            } 
                ${row?.bookingId?.paymentStatus === PAYMENTS_STATUS.FAILED &&
            "text-red-400"
            } 
                font-semibold `}
        >
          {row?.bookingId?.paymentStatus}
        </div>
      ),
    },
    {
      name: "Booked User",
      minWidth: "150px",
      selector: (row) => row.userId?.name,
    },
    {
      name: "Amount",
      minWidth: "120px",
      sortable: true,
      selector: (row) => <div className="text-green-600">₹ {row?.price}</div>,

    },
    {
      name: "Guest Name",
      minWidth: "200px",
      selector: (row) => <>{row?.guestName ? row?.guestName : "--"}</>,
    },
    {
      name: "Guest Mobile No",
      minWidth: "200px",
      selector: (row) => row?.guestMobile,
      selector: (row) => <>{row?.guestMobile ? row?.guestMobile : "--"}</>,
    },
    {
      name: "EmpId",
      minWidth: "200px",
      selector: (row) => row?.userId?.empId,
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center p-4 mb-2 border border-slate-100 rounded-md shadow-md">
        <h1 className="text-xl md:text-2xl lg:text:3xl">Seat-wise Reports</h1>
      </div>
      <form
        className="w-full flex flex-col md:flex-row justify-start items-center flex-wrap gap-4 py-4 mb-2"
        onSubmit={formik.handleSubmit}
      >
        <Select
          onChange={handleMovieChange}
          placeholder="Select Movie"
          className="w-[250px]"
          options={movieTitleList}
          isClearable
          value={movieTitleList.find(
            (movie) => movie.value === formik.values.movie
          ) || ""}
          ref={movieSelectRef}
        />

        <Select
          onChange={handleShowChange}
          placeholder="Select Show"
          className="w-[250px]"
          options={showTitleList}
          isClearable
          isDisabled={formik.values.movie === ""}
          value={showTitleList.find(
            (show) => show.value === formik.values.show
          ) || ""}
          ref={showSelectRef}
        />
        <input
          type="date"
          name="date"
          onChange={formik.handleChange}
          value={formik.values.date}
          className={`w-[250px] block text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white`}
        />
        <LoadingButton
          isLoading={loading}
          text={"Generate Report"}
          isDisable={formik.values.movie === ""}
        />
        <button
          className="border border-yellow-500 p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-black"
          onClick={handleRefresh}
        >
          <BiRefresh size={15} />
          <span className="hidden md:inline-block">Refresh</span>
        </button>
      </form>

      <div className="movies-table-wrapper  shadow mt-5 rounded-md">
        <div className="flex justify-between items-center mb-2 md:mb-4 pt-3  pr-2">
          <h3 className="text-base md:text-lg font-semibold mx-3 bg-yellow-200 px-2 rounded">
            Seats Reports
          </h3>
          <button
            className="border border-blue-500 p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-blue-700"
            onClick={downloadReports}
            disabled={report.length === 0}
          >
            <AiOutlineDownload size={15} />
            <span className="hidden md:inline-block">Download</span>
          </button>
        </div>
        <DataTableAdminSeatWiseReports
          isLoading={loadingAllSetsTable}
          data={report || []}
        />

      </div>
      <div className="mt-3 lg:mt-6 shadow-lg">
        <h3 className="text-base md:text-lg font-semibold mx-3 bg-yellow-200 px-2 rounded inline-block">
          All Booked seats
        </h3>
        <DataTable
          columns={columns}
          data={seatsDetailsData}
          // className={className}
          pagination
          paginationPerPage={20}
          // title="All Booked seats"
          progressPending={loadingAllSetsTable}
        />
      </div>
    </div>
  );
};

export default ReportsPageSeatWise;
