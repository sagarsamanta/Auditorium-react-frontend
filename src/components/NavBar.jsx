import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import Logo from './UI/Logo';
import { Link, useLocation } from 'react-router-dom';
import { userProfileImage } from '../lib/utils';

const NavBar = () => {
    const { user, isAuthenticated, token, logout } = useAuth();
    const { pathname } = useLocation();
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {() => (
                <>
                    <div className="mx-auto container px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <Logo />
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        {
                                            isAuthenticated && token !== null ? (
                                                <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" title={user?.name || 'User'}>
                                                    <span className="absolute -inset-1.5" />
                                                    <span className="sr-only">Open user menu</span>
                                                    {userProfileImage(user)}
                                                </Menu.Button>
                                            ) : (
                                                <Link
                                                    to={`${pathname === "/login" ? "/" : "/login"}`}
                                                    className={`text-white bg-skin-base hover:bg-skin-base/20 hover:text-white rounded-md px-3 py-2 text-sm font-medium`}
                                                >
                                                    {`${pathname === "/login" ? "Back to Home" : "Login"}`}
                                                </Link>
                                            )
                                        }
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to={`/user/profile/${user?.email}`}
                                                        className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm capitalize`}
                                                    >
                                                        {user?.name}
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to={`/user/profile/history/${user?.email}`}
                                                        className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm`}
                                                    >
                                                        Booking History
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => logout()}
                                                        className={`${active ? 'bg-red-100' : ''} block w-full text-left px-4 py-2 text-sm`}
                                                    >
                                                        Sign out
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    )
}

export default NavBar;