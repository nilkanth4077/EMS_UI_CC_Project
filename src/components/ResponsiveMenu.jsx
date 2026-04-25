import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ResponsiveMenu = ({ open }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

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

            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
                return;
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        navigate("/");
    };

    const menuConfig = {
            USER: [
                { id: 1, title: "Home", link: "/" },
                { id: 2, title: "My Events", link: "/my-events" },
                { id: 3, title: "Contact", link: "/" },
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

    const role = user?.role?.toUpperCase() || "USER";
    const menuItems = menuConfig[role] || menuConfig.USER;

    return (
        <AnimatePresence mode="wait">
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-20 left-0 w-full h-screen z-20"
                >
                    <div className="text-xl font-semibold bg-primary text-white py-10 m-6 rounded-3xl">
                        <ul className="flex flex-col items-center gap-10">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.link}
                                        target={item.target || "_self"}
                                        rel={item.target === "_blank" ? "noopener noreferrer" : ""}
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                            {token ? (
                                <button
                                    className="px-6 py-2 bg-white text-red-600 rounded-xl hover:bg-red-700 transition duration-300"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition duration-300"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                            )}
                        </ul>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResponsiveMenu;