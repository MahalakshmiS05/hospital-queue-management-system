import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminQueue() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/admin/appointments/active"
            );

            setAppointments(response.data);

        } catch (error) {

            setMessage("Failed to load queue");

        }
    };

    const moveToWaiting = async (appointmentId) => {

        try {

            const response = await axios.put(
                `http://localhost:5000/api/admin/appointments/${appointmentId}/waiting`
            );

            setMessage(response.data.message);

            fetchAppointments();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to move patient to waiting queue"
            );

        }
    };

    const callNext = async (slotId) => {

        try {

            const response = await axios.put(
                `http://localhost:5000/api/admin/slots/${slotId}/call-next`
            );

            setMessage(response.data.message);

            fetchAppointments();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to call next patient"
            );

        }
    };

    const completeAppointment = async (appointmentId) => {

        try {

            const response = await axios.put(
                `http://localhost:5000/api/admin/appointments/${appointmentId}/complete`
            );

            setMessage(response.data.message);

            fetchAppointments();

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to complete appointment"
            );

        }
    };

    return (
        <div>

            <h1>Queue Management</h1>

            {message && (
                <p>{message}</p>
            )}

            {appointments.length === 0 ? (

                <p>No active patients in the queue.</p>

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

                        <h2>
                            Token: {appointment.tokenNumber}
                        </h2>

                        <p>
                            <strong>Patient:</strong>{" "}
                            {appointment.patientId.name}
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

                        {appointment.status === "CONFIRMED" && (

                            <button
                                onClick={() =>
                                    moveToWaiting(appointment._id)
                                }
                            >
                                Move to Waiting
                            </button>

                        )}

                        {appointment.status === "WAITING" && (

                            <button
                                onClick={() =>
                                    callNext(appointment.slotId._id)
                                }
                            >
                                Call Next Patient
                            </button>

                        )}

                        {appointment.status === "CALLED" && (

                            <button
                                onClick={() =>
                                    completeAppointment(
                                        appointment._id
                                    )
                                }
                            >
                                Complete Appointment
                            </button>

                        )}

                    </div>

                ))

            )}

            <br />

            <button
                onClick={() => navigate("/admin-dashboard")}
            >
                Back to Admin Dashboard
            </button>

        </div>
    );
}

export default AdminQueue;