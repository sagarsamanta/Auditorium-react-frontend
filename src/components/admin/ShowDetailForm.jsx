"use client"
import { displayDate, getPriceBySeatNumber } from "@/lib/utils";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { addShowDetails, updateShowDetails } from "@/redux/slice/show";

const ShowDetailForm = ({ movie, showId, show, showTitle }) => {
    const dispatch = useDispatch();
    const showStore = useSelector((state) => state.show);
    const seatStore = useSelector((state) => state.seat);
    const formik = useFormik({
        initialValues: {
            sTime: show?.showStartTime || '10:00',
            eTime: show?.showEndTime || '12:00',
            priceRow_a_to_c: show?.price?.priceRow_a_to_c || '100',
            priceRow_d_to_h: show?.price?.priceRow_d_to_h || '200',
            priceRow_i_to_n: show?.price?.priceRow_i_to_n || '300',
        },
        validationSchema: Yup.object({
            sTime: Yup.string().required('Please Enter Movie Title'),
            eTime: Yup.string().required('Please Enter Movie Description'),
            priceRow_a_to_c: Yup.string().required('Please Enter Price'),
            priceRow_d_to_h: Yup.string().required('Please Enter Price'),
            priceRow_i_to_n: Yup.string().required('Please Enter Price'),
        }),
        onSubmit: async (values) => {
            const show = {
                ...values,
                title: showTitle,
                sTime: values.sTime,
                eTime: values.eTime,
                price: {
                    priceRow_a_to_c: values.priceRow_a_to_c,
                    priceRow_d_to_h: values.priceRow_d_to_h,
                    priceRow_i_to_n: values.priceRow_i_to_n,
                },
            };
            const seatsObjArr = seatStore?.seat?.selected[`${movie?._id}`]?.map((seat) => {
                return {
                    seatNo: seat,
                    price: getPriceBySeatNumber(seat, values)
                }
            });
            show.seats = seatsObjArr;
            if (showId?.length > 2) {
                // Update Show
                await dispatch(updateShowDetails({ movieId: movie?._id, showId: showId, show: show }));
                // FIX ME - page load to deal with caching of the page
                window.location.reload();
            } else {
                // Create Show
                await dispatch(addShowDetails({ movieId: movie?._id, showId: showId, show: show }));
                // FIX ME - page load to deal with caching of the page
                window.location.href = `/admin/shows?movie=${movie?._id}`;
            }
        }
    });

    return (
        <>
            <form className="w-full" onSubmit={formik.handleSubmit}>
                <div className="text-sm">
                    <span>Date: {movie?.releaseDate !== '' && displayDate(movie?.releaseDate)}</span>
                </div>
                <div className="flex flex-wrap my-6">
                    <div className="w-full">
                        <div className="">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-0">
                                <div>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="show-start-time">
                                        Show Start Time
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.sTime && formik.errors.sTime) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="show-start-time"
                                        type="time"
                                        name="sTime"
                                        value={formik.values.sTime}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.sTime && formik.errors.sTime) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.sTime}</p>
                                    }
                                </div>
                                <div>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="show-start-time">
                                        Show End Time
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.eTime && formik.errors.eTime) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="show-start-time"
                                        type="time"
                                        name="eTime"
                                        value={formik.values.eTime}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.eTime && formik.errors.eTime) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.eTime}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <p className="text-gray-700 text-lg font-bold mb-2">Price</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-0">
                                <div>
                                    <label className="block capitalize tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="show-start-time">
                                        Row <span className="text-skin-base">A - C</span>
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.priceRow_a_to_c && formik.errors.priceRow_a_to_c) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="show-start-time"
                                        type="number"
                                        name="priceRow_a_to_c"
                                        value={formik.values.priceRow_a_to_c}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.priceRow_a_to_c && formik.errors.priceRow_a_to_c) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.priceRow_a_to_c}</p>
                                    }
                                </div>
                                <div>
                                    <label className="block capitalize tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="show-start-time">
                                        Row <span className="text-skin-base">D - H</span>
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.priceRow_d_to_h && formik.errors.priceRow_d_to_h) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="show-start-time"
                                        type="number"
                                        name="priceRow_d_to_h"
                                        value={formik.values.priceRow_d_to_h}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.priceRow_d_to_h && formik.errors.priceRow_d_to_h) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.priceRow_d_to_h}</p>
                                    }
                                </div>
                                <div>
                                    <label className="block capitalize tracking-wide text-gray-700 text-sm font-bold mb-2" htmlFor="show-start-time">
                                        Row <span className="text-skin-base">I - N</span>
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.priceRow_i_to_n && formik.errors.priceRow_i_to_n) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="show-start-time"
                                        type="number"
                                        name="priceRow_i_to_n"
                                        value={formik.values.priceRow_i_to_n}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.priceRow_i_to_n && formik.errors.priceRow_i_to_n) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.priceRow_i_to_n}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full px-0 py-4 md:py-3">
                        <button className="shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-10 rounded relative" type="submit">
                            {showStore.isLoading && <span className="w-4 h-4 border border-r-0 border-skin-inverted inline-block rounded-full absolute top-3 left-4 animate-spin" />}
                            Save Show
                        </button>
                    </div>

                </div>
            </form>
        </>
    )
}

export default ShowDetailForm;