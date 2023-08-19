import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Axios from '../../../lib/axiosInstance';
import { useAuth } from '../../../lib/hooks/useAuth';
import { useFormik } from 'formik';
import LoadingButton from '../../../components/UI/LoadingButton';
import DataTableAdminShowWiseReports from '../../../components/DataTableAdminShowWiseReports';
import { getCurrencyFormat, getShowsByMovieId } from '../../../lib/utils';
import { AiOutlineDownload } from 'react-icons/ai'
import { downloadCSV } from '../../../lib/downloadCsv';


const ReportsPageShowWise = () => {
    const [movieTitleList, setMovieList] = useState([]);
    const [showTitleList, setShowList] = useState([]);
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState("")
    const [selectedShow, setSelectedShows] = useState("")
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
                    setMovieList(allOptions);
                }
            })
            .finally(() => {
                // setLoading({ ...loading, movie: false });
            })
            .catch((err) => {
                console.log(err)
            });
    }
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
            }
        });
        setShowList(showsList);
        return;
    }
    const calculateTotalAmount = (data = [], field = "totalAmount") => {
        let total = 0;
        for (const entry of data) {
            total += entry[`${field}`];
        }
        return total;
    }

    useEffect(() => {
        getAllMoviesTitle();
        getAllShows();
        return ()=>{
            setSelectedMovie("")
            setSelectedShows("")
        }
    }, []);

    // Handle Form
    const formik = useFormik({
        initialValues: {
            movie: '',
            show: '',
            date: '',
        },
        onSubmit: (values) => {
            setLoading(true);
            Axios('GET', `/show/daily-booking-reports/?movieId=${values?.movie}&date=${values?.date}`, null, { authRequest: true, token: token })
                .then((res) => {
                    if (res.status === 200) {
                        let reports = res?.data;
                        if (formik?.values?.show) {
                            reports.dailyReports = reports?.dailyReports?.filter((report) => report?.title === formik?.values?.show);
                        }
                        console.log('reports', reports);
                        setReport(reports);
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
        setSelectedMovie(e?.label)
        if (!e) {
            setReport([])
            setSelectedShows("")
        };
        getAllShows(e?.value);
    }
    const handleShowChange = (e) => {
        setSelectedShows(e?.label)
        formik.setFieldValue('show', e?.value || '');
    }
    const downloadReports = () => {
        let fileTitle = "Movie-reports"
        if (selectedMovie && selectedShow) {
            fileTitle = `${selectedMovie}-${formik.values.show}`
        } else if (selectedMovie) {
            fileTitle = `${selectedMovie}`
        }
        console.log(fileTitle);
        downloadCSV(report?.dailyReports, fileTitle)
    }

    return (
        <div>
            <div className="flex justify-between items-center p-4 mb-2 border border-slate-100 rounded-md shadow-md">
                <h1 className="text-xl md:text-2xl lg:text:3xl">Show-wise Reports</h1>
            </div>
            <form className='w-full flex flex-col md:flex-row justify-start items-center gap-4 py-4 mb-2' onSubmit={formik.handleSubmit}>
                <Select onChange={handleMovieChange} placeholder="Select Movie" className='min-w-[300px]' options={movieTitleList} isClearable />
                <Select onChange={handleShowChange} placeholder="Select Show" className='min-w-[300px]' options={showTitleList} isClearable isDisabled={formik.values.movie === ''} />
                <input
                    type="date"
                    name='date'
                    onChange={formik.handleChange}
                    value={formik.values.date}
                    className={`min-w-[300px] block text-gray-700 border rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white`}
                />
                <LoadingButton isLoading={loading} text={"Generate Report"} isDisable={formik.values.movie === ""} />
            </form>

            <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
                <div className='flex justify-between items-center'>
                    <div className='text-lg font-semibold mx-3 bg-yellow-300 px-1 inline-block'>Shows Reports</div>
                    <button className='border border-blue-500 p-1 rounded-md' onClick={downloadReports}>
                        <div className='flex items-center gap-1 text-blue-700'>
                            <AiOutlineDownload size={20} /> <span>Download</span>
                        </div>
                    </button>
                </div>
                <DataTableAdminShowWiseReports data={report?.dailyReports || []} />
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

export default ReportsPageShowWise;