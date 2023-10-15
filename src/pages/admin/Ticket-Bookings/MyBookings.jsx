import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../../components/UI/Loader";
import { getAdminBookings, getAdminOwnBookings } from "../../../lib/utils";
import { useAuth } from "../../../lib/hooks/useAuth";
import DataTableAdminBookings from "../../../components/DataTableAdminBookings";
import DataTableAdminReserved from "../../../components/DataTableAdminReserved";
import HistryTab from "../TicketHistory";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [reserved, setReserved] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useParams();
  const { token, user } = useAuth();

  useEffect(() => {
    const response = async () => {
      const data = await getAdminOwnBookings(user?._id, token);
      setBookings(data?.bookings);
      setReserved(data?.reserved);
      setLoading(false);
    };
    response();
  }, [userId]);
  return (
    <>
      <main className="my-bookings-page">
        <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
          <h1 className="text-xl md:text-2xl lg:text:3xl">My Bookings</h1>
        </div>

        <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
          {loading ? (
            <Loader className={"m-auto"} />
          ) : (
            <>
              <h3 className="text-lg md:text-xl lg:text:2xl bg-green-500 rounded-md inline-block px-2">
                Booked Seats
              </h3>
              <DataTableAdminBookings data={bookings} />
            </>
          )}
        </div>

        {!loading && (
          <div className="movies-table-wrapper p-4 shadow mt-5 rounded-md">
            <h3 className="text-lg md:text-xl lg:text:2xl bg-yellow-300 rounded-md inline-block px-2">
              Reserved Seats
            </h3>
            <DataTableAdminReserved data={reserved} />
          </div>
        )}
      </main>
    </>
  );
};

export default MyBookings;
