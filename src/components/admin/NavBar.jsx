import { BiMoviePlay } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

const NavBar = () => {
  // const pathname = usePathname();
  // const startsWith = (str) => pathname.startsWith(str);
  // console.log(startsWith("/admin/movies"));
  return (
    <nav
      className="flexjustify-between flex-col"
    >
      <div className="flex flex-col gap-3">
        <Link
          to="/admin/movies"
          className={`flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
        >
          <div className="flex justify-center items-center gap-4">
            <BiMoviePlay size={20} />
            <div>Movies</div>
          </div>
        </Link>
        <Link
          to="/admin/users"
          className={`flex items-center space-x-2 py-2 px-4 transition duration-200 hover:bg-gray-700 hover:text-white`}
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
