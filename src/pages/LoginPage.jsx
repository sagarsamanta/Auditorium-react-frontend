import Logo from "../components/UI/Logo";
import LoginForm from "../components/LoginForm";
import { OPGC } from "../lib/consts";

const LoginPage = () => {
  return (
    <>
      <section className="flex items-center min-h-screen mx-auto lg:justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col overflow-hidden rounded-md shadow-lg w-full md:flex-row md:flex-1 lg:max-w-screen-md">
          <div className="p-4 py-6 text-skin-muted bg-gray-800 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-center md:gap-3">
            <div className="my-3 text-4xl font-bold tracking-wider text-center text-skin-inverted flex justify-center items-center">
              <Logo />
            </div>

            <p className="mt-4 font-normal text-center md:mt-0">
              Movie Booking Portal for <span className="font-semibold">{OPGC}</span>
            </p>
            {/* <p className="mt-6 font-normal text-center md:mt-0">{OPGC}</p> */}
          </div>
          <LoginForm />
        </div>
      </section>
    </>
  );
};

export default LoginPage;
