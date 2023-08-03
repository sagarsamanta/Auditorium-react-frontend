import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import LoadingButton from "./LoadingButton";
import { displayDate, displayTime } from "../../lib/utils";
import Axios from "../../lib/axiosInstance";
import { useAuth } from "../../lib/hooks/useAuth";
import axios from "axios";

export default function TicketModal({ isOpen, closeHandler, ticket }) {
    const {
        title,
        poster,
        releaseDate,
        showTime,
        noOfSeatsBook,
        bookingId,
        seatNo,
        amount,
        language
    } = ticket;
    const { token } = useAuth();
    function closeModal() {
        closeHandler(false);
    }
    const handleDownloadTickets = (data) => {
        axios
            .post('http://localhost:5000/api/user/ticket', data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Replace `token` with your actual token value
                },
                responseType: 'blob',
            })
            .then((response) => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.setAttribute('download', 'movie_ticket.pdf');
                tempLink.click();
                URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error downloading PDF:', error);
            });
    }

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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-1 text-left align-middle shadow-xl transition-all">
                                    <div className="text-black">
                                        <div className=" rounded-lg p-4 flex flex-col md:flex-row gap-4 md:gap-8 shadow-lg">
                                            <div className="w-full md:w-1/3">
                                                <img src={poster} alt={title} className="w-auto object-fill h-full rounded-lg" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-xl font-semibold">{title}</div>
                                                <div>{language}, 2D</div>
                                                <div>{displayDate(releaseDate)} | {displayTime(showTime)}</div>
                                                <div>{"kolkata,VR Mall"}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-col gap-1">
                                                <div className="">NO OF TICKETS : <span>{noOfSeatsBook}</span></div>
                                                <div>BOOKING ID : <span>{bookingId}</span></div>
                                                <div>TOTAL AMOUNT : <span>{amount}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-x-3 text-center">
                                        <LoadingButton
                                            text={"Download"}
                                            //   isLoading={config?.loading}
                                            className={`transition delay-150 border border-transparent bg-skin-base py-1 text-sm font-medium text-skin-inverted hover:bg-skin-base/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-base focus-visible:ring-offset-2`}
                                            onClick={() => handleDownloadTickets(ticket)}
                                        />
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md transition delay-150 border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-skin-inverted focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
