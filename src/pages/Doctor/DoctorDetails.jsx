import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorList from "./OrganizerList";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import BaseUrl from "../../reusables/BaseUrl";
import DoctorDetailsModal from "./DoctorDetailsModal";

const DoctorDetails = () => {
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const { docId } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
            toast.error("Please login first.");
            navigate("/login");
            return;
        }

        const fetchDoctor = async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}/get/doctor`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            docId: docId,
                        }
                    }
                );

                if (response.data.statusCode === 200) {
                    setDoctor(response.data.data);
                    // console.log("Doc data: ", response.data.data)
                } else {
                    toast.error(response.data.message || "Failed to fetch doctor.");
                }
            } catch (error) {
                toast.error("Something went wrong while fetching doctor.");
            } finally {
                setLoading(false);
            }
        };

        if (docId) fetchDoctor();
    }, [docId, navigate]);

    return (
        <>
            {/* <Navbar /> */}
            <div className="min-h-screen bg-gray-100 px-4 py-8">
                <h4 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Doctor Details
                </h4>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
                        <p className="mt-4 text-gray-600 font-medium">
                            Fetching doctor details, please wait...
                        </p>
                    </div>
                ) : (
                    <>
                        <table className="min-w-full  bg-white shadow-md overflow-hidden">
                            <tbody>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">First Name</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{doctor.firstName}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Last Name</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{doctor.lastName}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Email</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{doctor.email}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Verification Status</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{doctor.verificationStatus}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Speciality</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{doctor.specialization}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Mobile</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{doctor.mobile}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Document Size</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{(doctor.documentSize / 1024).toString().substring(0, 7)} KB</td>
                                </tr>
                            </tbody>
                        </table>
                        {doctor.document && (
                            <div className="bg-white shadow-md rounded-lg mt-4">
                                <iframe
                                    title="Doctor Document"
                                    src={`data:application/pdf;base64,${doctor.document}`}
                                    className="rounded shadow w-full"
                                    style={{ minHeight: "1000px" }}
                                />
                            </div>
                        )}
                        <div className="p-3 flex justify-center">
                            <DoctorDetailsModal
                                isOpen={isModalOpen}
                                onClose={() => setModalOpen(false)}
                                doctor={doctor}
                            />
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default DoctorDetails;