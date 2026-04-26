import React from "react";
import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";

const Contact = () => {
  const handleSubmit = () => {
   alert("Work in progress! Reach out through email/phone.");
  };

  return (
   <>
   <Navbar />
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">

        {/* LEFT — Info Section */}
        <div className="bg-gradient-to-br from-[#6366f1] to-[#7c3aed] text-white rounded-2xl p-8 shadow-xl flex flex-col justify-between">
          
          <div>
            <h2 className="text-3xl font-black mb-4">Get in touch</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Have questions about events, organizers, or registrations?  
              We’re here to help you anytime.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            
            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                📞
              </div>
              <div>
                <p className="text-xs text-white/70">Phone</p>
                <p className="font-semibold">+91 93162 77803</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                📧
              </div>
              <div>
                <p className="text-xs text-white/70">Email</p>
                <p className="font-semibold">nilkanth0904@gmail.com</p>
              </div>
            </div>

          </div>

          {/* Footer note */}
          <p className="text-xs text-white/60 mt-10">
            We usually respond within 24 hours.
          </p>
        </div>

        {/* RIGHT — Form Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Send us a message
          </h2>

          <form className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-600">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-slate-600">Message</label>
              <textarea
                required
                rows="4"
                placeholder="Type your message..."
                className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Send Message
            </button>

          </form>
        </div>

      </div>
    </div>
    <Footer />
    </>
  );
};

export default Contact;