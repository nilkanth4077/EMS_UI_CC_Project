import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import BaseUrl from "../../reusables/BaseUrl";
import SlotDetailsModal from "./SlotDetailsModal";

const SlotDetails = () => {
    const navigate = useNavigate();
    const [slot, setSlot] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const { slotId } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
            toast.error("Please login first.");
            navigate("/login");
            return;
        }

        const fetchSlot = async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}/slot/get/${slotId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.statusCode === 200) {
                    setSlot(response.data.data);
                    // console.log("Slot data: ", response.data.data)
                } else {
                    toast.error(response.data.message || "Failed to fetch slot.");
                }
            } catch (error) {
                toast.error("Something went wrong while fetching slot.");
            } finally {
                setLoading(false);
            }
        };

        if (slotId) fetchSlot();
    }, [slotId, navigate]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 px-4 py-8">
                <h4 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Slot Details
                </h4>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
                        <p className="mt-4 text-gray-600 font-medium">
                            Fetching slot details, please wait...
                        </p>
                    </div>
                ) : (
                    <>
                        <table className="min-w-full  bg-white shadow-md overflow-hidden">
                            <tbody>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Slot ID</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{slot.slotId}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Type</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{slot.slotType}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Date</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{slot.startTime.toString().substring(0, 10)}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Start Time</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{slot.startTime.toString().substring(11, 16)}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">End Time</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{slot.endTime.toString().substring(11, 16)}</td>
                                </tr>
                                <tr>
                                    <th className="w-1/4 text-center border border-gray-500 py-2">Available</th>
                                    <td className="w-3/4 py-3 text-center border border-gray-500">{slot.available.toString()}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="p-6 flex justify-center">
                            <SlotDetailsModal
                                isOpen={isModalOpen}
                                onClose={() => setModalOpen(false)}
                                slot={slot}
                            />
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default SlotDetails;