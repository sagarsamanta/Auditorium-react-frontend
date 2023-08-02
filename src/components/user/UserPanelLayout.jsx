import NavBar from "../NavBar"

const UserPanelLayout = ({ children }) => {
    return (
        <>
            <NavBar />
            <main className="w-full min-h-screen bg-gray-700 pt-20">
                {children}
            </main>
        </>
    )
}

export default UserPanelLayout;