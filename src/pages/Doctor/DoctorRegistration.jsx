import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function DoctorRegistration() {

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [specialities, setSpecialities] = useState([]);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        specialization: "",
        documentFile: null,
    });

    useEffect(() => {

        try {
            axios
                .get(`${BaseUrl}/speciality/all`)
                .then((res) => {
                    setSpecialities(res.data.data);
                })
                .catch((err) => {
                    toast.error("Error fetching specialities.");
                    console.error(err);
                });

        } catch (error) {
            toast.error("Invalid session. Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    }, []);

    const handleChange = (e, restrictions = {}) => {
        const { name, value, files, type } = e.target;

        let finalValue = value;

        // For file input
        if (type === "file") {
            finalValue = files?.[0] || null;
        }

        // Apply restrictions for others
        if (restrictions.maxLength && typeof finalValue === "string") {
            finalValue = finalValue.slice(0, restrictions.maxLength);
        }

        if (restrictions.numericOnly) {
            finalValue = finalValue.replace(/\D/g, ""); // only digits
        }

        if (restrictions.onlyAtoZ) {
            finalValue = finalValue.replace(/[^a-zA-Z]/g, ""); // Remove non-letters
        }

        if (restrictions.capitalizeFirst) {
            finalValue = finalValue.charAt(0).toUpperCase() + finalValue.slice(1);
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            form.append("firstName", formData.firstName);
            form.append("lastName", formData.lastName);
            form.append("email", formData.email);
            form.append("password", formData.password);
            form.append("confirmPassword", formData.confirmPassword);
            form.append("mobile", formData.mobile);
            form.append("specialization", formData.specialization);
            form.append("documentFile", formData.documentFile);

            const response = await axios.post(`${BaseUrl}/auth/register-doctor`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Registration successful. You’ll receive an email once verified to log in.", {
                autoClose: 5000,
            });

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                mobile: "",
                specialization: "",
                documentFile: null,
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-back p-4">
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="w-full max-w-lg bg-primary p-8 rounded-xl shadow-lg"
                >
                    <h2 className="text-3xl font-bold text-center text-back mb-6">Register As Doctor</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="relative group w-full">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleChange(e, { maxLength: 20, capitalizeFirst: true })}
                                required
                                className="w-full p-2 rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                            />
                            <span className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Only alphabets are allowed
                            </span>
                        </div>

                        <div className="relative group w-full">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleChange(e, { maxLength: 20, capitalizeFirst: true })}
                                required
                                className="w-full p-2 rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                            />
                            <span className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Only alphabets are allowed
                            </span>
                        </div>

                        <div className="relative group w-full">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => handleChange(e, { maxLength: 30 })}
                                required
                                className="w-full p-2 rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                            />
                            <span className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Each email can be used only once
                            </span>
                        </div>

                        <div className="relative group w-full">
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Mobile"
                                value={formData.mobile}
                                onChange={(e) => handleChange(e, { maxLength: 10, numericOnly: true })}
                                required
                                className="w-full p-2 rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                            />
                            <span className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Exact 10 digits allowed
                            </span>
                        </div>

                        <div className="relative group w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => handleChange(e, { maxLength: 30 })}
                                required
                                className="w-full p-2 pr-10 rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                            />
                            <span className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Use strong password (Eg: Abcd_1234@User)
                            </span>
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <AiOutlineEyeInvisible className="text-mtext" />
                                ) : (
                                    <AiOutlineEye className="text-mtext" />
                                )}
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange(e, { maxLength: 30 })}
                                required
                                className="w-full p-2 rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                            />
                            <span className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Use strong password (Eg: Abcd_1234@User)
                            </span>
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <AiOutlineEyeInvisible className="text-mtext" />
                                ) : (
                                    <AiOutlineEye className="text-mtext" />
                                )}
                            </div>
                        </div>

                        <div className="relative group w-full">
                            <select
                                type="text"
                                name="specialization"
                                placeholder="Your Specialization"
                                value={formData.specialization}
                                onChange={(e) => handleChange(e, { maxLength: 30 })}
                                required
                                className="w-full p-2 rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                            >
                                <option value="">Select specialization</option>
                                {specialities.map((spec) => (
                                    <option key={spec.id} value={spec.specialization}>
                                        {spec.specialization}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Contact us if your specialization is not listed
                            </span>
                        </div>

                        <div className="relative group w-full">
                            <input
                                type="file"
                                name="documentFile"
                                accept=".pdf"
                                ref={fileInputRef}
                                onChange={(e) => handleChange(e)}
                                required
                                className="w-full p-2 rounded bg-white text-mtext focus:outline-none focus:ring-2 focus:ring-back"
                            />
                            <span className="absolute -top-8 left-0 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Only PDF (Maximum size: 2MB)
                            </span>
                        </div>

                    </div>

                    <div className="text-mtext text-md mt-4 text-left"><b>Merge all documents in single PDF then Upload*</b></div>

                    {error && (
                        <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full mt-6 bg-back hover:bg-secondary text-white hover:text-black disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed py-2 px-4 rounded flex justify-center items-center"
                        disabled={loading || formData.mobile.length !== 10}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-mtext"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        ) : (
                            "Register"
                        )}
                    </button>
                    <h3 className="text-center text-mtext mt-4">Already a User ? <a href="/login" className="text-mtext hover:text-secondary">Login Here !!</a></h3>
                </form>
            </div>
            <Footer />
        </>
    );
}