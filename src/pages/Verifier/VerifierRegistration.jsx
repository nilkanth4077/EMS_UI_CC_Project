import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifierRegistration = () => {
    const [loading, setLoading] = useState(false);
    const adminToken = localStorage.getItem("admintoken");
    const [verifierDetails, setDetails] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleInput = (e) => {
        setDetails({ ...verifierDetails, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!verifierDetails.name || !verifierDetails.email || !verifierDetails.password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            if (adminToken) {
                const res = await axios.post(
                    "https://doc-appointment-node-backend.onrender.com/verifierreg",
                    verifierDetails
                );
                if (res.data.message === "ok") {
                    toast.success("Registration Successful!");
                } else if (res.data.message === "Exists") {
                    toast.error("User already exists with this email. Please Login.");
                } else {
                    toast.error("Something went wrong. Try again");
                }
            }
        } catch (error) {
            toast.error("Only admins can create a new verifier.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-back">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Verifier Registration</h2>
                <p className="text-center text-gray-500 mb-6">Fill in the details below to register.</p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={verifierDetails.name}
                            onChange={handleInput}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={verifierDetails.email}
                            onChange={handleInput}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={verifierDetails.password}
                            onChange={handleInput}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full mt-4 py-3 rounded-lg text-white font-semibold transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"
                                    viewBox="0 0 24 24"
                                ></svg>
                                Registering...
                            </span>
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifierRegistration;