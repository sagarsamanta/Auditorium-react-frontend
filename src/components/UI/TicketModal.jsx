import { React, Fragment, useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import LoadingButton from "./LoadingButton";
import { GoDownload } from "react-icons/go";
import { displayDate, displayTime, getCurrencyFormat } from "../../lib/utils";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdClose } from 'react-icons/md';

export default function TicketModal({ isOpen, handleDownloadTickets, closeHandler, ticket }) {
    const {
        title,
        poster,
        releaseDate,
        showTitle,
        showTime,
        noOfSeatsBook,
        bookingId,
        seatNo,
        seatsPriceObj,
        amount,
        language
    } = ticket;
    const slickSliderSettings = {
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: true,
    };
    const [loading, setLoading] = useState(false);
    function closeModal() {
        closeHandler(false);
    }


    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-30" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-900"
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
                                <Dialog.Panel className="w-[330px] max-w-[330px] transform overflow-hidden rounded-xl py-7 px-3 bg-gray-100 text-left align-middle shadow-xl transition-all relative">
                                    <button
                                        className='absolute top-0 right-0 p-2'
                                        onClick={closeModal}
                                    >
                                        <MdClose size={15} />
                                    </button>
                                    <Slider {...slickSliderSettings}>
                                        {
                                            seatsPriceObj?.map((seat) => (
                                                <>
                                                    <div className="relative rounded-lg text-sm bg-white shadow-xl">
                                                        <div className="flex gap-2 p-3">
                                                            <div className="w-1/3 max-h-[140px]">
                                                                <img src={poster} alt={title} className="w-auto object-fill h-full rounded-md" />
                                                            </div>
                                                            <div className="w-2/3 flex flex-col gap-1 capitalize">
                                                                <h5 className="text-xl uppercase font-semibold line-clamp-2">{title}</h5>
                                                                <p>({language})</p>
                                                                <p>{displayDate(releaseDate, "ddd, DD MMM")} | {displayTime(showTime)}</p>
                                                                <p>{"kolkata,VR Mall"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="my-3 border-dashed border-2 border-gray-100 relative before:content-[''] before:absolute before:w-5 before:h-5 before:bg-gray-100 before:rounded-full before:top-1/2 before:left-[-10px] before:-translate-y-1/2 before:shadow-inner  after:content-[''] after:absolute after:w-5 after:h-5 after:bg-gray-100 after:rounded-full after:top-1/2 after:right-[-10px] after:-translate-y-1/2 after:shadow-inner" />
                                                        <div className="p-3">
                                                            <p className="text-center uppercase text-lg font-semibold">{seat?.seatNo}</p>
                                                            <p className="text-center capitalize font-semibold text-gray-600">{showTitle}</p>
                                                            <p className="text-center uppercase text-lg font-semibold">Booking Id: <span className="tracking-wider">{bookingId}</span></p>
                                                        </div>
                                                        <div className="p-3 flex justify-between">
                                                            <span>Total Amount:</span>
                                                            <span>{getCurrencyFormat(seat?.price)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-12 space-x-3 text-center">
                                                        <LoadingButton
                                                            text={`Download Ticket ${seat?.seatNo}`}
                                                            isLoading={loading}
                                                            icon={<GoDownload size={15} />}
                                                            className={`transition delay-150 border border-transparent bg-skin-base py-1 text-sm font-medium text-skin-inverted hover:bg-skin-base/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-base focus-visible:ring-offset-2`}
                                                            onClick={() => handleDownloadTickets({
                                                                title,
                                                                poster,
                                                                releaseDate,
                                                                showTitle,
                                                                showTime,
                                                                noOfSeatsBook: 1,
                                                                bookingId: `${bookingId}-${seat?.seatNo}`,
                                                                seatNo: seat?.seatNo,
                                                                amount: seat?.price,
                                                                language
                                                            })}
                                                        />
                                                    </div>
                                                </>
                                            ))
                                        }
                                    </Slider>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
