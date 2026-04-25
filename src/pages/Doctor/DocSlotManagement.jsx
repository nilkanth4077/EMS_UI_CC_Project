import React, { useEffect } from 'react'
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SlotListPage from './SlotListPage';
import AddSlots from './AddSlots';

const DocSlotManagement = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first !!");
            navigate("/login");
            return;
        }
    });

    return (
        <>
            <Navbar />
            <div className='bg-back'>
                {/* <AddSlots /> */}
                <SlotListPage />
            </div>
            <Footer />
        </>
    )
}

export default DocSlotManagement