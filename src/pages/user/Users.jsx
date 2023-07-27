import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/UI/Loader";
import DataTableUsers from "../../components/DataTableUsers";
import { getAllUsers } from "../../lib/utils";

const Users = () => {
    const [data, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const response = async () => {
            const data = await getAllUsers()
            setResponse(data?.users);
            setLoading(false);
        };
        response();
    }, []);
    return (
        <>
            <main className="movies-page  ">
                <div className="flex justify-between items-center p-4 pt-0 shadow-lg">
                    <h1 className="text-3xl">Users</h1>
                    <Link
                        to="/admin/movies/add"
                        className="text-sm inline-block px-4 py-3 rounded-lg bg-skin-base text-skin-inverted"
                    >
                        <div className="flex gap-2 items-center">
                            <div>Add New Users</div>
                        </div>
                    </Link>
                </div>

                <div className="movies-table-wrapper p-4 shadow-md mt-5">
                    {loading ? (
                        <Loader className={'m-auto'} />
                    ) : (
                        <DataTableUsers data={data} />
                    )}
                </div>
            </main>
        </>
    );
};

export default Users;
