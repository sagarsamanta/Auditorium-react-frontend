import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CustomDataTable as DataTable } from "./DataTable";
import { AiFillEdit, AiOutlineDelete } from 'react-icons/ai'

import { RiLockPasswordLine } from 'react-icons/ri'

import SearchBox from "./UI/SearchBox";
import Modal from "./UI/Modal";
import { generateRandomString } from "../lib/utils";
import { BsArrowRepeat } from "react-icons/bs";
import Axios from "../lib/axiosInstance";
import { useAuth } from "../lib/hooks/useAuth";
import { toast } from "react-toastify";
import EditUserModal from "../pages/admin/user/EditUserModal";
import { API_ROOT, USER_EMPLOYEE_ROLE } from "../lib/consts";
import AddUserModal from "../pages/admin/user/AddUserModal";

const DataTableUsers = ({ data, className, addUserModalConfig }) => {
    const [userList, setUsersList] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState();
    const [selectedUserForDelete, setSelectedUserForDelete] = useState();
    const [loadinfEditUserButton, setLoadingedituserButton] = useState(false);
    const [openEditUserModal, setOpnEditUserModal] = useState(false);
    const [openDeleteUserConfirmModal, setDeleteUserConfirmModal] =
        useState(false);
    const [loadingAddUser, setLoadingAddUser] = useState(false);
    const openAddUserModal = addUserModalConfig?.openAddUserModal;

    const [changePasswordModal, setChangePasswordModal] = useState({
        user: {},
        newPassword: "",
        show: false,
        loading: false,
        error: "",
    });
    const newPasswordInputRef = useRef();
    const { token } = useAuth();

    const openEditModal = () => {
        setOpnEditUserModal(true);
    };
    const closeEditModal = () => {
        setOpnEditUserModal(false);
    };
    const openDeleteModal = () => {
        setDeleteUserConfirmModal(true);
    };
    const closeDeleteModal = () => {
        setDeleteUserConfirmModal(false);
    };
    const onOkConfirmDelete = () => {
        setDeleteUserConfirmModal();
        Axios("DELETE", `${API_ROOT}/user/${selectedUserForDelete?._id}`, null, {
            authRequest: true,
            token: token,
        })
            .then((response) => {
                const filteredusers = userList.filter(
                    (user) => user?._id !== selectedUserForDelete?._id
                );
                setUsersList(filteredusers);
                toast.success("User Successfully Removed!");
                closeDeleteModal(false);
                setSelectedUserForDelete();
            })
            .catch((error) => {
                toast.error(`Failed To Remove`);
            })
            .finally(() => {
                // setAddUserModalOpen(false);
            });
    };
    const confirmConfig = {
        title: "Are you sure you want to remove this employee ?",
        buttonText: "Ok",
        text: openDeleteUserConfirmModal
            ? `Name : ${selectedUserForDelete?.name}`
            : "",
        buttonHandler: onOkConfirmDelete,
    };
    const closeConfirmModal = () => {
        setDeleteUserConfirmModal(false);
    };

    // Change Password Modal Handlers
    const changePasswordModalHandler = (user) => {
        setChangePasswordModal({ user: user, show: !changePasswordModal.show });
    };
    const handleNewPasswordInput = (e) => {
        setChangePasswordModal({
            ...changePasswordModal,
            newPassword: e?.target?.value,
        });
    };
    const generateNewPassword = () => {
        const newPass = generateRandomString();
        setChangePasswordModal({ ...changePasswordModal, newPassword: newPass });
        newPasswordInputRef.current.value = newPass;
    };
    const saveNewPassword = () => {
        if (changePasswordModal?.user && changePasswordModal?.newPassword) {
            const newUserPassword = {
                empId: changePasswordModal.user?.empId,
                newPassword: changePasswordModal.newPassword,
            };
            setChangePasswordModal({ ...changePasswordModal, loading: true });
            Axios("PUT", "user/change-password", newUserPassword, {
                authRequest: true,
                token: token,
            })
                .then((res) => {
                    if (res.status === 200) {
                        setChangePasswordModal({ ...changePasswordModal, show: false });
                        toast.success(res?.data?.message);
                    } else {
                        toast.error(res?.data?.message);
                    }
                })
                .catch((err) => {
                    console.log("err", err);
                    toast.error(err?.response?.data?.message);
                });
        } else {
            setChangePasswordModal({ ...changePasswordModal, error: true });
        }
    };
    const chnagePasswordModalConfig = {
        title: `Change Password for ${changePasswordModal?.user?.name || ""}`,
        text: (
            <>
                <label htmlFor="newPassword">New Password</label>
                <div className="flex justify-center items-center gap-4">
                    <div className="w-full">
                        <input
                            type="text"
                            name="newPassword"
                            id="newPassword"
                            onChange={handleNewPasswordInput}
                            autoFocus={true}
                            value={changePasswordModal?.newPassword}
                            ref={newPasswordInputRef}
                            className={`w-full outline-none text-gray-800 placeholder-gray-500 h-10 p-2 rounded border `}
                        />
                        <p
                            className={`${changePasswordModal?.error &&
                                    !changePasswordModal?.newPassword?.length
                                    ? "block"
                                    : "hidden"
                                } text-red-700`}
                        >
                            Enter Password
                        </p>
                    </div>
                    <button
                        className="p-2 rounded-lg transition duration-200 border border-skin-base text-center text-skin-base font-serif hover:bg-skin-base hover:text-white"
                        onClick={generateNewPassword}
                    >
                        <BsArrowRepeat />
                    </button>
                </div>
            </>
        ),
        buttonText: "Save",
        buttonHandler: saveNewPassword,
        loading: changePasswordModal?.loading,
    };

    // Edit User Modal Handlers
    const handleEditUserRequest = (data, id) => {
        Axios("PUT", `${API_ROOT}/user/${id}`, data, {
            authRequest: true,
            token: token,
        })
            .then((response) => {
                console.log(response.data);
                const indexToUpdate = userList.findIndex((user) => user?._id === id);
                const updatedUsers = [...userList];
                if (indexToUpdate !== -1) {
                    // Use array manipulation to replace the object at the found index
                    updatedUsers.splice(indexToUpdate, 1, response?.data?.users);
                    setUsersList(updatedUsers);
                    toast.success("Edit successfull!");
                    setOpnEditUserModal(false);
                    setSelectedUserForEdit();
                }
            })
            .catch((error) => {
                toast.error(`Failed to edit`);
            })
            .finally(() => {
                // setAddUserModalOpen(false);
            });
    };

    // Add User Modal Handlers
    const handleAddUserRequest = (values) => {
        setLoadingAddUser(true);
        const user = { ...values, role: USER_EMPLOYEE_ROLE };

        Axios("POST", `/user/register`, user, { authRequest: true, token: token })
            .then((response) => {
                if (response?.status === 200) {
                    setUsersList((prevUsers) => {
                        return [response?.data?.user, ...prevUsers]
                    });
                    toast.success(`Employee Added Successfully!`);
                    handleAddUserModalClose();
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
    const handleAddUserModalClose = () => {
        addUserModalConfig?.handleAddUserModalClose();
    }

    // Datatable columns
    const columns = [
        {
            name: "Emp Id",
            sortable: true,
            selector: (row) => row.empId,
            cell: (row) => (
                <Link
                    to={`/admin/users/booking/${row._id}`}
                    className="underline text-blue-500"
                >
                    {row.empId}
                </Link>
            ),
        },
        {
            name: "Name",
            cell: (row) => <div className="w-72 md:w-80">{row.name}</div>,
        },
        {
            name: "Email",
            cell: (row) => <div className="w-72">{row.email}</div>,
        },
        {
            name: "Mobile",
            cell: (row) => <div>{row.mobile}</div>,
        },
        {
            name: "Actions",
            minWidth: "250px",
            cell: (row) => (
                <div className="space-x-4 flex justify-center items-center gap-2">
                    <button
                        className="inline-block p-2 rounded-lg transition duration-200 border border-green-700 text-center text-green-700 font-serif hover:bg-green-600 hover:text-white"
                        title="Edit User"
                        onClick={() => {
                            openEditModal();
                            setSelectedUserForEdit(row);
                        }}
                    >
                        <AiFillEdit size={15} />
                    </button>
                    <button
                        className="inline-block p-2 rounded-lg transition duration-200 border border-red-700 text-center text-red-700 font-serif hover:bg-red-600 hover:text-white"
                        title="Change Password"
                        onClick={() => changePasswordModalHandler(row)}
                    >
                        <RiLockPasswordLine size={15} />
                    </button>
                    <button
                        className="inline-block p-2 rounded-lg transition duration-200 border border-red-700 text-center text-red-700 font-serif hover:bg-red-600 hover:text-white"
                        title="Delete User"
                        onClick={() => {
                            setSelectedUserForDelete(row);
                            openDeleteModal();
                        }}
                    >
                        <AiOutlineDelete size={15} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <SearchBox
                data={data}
                setData={setUsersList}
                setIsLoading={setIsLoading}
            />
            <DataTable
                columns={columns}
                data={userList}
                className={className}
                pagination
                paginationPerPage={20}
                title="Users List"
                progressPending={isLoading}
            />

            {/* Delete User Modal */}
            {openDeleteUserConfirmModal && (
                <Modal
                    isOpen={openDeleteUserConfirmModal}
                    closeHandler={closeConfirmModal}
                    config={confirmConfig}
                />
            )}

            {/* Chnage Password Modal */}
            <Modal
                isOpen={changePasswordModal?.show}
                closeHandler={closeDeleteModal}
                config={chnagePasswordModalConfig}
            />

            {/* Edit user modal */}
            {openEditUserModal && (
                <EditUserModal
                    isOpen={openEditUserModal}
                    closeHandler={closeEditModal}
                    initialValues={selectedUserForEdit}
                    isLoading={loadinfEditUserButton}
                    handleEditUserRequest={handleEditUserRequest}
                />
            )}

            {/* Add user modal  */}
            {openAddUserModal && (
                <AddUserModal
                    isOpen={openAddUserModal}
                    closeHandler={handleAddUserModalClose}
                    handleAddUserRequest={handleAddUserRequest}
                    isLoading={loadingAddUser}
                />
            )}
        </>
    );
};

export default DataTableUsers;
