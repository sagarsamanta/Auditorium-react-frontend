import { useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import SearchBox from "./UI/SearchBox";
const UsersCheckInTable = () => {
    const [moviesList, setAllMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();


    return (
        <>
            <SearchBox placeholder="Enter booking id ....." data={moviesList} setData={setAllMovieList} setIsLoading={setIsLoading} />
            {/* <DataTable
                columns={columns}
                data={moviesList}
                className={className}
                pagination
                paginationPerPage={20}
                loading={true}
                title="Movie List"
                progressPending={isLoading}
            /> */}
        </>
    )
}

export default UsersCheckInTable;
