import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookAppointment from './pages/BookAppointment';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from "react-toastify";
import VerifierDashboard from './pages/Verifier/VerifierDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DoctorRegistration from './pages/Doctor/DoctorRegistration';
import EventDetails from './pages/User/EventDetails';
import DoctorListPage from './pages/Doctor/OrganizerListPage';
import DoctorDetails from './pages/Doctor/DoctorDetails';
import DocSlotManagement from './pages/Doctor/DocSlotManagement';
import SlotDetails from './pages/Doctor/SlotDetails';
import BookedSlots from './pages/Doctor/BookedSlots';
import MyEvents from './pages/User/MyEvents';
import AdminHome from './pages/Admin/AdminHome';
import PatientListPage from './pages/Doctor/PatientListPage';
import PatientDetails from './pages/Doctor/PatientDetails';
import OrganizerApply from './pages/OrganizerApply';
import OrganizerListPage from './pages/Doctor/OrganizerListPage';
import OrganizerDashboard from './pages/Organizer/OrganizerDashboard';
import OrganizerEventDetail from './pages/Organizer/OrganizerEventDetail';
import ManageEvents from './pages/Admin/ManageEvents';
import AdminEventDetail from './pages/Admin/AdminEventDetail';

function App() {
  return (
    <>
      {/* <h4 className='font-bold flex justify-center bg-secondary'><span className='mx-3'>Our website is under development, but feel free to explore - some sections may be incomplete !!</span></h4> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/organizer-apply" element={<OrganizerApply />} />
          <Route path="/doc-registration" element={<DoctorRegistration />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/verifier-dashboard" element={<VerifierDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path='manage-organizers' element={<OrganizerListPage />} />
            <Route path='manage-events' element={<ManageEvents />} />
            <Route path='manage-patients' element={<PatientListPage />} />
            <Route path='doctor/:docId' element={<DoctorDetails />} />
            <Route path="events/:id" element={<AdminEventDetail />} />
          </Route>
          <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer-dashboard/events/:id" element={<OrganizerEventDetail />} />
          <Route path='/event-details' element={<EventDetails />} />
          <Route path='/slot/:slotId' element={<SlotDetails />} />
          <Route path='/doc-slot-management' element={<DocSlotManagement />} />
          <Route path='/doc/appointments' element={<BookedSlots />} />
          <Route path='/my-events' element={<MyEvents />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;