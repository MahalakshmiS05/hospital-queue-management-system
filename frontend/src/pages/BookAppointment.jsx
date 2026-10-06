import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function BookAppointment() {

    const location = useLocation();
    const navigate = useNavigate();

    const doctor = location.state?.doctor;
    const slot = location.state?.slot;

    const [message, setMessage] = useState("");
    const [appointment, setAppointment] = useState(null);

    const handleBooking = async () => {

        try {

            // Get logged-in patient from browser
            const savedPatient = localStorage.getItem("patient");

            if (!savedPatient) {

                setMessage("Please login first");
                return;
            }

            const patient = JSON.parse(savedPatient);

            const response = await axios.post(
                "http://localhost:5000/api/appointments/book",
                {
                    patientId: patient.id,
                    doctorId: doctor._id,
                    slotId: slot._id
                }
            );

            setAppointment(response.data.appointment);

            setMessage(response.data.message);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Booking failed"
            );
        }
    };

    if (!doctor || !slot) {

        return (
            <div>

                <h2>Appointment details not found</h2>

                <button onClick={() => navigate("/")}>
                    Back to Dashboard
                </button>

            </div>
        );
    }

    return (
        <div>

            <h1>Book Appointment</h1>

            <hr />

            <h2>Doctor Details</h2>

            <p>
                <strong>Name:</strong>{" "}
                {doctor.name}
            </p>

            <p>
                <strong>Specialization:</strong>{" "}
                {doctor.specialization}
            </p>

            <p>
                <strong>Room:</strong>{" "}
                {doctor.roomNumber}
            </p>

            <hr />

            <h2>Slot Details</h2>

            <p>
                <strong>Date:</strong>{" "}
                {slot.date}
            </p>

            <p>
                <strong>Time:</strong>{" "}
                {slot.startTime} - {slot.endTime}
            </p>

            <p>
                <strong>Available Slots:</strong>{" "}
                {slot.maxPatients - slot.bookedPatients}
            </p>

            {!appointment && (

                <button onClick={handleBooking}>
                    Confirm Appointment
                </button>

            )}

            {message && (
                <h3>{message}</h3>
            )}

            {appointment && (

                <div>

                    <h2>Appointment Booked Successfully! 🎉</h2>

                    <p>
                        <strong>Token Number:</strong>{" "}
                        {appointment.tokenNumber}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {appointment.status}
                    </p>

                    <p>
                        Your appointment is waiting for admin confirmation.
                    </p>

                    <button
                        onClick={() => navigate("/")}
                    >
                        Back to Dashboard
                    </button>

                </div>

            )}

        </div>
    );
}

export default BookAppointment;