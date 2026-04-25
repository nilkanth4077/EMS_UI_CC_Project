import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorList from "./DoctorList";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import BaseUrl from "../../reusables/BaseUrl";
import DoctorDetailsModal from "./DoctorDetailsModal";
import PatientDetailsModal from "./PatientDetailsModal";

const PatientDetails = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const { patientId } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
            toast.error("Please login first.");
            navigate("/login");
            return;
        }

        const fetchPatient = async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}/get/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            patientId: patientId,
                        }
                    }
                );

                if (response.data.statusCode === 200) {
                    setPatient(response.data.data);
                    console.log("Patient data: ", response.data.data) 
                } else {
                    toast.error(response.data.message || "Failed to fetch patient.");
                }
            } catch (error) {
                toast.error("Something went wrong while fetching patient.");
            } finally {
                setLoading(false);
            }
        };

        if (patientId) fetchPatient();
    }, [patientId, navigate]);

    return (
        <>
            {/* <Navbar /> */}
            <div className="min-h-screen bg-gray-100 px-4 py-8">
                <h4 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Patient Details
                </h4>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
                        <p className="mt-4 text-gray-600 font-medium">
                            Fetching patient details, please wait...
                        </p>
                    </div>
                ) : (
                    <>
                        <table className="min-w-full  bg-white shadow-md overflow-hidden">
                            <tbody>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">First Name</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{patient.firstName}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Last Name</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{patient.lastName}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Email</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{patient.email}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Status</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{patient.active.toString()}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Mobile</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{patient.mobile}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="p-3 flex justify-center">
                            <PatientDetailsModal
                                isOpen={isModalOpen}
                                onClose={() => setModalOpen(false)}
                                patient={patient}
                            />
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default PatientDetails;