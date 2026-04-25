import React, { useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaLaptopMedical } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { NavLink } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ open }) => {
    const [userOpen, setUserOpen] = useState(false);

    return (
        <aside
            className={`fixed top-0 left-0 h-[calc(120vh-64px)]
        bg-back transition-all duration-300
        ${open ? "w-64" : "w-16"}
      `}
        >
            <div className="text-2xl flex items-center gap-2 font-bold uppercase m-4">

                {open ?
                    <>
                        <p className="text-primary">Crowd</p>
                        <p className="text-secondary">Craft</p>
                        <FaLaptopMedical className="text-primary" />
                    </>
                    :
                    <FaLaptopMedical className="text-primary" />
                }
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <NavLink
                    to="/admin-dashboard"
                    className="rounded px-3 py-2 text-white hover:text-secondary"
                >
                    {open ?
                        <div className="flex items-center gap-2">
                            <HiHome />
                            <span>Dashboard</span>
                        </div> : <HiHome />}
                </NavLink>

                <div>
                    <button
                        onClick={() => setUserOpen(!userOpen)}
                        className="flex w-full items-center justify-between rounded px-3 py-2 text-white hover:text-secondary"
                    >
                        <div className="flex items-center gap-2">
                            <BsPeopleFill />
                            {open && <span>Users</span>}
                        </div>

                        {open && (
                            <MdKeyboardArrowDown
                                className={`transition-transform ${userOpen ? "rotate-180" : ""}`}
                            />
                        )}
                    </button>

                    {userOpen && open && (
                        <div className="ml-6 mt-1 flex flex-col gap-1">
                            <NavLink
                                to="/admin-dashboard/manage-doctors"
                                className="rounded px-3 py-2 text-sm text-white hover:text-secondary"
                            >
                                Organizers
                            </NavLink>

                            <NavLink
                                to="/admin-dashboard/manage-patients"
                                className="rounded px-3 py-2 text-sm text-white hover:text-secondary"
                            >
                                Users
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink
                    to="/admin/dashboard"
                    className="rounded px-3 py-6 text-white"
                >
                    {open ?
                        <div className="flex items-center gap-2 text-red-400 hover:text-red-600">
                            <LogoutIcon />
                            <span>Logout</span>
                        </div> : <LogoutIcon className="text-red-400 hover:text-red-600" />}
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;