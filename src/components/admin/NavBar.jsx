import React, { useState } from "react";
import { BiMoviePlay } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { TbReportSearch } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { BsCheckCircle } from "react-icons/bs";
import { GoHistory } from "react-icons/go";
import { BiTime, BiSlideshow, BiCameraMovie } from "react-icons/bi";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
const NavBar = () => {
  const { pathname } = useLocation();
  const startsWith = (str) => pathname.startsWith(str);

  const [reportsExpanded, setReportsExpanded] = useState(false);

  return (
    <nav
      data-dev-hint="main navigation"
      className="flex justify-between flex-col"
    >
      <div className="flex flex-col gap-3">
        <hr className="border-gray-700 my-1" />

        <Link
          to="/admin/movies"
          className={`${
            (startsWith("/admin/movies") || startsWith("/admin/shows")) &&
            "bg-skin-base"
          } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <BiMoviePlay size={20} />
            <div>Movies</div>
          </div>
        </Link>
        <Link
          to="/admin/users"
          className={`${
            startsWith("/admin/users") && "bg-skin-base"
          } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <FiUsers size={20} />
            <div>Users</div>
          </div>
        </Link>
        <Link
          to={`/admin/bookings`}
          className={`${
            startsWith("/admin/bookings") && "bg-skin-base"
          } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <BiMoviePlay size={20} />
            <div>Bookings</div>
          </div>
        </Link>
        <Link
          to={`/admin/live-bookings`}
          className={`${
            startsWith("/admin/live-bookings") && "bg-skin-base"
          } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <BiTime size={21} />
            <div>Upcomming Movie</div>
          </div>
        </Link>
        <Link
          to="/admin/check-in"
          className={`${
            startsWith("/admin/check-in") && "bg-skin-base"
          } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <BsCheckCircle size={19} />
            <div>Check-In</div>
          </div>
        </Link>
        <Link
          to={`/admin/history`}
          className={`${
            startsWith("/admin/history") && "bg-skin-base"
          } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <GoHistory size={19} />
            <div>My History</div>
          </div>
        </Link>

        <hr className="border-gray-700 my-1" />

        {/* ... Other navigation links ... */}

        <div
          onClick={() => setReportsExpanded(!reportsExpanded)}
          className={`${
            startsWith("/admin/reports") && "bg-skin-base"
          } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white cursor-pointer`}
        >
          <div className="flex justify-between items-center w-full gap-4">
            <div className="flex gap-4">
              {" "}
              <TbReportSearch size={20} />
              <div>Reports</div>
            </div>
            {reportsExpanded ? (
              <FaAngleUp size={18} />
            ) : (
              <FaAngleDown size={18} />
            )}
          </div>
        </div>

        {reportsExpanded && (
          <div className="pl-6">
            <Link
              to="/admin/reports/movie-wise-report"
              className={`${
                startsWith("/admin/reports/movie-wise-report") && "bg-skin-base"
              } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
            >
              <div className="flex justify-center items-center gap-4">
                <BiCameraMovie size={20} />
                <div>Movies-wise Reports</div>
              </div>
            </Link>
            <Link
              to="/admin/reports/show-wise-report"
              className={`${
                startsWith("/admin/reports/show-wise-report") && "bg-skin-base"
              } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
            >
              <div className="flex justify-center items-center gap-4">
                <BiSlideshow size={20} />
                <div>Show-wise Reports</div>
              </div>
            </Link>
            <Link
              to="/admin/reports/seat-wise-report"
              className={`${
                startsWith("/admin/reports/seat-wise-report") && "bg-skin-base"
              } flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
            >
              <div className="flex justify-center items-center gap-4">
                <MdAirlineSeatReclineNormal size={20} />
                <div>Seat-wise Reports</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
