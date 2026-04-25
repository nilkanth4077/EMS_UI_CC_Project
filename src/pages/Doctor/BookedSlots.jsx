import React, { useEffect, useState } from "react";
import { fetchDoctorByUserId, getAppointmentBySlotId, getBookedSlots, triggerRoomDetails } from "../../services/doctorApi";
import { toast } from "react-toastify";
import { Footer } from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BaseUrl from "../../reusables/BaseUrl";

export default function BookedSlots() {

    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [doctor, setDoctor] = useState({});

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const [hourStr, minute] = dateStr.substring(11, 16).split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    const getDoctorByUserId = async () => {
        try {
            const response = await fetchDoctorByUserId(token, user.id);

            if (response.statusCode === 200) {
                setDoctor(response.data);
                // console.log("Doc data: ", response.data)
            } else {
                toast.error(response.message || "Failed to fetch doctor.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.message || "Something went wrong while fetching doctor.");
        } finally {
            setLoading(false);
        }
    };

    const fetchBookedSlots = async () => {
        try {
            const response = await getBookedSlots(doctor.doctorId, token);

            if (response.statusCode === 200) {
                setSlots(response.data);
                // console.log("Slots response: ", response.data)
            } else {
                toast.error(response.message || "Failed to fetch slots.");
            }
        } catch (error) {
            toast.error(error.response?.message || "Something went wrong while fetching slots.");
        } finally {
            setLoading(false);
        }
    };

    const isSlotActive = (slot) => {
        const now = new Date();
        const start = new Date(slot.startTime);
        const end = new Date(slot.endTime);

        return now >= start && now <= end;
    };

    useEffect(() => {
        getDoctorByUserId();
    }, []);

    useEffect(() => {
        if (doctor.doctorId) {
            fetchBookedSlots();
        }
    }, [doctor.doctorId]);

    const handleClick = async (slotId) => {
        setLoadingId(slotId);

        try {
            const appointmentResponse = await getAppointmentBySlotId(slotId, token);

            if (appointmentResponse.statusCode === 200 && appointmentResponse.data) {

                const existingMeetDetails = await axios.get(
                    `${BaseUrl}/zoom/meet-details?appointmentId=${appointmentResponse.data.appointmentId}`
                ).catch((err) => err.response);

                const meet = existingMeetDetails?.data?.data;

                if (meet && (meet.startUrl || meet.joinUrl)) {
                    window.open(meet.startUrl ?? meet.joinUrl, "_blank");
                    return;
                }

                const now = new Date();
                const start = new Date(`${appointmentResponse.data.startTime}`);
                const end = new Date(`${appointmentResponse.data.endTime}`);

                if (!(now >= start && now <= end)) {
                    toast.error("Meeting is not allowed at this time", { autoClose: 2000 });
                    return;
                }

                try {
                    const response = await axios.post(
                        `${BaseUrl}/zoom/create-meeting?appointmentId=${appointmentResponse.data.appointmentId}`,
                    );

                    if (response.data.statusCode === 200) {
                        const newMeetDetails = response.data;
                        window.open(newMeetDetails.data.startUrl ?? newMeetDetails.data.joinUrl, "_blank");
                    } else {
                        toast.error(response.data.message || "Failed to retrieve meeting link.", { autoClose: 2000 });
                        return;
                    }

                } catch (err) {
                    toast.error(err.response.message || "Failed to create Zoom meeting", { autoClose: 2000 });
                }
            } else {
                toast.error("Failed to fetch appointment details");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <>
            <Navbar />
            <div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
                        <p className="mt-4 text-gray-600 font-medium">
                            Fetching your appointments, please wait...
                        </p>
                    </div>
                ) : (
                    <>
                        {slots.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="font-medium">You do not have any appointments</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 bg-back">
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.appointmentId}
                                            className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition"
                                        >
                                            {/* Patient Info */}
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    Appointment Id: {slot.appointmentId}
                                                </h2>
                                                <span
                                                    className={`inline-block my-2 px-3 py-1 rounded-full text-sm font-medium ${slot.status === "BOOKED"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {slot.status}
                                                </span>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>{slot.patientName}</b>
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Date:</b> {slot.startTime.toString().substring(0, 10).split("-").reverse().join("-")}
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Slot:</b>{" "}
                                                    {formatTime(slot.startTime)} - {" "}
                                                    {formatTime(slot.endTime)}
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Type:</b> {slot.slotType}
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Email:</b> {slot.patientEmail}
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Mobile:</b> {slot.patientMobile}
                                                </p>
                                            </div>

                                            <button
                                                className={`mt-4 py-2 px-4 rounded-lg text-sm font-medium transition 
                                                ${slot.slotType === "ONLINE" && "bg-blue-600 text-white hover:bg-blue-700"
                                                    }`}
                                                // disabled={!isSlotActive(slot) || slot.slotType !== "ONLINE"}
                                                onClick={() => handleClick(slot.slotId)}
                                            >
                                                {loadingId === slot.slotId ? (
                                                    <>
                                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2 inline-block"></div>
                                                        Creating Meeting...
                                                    </>
                                                ) : (
                                                    "Start Call"
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}