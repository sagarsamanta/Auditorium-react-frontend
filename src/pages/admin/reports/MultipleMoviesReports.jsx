import React from "react";
import { getCurrencyFormat } from "../../../lib/utils";

const MultipleMoviesReports = ({ data }) => {

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-base font-bold mb-2">Aggregated Reports</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {/* <th className="border border-gray-300 px-4 py-2">Movie Title</th> */}
            <th className="border border-gray-300 px-4 py-2">Total Booking</th>
            <th className="border border-gray-300 px-4 py-2">Total Reserved Seats</th>
            <th className="border border-gray-300 px-4 py-2">Total Amount Collected</th>
            <th className="border border-gray-300 px-4 py-2">Total Amount Online</th>
            <th className="border border-gray-300 px-4 py-2">Total Amount Cash</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            {/* <td className="border border-gray-300 px-4 py-2">{movieTitle}</td> */}
            <td className="border border-gray-300 px-4 py-2  text-center">{data?.bookedSeats}</td>
            <td className="border border-gray-300 px-4 py-2 text-center ">{data?.reservedSeats}</td>
            <td className="border border-gray-300 px-4 py-2 text-center">{data?.totalAmountCollected?.total && getCurrencyFormat(data?.totalAmountCollected?.total)} </td>
            <td className="border border-gray-300 px-4 py-2 text-center">{data?.totalAmountCollected?.online && getCurrencyFormat(data?.totalAmountCollected?.online)}</td>
            <td className="border border-gray-300 px-4 py-2 text-center">{data?.totalAmountCollected?.cash && getCurrencyFormat(data?.totalAmountCollected?.cash)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MultipleMoviesReports;
