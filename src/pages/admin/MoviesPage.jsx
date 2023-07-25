// import DataTableMovie from "@/components/DataTableMovie";
import { useContext, useEffect, useState } from "react";
import DataTableMovie from "../../components/DataTableMovie";
import { getAllMovies } from "../../lib/utils";
import { UserContext } from "../../context/userContext";
// import { Link } from 'react-router-dom';

const MoviesPage = () => {
    const [data, setResponse] = useState([]);

    useEffect(() => {
        const response = async () => {
            const data = await getAllMovies()
            console.log(data?.movies);
            setResponse(data);
        };
        response();
    }, []);
    return (
        <>
            <main className="movies-page  ">
                <DataTableMovie data={data} />
            </main>
        </>
    );
};

export default MoviesPage;
