import { useEffect, useState } from 'react'
import { bookAppointment, getSlotsByDoctorId, deleteExpiredSlots } from '../../services/doctorApi';
import { toast } from 'react-toastify';

const EventModal = ({ closeAppointmentModal, doctorId }) => {

    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookAppLoading, setBookAppLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const token = localStorage.getItem("token");

    const fetchSlotsByDoctor = async () => {
        try {
            const response = await getSlotsByDoctorId(token, doctorId);

            if (response.statusCode === 200) {
                setSlots(response.data.filter((slot) => slot.available));
                // console.log("Slots response: ", response.data.filter((slot) => slot.available))
            }
        } catch (error) {
            toast.error(error.response?.message || "Something went wrong while fetching slots.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlotsByDoctor();
    }, [doctorId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedSlot) {
            toast.error("Please select a slot to book.");
            return;
        }
    }

    // console.log("Slots just before mapping: ", slots);

    const formatFullDate = (dateString) => {
        const date = new Date(dateString);

        const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
        const month = date.toLocaleDateString("en-GB", { month: "long" });
        const year = date.getFullYear();
        const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });

        return `${day} ${month} ${year} (${weekday})`; // "04 September 2025 (Thursday)"
    };

    const uniqueDates = [
        ...new Set(slots.map((slot) => formatFullDate(slot.startTime))),
    ];

    const filteredSlots = slots.filter(
        (slot) => formatFullDate(slot.startTime) === selectedDate
    );

    const handleBook = async () => {
        if (!selectedSlot) {
            return;
        }
        // console.log("Booking slot: ", selectedSlot);

        setBookAppLoading(true);

        try {
            const response = await bookAppointment(token, selectedSlot.id);
            // console.log("Book appointment response: ", response);

            if (response.statusCode === 200) {
                toast.success(response.message || "Appointment booked successfully.");
                closeAppointmentModal();
                // console.log("Slots response: ", response.message);
            }
        } catch (error) {
            toast.error(error.response?.message || "Something went wrong while booking an appointment.");
            // console.error("Error booking appointment: ", error);
            // console.log("Error details: ", error.response);
        } finally {
            setBookAppLoading(false);
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto bg-back rounded-xl p-6 sm:p-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-primary">
                    Book Your Slot
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-white text-2xl mb-2 flex justify-between items-center">
                            <div className="flex items-center justify-start">
                                Select Slot
                            </div>
                            {loading ? (
                                <div className="flex items-center justify-end">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-mtext" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Fetching slots...
                                </div>
                            ) : (
                                ""
                            )}
                        </label>

                        <select
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedSlot(null);
                            }}
                            className="border rounded p-2 w-full"
                        >
                            <option value="">-- Select Date --</option>
                            {uniqueDates.map((date, index) => (
                                <option key={index} value={date}>
                                    {date}
                                </option>
                            ))}
                        </select>

                        {/* Slot time boxes */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {filteredSlots.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-3 rounded-lg border
                                        ${selectedSlot?.id === slot.id
                                            ? "bg-secondary text-black"
                                            : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    {new Date(slot.startTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(slot.endTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        {filteredSlots.length > 0 && (
                            <button
                                type="submit"
                                onClick={handleBook}
                                className="w-full py-2 px-4 bg-primary hover:bg-secondary text-white hover:text-black font-semibold rounded transition duration-200"
                            >
                                {bookAppLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2 text-mtext" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Booking Appointment...
                                    </div>
                                ) : (
                                    "Book Appointment"
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}

export default EventModal