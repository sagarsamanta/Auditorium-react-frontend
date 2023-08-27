import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingButton from "../../../components/UI/LoadingButton";

export default function EditUserModal({
  isOpen,
  closeHandler,
  isLoading,
  initialValues,
  handleEditUserRequest,
}) {
  function closeModal() {
    closeHandler(false);
  }
  const validationSchema = Yup.object({
    empId: Yup.string().required("Employee ID is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address"),
    // .required("Email is required"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d{10}$/, "Mobile number must be a 10-digit number"),
  });

  const formik = useFormik({
    initialValues: {
      empId: initialValues.empId, // Pre-fill the values here
      name: initialValues.name,
      email: initialValues.email,
      mobile: initialValues.mobile,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleEditUserRequest(values, initialValues?._id);
    },
  });

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                  Edit Employee Details
                  </Dialog.Title>
                  <form onSubmit={formik.handleSubmit} className="space-y-6 mt-3">
                    <div>
                      <label
                        htmlFor="empId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Employee ID
                      </label>
                      <input
                        readOnly
                        type="text"
                        id="empId"
                        value={formik.values.empId}
                        {...formik.getFieldProps("empId")}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formik.touched.empId && formik.errors.empId && (
                        <p className="mt-2 text-sm text-red-600">
                          {formik.errors.empId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formik.values.name}
                        {...formik.getFieldProps("name")}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="mt-2 text-sm text-red-600">
                          {formik.errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formik.values.email}
                        {...formik.getFieldProps("email")}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mobile Number
                      </label>
                      <input
                        type="number"
                        id="mobile"
                        value={formik.values.mobile}
                        {...formik.getFieldProps("mobile")}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formik.touched.mobile && formik.errors.mobile && (
                        <p className="mt-2 text-sm text-red-600">
                          {formik.errors.mobile}
                        </p>
                      )}
                    </div>

                    <div className="mt-6">
                      {/* <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add User
                      </button> */}
                      <LoadingButton
                        text={"Update User"}
                        isLoading={isLoading}
                        className={`transition delay-150 border border-transparent bg-skin-base py-2 text-sm font-medium text-skin-inverted hover:bg-skin-base/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-base focus-visible:ring-offset-2`}
                        onClick={formik.handleSubmit}
                      />
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md transition delay-150 border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-skin-inverted focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ml-3"
                        onClick={closeHandler}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
