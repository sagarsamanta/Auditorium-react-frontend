import React, { useState } from "react";
import BookingHistory from "./Ticket-Bookings/AllTypeBookins"; // Import your BookingHistory component
import MyBookings from "./Ticket-Bookings/MyBookings";
import UsersBookings from "./Ticket-Bookings/UsersBookings";

const TabComponent = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between space-x-2 md:space-x-4 lg:space-x-8">
        <button
          className={`flex-1 p-2 ${
            selectedTab === 0 ? "bg-blue-500 text-white" : "bg-blue-200"
          }`}
          onClick={() => handleTabChange(0)}
        >
          All Bookings
        </button>
        <button
          className={`flex-1 p-2 ${
            selectedTab === 1 ? "bg-green-500 text-white" : "bg-green-200"
          }`}
          onClick={() => handleTabChange(1)}
        >
          My Booked
        </button>
        <button
          className={`flex-1 p-2 ${
            selectedTab === 2 ? "bg-yellow-500 text-white" : "bg-yellow-200"
          }`}
          onClick={() => handleTabChange(2)}
        >
          User Booked
        </button>
      </div>

      <div className="mt-4">
        {selectedTab === 0 && <BookingHistory />}
        {selectedTab === 1 && <MyBookings />}
        {selectedTab === 2 && <UsersBookings />}
      </div>
    </div>
  );
};

export default TabComponent;
