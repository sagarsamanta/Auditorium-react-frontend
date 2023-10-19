import React, { useEffect, useState } from "react";
import Select from "react-select";
import Axios from "../../../lib/axiosInstance";
import { useAuth } from "../../../lib/hooks/useAuth";
import { useFormik } from "formik";
import LoadingButton from "../../../components/UI/LoadingButton";
import DataTableAdminReports from "../../../components/DataTableAdminReports";
import { displayDate, getCurrencyFormat } from "../../../lib/utils";
import DataTableMoviesReports from "../../../components/DataTableMoviesReports";
import { AiOutlineDownload } from "react-icons/ai";
import { downloadCSV, generateReportFileName } from "../../../lib/downloadCsv";
import MultipleMoviesReports from "./MultipleMoviesReports";

const ReportsPageMovieWise = () => {
  const [movieTitleList, setmovieList] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMoviesReports, setLoadingMovieReports] = useState(false);
  const [multiMovieSelect, setSelectMultipleMovie] = useState([]);

  const [movies, setMovies] = useState([]);

  const { token } = useAuth();

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
              label: `${movie.title}-(${displayDate(movie?.releaseDate)})`,
            };
          });
          setmovieList(allOptions);
        }
      })
      .finally(() => {
        // setLoading({ ...loading, movie: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMultipleMovieChange = (value) => {
    if (!value) return;
    setLoadingMovieReports(true);
    const movieIds = value?.map((movie) => movie.value);
    Axios(
      "POST",
      `/movie/all-movie-reports-grouped-title`,
      { movieIds },
      { authRequest: true, token: token }
    )
      .then((res) => {
        if (res.status === 200) {
          setSelectMultipleMovie(res.data?.overallSum);
          setMovies(res.data?.movieReports);
          setLoadingMovieReports(false);
        }
      })
      .finally(() => {
        setLoadingMovieReports(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoadingMovieReports(false);
        setSelectMultipleMovie([]);
        setMovies([]);
      });
  };
  const calculateTotalAmount = (data = [], field = "totalAmount") => {
    let total = 0;
    for (const entry of data) {
      // total += entry.total;
      total += entry[`${field}`];
    }

    return total;
  };

  useEffect(() => {
    getAllMoviesTitle();
    // getAllMoviesReports()
  }, []);

  // Handle Form
  const formik = useFormik({
    initialValues: {
      movie: "",
      date: "",
    },
    onSubmit: (values) => {
      setLoading(true);
      Axios(
        "GET",
        `/movie/daily-booking-reports/?movieId=${values?.movie}&date=${values?.date}`,
        null,
        { authRequest: true, token: token }
      )
        .then((res) => {
          if (res.status === 200) {
            const allMovies = res?.data;
            setReport(allMovies);
          }
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
  });

  const handleMovieChange = (e) => {
    formik.setFieldValue("movie", e?.value || "");
    if (!e) setReport([]);
  };

  const downloadAllMoviesReport = () => {
    const reportData = movies.map((row) => ({
      MOVIE: row?.movieTitle,
      "MOVIE LANGUAGE": row?.language,
      "MOVIE STATUS": row?.status,
      "BOOKED SEATS": row?.bookedSeats,
      "RESERVED SEATS": row?.reservedSeats,
      REFUNDABLE: row?.isRefundable ? "YES" : "NO",
      "RELEASE DATE": `${displayDate(row?.releaseDate)}`,
      "TOTAL ONLINE COLLECTION": row?.totalAmountCollected?.online,
      "TOTAL CASH COLLECTION": row?.totalAmountCollected?.cash,
      "TOTAL AMOUNT COLLECTION": row?.totalAmountCollected?.total,
    }));
    const totals = reportData.reduce((acc, curr) => {
      for (const key in curr) {
        if (key !== "MOVIE" && key !== "MOVIE LANGUAGE") {
          acc[key] = (acc[key] || 0) + (parseFloat(curr[key]) || 0);
        }
      }
      return acc;
    }, {});
    const totalRow = {
      MOVIE: "TOTAL",
      "MOVIE LANGUAGE": "",
      // Add the totals for each column
      "BOOKED SEATS": totals["BOOKED SEATS"],
      "RESERVED SEATS": totals["RESERVED SEATS"],
      REFUNDABLE: "",
      "RELEASE DATE": "",
      "TOTAL ONLINE COLLECTION": totals["TOTAL ONLINE COLLECTION"],
      "TOTAL CASH COLLECTION": totals["TOTAL CASH COLLECTION"],
      "TOTAL AMOUNT COLLECTION": totals["TOTAL AMOUNT COLLECTION"],
    };
    reportData.push(totalRow);
    const reportFileName = `Movie-wise_Collection_${displayDate(
      new Date(),
      "DD-MM-YYYY_hhmmss"
    )}`;
    downloadCSV(reportData, reportFileName);
  };
  const downloadAllAggrigateMoviesReport = () => {
    const reportData = [
      {
        // "MOVIE": row?.movieTitle,
        "TOTAL BOOKINGS": multiMovieSelect?.bookedSeats,
        "TOTAL RESERVED SEATS": multiMovieSelect?.reservedSeats,
        "TOTAL ONLINE COLLECTION":
          multiMovieSelect?.totalAmountCollected?.online,
        "TOTAL CASH COLLECTION": multiMovieSelect?.totalAmountCollected?.cash,
        "TOTAL AMOUNT COLLECTION":
          multiMovieSelect?.totalAmountCollected?.total,
      },
    ];
    const reportFileName = `Aggrigate-Movie_Collection_${displayDate(
      new Date(),
      "DD-MM-YYYY_hhmmss"
    )}`;
    downloadCSV(reportData, reportFileName);
  };

  const downloadMovieDateWiseReport = () => {
    const movie = movieTitleList.filter(
      (movie) => movie.value === formik.values.movie
    );
    const reportData = report?.dailyReports.map((row) => ({
      DATE: `${displayDate(row?._id?.date)}`,
      "NO OF SHOWS": row?.totalShows,
      "TOTAL BOOKINGS": row?.totalBookings,
      "CASH COLLECTION": row?.totalAmountCash,
      "ONLINE COLLECTION": row?.totalAmountOnline,
      "TOTAL COLLECTION": row?.totalAmount,
    }));

    const totals = reportData.reduce((acc, curr) => {
      for (const key in curr) {
        if (key !== "DATE") {
          acc[key] = (acc[key] || 0) + (parseFloat(curr[key]) || 0);
        }
      }
      return acc;
    }, {});
    const totalRow = {
      DATE: "TOTAL",
      "NO OF SHOWS": totals["NO OF SHOWS"],
      "TOTAL BOOKINGS": totals["TOTAL BOOKINGS"],
      "CASH COLLECTION": totals["CASH COLLECTION"],
      "ONLINE COLLECTION": totals["ONLINE COLLECTION"],
      "TOTAL COLLECTION": totals["TOTAL COLLECTION"],
    };
    reportData.push(totalRow);
    const reportFileName = generateReportFileName(
      movie[0]?.label,
      "",
      formik.values.date
    );
    downloadCSV(reportData, reportFileName);
  };

  return (
    <div className="mb-14">
      <div className="flex justify-between items-center p-4 mb-2 border border-slate-100 rounded-md shadow-md">
        <h1 className="text-xl md:text-2xl lg:text:3xl">Movies Reports</h1>
      </div>
      <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
        <form
          className="w-full flex flex-col md:flex-row justify-start items-center flex-wrap gap-4 py-4 mb-2"
          onSubmit={formik.handleSubmit}
        >
          <Select
            onChange={handleMovieChange}
            placeholder="Select Movie"
            className="w-[300px]"
            options={movieTitleList}
            isClearable
          />
          <input
            type="date"
            name="date"
            onChange={formik.handleChange}
            value={formik.values.date}
            className={`w-[300px] block text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white`}
          />
          <LoadingButton
            isLoading={loading}
            text={"Generate Report"}
            isDisable={formik.values.movie === ""}
          />
        </form>
        <div className="flex justify-between items-center ">
          <h3 className="text-base md:text-lg font-semibold mx-3 bg-yellow-200 px-2 rounded">
            Movies Date-wise Collection
          </h3>
          <button
            disabled={
              formik.values.movie === "" ||
              report.length === 0 ||
              report?.dailyReports?.length === 0
            }
            className="border border-blue-500 p-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center gap-1 text-blue-700"
            onClick={downloadMovieDateWiseReport}
          >
            <AiOutlineDownload size={15} />
            <span className="hidden md:inline-block">Downloadpppp</span>
          </button>
        </div>
        <DataTableAdminReports data={report?.dailyReports || []} />

        {report?.dailyReports && report?.dailyReports?.length !== 0 && (
          <>
            <div className="text-lg font-semibold">
              <span className="text-blue-500">Total Revenue </span> :{" "}
              <span className="text-green-400">
                {getCurrencyFormat(
                  calculateTotalAmount(report?.dailyReports, "totalAmount")
                )}
              </span>
            </div>
            <div className="text-lg font-semibold">
              <span className="text-blue-500">Total Bookings </span>:{" "}
              <span className="text-green-400">
                {calculateTotalAmount(report?.dailyReports, "totalBookings")}
              </span>
            </div>
          </>
        )}
      </div>
      <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="text-base md:text-lg font-semibold mx-3 bg-yellow-200 px-3 rounded inline-block">
            Multiple Movies-wise Collection
          </h3>
          <button
            className="border border-blue-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed px-2 rounded-md flex items-center gap-1 text-blue-700"
            onClick={downloadAllAggrigateMoviesReport}
            disabled={multiMovieSelect.length === 0}
          >
            <AiOutlineDownload size={15} />
            {/* done */}
            <span className="hidden md:inline-block">Download</span>
          </button>
        </div>
        <Select
          isMulti={true}
          onChange={handleMultipleMovieChange}
          placeholder="Select Movie"
          className="w-full mt-3 lg:mt-5 mx-3"
          options={movieTitleList}
          isClearable
        />

        <MultipleMoviesReports data={multiMovieSelect} />
      </div>
      <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="text-base md:text-lg font-semibold mx-3 bg-yellow-200 px-2 rounded">
            Movies-wise Collection
          </h3>
          <button
            className="border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed p-1 px-2 rounded-md flex items-center gap-1 text-blue-700"
            onClick={downloadAllMoviesReport}
            disabled={movies.length === 0}
          >
            <AiOutlineDownload size={15} />
            {/* done */}
            <span className="hidden md:inline-block">Download</span>
          </button>
        </div>
        <DataTableMoviesReports
          isLoading={loadingMoviesReports}
          data={movies}
        />
      </div>
    </div>
  );
};

export default ReportsPageMovieWise;
