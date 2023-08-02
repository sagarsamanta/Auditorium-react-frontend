import React from 'react'

const BookingsPage = () => {
  return (
    <div class=" text-sm container lg:mx-auto px-3 mt-8 ">
    <h1 class="text-xl md:text-2xl lg:text-3xl p-3 bg-purple-300 rounded-sm  font-semibold mb-4">My Booked Movies</h1>
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <li class="bg-white rounded shadow-md p-4">
        <h2 class="font-semibold mb-2">Movie Title 1</h2>
        <p class="text-gray-600">Date: August 10, 2023</p>
        <p class="text-gray-600">Time: 7:30 PM</p>
      </li>
      <li class="bg-white rounded shadow-md p-4">
        <h2 class=" font-semibold mb-2">Movie Title 2</h2>
        <p class="text-gray-600">Date: August 15, 2023</p>
        <p class="text-gray-600">Time: 6:45 PM</p>
      </li>
    </ul>
  </div>
  )
}

export default BookingsPage