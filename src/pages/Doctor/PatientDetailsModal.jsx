import React, { useEffect, useState } from "react";
import { getAllSpecializations } from "../../services/doctorApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BaseUrl from "../../reusables/BaseUrl";
import axios from "axios";

export default function PatientDetailsModal({ patient, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);

    useEffect(() => {
        if (patient) {
            setFormData({
                id: patient.id,
                firstName: patient.firstName || "",
                lastName: patient.lastName || "",
                email: patient.email || "",
                mobile: patient.mobile || "",
                active: patient.active ?? true,
            });
        }
    }, [patient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!formData.id || !token) {
                toast.error("patientId and token are required");
                return;
            }

            const data = new FormData();
            data.append("patientId", formData.id);

            // append only changed fields
            Object.keys(formData).forEach((key) => {
                if (
                    formData[key] !== undefined &&
                    formData[key] !== null &&
                    formData[key] !== "" &&
                    formData[key] !== patient[key]
                ) {
                    data.append(key, formData[key]);
                }
            });

            const response = await axios.put(`${BaseUrl}/update/user`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.statusCode === 200) {
                toast.success("Patient details updated successfully", {
                    autoClose: 1000,
                    onClose: () => {
                        window.location.reload();
                    },
                });
                onUpdate?.(response.data.data);
            } else {
                toast.error(response.data.message || "Update failed");
                console.error("Update failed: ", response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error("Error updating patient details: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-5">
            <button
                className="bg-blue-600 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                onClick={() => setIsOpen(true)}
            >
                Update
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-center">Patient Details</h2>

                        <table className="min-w-full border border-gray-300">
                            <tbody>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 w-1/3 text-center">
                                        ID
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 w-2/3">
                                        <input
                                            type="number"
                                            name="patientId"
                                            placeholder="Id"
                                            value={formData.id}
                                            readOnly
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 w-1/3 text-center">
                                        First Name
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 w-2/3">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 w-1/3 text-center">
                                        Last Name
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 w-2/3">
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 text-center">
                                        Email
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="First Name"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 text-center">
                                        Mobile
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="text"
                                            name="mobile"
                                            placeholder="Mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                onClick={handleSubmit}
                            >
                                {loading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-mtext"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                ) : (
                                    "Update"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}