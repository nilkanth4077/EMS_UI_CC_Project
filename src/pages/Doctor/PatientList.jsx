import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";

const PatientList = ({ patients, setPatients }) => {

    const navigate = useNavigate();

    const handleDetails = (item) => {
        const patientId = item.id;
        navigate(`/admin-dashboard/patient/${patientId}`, { state: { patientId } });
    };

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
        toast.error("Please login first.");
        navigate("/login");
        return;
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `${BaseUrl}/admin/delete/patient`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        id: id,
                    }
                }
            );

            if (response.data.statusCode === 200) {
                // console.log("Doctor deleted with id: ", response.data.data.id);
                toast.success("Patient deleted with id: " + response.data.data.id);
                setPatients(prev => prev.filter(patient => patient.id !== id)); // Remove from local state
            } else {
                toast.error(response.data.message || "Failed to delete patient.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while deleting patient.");
        }
    };

    return (
        <div className="overflow-x-auto mb-20">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-3 px-6 text-left">Id</th>
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Mobile</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Action</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {patients.map((item, index) => (
                        <tr
                            key={index}
                            className={`border-t ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                        >
                            <td className="py-3 px-6">{item.id}</td>
                            <td className="py-3 px-6 whitespace-nowrap">
                                {item.firstName} {item.lastName}
                            </td>
                            <td className="py-3 px-6">{item.email}</td>
                            <td className="py-3 px-6">{item.mobile}</td>
                            <td className="py-3 px-6">{item.active.toString()}</td>
                            <td className="py-3 px-6 text-center whitespace-nowrap">

                                <div className="hidden sm:flex gap-2 justify-center">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                        onClick={() => handleDetails(item)}
                                    >
                                        Details
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {/* Mobile screen - dropdown menu */}
                                <div className="relative sm:hidden inline-block text-left">
                                    <details className="group">
                                        <summary className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded text-sm cursor-pointer">
                                            Actions
                                        </summary>
                                        <div className="relative z-10 mt-2 w-32 bg-white rounded shadow-lg border border-gray-200">
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                                onClick={() => handleDetails(item)}
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </details>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientList;