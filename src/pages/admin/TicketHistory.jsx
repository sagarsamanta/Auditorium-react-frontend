import React, { useState } from "react";
import MyBookings from "./Ticket-Bookings/MyBookings";
import UsersBookings from "./Ticket-Bookings/UsersBookings";
import BookingHistory from "./Ticket-Bookings/AllTypeBookins";

const TabComponent = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const tabStyles = "mr-2  text-base md:text-lg lg:text-xl font-500 cursor-pointer rounded-md"; // Common style for all tabs
  const activeTabStyles = "text-blue-500"; // Active tab style
  const inactiveTabStyles = "text-gray-500"; // Inactive tab style

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center space-x-2 md:space-x-4 lg:space-x-8">
        <button
          className={`relative  ${tabStyles} ${
            selectedTab === 0 ? activeTabStyles : inactiveTabStyles
          }`}
          onClick={() => handleTabChange(0)}
        >
          All Bookings
          {selectedTab === 0 && (
            <div className="border-b-2 border-blue-500 absolute w-full bottom-0"></div>
          )}
        </button>
        <button
          className={`relative ${tabStyles} ${
            selectedTab === 1 ? activeTabStyles : inactiveTabStyles
          }`}
          onClick={() => handleTabChange(1)}
        >
          My Booked
          {selectedTab === 1 && (
            <div className="border-b-2 border-blue-500 absolute w-full bottom-0"></div>
          )}
        </button>
        <button
          className={`relative ${tabStyles} ${
            selectedTab === 2 ? activeTabStyles : inactiveTabStyles
          }`}
          onClick={() => handleTabChange(2)}
        >
          User Booked
          {selectedTab === 2 && (
            <div className="border-b-2 border-blue-500 absolute w-full bottom-0"></div>
          )}
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
