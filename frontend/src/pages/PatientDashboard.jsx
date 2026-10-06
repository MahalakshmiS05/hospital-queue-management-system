import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {

    const [doctors, setDoctors] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {

        try {

            const response = await axios.get(
                "http://localhost:5000/api/doctors"
            );

            setDoctors(response.data);

        } catch (error) {

            setMessage("Failed to load doctors");

        }
    };

    const handleViewSlots = (doctor) => {

        navigate("/doctor-slots", {
            state: {
                doctor: doctor
            }
        });

    };

    return (
        <div>

            <h1>Patient Dashboard</h1>

            <h2>Available Doctors</h2>

            {message && (
                <p>{message}</p>
            )}

            {doctors.length === 0 ? (

                <p>No doctors available</p>

            ) : (

                doctors.map((doctor) => (

                    <div
                        key={doctor._id}
                        style={{
                            border: "1px solid black",
                            padding: "15px",
                            margin: "10px",
                            width: "300px"
                        }}
                    >

                        <h3>{doctor.name}</h3>

                        <p>
                            <strong>Specialization:</strong>{" "}
                            {doctor.specialization}
                        </p>

                        <p>
                            <strong>Room:</strong>{" "}
                            {doctor.roomNumber}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {doctor.available
                                ? "Available"
                                : "Not Available"}
                        </p>

                        <button
                            onClick={() => handleViewSlots(doctor)}
                            disabled={!doctor.available}
                        >
                            View Slots
                        </button>

                    </div>

                ))

            )}

        </div>
    );
}

export default PatientDashboard;