// services/doctorService.js
import axios from "axios";
import BaseUrl from "../reusables/BaseUrl";

export const getAllEvents = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/events`);
      console.log("Events from API: ", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

export const fetchDoctorByUserId = async (token, userId) => {
    try {
        const response = await axios.get(`${BaseUrl}/doctor/by-user-id`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId,
            },
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllSpecializations = async () => {
    try {
        const response = await axios.get(`${BaseUrl}/speciality/all`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getSlotsByDoctorId = async (token, doctorId) => {
    try {
        const response = await axios.get(
            `${BaseUrl}/slot/doctor/${doctorId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const bookAppointment = async (token, slotId) => {
    try {
        const response = await axios.put(
            `${BaseUrl}/user/book-appointment`, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    slotId,
                }
            }
        );
        // console.log("Book appointment response from api: ", response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getBookedSlots = async (doctorId, token) => {
    try {
        const response = await axios.get(
            `${BaseUrl}/doctor/get/booked-appointments`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    doctorId,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteExpiredSlots = async (token) => {
    try {
        const response = await axios.put(
            `${BaseUrl}/slot/delete/expiredSlot`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const triggerRoomDetails = async (appointmentId, token) => {
    try {
        const response = await axios.post(
            `${BaseUrl}/send/email/roomDetails`, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    appointmentId,
                }
            }
        );
        // console.log("Trigger room details response: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error from api: ", error);
        throw error;
    }
};

export const getAppointmentBySlotId = async (slotId, token) => {
    try {
        const response = await axios.get(
            `${BaseUrl}/get/appointment`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    slotId: slotId,
                }
            }
        );
        // console.log("Get appointment by slotId response: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error api: ", error);
        throw error;
    }
};

export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(
            `${BaseUrl}/admin/get/all-users`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // console.log("Get all users response: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error api: ", error);
        throw error;
    }
};

export const getAllAppointments = async (token) => {
    try {
        const response = await axios.get(
            `${BaseUrl}/admin/get/all-appointments`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // console.log("Get all apps response: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error api: ", error);
        throw error;
    }
};

export const getAllDoctors = async (token) => {
    try {
        const response = await axios.get(
            `${BaseUrl}/admin/get/all-doctors`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Get all users response: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error api: ", error);
        throw error;
    }
};