import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CustomDataTable as DataTable } from "./DataTable";
import { MdEdit, MdPassword } from "react-icons/md";
import SearchBox from "./UI/SearchBox";
import { AiOutlineDelete } from "react-icons/ai";
import Modal from "./UI/Modal";
import { generateRandomString } from "../lib/utils";
import { BsArrowRepeat } from "react-icons/bs";
import Axios from "../lib/axiosInstance";
import { useAuth } from "../lib/hooks/useAuth";
import { toast } from "react-toastify";

const DataTableUsers = ({ data, className }) => {
  const [userList, setUsersList] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState({
    user: "",
    show: false,
  });
  const [changePasswordModal, setChangePasswordModal] = useState({
    user: {},
    newPassword: "",
    show: false,
    loading: false,
    error: "",
  });
  const newPasswordInputRef = useRef();
  const { token } = useAuth();
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
      cell: (row) => (
        <div className="space-x-4">
          <button
            className="inline-block p-2 rounded-lg transition duration-200 border border-red-700 text-center text-red-700 font-serif hover:bg-red-600 hover:text-white"
            title="Change Password"
            onClick={() => changePasswordModalHandler(row)}
          >
            Change Password
          </button>

          {/* <button to="#" className="inline-block p-2 rounded-lg transition duration-200 border border-skin-base text-center text-skin-base font-serif hover:bg-skin-base hover:text-white" title="Edit"><MdEdit size={15} /></button>

                    <button onClick={() => openConfirmModal(row.name)} className="text-lg inline-block p-2 rounded-lg transition duration-200 border border-red-500 text-center text-red-500 font-serif hover:bg-red-500 hover:text-white" title="Remove"><AiOutlineDelete size={15} /></button> */}
        </div>
      ),
    },
  ];
  const onOkConfirmDelete = () => {
    console.log("Api called for delete");
    closeConfirmModal();
  };
  const confirmConfig = {
    title: "Are you sure you want to remove this user ?",
    buttonText: "Ok",
    text: showDeleteConfirm ? `Name : ${showDeleteConfirm.movie}` : "",
    buttonHandler: onOkConfirmDelete,
  };
  const closeConfirmModal = () => {
    setShowDeleteConfirm({
      movie: "",
      show: false,
    });
  };
  const openConfirmModal = (text) => {
    setShowDeleteConfirm({
      movie: text,
      show: true,
    });
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
              className={`${
                changePasswordModal?.error &&
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
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm.show}
          closeHandler={closeConfirmModal}
          config={confirmConfig}
        />
      )}

      {/* Chnage Password Modal */}
        <Modal
          isOpen={changePasswordModal?.show}
          closeHandler={changePasswordModalHandler}
          config={chnagePasswordModalConfig}
        />
    </>
  );
};

export default DataTableUsers;
