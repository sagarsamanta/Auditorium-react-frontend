import React from 'react';
import SearchBox from '../../components/UI/SearchBox';
import UsersCheckInTable from '../../components/UsersCheckInTable';

const CheckIn = () => {
    // Replace these values with your actual data
    const totalSeats = 100;
    const availableSeats = 70;
    const reservedSeats = 20;
    const bookedSeats = 10;
    const peopleInsideAuditorium = 50;
    const peopleNotEntered = 20;

    return (
        <div className="container">
            <h2 className="text-xl">Auditorium Status</h2>
            <div className="bg-white rounded-lg  py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Total Seats</span>
                    <span className="text-sm ">{totalSeats}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Available Seats</span>
                    <span className="test-sm ">{availableSeats}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Reserved Seats</span>
                    <span className="test-sm ">{reservedSeats}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">Booked Seats</span>
                    <span className="test-sm ">{bookedSeats}</span>
                </div>
                <div className="border p-4 rounded-lg flex flex-col shadow-md">
                    <span className=" text-sm font-semibold">People Inside Auditorium</span>
                    <span className="test-sm ">{peopleInsideAuditorium}</span>
                </div>

            </div>
            <div>
                <UsersCheckInTable/>
            </div>
        </div>
    );
};

export default CheckIn;
