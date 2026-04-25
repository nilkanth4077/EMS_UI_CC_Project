import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./style/AdminDashboard.css";
import Sidebar from "../../components/SideBar";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                <Sidebar open={sidebarOpen} />

                <main
                    className={`flex-1 p-2 transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-12"
                        }`}
                >
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="fixed top-1/2 -translate-y-1/2 rounded-lg bg-back size-7 text-white z-50"
                    >
                        <span className="text-sm">
                            {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </span>
                    </button>

                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;