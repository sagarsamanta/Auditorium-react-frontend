"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BiMoviePlay } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";

const NavBar = () => {
  const pathname = usePathname();
  const startsWith = (str) => pathname.startsWith(str);
  console.log(startsWith("/admin/movies"));
  return (
    <nav
      data-dev-hint="main navigation"
      className="flexjustify-between flex-col"
    >
      <div className="flex flex-col gap-3">        
        <Link
          href="/admin/movies"
          className={`${
            (startsWith("/admin/movies") || startsWith("/admin/shows")) &&
            "bg-sky-700"
          } flex items-center space-x-2 py-2 px-8 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <BiMoviePlay />
            <div>Movies</div>
          </div>
        </Link>
        <Link
          href="/admin/users"
          className={`${
            pathname === "/admin/users" && "bg-sky-700"
          } flex items-center space-x-2 py-2 px-8 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <FiUsers size={20} />
            <div>Users</div>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
