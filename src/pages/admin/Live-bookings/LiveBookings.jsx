import React, { useEffect, useState } from "react";
import SearchBox from "../../../components/UI/SearchBox";
import UsersCheckInTable from "../../../components/UsersCheckInTable";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../../../lib/hooks/useAuth";
import { displayTime, getCurrencyFormat } from "../../../lib/utils";
import { MdRadioButtonUnchecked } from "react-icons/md";
import Axios from "../../../lib/axiosInstance";
import LiveBookingsTable from "../../../components/LiveBookingsTable";
import { STATUS_ACTIVE } from "../../../lib/consts";

const LiveBookings = () => {
  // Replace these values with your actual data

  const [shows, setAllShows] = useState([]);
  const [activeMovie, setActiveMovie] = useState([]);
  const [selectedShow, setSelectedShow] = useState({});
  const [totalAmountCollected, setTotalAmountCollected] = useState(0);
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
        setTotalAmountCollected(res?.data?.totalAmountCollected);
        setAllShows(res.data?.show);
        setActiveMovie(res.data?.movie[0]);
        setSelectedShow(res.data?.show[0]);
      })
      .finally(() => {})
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log("selectedShow", selectedShow);
  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-y-4 p-4 border border-slate-100 rounded-md shadow-md">
        <h1 className="text-xl md:text-2xl lg:text:3xl">All Bookings</h1>
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
      <div className="bg-white rounded-lg  mt-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1">
        <div className="border p-4 rounded-lg flex flex-col shadow-md">
          <span className="text-lg font-semibold">
            {getCurrencyFormat(totalAmountCollected)}
          </span>
          <span className="text-sm">Total Collection</span>
        </div>
        <div className="border p-4 rounded-lg flex flex-col shadow-md">
          <span className="text-lg font-semibold">
            {selectedShow?.totalSeats -
              (selectedShow?.reservedSeats + selectedShow?.bookedSeats) || 0}
          </span>
          <span className="text-sm">Available Seats</span>
        </div>
        <div className="border p-4 rounded-lg flex flex-col shadow-md">
          <span className="text-lg font-semibold">
            {selectedShow?.reservedSeats || 0}
          </span>
          <span className="text-sm">Reserved Seats</span>
        </div>
        <div className="border p-4 rounded-lg flex flex-col shadow-md">
          <span className="text-lg font-semibold">
            {selectedShow?.bookedSeats || 0}
          </span>
          <span className="text-sm">Booked Seats</span>
        </div>
      </div>
      <div className="font-semibold text-xl mt-2">Available Show Timings</div>
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
          <LiveBookingsTable
            show={selectedShow}
            showStartTime={selectedShow?.showStartTime}
          />
        )}
      </div>
    </div>
  );
};

export default LiveBookings;
