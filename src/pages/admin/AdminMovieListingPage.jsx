import MoviesLoop from "../../components/MoviesLoop";

const AdminMovieListingPage = () => {

    return (
        <>
            <div className="book-ticket-page relative min-h">
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                    <h1 className="text-xl md:text-2xl lg:text:3xl">Book Movie Ticket</h1>
                </div>
                <MoviesLoop cardClassName="bg-gray-100 text-gray-800" />
            </div>
        </>
    )
}

export default AdminMovieListingPage;