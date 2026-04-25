import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import BaseUrl from "../../reusables/BaseUrl";
import { triggerRoomDetails } from "../../services/doctorApi";

const MyEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);

    const token = localStorage.getItem("token");

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const [hourStr, minute] = dateStr.substring(11, 16).split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    const isSlotActive = (slot) => {
        const now = new Date();
        const start = new Date(slot.startTime);
        const end = new Date(slot.endTime);

        return now >= start && now <= end;
    };

    const handleClick = async (event) => {
        setLoadingId(event.eventId);

        try {
            const existingMeetDetails = await axios.get(
                `${BaseUrl}/zoom/meet-details?appointmentId=${appointment.appointmentId}`
            ).catch((err) => err.response);

            const meet = existingMeetDetails?.data?.data;

            if (meet && (meet.startUrl || meet.joinUrl)) {
                window.open(meet.startUrl ?? meet.joinUrl, "_blank");
                return;
            }

            const now = new Date();
            const start = new Date(`${appointment.startTime}`);
            const end = new Date(`${appointment.endTime}`);

            if (!(now >= start && now <= end)) {
                toast.error("Meeting is not allowed at this time", { autoClose: 2000 });
                return;
            }

            toast.warn("Doctor has not started the meeting yet", { autoClose: 2000 });
            return;

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoadingId(null);
        }
    };

    useEffect(() => {

        if (!token) {
            toast.error("Please login first !!");
            navigate("/login");
            return;
        }

        axios
            .get(`${BaseUrl}/user/booked/appointments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data && response.data.data) {
                    setEvents(response.data.data);
                    // console.log("Events: ", response.data.data)
                } else {
                    toast.error("Unexpected response format");
                }
            })
            .catch((error) => {
                console.error("Error fetching appointments: ", error);
                toast.error("Failed to fetch appointments");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Navbar />
            <div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
                        <p className="mt-4 text-gray-600 font-medium">
                            Fetching your events, please wait...
                        </p>
                    </div>
                ) : (
                    <>
                        {events.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="font-medium">You do not have any events</p>
                                <button
                                    onClick={() => navigate("/book-appointment")}
                                    className="mt-2 px-3 py-2 rounded-xl font-medium bg-back text-secondary hover:bg-primary hover:text-back"
                                >
                                    Book Event
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 bg-back">
                                    {events.map((eventWrapper) => (
                                        <div
                                            key={eventWrapper.eventId}
                                            className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition"
                                        >
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">
                                                    Appointment Id: {eventWrapper.eventId}
                                                </h2>
                                                <span
                                                    className={`inline-block my-2 px-3 py-1 rounded-full text-sm font-medium ${eventWrapper.appointmentStatus === "BOOKED"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {eventWrapper.appointmentStatus}
                                                </span>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>{eventWrapper.doctorFirstName} {eventWrapper.doctorLastName}</b> ({eventWrapper.specialization})
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Date:</b> {eventWrapper.startTime.toString().substring(0, 10).split("-").reverse().join("-")}
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Slot:</b>{" "}
                                                    {formatTime(eventWrapper.startTime)} - {" "}
                                                    {formatTime(eventWrapper.endTime)}
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Type:</b> {eventWrapper.slotType}
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Email:</b> {eventWrapper.doctorEmail}
                                                </p>
                                                <p className="text-md text-gray-600 mt-1">
                                                    <b>Mobile:</b> {eventWrapper.doctorMobile}
                                                </p>
                                            </div>

                                            {/* <button
                                                className={`mt-4 py-2 px-4 rounded-lg text-sm font-medium transition 
                                                ${eventWrapper.slotType === "ONLINE" && isSlotActive(eventWrapper)
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                                disabled={eventWrapper.slotType !== "ONLINE" || !isSlotActive(eventWrapper)}
                                                onClick={() => handleClick(eventWrapper.appointmentId)}
                                            >
                                                Start Video Call
                                            </button> */}

                                            <button
                                                className={`mt-4 py-2 px-4 rounded-lg text-sm font-medium transition flex justify-center items-center gap-2
                                                    ${eventWrapper.slotType === "ONLINE" && "bg-blue-600 text-white hover:bg-blue-700"
                                                    }`}
                                                // disabled={
                                                //     eventWrapper.slotType !== "ONLINE" ||
                                                //     !isSlotActive(eventWrapper) ||
                                                //     loadingId === eventWrapper.appointmentId
                                                // }
                                                onClick={() =>
                                                    handleClick(eventWrapper)
                                                }
                                            >
                                                {loadingId === eventWrapper.appointmentId ? (
                                                    <>
                                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                                        Redirecting...
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
            </div >

            <Footer />
        </>
    );
};

export default MyEvents;
