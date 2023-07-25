import MoviesPage from "./admin/MoviesPage"


const Pages = () => {
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Pages</h1>
                    </div>
                </div>
            </div>
            <div className="container">
                <MoviesPage />
            </div>
        </>
    )
}

export default Pages;