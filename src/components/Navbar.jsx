import { useState, useEffect } from "react";
import { FaLaptopMedical } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import ResponsiveMenu from "./ResponsiveMenu";
import { jwtDecode } from "jwt-decode";

export default function Navigation() {
    const [open, setOpen] = useState(false);

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);

                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setToken(null);
                    setUser(null);
                    return;
                }

                setToken(storedToken);
                setUser(storedUser);
            } catch (err) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
            }
        }
    }, []);

    const menuConfig = {
        USER: [
            { id: 1, title: "Home", link: "/" },
            { id: 2, title: "My Events", link: "/my-events" },
            { id: 3, title: "Contact", link: "/contact" },
        ],
        ORGANIZER: [
            { id: 1, title: "Dashboard", link: "/doctor-dashboard" },
            { id: 2, title: "My Events", link: "/doc/appointments" },
            { id: 3, title: "Users", link: "/doctor-dashboard" },
            { id: 4, title: "Profile", link: "/doctor-dashboard" },
            { id: 5, title: "Slots", link: "/doc-slot-management" },
        ],
        ADMIN: [
            { id: 1, title: "Admin Dashboard", link: "/admin-dashboard" },
            { id: 2, title: "Manage Organizers", link: "/admin-dashboard" },
            { id: 3, title: "Manage Users", link: "/admin-dashboard" },
            { id: 4, title: "Settings", link: "/admin-dashboard" },
        ],
    };

    const role = user?.role || "USER";

    const NavbarMenu = menuConfig[role];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <>
            <nav>
                <div className="flex justify-between items-center py-4 bg-back px-5 md:px-14">
                    {/* Logo Section */}
                    <div className="text-2xl flex items-center gap-2 font-bold uppercase">
                        <p className="text-primary">Crowd</p>
                        <p className="text-secondary">Craft</p>
                        <FaLaptopMedical className="text-primary" />
                    </div>

                    {/* Menu Section */}
                    <div className="hidden md:block">
                        <ul className="flex items-center gap-6 text-gray-600">
                            {NavbarMenu.map((menu) => (
                                <li key={menu.id} className="text-md">
                                    <a
                                        href={menu.link}
                                        target={menu.target || "_self"}
                                        rel={menu.target === "_blank" ? "noopener noreferrer" : ""}
                                        className="inline-block py-1 px-3 text-primary hover:text-secondary font-semibold">
                                        {menu.title}
                                    </a>
                                </li>
                            ))}
                            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                                {token ? (
                                    <div className="flex items-center">
                                        <div className="mx-5">
                                            <a
                                                href="/"
                                                onClick={handleLogout}
                                                className="text-white bg-red-700 hover:bg-secondary hover:text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center"
                                            >
                                                Logout
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <a
                                        href="/login"
                                        className="text-white bg-primary hover:bg-secondary hover:text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center"
                                    >
                                        Login
                                    </a>
                                )}
                            </div>
                        </ul>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex" onClick={() => setOpen(!open)}>
                        <MdMenu className="text-4xl text-primary" />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Selection */}
            <ResponsiveMenu open={open} />
        </>
    );
}