import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PatientAppointments() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [queue, setQueue] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchAppointments();
        fetchQueue();
    }, []);

    const getPatient = () => {

        const savedPatient = localStorage.getItem("patient");

        if (!savedPatient) {
            return null;
        }

        return JSON.parse(savedPatient);
    };

    const fetchAppointments = async () => {

        try {

            const patient = getPatient();

            if (!patient) {
                setMessage("Please login first");
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/appointments/patient/${patient.id}`
            );

            setAppointments(response.data);

        } catch (error) {

            setMessage("Failed to load appointments");

        }
    };

    const fetchQueue = async () => {

        try {

            const patient = getPatient();

            if (!patient) {
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/appointments/patient/${patient.id}/queue`
            );

            setQueue(response.data);

        } catch (error) {

            // No active queue is okay
            setQueue(null);

        }
    };

    return (
        <div>

            <h1>My Appointments</h1>

            {message && (
                <p>{message}</p>
            )}

            {appointments.length === 0 ? (

                <p>No appointments found.</p>

            ) : (

                appointments.map((appointment) => (

                    <div
                        key={appointment._id}
                        style={{
                            border: "1px solid black",
                            padding: "15px",
                            margin: "10px",
                            width: "400px"
                        }}
                    >

                        <h3>
                            Dr. {appointment.doctorId.name}
                        </h3>

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
                            <strong>Token:</strong>{" "}
                            {appointment.tokenNumber}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {appointment.status}
                        </p>

                    </div>

                ))

            )}

            <hr />

            <h2>Current Queue Status</h2>

            {queue ? (

                <div
                    style={{
                        border: "2px solid black",
                        padding: "20px",
                        width: "400px"
                    }}
                >

                    <h3>
                        Your Token: {queue.tokenNumber}
                    </h3>

                    <p>
                        <strong>Current Token:</strong>{" "}
                        {queue.currentToken || "Not called yet"}
                    </p>

                    <p>
                        <strong>People Before You:</strong>{" "}
                        {queue.peopleBefore}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {queue.status}
                    </p>

                    <p>
                        <strong>Doctor:</strong>{" "}
                        {queue.doctor.name}
                    </p>

                    {queue.status === "CALLED" && (
                        <h2>
                            🔔 Your turn! Please go to the doctor.
                        </h2>
                    )}

                </div>

            ) : (

                <p>
                    No active queue at the moment.
                </p>

            )}

            <br />

            <button onClick={() => navigate("/")}>
                Back to Dashboard
            </button>

        </div>
    );
}

export default PatientAppointments;