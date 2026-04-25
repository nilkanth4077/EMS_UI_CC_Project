import React, { useEffect, useState } from "react";
import {
    BsFillPeopleFill,
    BsCalendarCheck,
    BsPersonBadgeFill,
} from "react-icons/bs";
import { IoRefreshOutline } from "react-icons/io5";
import { getAllAppointments, getAllUsers } from "../../services/doctorApi";

const AdminHome = () => {

    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await getAllUsers(token);
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAllAppointments = async () => {
            try {
                const response = await getAllAppointments(token);
                setAppointments(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchAllDoctors = async () => {
            try {
                const response = await getAllDoctors(token);
                setDoctors(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllUsers();
        fetchAllAppointments();
    }, [token]);

    const noOfDocs = users.filter(user => user.role === "DOCTOR");
    const noOfPatience = users.filter(user => user.role === "USER");
    const getDateOnly = (date) =>
        new Date(date).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    const todaysAppointments = appointments.filter(
        (appt) => getDateOnly(appt.startTime) === today
    );

    const stats = [
        {
            title: "Today Appointments",
            value: todaysAppointments.length,
            icon: <BsCalendarCheck size={22} />,
            bg: "bg-green-500",
        },
        {
            title: "Patients",
            value: noOfPatience.length,
            icon: <BsFillPeopleFill size={22} />,
            bg: "bg-purple-500",
        },
        {
            title: "Doctors",
            value: noOfDocs.length,
            icon: <BsPersonBadgeFill size={22} />,
            bg: "bg-blue-500",
        },
        {
            title: "Revenue",
            value: "₹32,000",
            icon: <BsFillPeopleFill size={22} />,
            bg: "bg-red-500",
        },
    ];

    const handleRefresh = () => {
        alert("Refresh Clicked...")
    }

    return (
        <div className="mx-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold mx-1 py-2 text-gray-800 whitespace-nowrap">
                    Hello Admin !!
                </h1>
                <IoRefreshOutline className="size-5 hover:cursor-pointer" onClick={handleRefresh} />
            </div>
            <div className="grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4"
            >
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-xl bg-white p-5 shadow"
                    >
                        <div>
                            <p className="text-sm text-gray-500">{item.title}</p>
                            <p className="text-2xl font-bold">{item.value}</p>
                        </div>

                        <div
                            className={`rounded-full p-3 text-white ${item.bg}`}
                        >
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHome;