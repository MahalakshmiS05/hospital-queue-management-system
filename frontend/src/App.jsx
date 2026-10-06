import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";

import PatientDashboard from "./pages/PatientDashboard";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import DoctorSlots from "./pages/DoctorSlots";
import BookAppointment from "./pages/BookAppointment";
import PatientAppointments from "./pages/PatientAppointments";
import QueueStatus from "./pages/QueueStatus";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddDoctor from "./pages/AdminAddDoctor";
import AdminAddSlot from "./pages/AdminAddSlot";
import AdminQueue from "./pages/AdminQueue";


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* HOME */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* PATIENT */}

                <Route
                    path="/login"
                    element={<PatientLogin />}
                />

                <Route
                    path="/register"
                    element={<PatientRegister />}
                />

                <Route
                    path="/patient-dashboard"
                    element={<PatientDashboard />}
                />

                <Route
                    path="/doctor-slots"
                    element={<DoctorSlots />}
                />

                <Route
                    path="/book-appointment"
                    element={<BookAppointment />}
                />

                <Route
                    path="/my-appointments"
                    element={<PatientAppointments />}
                />

                <Route
                    path="/queue-status"
                    element={<QueueStatus />}
                />


                {/* ADMIN */}

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin-add-doctor"
                    element={<AdminAddDoctor />}
                />

                <Route
                    path="/admin-add-slot"
                    element={<AdminAddSlot />}
                />

                <Route
                    path="/admin-queue"
                    element={<AdminQueue />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;