import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchPendingAppointments();
    }, []);

    const fetchPendingAppointments = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/admin/appointments/pending"
            );

            setAppointments(response.data);

        } catch (error) {

            setMessage("Failed to load pending appointments");

        }
    };

    const confirmAppointment = async (appointmentId) => {

        try {

            const response = await axios.put(
                `http://localhost:5000/api/admin/appointments/${appointmentId}/confirm`
            );

            setMessage(response.data.message);

            fetchPendingAppointments();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to confirm appointment"
            );

        }
    };

    const rejectAppointment = async (appointmentId) => {

        try {

            const response = await axios.put(
                `http://localhost:5000/api/admin/appointments/${appointmentId}/reject`
            );

            setMessage(response.data.message);

            fetchPendingAppointments();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to reject appointment"
            );

        }
    };

    const logout = () => {

        localStorage.removeItem("admin");

        navigate("/admin-login");

    };

    return (
        <div>

            <h1>Admin Dashboard</h1>
            <button onClick={() => navigate("/admin-add-doctor")}>
    Add Doctor
</button>
<button onClick={() => navigate("/admin-add-slot")}>
    Create Slot
</button>
<button onClick={() => navigate("/admin-queue")}>
    Queue Management
</button>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h2>Pending Appointments</h2>

            {message && (
                <p>{message}</p>
            )}

            {appointments.length === 0 ? (

                <p>No pending appointments.</p>

            ) : (

                appointments.map((appointment) => (

                    <div
                        key={appointment._id}
                        style={{
                            border: "1px solid black",
                            padding: "15px",
                            margin: "10px",
                            width: "500px"
                        }}
                    >

                        <h3>
                            Token: {appointment.tokenNumber}
                        </h3>

                        <p>
                            <strong>Patient:</strong>{" "}
                            {appointment.patientId.name}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {appointment.patientId.email}
                        </p>

                        <p>
                            <strong>Phone:</strong>{" "}
                            {appointment.patientId.phone}
                        </p>

                        <p>
                            <strong>Doctor:</strong>{" "}
                            {appointment.doctorId.name}
                        </p>

                        <p>
                            <strong>Specialization:</strong>{" "}
                            {appointment.doctorId.specialization}
                        </p>

                        <p>
                            <strong>Room:</strong>{" "}
                            {appointment.doctorId.roomNumber}
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {appointment.slotId.date}
                        </p>

                        <p>
                            <strong>Time:</strong>{" "}
                            {appointment.slotId.startTime}
                            {" - "}
                            {appointment.slotId.endTime}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {appointment.status}
                        </p>

                        <button
                            onClick={() =>
                                confirmAppointment(appointment._id)
                            }
                        >
                            Confirm
                        </button>

                        {" "}

                        <button
                            onClick={() =>
                                rejectAppointment(appointment._id)
                            }
                        >
                            Reject
                        </button>

                    </div>

                ))

            )}

        </div>
    );
}

export default AdminDashboard;