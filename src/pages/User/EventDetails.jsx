import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import BaseUrl from "../../reusables/BaseUrl";
import EventModal from "./EventModal";
import { deleteExpiredSlots } from "../../services/doctorApi";

const EventDetails = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookAppLoading, setBookAppLoading] = useState(false);
    const speciality = state?.speciality || "";

    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    const openAppointmentModal = (doctorId) => setSelectedDoctorId(doctorId);
    const closeAppointmentModal = () => setSelectedDoctorId(null);
    const token = localStorage.getItem("token");

    const handleExpiredSlots = async (token) => {
        try {
            const response = await deleteExpiredSlots(token);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const handleBookAndOpenModal = async (doctorId) => {
        setBookAppLoading(true);
        try {
            const response = await handleExpiredSlots(token);
            if (response.statusCode === 200) {
                console.log(response.message || "Expired slots deleted successfully.");
                setSelectedDoctorId(doctorId);
            }
        } catch (error) {
            toast.error("Something went wrong while preparing appointment.");
        } finally {
            setBookAppLoading(false);
        }
    };

    useEffect(() => {

        if (!token) {
            toast.error("Please login first !!");
            navigate("/login");
            return;
        }

        axios
            .get(`${BaseUrl}/user/doctor-by-speciality`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    speciality: speciality,
                },
            })
            .then((response) => {
                if (response.data && response.data.data) {
                    setDoctors(response.data.data);
                    // console.log("Doctors: ", response.data.data)
                } else {
                    toast.error("Unexpected response format");
                }
            })
            .catch((error) => {
                console.error("Error fetching doctors:", error);
                toast.error("Failed to fetch doctors");
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
                            Fetching doctors with speciality <b>{speciality}</b>, please wait...
                        </p>
                    </div>
                ) : (
                    <>
                        {doctors.length === 0 ? (
                            <p>No doctors found.</p>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 bg-back">
                                {doctors.map((doctorWrapper) => (
                                    <div
                                        key={doctorWrapper.id}
                                        className="bg-white shadow-md rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition"
                                    >
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                Dr. {doctorWrapper.doctor.firstName} {doctorWrapper.doctor.lastName}
                                            </h2>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {doctorWrapper.specialization}
                                            </p>
                                            <span
                                                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${doctorWrapper.verificationStatus === "Verified"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {doctorWrapper.verificationStatus}
                                            </span>

                                            <div className="mt-4 text-sm text-gray-700 space-y-1">
                                                <p><span className="font-bold">Email:</span> {doctorWrapper.doctor.email}</p>
                                                <p><span className="font-bold">Mobile:</span> {doctorWrapper.doctor.mobile}</p>
                                            </div>
                                        </div>

                                        <button
                                            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-70"
                                            onClick={() => handleBookAndOpenModal(doctorWrapper.id)}
                                            disabled={bookAppLoading}
                                        >
                                            {bookAppLoading
                                                ? (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                                                        Processing...
                                                    </div>
                                                )
                                                : "Book Appointment"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedDoctorId && (
                <div className="fixed inset-0 z-50 flex p-4 items-center justify-center bg-white bg-opacity-25">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
                        <button
                            className="absolute top-3 right-3 text-white bg-red-600 rounded-full px-2 py-1 hover:bg-red-700 transition"
                            onClick={closeAppointmentModal}
                        >
                            ✕
                        </button>

                        <EventModal
                            closeAppointmentModal={closeAppointmentModal}
                            doctorId={selectedDoctorId}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default EventDetails;
