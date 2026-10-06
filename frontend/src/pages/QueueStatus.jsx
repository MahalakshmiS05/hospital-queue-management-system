import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function QueueStatus() {

    const navigate = useNavigate();

    const [queue, setQueue] = useState(null);
    const [message, setMessage] = useState("");

    const fetchQueueStatus = async () => {

        try {

            const patient = JSON.parse(
                localStorage.getItem("patient")
            );

            if (!patient) {
                setMessage("Please login first");
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/appointments/patient/${patient.id}/queue`
            );

            setQueue(response.data);
            setMessage("");

        } catch (error) {

            if (error.response?.status === 404) {

                setMessage(
                    "You don't have an active appointment."
                );

                setQueue(null);

            } else {

                setMessage(
                    error.response?.data?.message ||
                    "Failed to load queue status"
                );

            }
        }
    };

    useEffect(() => {

        fetchQueueStatus();

        // Refresh queue every 5 seconds
        const interval = setInterval(() => {
            fetchQueueStatus();
        }, 5000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div>

            <h1>My Queue Status</h1>

            {message && (
                <p>{message}</p>
            )}

            {queue && (

                <div>

                    <h2>
                        Doctor: {queue.doctor.name}
                    </h2>

                    <p>
                        Specialization:{" "}
                        {queue.doctor.specialization}
                    </p>

                    <p>
                        Room: {queue.doctor.roomNumber}
                    </p>

                    <hr />

                    <h2>
                        Your Token: {queue.tokenNumber}
                    </h2>

                    <h2>
                        Current Token:{" "}
                        {queue.currentToken || "Not called yet"}
                    </h2>

                    <h2>
                        People Before You:{" "}
                        {queue.peopleBefore}
                    </h2>

                    <p>
                        Appointment Status:
                        {" "}
                        <strong>{queue.status}</strong>
                    </p>

                    {queue.status === "WAITING" && (

                        <div>

                            <h2>
                                ⏳ Please wait for your turn
                            </h2>

                            <p>
                                There are {queue.peopleBefore}
                                {" "}
                                patient(s) before you.
                            </p>

                        </div>

                    )}

                    {queue.status === "CALLED" && (

                        <div>

                            <h2>
                                🔔 YOUR TURN!
                            </h2>

                            <p>
                                Please go to the doctor's room.
                            </p>

                        </div>

                    )}

                </div>

            )}

            <br />

            <button
                onClick={() => navigate("/")}
            >
                Back to Dashboard
            </button>

        </div>
    );
}

export default QueueStatus;