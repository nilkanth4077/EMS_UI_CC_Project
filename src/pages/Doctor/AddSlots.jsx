import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";
import { useNavigate } from "react-router-dom";
import { fetchDoctorByUserId } from "../../services/doctorApi";

const AddSlots = ({ closeAddSlotModal }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [doctor, setDoctor] = useState({});
    const [formData, setFormData] = useState({
        doctorId: "",
        slotType: "ONLINE",
        startDate: "",
        endDate: "",
        times: [""],
    });

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const getDoctorByUserId = async () => {
        try {
            const response = await fetchDoctorByUserId(token, user.id);

            if (response.statusCode === 200) {
                setDoctor(response.data);
                // console.log("Doc data: ", response.data)
                setFormData((prev) => ({
                    ...prev,
                    doctorId: response.data.doctorId,
                }));
            } else {
                toast.error(response.message || "Failed to fetch doctor.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.message || "Something went wrong while fetching doctor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token || !userString) {
            toast.error("Please login first.");
            navigate("/login");
            return;
        }
        getDoctorByUserId();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTimeChange = (index, value) => {
        const newTimes = [...formData.times];
        newTimes[index] = value;
        setFormData((prev) => ({
            ...prev,
            times: newTimes,
        }));
    };

    const addTimeField = () => {
        setFormData((prev) => ({ ...prev, times: [...prev.times, ""] }));
    };

    const removeTimeField = (index) => {
        const newTimes = formData.times.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, times: newTimes }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                doctorId: parseInt(formData.doctorId),
                slotType: formData.slotType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                times: formData.times.filter((t) => t.trim() !== ""),
            };

            const response = await axios.post(`${BaseUrl}/slot/add`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.statusCode === 200) {
                toast.success("Slots added successfully", {
                    autoClose: 2000,
                    onClose: () => {
                        window.location.reload();
                    },
                });
                setFormData({
                    doctorId: "",
                    slotType: "ONLINE",
                    startDate: "",
                    endDate: "",
                    times: [""],
                });

                if (closeAddSlotModal) closeAddSlotModal();
            } else {
                toast.error(response.data.message || "Failed to add slots");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong", {
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-back rounded-xl p-6 sm:p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                Add New Slots
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-primary">
                        Doctor ID
                    </label>
                    <input
                        type="number"
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                        readOnly
                        className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-primary">
                        Slot Type
                    </label>
                    <select
                        name="slotType"
                        value={formData.slotType}
                        onChange={handleChange}
                        className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ONLINE">ONLINE</option>
                        <option value="OFFLINE">OFFLINE</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-primary">
                        Start Date
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-primary">
                        End Date
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-primary">
                        Times
                    </label>
                    {formData.times.map((time, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => handleTimeChange(index, e.target.value)}
                                placeholder="HH:MM AM/PM"
                                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            {formData.times.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTimeField(index)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTimeField}
                        className="mt-2 px-4 py-2 bg-primary text-back font-semibold rounded-lg hover:bg-blue-600 text-sm"
                    >
                        + Add Time
                    </button>
                </div>

                <div className="text-center">
                    {/* <button
                        type="submit"
                        className="w-full py-2 px-4 bg-primary text-back font-bold rounded-lg hover:bg-secondary hover:text-back focus:ring-8 focus:ring-primary"
                    >
                        Add Slots
                    </button> */}

                    <button
                        className="w-full mt-2 py-2 px-4 text-sm transition bg-primary text-back font-bold rounded-lg hover:bg-secondary hover:text-back focus:ring-2 focus:ring-primary"
                        // disabled={!isSlotActive(slot) || slot.slotType !== "ONLINE"}
                        type="submit"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2 inline-block"></div>
                                Inserting Slots...
                            </>
                        ) : (
                            "Add Slots"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSlots;