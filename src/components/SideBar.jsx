import React, { useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaLaptopMedical } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { MdEvent, MdKeyboardArrowDown } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ open }) => {
    const [userOpen, setUserOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-[calc(120vh-64px)]
                bg-gradient-to-b from-[#6366f1] to-[#7c3aed] shadow-xl transition-all duration-300
                ${open ? "w-64" : "w-16"}
            `}
        >
            {/* Logo */}
            <div className="text-2xl flex items-center gap-2 font-bold uppercase m-4 pb-4 border-b border-white/20">
                {open ? (
                    <>
                        <p className="text-white">Crowd</p>
                        <p className="text-[#fbbf24]">Craft</p>
                        <FaLaptopMedical className="text-white/80" />
                    </>
                ) : (
                    <FaLaptopMedical className="text-white/80" />
                )}
            </div>

            <nav className="flex flex-col p-3 space-y-1">

                {/* Dashboard */}
                <NavLink
                    to="/admin-dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                        ${isActive
                            ? "bg-white/20 text-white shadow-sm"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`
                    }
                >
                    <HiHome className="text-lg shrink-0" />
                    {open && <span>Dashboard</span>}
                </NavLink>

                <NavLink
                    to="/admin-dashboard/manage-events"
                    className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                        ${isActive
                            ? "bg-white/20 text-white shadow-sm"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`
                    }
                >
                    <MdEvent className="text-lg shrink-0" />
                    {open && <span>Events</span>}
                </NavLink>

                {/* Users dropdown */}
                <div>
                    <button
                        onClick={() => setUserOpen(!userOpen)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium
                            text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150"
                    >
                        <div className="flex items-center gap-3">
                            <BsPeopleFill className="text-lg shrink-0" />
                            {open && <span>Users</span>}
                        </div>
                        {open && (
                            <MdKeyboardArrowDown
                                className={`transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`}
                            />
                        )}
                    </button>

                    {userOpen && open && (
                        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-white/20 pl-3">
                            <NavLink
                                to="/admin-dashboard/manage-organizers"
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150
                                    ${isActive
                                        ? "bg-white/20 text-white"
                                        : "text-white/60 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                Organizers
                            </NavLink>
                            <NavLink
                                to="/admin-dashboard/manage-patients"
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150
                                    ${isActive
                                        ? "bg-white/20 text-white"
                                        : "text-white/60 hover:bg-white/10 hover:text-white"
                                    }`
                                }
                            >
                                Users
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Logout */}
                <NavLink
                    to="/"
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                        text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-150 mt-2"
                >
                    <LogoutIcon className="text-lg shrink-0" style={{ fontSize: 18 }} />
                    {open && <span>Logout</span>}
                </NavLink>

            </nav>
        </aside>
    );
};

export default Sidebar;