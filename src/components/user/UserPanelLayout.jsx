import NavBar from "../NavBar"

const UserPanelLayout = ({ children }) => {
    return (
        <>
            <NavBar />
            {children}
        </>
    )
}

export default UserPanelLayout;