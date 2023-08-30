import { useEffect, useState } from "react";
import Axios from "../../lib/axiosInstance";
import Loader from "../../components/UI/Loader";
import { useAuth } from "../../lib/hooks/useAuth";
import { FiCheckCircle } from "react-icons/fi";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { STATUS_ACTIVE } from "../../lib/consts";
import { displayDate, displayTime } from "../../lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import ShowSeats from "../../components/admin/ShowSeats";
import SomethingWentWrong from "../../components/UI/SomethingWentWrong";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoArrowBack } from "react-icons/io5";

const AdminBookingsPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState({});
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState({});
  const [loading, setLoading] = useState({ movie: true, shows: true });
  const [error, setError] = useState({ movie: false, shows: false });
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const isAllShowInactive =
    shows.filter((show) => show.status === STATUS_ACTIVE).length === 0;

  // Frath Movie
  useEffect(() => {
    Axios("GET", `/movie/${movieId}`, null, { authRequest: true, token: token })
      .then((res) => {
        if (res.status === 200) {
          setMovie(res.data?.movie);
        }
      })
      .finally(() => {
        setLoading({ ...loading, movie: false });
      })
      .catch((err) => {
        setError({ movie: true, shows: true });
        // toast.error(`${err.response.statusText}`);
      });
  }, []);

  // Fetch Show
  useEffect(() => {
    if (isAuthenticated && token && movie?._id) {
      Axios("GET", `user/getAllShowsForMovie/${movieId}`, null, {
        authRequest: true,
        token: token,
      })
        .then((res) => {
          setShows(res.data?.shows);
          setSelectedShow(res.data?.shows[0]);
        })
        .finally(() => {
          setLoading({ movie: false, shows: false });
        })
        .catch((err) => {
          setError({ movie: true, shows: true });
        });
    }
  }, [movie, isAuthenticated, token]);

  return (
    <>
      <div className="relative min-h-screen">
        {loading.movie ? (
          <Loader className="absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10" />
        ) : error.movie || error.shows || !selectedShow ? (
          <div className="absolute top-1/3 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
            <SomethingWentWrong className="" text="No Shows available!" />
            <button
              className="text-sm  md:px-4 rounded-full transition bg-skin-base hover:bg-skin-base/90 text-skin-inverted flex items-center gap-2 mx-auto mt-4"
              title="Back"
              onClick={() => navigate(-1)}
            >
              <IoArrowBack size={20} /> Back
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
              <h1 className="text-xl md:text-2xl lg:text:3xl">Book shows</h1>
              <button
                className="text-sm  px-2 py-2 md:px-4 md:py-3 rounded-lg border border-skin-base bg-skin-inverted text-skin-base flex items-center gap-2 hidden"
                onClick={() => navigate(-1)}
              >
                <RiArrowGoBackLine /> Back
              </button>
            </div>
            <div className=" text-gray-800 shadow-lg bg-gray-100 rounded-lg p-4 flex flex-col md:flex-row gap-4 md:gap-8">
              <div
                className={`w-full md:w-1/3 h-[360px] max-h-[360px] relative overflow-hidden rounded-lg`}
              >
                <img
                  src={movie?.poster}
                  alt={movie?.title}
                  className="w-full h-full absolute inset-0 object-cover bg-center z-[0] blur-lg"
                />
                <img
                  src={movie?.poster}
                  alt={movie?.title}
                  className="w-full h-full absolute inset-0 object-contain bg-center z-[2]"
                />
              </div>
              <div className="w-full md:w-2/3 space-y-6">
                <h2 className="text-3xl font-semibold">{movie?.title}</h2>
                <div className="mt-4 space-y-2">
                  <span className="text-xl font-semibold">Description</span>
                  <p className="line-clamp-3">{movie?.description}</p>
                </div>

                <div className="mt-4 space-y-2">
                  <span className="text-xl font-semibold">Date</span>
                  <p className="line-clamp-3">
                    {displayDate(movie?.releaseDate)}
                  </p>
                </div>
                <div className="mt-4 space-y-2 inline-block">
                  <p
                    className={`line-clamp-3 rounded-md px-2 font-semibold ${
                      movie?.isRefundable ? "bg-green-400" : "bg-red-400 "
                    }`}
                  >
                    {movie?.isRefundable ? "Refundable" : "Non-Refundable"}
                  </p>
                </div>

                {/* Shows */}
                <div className="mt-4 space-y-2">
                  <span className="text-xl font-semibold">Shows</span>
                  {!isAuthenticated ? (
                    <div
                      className={` z-10 p-5 flex justify-center items-center relative overflow-hidden`}
                    >
                      <div className="flex flex-col justify-center items-center gap-4">
                        <img
                          src={`/images/blurBg.png`}
                          alt=""
                          className="absolute inset-0 -z-10 select-none pointer-events-none md:opacity-50"
                        />
                        <Link
                          to="/login"
                          className="text-gray-800 hover:scale-110 transition bg-skin-base focus:ring-skin-muted focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2"
                        >
                          Login to Book ticket
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      {loading.shows ? (
                        <Loader className="w-[14px] h-[14px]" />
                      ) : (
                        <div className="w-full md:w-3/4 grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                          {isAllShowInactive && (
                            <p className="p-2 bg-gray-700 col-span-2 rounded-md text-center">
                              No show Available!
                            </p>
                          )}
                          {shows.map((show, index) => {
                            if (show?.status === STATUS_ACTIVE) {
                              return (
                                <button
                                  key={index}
                                  className={`${
                                    selectedShow._id === show._id
                                      ? "text-gray-800 border border-green-800/70 hover:bg-green-800/20 focus:ring-green-800/70 bg-green-800/40"
                                      : "text-gray-800 border border-skin-base hover:bg-skin-base/20 focus:ring-skin-muted"
                                  } focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                                  onClick={() => setSelectedShow(show)}
                                >
                                  {selectedShow?._id === show?._id ? (
                                    <FiCheckCircle size={15} />
                                  ) : (
                                    <MdRadioButtonUnchecked size={15} />
                                  )}
                                  {displayTime(show?.showStartTime)}
                                </button>
                              );
                            }
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {isAuthenticated && selectedShow && !isAllShowInactive && (
              <div className="  text-gray-800 rounded-lg p-4 bg-gray-100 shadow-lg">
                <span className="text-xl font-semibold">Available Seats</span>
                {loading.shows ? (
                  <div className="py-4">
                    <Loader className="block" />
                  </div>
                ) : (
                  <ShowSeats
                    show={{ ...selectedShow, movie }}
                    movieId={movie?._id}
                    showId={selectedShow?._id}
                    authUser={{ user: user, token: token }}
                    priceList={selectedShow?.price}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBookingsPage;
