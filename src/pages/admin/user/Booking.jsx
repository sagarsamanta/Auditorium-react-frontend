import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../components/UI/Loader";
import { getAllUserBookings } from "../../../lib/utils";
import DataTableUsersBookings from "../../../components/DataTableUsersBookings";

const UserMovieBooking = () => {
    const [data, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams()
    useEffect(() => {
        const response = async () => {
            const data = await getAllUserBookings(userId)
            setResponse(data?.bookings);
            setLoading(false);
        };
        response();
    }, [userId]);
    return (
        <>
            <main className="movies-page  ">
                <div className="flex justify-between items-center p-4 pt-0 shadow-lg">
                    <h1 className="text-lg text-center w-full md:text-xl lg:text-2xl font-semibold">All Bookings</h1>

                </div>

                <div className="movies-table-wrapper p-4 shadow-md mt-5">
                    {loading ? (
                        <Loader className={'m-auto'} />
                    ) : (
                        <DataTableUsersBookings data={data} />
                    )}
                </div>
            </main>
        </>
    );
};

export default UserMovieBooking;
