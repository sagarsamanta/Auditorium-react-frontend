import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllUsers } from "../../../lib/utils";
import Loader from "../../../components/UI/Loader";
import DataTableUsers from "../../../components/DataTableUsers";
import { useAuth } from "../../../lib/hooks/useAuth";
import { AiOutlineUserAdd } from "react-icons/ai";
import AddUserModal from "./AddUserModal";
import { USER_EMPLOYEE_ROLE } from "../../../lib/consts";
import Axios from "../../../lib/axiosInstance";
import { toast } from "react-toastify";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddUserModal, setAddUserModalOpen] = useState(false);
    const { token } = useAuth();
    const [loadingAddUser, setLoadingAddUser] = useState(false);

    useEffect(() => {
        const response = async () => {
            const data = await getAllUsers(token);
            setUsers(data?.users);
            setLoading(false);
        };
        response();
    }, []);

    const handleAddUserModalOpen = () => {
        setAddUserModalOpen(true);
    };
    const handleAddUserModalClose = () => {
        setAddUserModalOpen(false);
    };
    const sendAddUserRequest = (values) => {
        setLoadingAddUser(true);
        const user = { ...values, role: USER_EMPLOYEE_ROLE };

        Axios("POST", `/user/register`, user, { authRequest: true, token: token })
            .then((response) => {
                console.log('then users', response);
                if (response?.status === 200) {
                    setUsers([response?.data?.user, ...users]);
                    toast.success(`Employee Added Successfully!`);
                    setAddUserModalOpen(false);
                }
            })
            .catch((error) => {
                console.error("Error adding user:", error?.response);
                if (error?.response?.status === 409) {
                    toast.warn(`${error?.response?.data?.message}`);
                } else {
                    toast.error(`An error occurred. Failed to add user.`);
                }
            })
            .finally(() => {
                setLoadingAddUser(false);
            });
    };
    return (
        <>
            <main className="movies-page  ">
                <div className="flex justify-between items-center p-4 border border-slate-100 rounded-md shadow-md">
                    <h1 className="text-xl md:text-2xl lg:text:3xl">Users</h1>
                    <Link
                        to=""
                        className="text-sm inline-block px-2 py-2 md:px-4 md:py-3 rounded-lg bg-skin-base text-skin-inverted"
                    >
                        <div
                            className="flex gap-2 items-center "
                            onClick={handleAddUserModalOpen}
                        >
                            <AiOutlineUserAdd size={18} /> <div>Add New User</div>
                        </div>
                    </Link>
                </div>

                <div className="movies-table-wrapper p-4 shadow-md mt-5">
                    {loading ? (
                        <Loader className={"m-auto"} />
                    ) : (
                        <DataTableUsers data={users} />
                    )}
                </div>
                {openAddUserModal && (
                    <AddUserModal
                        isOpen={openAddUserModal}
                        closeHandler={handleAddUserModalClose}
                        sendAddUserRequest={sendAddUserRequest}
                        isLoading={loadingAddUser}
                    />
                )}
            </main>
        </>
    );
};

export default UsersPage;
