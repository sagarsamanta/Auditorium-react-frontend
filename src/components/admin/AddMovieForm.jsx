import { STATUS_ACTIVE } from "../../lib/consts";
import { displayDate, getDataUriOfImage } from "../../lib/utils";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";
import Axios from "../../lib/axiosInstance";
import { useAuth } from "../../lib/hooks/useAuth";
import { toast } from "react-toastify";
import LoadingButton from "../UI/LoadingButton";

const AddMovieForm = ({ movie }) => {
    const imgPreviewRef = useRef(null);
    const imgInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const formik = useFormik({
        initialValues: {
            title: movie?.title || '',
            description: movie?.description || '',
            date: displayDate(movie?.releaseDate, 'YYYY-MM-DD') || '',
            duration: movie?.duration || '',
            language: movie?.language || '',
            image: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Please Enter Movie Title'),
            description: Yup.string().required('Please Enter Movie Description'),
            date: Yup.string().required('Please Enter Show Date'),
            duration: Yup.string(),
            language: Yup.string(),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('releaseDate', values.date);
            formData.append('duration', values.duration);
            formData.append('language', values.language);
            formData.append('poster', values.image);

            const requestMethod = movie ? 'PUT' : 'POST';
            const requestUrl = movie ? `/movie/${movie?._id}` : '/movie/';

            Axios(requestMethod, requestUrl, formData, { authRequest: true, token: token })
                .then((response) => {
                    console.log('response', response);
                    if (response?.status === 201) {
                        toast.success('Movie Added Sucessfully');
                    }
                    if (response?.status === 200) {
                        toast.success('Movie Updated Sucessfully');
                    }
                })
                .finally(() => {
                    setLoading(false);
                })
                .catch((error) => {
                    toast.error(`${error.message}`);
                });
        }
    });

    const handleImageChange = async (file) => {
        const imgUri = await getDataUriOfImage(file);
        imgPreviewRef.current.src = imgUri;
        formik.setFieldValue('image', file);
    }
    return (
        <>
            <form className="w-full" onSubmit={formik.handleSubmit}>
                <div className="flex flex-wrap my-6">
                    <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="col-span-3">
                            <div className="px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="movie-title">
                                    Movie Title {' '}
                                    {
                                        movie?.status ? <span className={`badge font-normal normal-case py-1 px-2 rounded-full ${movie?.status === STATUS_ACTIVE ? 'bg-green-200' : 'bg-yellow-200'}`}>This movie is currently: {movie?.status}</span> : ''
                                    }
                                </label>
                                <input
                                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.title && formik.errors.title) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                    id="movie-title"
                                    type="text"
                                    placeholder="Sholay"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                />
                                {
                                    (formik.touched.title && formik.errors.title) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.title}</p>
                                }
                            </div>
                            <div className="px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="movie-description">
                                    Description
                                </label>
                                <textarea
                                    rows="10"
                                    className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.description && formik.errors.description) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                    id="movie-description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                ></textarea>
                                {
                                    (formik.touched.description && formik.errors.description) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.description}</p>
                                }
                            </div>

                            <div className="px-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="movie-description">
                                        Language
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.language && formik.errors.language) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="movie-date"
                                        type="text"
                                        name="language"
                                        value={formik.values.language}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.language && formik.errors.language) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.language}</p>
                                    }
                                </div>
                                <div>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="movie-description">
                                        Duration
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.duration && formik.errors.duration) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="movie-duration"
                                        type="number"
                                        name="duration"
                                        value={formik.values.duration}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.duration && formik.errors.duration) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.duration}</p>
                                    }
                                </div>
                                <div>
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="movie-description">
                                        Show Date
                                    </label>
                                    <input
                                        className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${(formik.touched.date && formik.errors.date) ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                        id="movie-date"
                                        type="date"
                                        name="date"
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                    />
                                    {
                                        (formik.touched.date && formik.errors.date) ?? <p className="text-red-500 text-xs italic capitalize">{formik.errors.date}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col">
                            <div>
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="movie-poster">
                                    Movie Poster
                                </label>
                                <input
                                    ref={imgInputRef}
                                    className="hidden"
                                    id="movie-poster"
                                    type="file"
                                    placeholder="Sholay"
                                    name="image"
                                    onChange={(e) => handleImageChange(e.currentTarget.files[0])}
                                />
                            </div>
                            <div className="relative h-60 md:h-full">
                                <img
                                    ref={imgPreviewRef}
                                    src={movie?.poster || `https://res.cloudinary.com/dmnbwbb2q/image/upload/v1689672759/sagar/iwlsfplmpv6uiqi7llsp.png`} className={`absolute inset-0 ${movie?.poster || imgPreviewRef?.current?.src ? '' : 'flex justify-center items-center bg-gray-200'} w-full h-full object-contain cursor-pointer`}
                                    onClick={() => imgInputRef.current.click()}
                                    alt="Click to add Movie Poster"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full px-0 py-4 md:p-3">
                        <LoadingButton isLoading={loading} text={movie ? "Update Movie" : "Add Movie"} />
                    </div>

                </div>
            </form>
        </>
    )
}

export default AddMovieForm;