import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function DoctorSlots() {

    const location = useLocation();
    const navigate = useNavigate();

    const doctor = location.state?.doctor;

    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {

        if (doctor) {
            fetchSlots();
        }

    }, [doctor]);

    const fetchSlots = async () => {

        try {

            const response = await axios.get(
                `http://localhost:5000/api/slots/doctor/${doctor._id}`
            );

            setSlots(response.data);

        } catch (error) {

            setMessage("Failed to load slots");

        }
    };

    const handleBook = (slot) => {

        navigate("/book-appointment", {
            state: {
                doctor: doctor,
                slot: slot
            }
        });

    };

    if (!doctor) {

        return (
            <div>

                <h2>Doctor not selected</h2>

                <button onClick={() => navigate("/")}>
                    Back to Dashboard
                </button>

            </div>
        );
    }

    return (
        <div>

            <h1>Doctor Slots</h1>

            <h2>{doctor.name}</h2>

            <p>
                <strong>Specialization:</strong>{" "}
                {doctor.specialization}
            </p>

            <p>
                <strong>Room:</strong>{" "}
                {doctor.roomNumber}
            </p>

            <hr />

            <h2>Available Slots</h2>

            {message && (
                <p>{message}</p>
            )}

            {slots.length === 0 ? (

                <p>No slots available for this doctor.</p>

            ) : (

                slots.map((slot) => {

                    const remaining =
                        slot.maxPatients - slot.bookedPatients;

                    const isFull = remaining <= 0;

                    return (
                        <div
                            key={slot._id}
                            style={{
                                border: "1px solid black",
                                padding: "15px",
                                margin: "10px",
                                width: "350px"
                            }}
                        >

                            <p>
                                <strong>Date:</strong>{" "}
                                {slot.date}
                            </p>

                            <p>
                                <strong>Time:</strong>{" "}
                                {slot.startTime} - {slot.endTime}
                            </p>

                            <p>
                                <strong>Total Slots:</strong>{" "}
                                {slot.maxPatients}
                            </p>

                            <p>
                                <strong>Booked:</strong>{" "}
                                {slot.bookedPatients}
                            </p>

                            <p>
                                <strong>Remaining:</strong>{" "}
                                {remaining}
                            </p>

                            {isFull ? (

                                <button disabled>
                                    Slot Full
                                </button>

                            ) : (

                                <button
                                    onClick={() => handleBook(slot)}
                                >
                                    Book Appointment
                                </button>

                            )}

                        </div>
                    );

                })

            )}

            <br />

            <button onClick={() => navigate("/")}>
                Back to Dashboard
            </button>

        </div>
    );
}

export default DoctorSlots;