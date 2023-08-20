import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Axios from '../../../lib/axiosInstance';
import { useAuth } from '../../../lib/hooks/useAuth';
import { useFormik } from 'formik';
import LoadingButton from '../../../components/UI/LoadingButton';
import DataTableAdminReports from '../../../components/DataTableAdminReports';
import { displayDate, getCurrencyFormat } from '../../../lib/utils';
import DataTableMoviesReports from '../../../components/DataTableMoviesReports';
import { AiOutlineDownload } from 'react-icons/ai'
import { downloadCSV, generateReportFileName } from '../../../lib/downloadCsv';

const ReportsPageMovieWise = () => {
    const [movieTitleList, setmovieList] = useState([]);
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMoviesReports, setLoadingMovieReports] = useState(true);

    const [movies, setMovies] = useState([])
    const [tempMovies, setTempMovies] = useState([])

    const { token } = useAuth();

    const getAllMoviesTitle = () => {
        Axios('GET', '/movie/get-all-movie-title', null, { authRequest: true, token: token })
            .then((res) => {

                if (res.status === 200) {
                    const allMovies = res.data?.movies
                    const allOptions = allMovies?.map((movie) => {
                        return {
                            value: movie._id,
                            label: movie.title
                        }
                    })
                    setmovieList(allOptions);
                }
            })
            .finally(() => {
                // setLoading({ ...loading, movie: false });
            })
            .catch((err) => {
                console.log(err)
            });
    }
    const getAllMoviesReports = () => {
        Axios('GET', '/movie/all-movie-reports', null, { authRequest: true, token: token })
            .then((res) => {

                if (res.status === 200) {
                    setMovies(res.data);
                    setTempMovies(res.data);
                    setLoadingMovieReports(false)
                }
            })
            .catch((err) => {
                setLoadingMovieReports(false)
                console.log(err)
            })
            .finally(() => {
                setLoadingMovieReports(false)
            })

    }
    const calculateTotalAmount = (data = [], field = "totalAmount") => {
        let total = 0;
        for (const entry of data) {
            // total += entry.total;
            total += entry[`${field}`];
        }

        return total;
    }

    useEffect(() => {
        getAllMoviesTitle()
        getAllMoviesReports()
    }, []);

    // Handle Form
    const formik = useFormik({
        initialValues: {
            movie: '',
            date: '',
        },
        onSubmit: (values) => {
            setLoading(true);
            Axios('GET', `/movie/daily-booking-reports/?movieId=${values?.movie}&date=${values?.date}`, null, { authRequest: true, token: token })
                .then((res) => {
                    if (res.status === 200) {
                        const allMovies = res?.data;
                        console.log('allMovies', allMovies);
                        setReport(allMovies);
                    }
                })
                .finally(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.log('err', err)
                });
        }
    });

    const handleMovieChange = (e) => {
        formik.setFieldValue('movie', e?.value || '');
        if (!e) setReport([]);
    }

    const downloadAllMoviesReport = () => {
        const reportData = movies.map((row) => ({
            "MOVIE": row?.movie?.title,
            "TOTAL COLLECTION": row?.totalAmountCollected,
            "RELEASE DATE": `${displayDate(row?.movie?.releaseDate)}`,
            "BOOKED SEATS": row?.bookedSeats,
            "RESERVED SEATS": row?.reservedSeats,
        }));
        const reportFileName = `Movie-wise_Collection_${displayDate(new Date(), "DD-MM-YYYY_hhmmss")}`;
        downloadCSV(reportData, reportFileName);
    }

    const downloadMovieDateWiseReport = () => {
        const movie = movieTitleList.filter((movie) => (movie.value === formik.values.movie));
        const reportData = report?.dailyReports.map((row) => ({
            "DATE": `${displayDate(row?.createdAt)}`,
            "TOTAL COLLECTION": row?.totalAmount,
            "TOTAL BOOKINGS": row?.totalBookings,
        }));
        const reportFileName = generateReportFileName(movie[0]?.label, '', formik.values.date);
        downloadCSV(reportData, reportFileName);
    }

    return (
        <div>
            <div className="flex justify-between items-center p-4 mb-2 border border-slate-100 rounded-md shadow-md">
                <h1 className="text-xl md:text-2xl lg:text:3xl">Movies Reports</h1>
            </div>

            <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
                <div className='flex justify-between items-center'>
                    <h3 className='text-base md:text-lg font-semibold mx-3 bg-yellow-200 px-2 rounded'>Movies-wise Collection</h3>
                    <button
                        className='border border-blue-500 p-1 px-2 rounded-md flex items-center gap-1 text-blue-700'
                        onClick={downloadAllMoviesReport}
                    >
                        <AiOutlineDownload size={15} /><span className='hidden md:inline-block'>Download</span>
                    </button>
                </div>
                <DataTableMoviesReports isLoading={loadingMoviesReports} data={movies}  />
            </div>


            <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
                <form className='w-full flex flex-col md:flex-row justify-start items-center flex-wrap gap-4 py-4 mb-2' onSubmit={formik.handleSubmit}>
                    <Select onChange={handleMovieChange} placeholder="Select Movie" className='w-[300px]' options={movieTitleList} isClearable />
                    <input
                        type="date"
                        name='date'
                        onChange={formik.handleChange}
                        value={formik.values.date}
                        className={`w-[300px] block text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white`}
                    />
                    <LoadingButton isLoading={loading} text={"Generate Report"} isDisable={formik.values.movie === ""} />
                </form>
                <div className='flex justify-between items-center'>
                    <h3 className='text-base md:text-lg font-semibold mx-3 bg-yellow-200 px-2 rounded'>Movies Date-wise Collection</h3>
                    <button
                        className='border border-blue-500 p-1 px-2 rounded-md flex items-center gap-1 text-blue-700'
                        onClick={downloadMovieDateWiseReport}
                    >
                        <AiOutlineDownload size={15} /><span className='hidden md:inline-block'>Download</span>
                    </button>
                </div>
                <DataTableAdminReports data={report?.dailyReports || []} />

                {report?.dailyReports && report?.dailyReports?.length !== 0 && (
                    <>
                        <div className='text-lg'>Total Revenue: {getCurrencyFormat(calculateTotalAmount(report?.dailyReports, "totalAmount"))}</div>
                        <div className='text-lg'>Total Bookings: {calculateTotalAmount(report?.dailyReports, "totalBookings")}</div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ReportsPageMovieWise;