import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";
import { LuArrowUpDown } from "react-icons/lu";
import AddSlots from "./AddSlots";

const SlotList = ({ slots, setSlots }) => {

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const openAddSlotModal = () => setIsOpen(true);
    const closeAddSlotModal = () => setIsOpen(false);

    const navigate = useNavigate();
    var slotId = null;

    // const handleDetails = (item) => {
    //     slotId = item.id;
    //     navigate(`/slot/${slotId}`, { state: { slotId } });
    // };

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    // console.log("Slots from SlotList: ", slots);

    if (!token || !userString) {
        toast.error("Please login first.");
        navigate("/login");
        return;
    }

    const handleDelete = async (slotId) => {
        // console.log("Slot Id: ", slotId)
        try {
            const response = await axios.delete(
                `${BaseUrl}/slot/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        slotId: slotId,
                    }
                }
            );

            if (response.data.statusCode === 200) {
                // console.log("Slot deleted with id: ", slotId);
                toast.success("Slot deleted successfully");
                setSlots(prev => prev.filter(slot => slot.id !== slotId)); // Remove from local state
            } else {
                toast.error(response.data.message || "Failed to delete slot.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error);
        }
    };

    const handleUpdate = async (slot) => {
        setSelectedSlot(slot);
        // console.log("Selected Slot: ", slot);
        setFormData({
            slotId: slot.id,
            newStartTime: slot.startTime.substring(0, 16),
            slotType: slot.slotType,
            available: slot.available,
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        const payload = { slotId: formData.slotId };

        if (formData.newStartTime !== selectedSlot.startTime.substring(0, 16)) {
            payload.newStartTime = formData.newStartTime;
        }
        if (formData.slotType !== selectedSlot.slotType) {
            payload.slotType = formData.slotType;
        }
        if (formData.available !== selectedSlot.available) {
            payload.available = formData.available;
        }

        try {
            const response = await axios.put(`${BaseUrl}/slot/update`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.statusCode === 200) {
                toast.success("Slot updated successfully");

                setSlots((prev) =>
                    prev.map((slot) =>
                        slot.id === formData.slotId ? { ...slot, ...response.data.data } : slot
                    )
                );
                setShowModal(false);
            } else {
                toast.error(response.data.data.message || "Failed to update slot.");
            }
        } catch (error) {
            // console.error(error.response.data.message);
            toast.error(error.response.data.message || "Something went wrong while updating slot.");
        }
    };

    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                // toggle asc/desc if same column
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedSlots = [...slots].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.substring(0, 10).split("-").reverse().join("-");
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const [hourStr, minute] = dateStr.substring(11, 16).split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    const filteredData = sortedSlots.filter((item) => {
        const search = searchQuery.toLowerCase();

        const id = item.id?.toString() || "";
        const slotId = item.slotId?.toString() || "";
        const slotType = item.slotType?.toLowerCase() || "";
        const date = formatDate(item.startTime); // "22-09-2025"
        const startTime = formatTime(item.startTime); // "10:30"
        const endTime = formatTime(item.endTime); // "12:30"

        return (
            id.includes(search) ||
            slotId.includes(search) ||
            slotType.includes(search) ||
            date.includes(search) ||
            startTime.includes(search) ||
            endTime.includes(search) ||
            (item.available ? "available" : "unavailable").toLowerCase().startsWith(search.toLowerCase())
        );
    });

    return (
        <div className="overflow-x-auto mb-20">
            <div className="flex justify-between items-center mb-3">
                {/* <h2 className="text-2xl font-bold ml-2">Slot List</h2> */}
                <button
                    className="bg-blue-600 text-white font-semibold p-2 rounded-lg"
                    onClick={openAddSlotModal}
                >
                    Add Slots
                </button>

                {/* Modal */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex p-4 items-center justify-center bg-white bg-opacity-50">
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">

                            <button
                                className="absolute top-3 right-3 text-white bg-red-600 rounded-full px-2 py-1 hover:bg-red-700 transition"
                                onClick={closeAddSlotModal}
                            >
                                ✕
                            </button>

                            <AddSlots closeModal={closeAddSlotModal} />
                        </div>
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Search slots..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded px-3 py-2 w-64"
                />
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th
                            className="py-3 px-6 text-left cursor-pointer whitespace-nowrap"
                            onClick={() => handleSort("id")}
                        >
                            Slot Id {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "↑" : "↓") : <LuArrowUpDown className="inline w-4 h-4 ml-1" />}
                        </th>
                        <th
                            className="py-3 px-6 text-left cursor-pointer whitespace-nowrap"
                            onClick={() => handleSort("slotType")}
                        >
                            Type {sortConfig.key === "slotType" ? (sortConfig.direction === "asc" ? "↑" : "↓") : <LuArrowUpDown className="inline w-4 h-4 ml-1" />}
                        </th>
                        <th
                            className="py-3 px-6 text-left cursor-pointer whitespace-nowrap"
                            onClick={() => handleSort("startTime")}
                        >
                            Date {sortConfig.key === "startTime" ? (sortConfig.direction === "asc" ? "↑" : "↓") : <LuArrowUpDown className="inline w-4 h-4 ml-1" />}
                        </th>
                        <th className="py-3 px-6 text-left whitespace-nowrap">Start Time</th>
                        <th className="py-3 px-6 text-left whitespace-nowrap">End Time</th>
                        <th
                            className="py-3 px-6 text-left cursor-pointer whitespace-nowrap"
                            onClick={() => handleSort("available")}
                        >
                            Available {sortConfig.key === "available" ? (sortConfig.direction === "asc" ? "↑" : "↓") : <LuArrowUpDown className="inline w-4 h-4 ml-1" />}
                        </th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {filteredData.map((item, index) => (
                        <tr
                            key={index}
                            className={`border-t ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                        >
                            <td className="py-3 px-6 whitespace-nowrap">{item.id}</td>
                            <td className="py-3 px-6 whitespace-nowrap">{item.slotType}</td>
                            <td className="py-3 px-6 whitespace-nowrap">{formatDate(item.startTime)}</td>
                            <td className="py-3 px-6 whitespace-nowrap">{formatTime(item.startTime)}</td>
                            <td className="py-3 px-6 whitespace-nowrap">{formatTime(item.endTime)}</td>
                            <td className="py-3 px-6 whitespace-nowrap">
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${item.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {item.available ? "Available" : "Unavailable"}
                                </span>
                            </td>
                            <td className="py-3 px-6 text-center whitespace-nowrap">

                                <div className="hidden sm:flex gap-2 justify-center">
                                    {/* <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                        onClick={() => handleDetails(item)}
                                    >
                                        Details
                                    </button> */}
                                    <button
                                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm"
                                        onClick={() => handleUpdate(item)}
                                    >
                                        Update
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
                                            {/* <button
                                                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                                onClick={() => handleDetails(item)}
                                            >
                                                Details
                                            </button> */}
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-100"
                                                onClick={() => handleUpdate(item)}
                                            >
                                                Update
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

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Update Slot</h2>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Slot ID</label>
                            <input
                                type="text"
                                value={formData.slotId}
                                disabled
                                className="w-full border px-3 py-2 rounded bg-gray-100"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Start Time</label>
                            <input
                                type="datetime-local"
                                name="newStartTime"
                                value={formData.newStartTime}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium">Slot Type</label>
                            <select
                                name="slotType"
                                value={formData.slotType}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded"
                            >
                                <option value="ONLINE">ONLINE</option>
                                <option value="OFFLINE">OFFLINE</option>
                            </select>
                        </div>

                        <div className="mb-3 flex items-center">
                            <input
                                type="checkbox"
                                name="available"
                                checked={formData.available}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label className="text-sm">Available</label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleSubmit}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlotList;