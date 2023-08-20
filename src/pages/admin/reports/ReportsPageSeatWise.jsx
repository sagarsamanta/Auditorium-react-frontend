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
          }
        })
        .finally(() => {
          setLoading(false);
          setLoaadingAllSetsTable(false)
        })
        .catch((err) => {
          console.log("err", err);
        });
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
  };
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
          )}
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
          )}
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
        {/* {report && report?.length !== 0 && (
                    <>
                        <div className='text-lg'>Total Revenue: {getCurrencyFormat(calculateTotalAmount(report, "totalAmount"))}</div>
                        <div className='text-lg'>Total Bookings: {calculateTotalAmount(report, "totalBookings")}</div>
                    </>
                )} */}
      </div>
    </div>
  );
};

export default ReportsPageSeatWise;
