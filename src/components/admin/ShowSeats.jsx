import Axios from "../../lib/axiosInstance";
import {
  MAX_SEATS_PER_BOOKING,
  PAYMENT,
  PAYMENT_METHOS,
  SEATS,
  USER_ADMIN_ROLE,
  USER_EMPLOYEE_ROLE,
} from "../../lib/consts";
import {
  getCurrencyFormat,
  getSeatPriceObj,
  getSeatsForShow,
  organizeSeatsByStatus,
} from "../../lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../UI/Loader";
import Modal from "../UI/Modal";
import BookingConfirmation from "../../pages/admin/movie/booking/BookingConfirmation";
import BookingConfirm from "../UI/BookingConfirm";
import { redirectToPaymentGateway } from "../../lib/payment";
import { useNavigate } from "react-router-dom";

const ShowSeats = ({ movieId, showId, show, authUser, priceList, movie }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatsList, setSeats] = useState(null);
  const [loading, setLoading] = useState({
    booking: false,
    reserved: false,
    seats: true,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isOpenReserveSeatModal, setIsOpenReserveSeatModal] = useState(false);
  const [isOpenSelectedSeatModal, setIsOpenSelectedSeatModal] = useState(false);
  const [isOpenReserveConfirmSeatModal, setHandleCloseReservedConfirmModal] =
    useState(false);
  const [selectedReservedSeate, setSelectedReservedSeate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOS.DEFAULT);
  const seatsByStatus = organizeSeatsByStatus(seatsList?.seats);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [seatGuests, setSeatGuests] = useState([]);

  const paymentFormRef = useRef();
  const clientCodeRef = useRef();
  const encDataRef = useRef();
  const paymentFormRefs = { paymentFormRef, clientCodeRef, encDataRef };
  const navigate = useNavigate();

  const fetchFreshData = async () => {
    if (authUser?.user?.role !== USER_ADMIN_ROLE)
      setLoading({ ...loading, seats: true });
    const seats = await getSeatsForShow(movieId, showId, authUser?.token);
    if (seats) setSeats(seats);
    setLoading({ booking: false, reserved: false, seats: false });
    setSelectedSeats([]);
  };
  const handleSelect = (e, seatNo) => {
    e.preventDefault();
    // If seat is booked / visited, then do not allow to select
    if (seatsByStatus?.BOOKED?.seatNo?.includes(seatNo)) return;
    if (seatsByStatus?.VISITED?.seatNo?.includes(seatNo)) return;

    if (seatsByStatus?.RESERVED?.seatNo.includes(seatNo)) {
      setIsOpenReserveSeatModal(true);
      setSelectedReservedSeate(seatNo);
    }

    if (selectedSeats.includes(seatNo)) {
      const newSelectedSeats = selectedSeats.filter(
        (selectedSeat) => selectedSeat !== seatNo
      );
      setSelectedSeats(newSelectedSeats);
    } else {
      if (authUser?.user?.role === USER_ADMIN_ROLE) {
        setSelectedSeats([...selectedSeats, seatNo]);
      } else if (
        authUser?.user?.role === USER_EMPLOYEE_ROLE &&
        selectedSeats.length < MAX_SEATS_PER_BOOKING
      ) {
        setSelectedSeats([...selectedSeats, seatNo]);
      } else {
        toast.warning(`You can only select ${MAX_SEATS_PER_BOOKING} seats`);
      }
    }
  };
  const handleCloseReservedModal = () => {
    setIsOpenReserveSeatModal(false);
    setSelectedSeats([]);
  };
  const handleCloseReservedConfirmModal = () => {
    setHandleCloseReservedConfirmModal(false);
    setSelectedSeats([]);
  };

  const getSeatStatusColor = (seatNo) => {
    if (seatsList?.totalSeats) {
      if (
        seatsByStatus?.BOOKED?.seatNo.includes(seatNo) ||
        seatsByStatus?.VISITED?.seatNo.includes(seatNo)
      ) {
        return "bg-skin-seat-booked cursor-not-allowed";
      }
      if (seatsByStatus?.RESERVED?.seatNo.includes(seatNo)) {
        if (authUser?.user?.role !== USER_ADMIN_ROLE)
          return "bg-skin-seat-booked cursor-not-allowed";
        return "bg-skin-seat-reserved";
      }
    }
    if (selectedSeats.includes(seatNo)) {
      return "bg-skin-seat-selected";
    }
    const availableTextColor =
      authUser?.user?.role === USER_ADMIN_ROLE ? "" : "text-white";
    return `${availableTextColor} border transition bg-green-800/20 hover:bg-green-800/40 border-green-800/70 focus:ring-green-800/70`;
  };

  const getRowBgColor = () => {
    const bgColor =
      authUser?.user?.role === USER_ADMIN_ROLE
        ? "bg-gray-200/50"
        : "bg-skin-muted/10";
    return `${bgColor}`;
  };

  const getTotalSelectedPrice = (seatsObj) => {
    return seatsObj?.reduce((total, seat) => total + seat.price, 0);
  };

  const getSeatsInfoWithGuest = (seatPriceObj) => {
    const data = seatPriceObj.map((seat) => {
      const guest = seatGuests.find(
        (info) => info.seat.trim() === seat.seatNo.trim()
      );
      if (guest) {
        return {
          ...seat,
          name: guest.name,
          phone: guest.phone,
          children: guest.children,
        };
      }

      return seat;
    });
    return data;
  };
  const handleSave = async (payMode) => {
    if (selectedSeats.length > 0) {
      setConfirmLoading(true);
      const seatPriceObj = getSeatPriceObj(selectedSeats, priceList);
      const updatedSeatPriceObj =
        authUser?.user?.role === USER_ADMIN_ROLE
          ? getSeatsInfoWithGuest(seatPriceObj)
          : seatPriceObj;
      console.log(updatedSeatPriceObj);
      const seats = {
        movieId,
        showtimeId: showId,
        seatIds: updatedSeatPriceObj,
        userId: selectedEmployee ? selectedEmployee.value : authUser.user._id,
        totalPrice: getTotalSelectedPrice(seatPriceObj),
        paymentMode: payMode,
      };

      if (paymentMethod === PAYMENT_METHOS.ONLINE) {
        // Online Payment
        await redirectToPaymentGateway(authUser.user, seats, paymentFormRefs);
      } else if (
        paymentMethod === PAYMENT_METHOS.CASH &&
        authUser?.user?.role === USER_ADMIN_ROLE
      ) {
        // Cash Payment By Admin
        Axios("POST", `/booking/book-movie-byCash/${movieId}`, seats, {
          authRequest: true,
          token: authUser.token,
        })
          .then(async (res) => {
            if (res?.status === 201) {
              toast.success(`Booked Successfully!`);
              navigate("/admin/history");
            }
          })
          .finally(() => {
            setConfirmLoading(false);
            // setLoading((prev) => {
            //   return { ...prev, booking: false };
            // });
            setIsOpenSelectedSeatModal(false);
            fetchFreshData();
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    }
  };
  const handleSaveReserve = async () => {
    if (selectedSeats.length > 0) {
      setLoading((prev) => {
        return { ...prev, reserved: true };
      });
      const seatPriceObj = getSeatPriceObj(selectedSeats, priceList);
      const seats = {
        movieId,
        showtimeId: showId,
        seatIds: seatPriceObj,
        userId: authUser.user._id,
        totalPrice: getTotalSelectedPrice(seatPriceObj),
      };

      // API call to save seats
      Axios("POST", `/booking/reserve-seats/${movieId}`, seats, {
        authRequest: true,
        token: authUser.token,
      })
        .then((res) => {
          if (res?.status === 201) {
            toast.success(`${res?.data?.message}`);
          }
          handleCloseReservedConfirmModal();
        })
        .finally(() => {
          setLoading((prev) => {
            return { ...prev, reserved: false };
          });
          fetchFreshData();
          handleCloseReservedConfirmModal();
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  const handleMakeAvailable = async () => {
    setLoading({ ...loading, reserved: true });
    Axios(
      "DELETE",
      `/show/${movieId}/${showId}/${selectedReservedSeate}`,
      null,
      { authRequest: true, token: authUser?.token }
    )
      .then((res) => {
        console.log("res", res);
      })
      .finally(() => {
        fetchFreshData();
        setSelectedReservedSeate("");
        setIsOpenReserveSeatModal(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    fetchFreshData();
    if (authUser?.user?.role === USER_ADMIN_ROLE) {
      Axios("GET", "/user", null, { authRequest: true, token: authUser?.token })
        .then((res) => {
          if (res.status === 200) {
            const userList = res?.data?.users
              .filter((user) => user.role !== USER_ADMIN_ROLE)
              .map((user) => ({
                label: `${user.name} (${user.empId})`,
                value: user._id,
              }));
            setEmployeeOptions(userList);
          }
        })
        .catch((err) => {
          console.log("err", err.message);
        });
    }
  }, [movieId, showId, authUser, priceList]);

  const closeSeatBookinConfirmModal = () => {
    setIsOpenSelectedSeatModal(false);
  };

  const bookingConfirmationSchema = () => {
    const seatPriceObj = getSeatPriceObj(selectedSeats, priceList);
    const totalAmount = getTotalSelectedPrice(seatPriceObj);
    return (
      <BookingConfirmation
        handlePay={handleSave}
        closeModal={closeSeatBookinConfirmModal}
        selectedSeats={selectedSeats?.sort()?.join(", ")}
        totalAmount={totalAmount}
        show={show}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        isLoading={confirmLoading}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        employeeOptions={employeeOptions}
        setEmployeeOptions={setEmployeeOptions}
        seatGuests={seatGuests}
        setSeatGuests={setSeatGuests}
      />
    );
  };

  return (
    <>
      <div className="seats-wrapper">
        <div className="info-wrapper py-3">
          {/* Info and color code elements */}
          <div className="w-[95%] mx-auto color-code-wrapper flex justify-center flex-wrap items-center gap-x-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm text-skin-inverted border border-green-800/70 bg-green-800/20" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-skin-seat-selected rounded-sm" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-skin-seat-booked rounded-sm" />
              <span>Booked</span>
            </div>
            {authUser?.user?.role === USER_ADMIN_ROLE && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-skin-seat-reserved rounded-sm" />
                <span>Reserved</span>
              </div>
            )}
          </div>
          <div className="m-2 ">
            <div className="flex justify-center items-center font-semibold text-lg mb-1">
              Seats Price List
            </div>
            <div className="w-full mx-auto color-code-wrapper flex flex-col md:flex-row justify-center items-center gap-1 md:gap-3 text-sm">
              <div className="flex rounded-md items-center flex-row gap-2 border border-skin-base px-2">
                <span className="font-semibold">A - C </span>
                <div className="w-fit h-fit p-1 rounded-sm ">
                  {getCurrencyFormat(priceList?.priceRow_a_to_c)}
                </div>
              </div>
              <div className="flex rounded-md items-center flex-row gap-2 border border-skin-base px-2">
                <span className="font-semibold">D - H</span>
                <div className="w-fit h-fit  p-1 ">
                  {getCurrencyFormat(priceList?.priceRow_d_to_h)}
                </div>
              </div>
              <div className="flex rounded-md items-center flex-row gap-2 border border-skin-base px-2">
                <span className="font-semibold">I - N</span>
                <div className="w-fit h-fit  p-1 ">
                  {getCurrencyFormat(priceList?.priceRow_i_to_n)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading.seats ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : (
          <>
            <div className="seats overflow-hidden flex justify-center">
              <div className="wrapper-1 overflow-x-auto">
                <div className="seats-container mt-5 w-max">
                  <div className="screen mb-6 h-6 bg-skin-muted/50 text-center rounded-md">
                    Screen
                  </div>
                  {Object.keys(SEATS).map((row_set) => {
                    const rows = SEATS[row_set];
                    return (
                      <div
                        key={row_set}
                        className={`${row_set} pt-2 pb-4 px-4 my-3 ${getRowBgColor()} rounded-md`}
                      >
                        <div className={`seats-${row_set} flex flex-col gap-1`}>
                          <span className="capitalize text-center mx-auto font-semibold">
                            {row_set.replace("_to_", "-")} (
                            {getCurrencyFormat(
                              priceList[`priceRow_${row_set}`]
                            )}
                            )
                          </span>
                          {Object.keys(rows).map((row) => {
                            const seats = rows[row];
                            return (
                              <div className="w-full flex justify-center items-center gap-1">
                                {seats.map((seat) => {
                                  const seatNo = `${row}${seat}`;
                                  return (
                                    <>
                                      <button
                                        key={seatNo}
                                        className={`seat w-7 h-7 ${getSeatStatusColor(
                                          seatNo
                                        )} rounded-md font-semibold flex justify-center items-center text-[11px] seat-${seatNo} disabled:cursor-not-allowed`}
                                        onClick={(e) => handleSelect(e, seatNo)}
                                      >
                                        {seatNo}
                                      </button>
                                    </>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-stretch md:justify-center items-stretch gap-2 w-full px-0 py-4 md:py-3">
              <button
                className="shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed"
                type="submit"
                onClick={() => setIsOpenSelectedSeatModal(true)}
                disabled={
                  selectedSeats.length === 0 ||
                  loading.booking ||
                  loading.reserved ||
                  loading.seats
                }
              >
                {loading.booking && (
                  <span className="w-4 h-4 border border-r-0 border-skin-inverted inline-block rounded-full absolute top-3 left-4 animate-spin" />
                )}
                Book Selected Seats
              </button>
              {authUser?.user?.role === USER_ADMIN_ROLE && (
                <button
                  className="shadow transition duration-300 ease-in-out bg-skin-base hover:bg-skin-base/80 focus:shadow-outline focus:outline-none text-white py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed"
                  type="submit"
                  onClick={() => {
                    setHandleCloseReservedConfirmModal(true);
                  }}
                  disabled={
                    selectedSeats.length === 0 ||
                    loading.booking ||
                    loading.reserved ||
                    loading.seats
                  }
                >
                  {loading.reserved && (
                    <span className="w-4 h-4 border border-r-0 border-skin-inverted inline-block rounded-full absolute top-3 left-4 animate-spin" />
                  )}
                  Reserve Selected Seats
                </button>
              )}
            </div>
          </>
        )}
        <Modal
          isOpen={isOpenReserveSeatModal}
          closeHandler={handleCloseReservedModal}
          config={{
            title: `Make seat no. "${selectedReservedSeate}" as Available`,
            text: "This will mark this seat as Available for everyone",
            buttonText: "Make Available",
            buttonHandler: handleMakeAvailable,
            loading: loading.reserved,
            buttonClassName:
              "bg-skin-base text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed",
          }}
        />
        <Modal
          isOpen={isOpenReserveConfirmSeatModal}
          closeHandler={handleCloseReservedConfirmModal}
          config={{
            title: (
              <span>
                Seat no. "
                <span className="text-skin-base">
                  {selectedSeats?.sort()?.join(", ")}
                </span>
                "
              </span>
            ),
            text: "Are you sure you want to reserved these seats?",
            buttonText: "Make Reserved",
            buttonHandler: handleSaveReserve,
            loading: loading.reserved,
            buttonClassName:
              "bg-skin-base text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed",
          }}
        />
        <BookingConfirm
          isOpen={isOpenSelectedSeatModal}
          closeHandler={setIsOpenSelectedSeatModal}
          config={{
            title: bookingConfirmationSchema,
            loading: loading.booking,
            buttonClassName:
              "bg-skin-base text-white font-bold py-2 px-10 rounded relative disabled:opacity-75 disabled:cursor-not-allowed",
          }}
        />
        <form
          action={PAYMENT.spURL}
          method="post"
          ref={paymentFormRef}
          className="hidden"
        >
          <input type="hidden" name="encData" ref={encDataRef} />
          <input type="hidden" name="clientCode" ref={clientCodeRef} />
        </form>
      </div>
    </>
  );
};

export default ShowSeats;
