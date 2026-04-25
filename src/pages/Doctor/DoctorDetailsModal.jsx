import React, { useEffect, useState } from "react";
import { getAllSpecializations } from "../../services/doctorApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BaseUrl from "../../reusables/BaseUrl";
import axios from "axios";

export default function DoctorDetailsModal({ doctor, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [specialities, setSpecialities] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);

    const allStatuses = ["Verified", "Pending", "Rejected"];

    useEffect(() => {
        if (doctor) {
            setFormData({
                doctorId: doctor.doctorId,
                firstName: doctor.firstName || "",
                lastName: doctor.lastName || "",
                email: doctor.email || "",
                verificationStatus: doctor.verificationStatus || "",
                specialization: doctor.specialization || "",
                mobile: doctor.mobile || "",
                active: doctor.active ?? true,
            });
        }
    }, [doctor]);

    const getSpecialities = async () => {
        try {
            const response = await getAllSpecializations();
            // console.log("Response: ", response.data);

            if (response.statusCode === 200) {
                setSpecialities(response.data);
            } else {
                toast.error(error.response?.data?.message || "Failed to fetch specializations.");
                console.error("Failed to fetch specializations: ", response.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Try again later");
            console.error("Error fetching specializations: ", error);
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }
        getSpecialities();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!formData.doctorId || !token) {
                toast.error("DoctorId and token are required");
                return;
            }

            const data = new FormData();
            data.append("doctorId", formData.doctorId);

            // append only changed fields
            Object.keys(formData).forEach((key) => {
                if (
                    formData[key] !== undefined &&
                    formData[key] !== null &&
                    formData[key] !== "" &&
                    formData[key] !== doctor[key]
                ) {
                    data.append(key, formData[key]);
                }
            });

            if (file) {
                data.append("documentFile", file);
            }

            const response = await axios.put(`${BaseUrl}/update/doctor`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.statusCode === 200) {
                toast.success("Doctor details updated successfully", {
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
            console.error("Error updating doctor details: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-5">
            {/* Update Button */}
            <button
                className="bg-blue-600 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                onClick={() => setIsOpen(true)}
            >
                Update
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-center">Doctor Details</h2>

                        <table className="min-w-full border border-gray-300">
                            <tbody>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 w-1/3 text-center">
                                        Doctor ID
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2 w-2/3">
                                        <input
                                            type="number"
                                            name="doctorId"
                                            placeholder="First Name"
                                            value={formData.doctorId}
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
                                        Verification Status
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <select
                                            name="verificationStatus"
                                            value={formData.verificationStatus}
                                            onChange={handleChange}
                                            className="w-full rounded border px-2 py-1"
                                        >
                                            <option value={doctor.verificationStatus}>
                                                {doctor.verificationStatus}
                                            </option>
                                            {allStatuses
                                                .filter((s) => s !== doctor.verificationStatus)
                                                .map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 text-center">
                                        Speciality
                                    </th>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <select
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="w-full rounded border px-2 py-1"
                                        >
                                            <option value={doctor.specialization}>
                                                {doctor.specialization}
                                            </option>
                                            {specialities
                                                .filter((s) => s.specialization !== doctor.specialization)
                                                .map((s, i) => (
                                                    <option key={i} value={s.specialization}>
                                                        {s.specialization}
                                                    </option>
                                                ))}
                                        </select>
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

                        {/* Document Upload */}
                        <div className="mt-4">
                            <label className="block font-medium mb-2">
                                Upload New Document:
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                        </div>

                        {/* Buttons */}
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