import React, { useEffect, useState } from "react";
import SearchBox from "../../components/UI/SearchBox";
import UsersCheckInTable from "../../components/UsersCheckInTable";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../lib/hooks/useAuth";
import { displayTime } from "../../lib/utils";
import Axios from "../../lib/axiosInstance";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { STATUS_ACTIVE } from "../../lib/consts";

const CheckIn = () => {
  // Replace these values with your actual data

  const [shows, setAllShows] = useState([]);
  const [activeMovie, setActiveMovie] = useState([]);
  const [selectedShow, setSelectedShow] = useState({});
  const [isLoading,setLoading]=useState(true)
  const { token } = useAuth();
  const getShowsRecords = (id) => {
    const show = shows.filter((show) => show._id === id);
    setSelectedShow(show[0]);
  };
  useEffect(() => {
    Axios("GET", `movie/movie-shows-timings`, null, {
      authRequest: true,
      token: token,
    })
      .then((res) => {
        setAllShows(res.data?.show);
        setActiveMovie(res.data?.movie[0]);
        setSelectedShow(res.data?.show[0]);
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-52 lg:h-96">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 h-16 w-16"></div>
        </div>
      ) : (
        <div className="relative min-h-screen">
          <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
            <h1 className="text-xl md:text-2xl lg:text:3xl">Check-In</h1>
            {activeMovie?.status === STATUS_ACTIVE && (
              <div className="min-h-[32px]">
                <span className="bg-green-300 text-black text-sm text-center rounded-md px-2 py-1 capitalize">
                  Active Movie
                </span>
                <div className="font-semibold text-base md:text-xl">
                  {activeMovie?.title}
                </div>
              </div>
            )}
          </div>

          <div className="border border-slate-100 rounded-md shadow p-4 mt-2">
            <div className="font-semibold text-xl mt-2">
              Available Show Timings
            </div>
            {shows.length === 0 && (
              <div className="p-3 flex justify-center items-center">
                No shows Available
              </div>
            )}
            <div className="my-3">
              {shows?.map((show, index) => (
                <button
                  key={index}
                  className={`${
                    selectedShow?._id === show._id
                      ? "transition text-skin-inverted border hover:border-green-700 border-green-800 hover:bg-green-700 focus:ring-green-800/70 bg-green-800"
                      : "text-skin-base border border-skin-base hover:bg-skin-base/20 focus:ring-skin-muted"
                  } focus:ring-1 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center gap-2`}
                  onClick={() => getShowsRecords(show?._id)}
                >
                  {selectedShow?._id === show?._id ? (
                    <FiCheckCircle size={15} />
                  ) : (
                    <MdRadioButtonUnchecked size={15} />
                  )}
                  {displayTime(show?.showStartTime)}
                </button>
              ))}
            </div>
            <div>
              {selectedShow && Object.keys(selectedShow).length > 0 && (
                <UsersCheckInTable
                  show={selectedShow}
                  showStartTime={selectedShow?.showStartTime}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckIn;
