import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import axios, { isCancel, AxiosError } from 'axios';
import { Link, useNavigate } from "react-router-dom";


const VerifierLogin = () => {
  const [loading, setLoading] = useState(false);
  const [verifierdetails, setdetails] = useState({
    email: "", password: ""
  })
  const { email, password } = verifierdetails;
  const handleInput = (e) => {
    setdetails({ ...verifierdetails, [e.target.name]: e.target.value });
  }
  const navigate = useNavigate();
  const submit = async e => {
    if (verifierdetails.email == "" || verifierdetails.password == "") {
      toast.error("Fill info first");
    }
    else {
      e.preventDefault();
      setLoading(true);

      await axios.post("https://doc-appointment-node-backend.onrender.com/verifierlogin", verifierdetails).then((res) => {
        if (res.data.message === "ok") {
          localStorage.setItem('verifiertoken', res.data.token);
          toast.success("login Successful");
          setTimeout(() => {
            navigate('/verifier-dashboard');
          }, 1200)
          setLoading(false);

          //toast.info("Now You can login with your email and pass");
        }
        if (res.data.message === "don'tmatch") {
          toast.error("email or password not match");
          setLoading(false);
          //toast.info("Now You can login with your email and pass");
        }
        if (res.data.message === "error") {
          toast.error("User not exists");
          setLoading(false);
        }
        // if (res.data.message === "Exists") {
        //   toast.error("User already exist on this email");
        // }


      });
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-back">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Verifier Login</h2>
          <p className="text-center text-gray-500 mb-6">Fill in the details below to register.</p>

          <form onSubmit={submit} className="space-y-4">

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={verifierdetails.email}
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
                value={verifierdetails.password}
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
                  Logging In...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default VerifierLogin;