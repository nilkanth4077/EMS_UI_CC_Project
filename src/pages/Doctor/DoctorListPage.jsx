import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DoctorList from "./DoctorList";
import BaseUrl from "../../reusables/BaseUrl";

const DoctorListPage = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
            toast.error("Please login first.");
            navigate("/login");
            return;
        }

        const fetchDoctors = async () => {
            try {
                const response = await axios.get(
                    `${BaseUrl}/admin/all-doctors`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.statusCode === 200) {
                    setDoctors(response.data.data);
                } else {
                    toast.error(response.data.message || "Failed to fetch doctors.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong while fetching doctors.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [navigate]);

    return (
        <>
            <div className="min-h-screen bg-gray-100 px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Doctor List
                </h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
                        <p className="mt-4 text-gray-600 font-medium">
                            Fetching doctors, please wait...
                        </p>
                    </div>
                ) : (
                    <DoctorList doctors={doctors} setDoctors={setDoctors} />
                )}
            </div>
        </>
    );
};

export default DoctorListPage;