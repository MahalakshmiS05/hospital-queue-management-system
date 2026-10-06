import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAddSlot() {

    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        doctorId: "",
        date: "",
        startTime: "",
        endTime: "",
        maxPatients: ""
    });

    const [message, setMessage] = useState("");

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

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:5000/api/slots/add",
                {
                    doctorId: formData.doctorId,
                    date: formData.date,
                    startTime: formData.startTime,
                    endTime: formData.endTime,
                    maxPatients: Number(formData.maxPatients)
                }
            );

            setMessage(response.data.message);

            setFormData({
                doctorId: "",
                date: "",
                startTime: "",
                endTime: "",
                maxPatients: ""
            });

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to create slot"
            );

        }
    };

    return (
        <div>

            <h1>Create Doctor Slot</h1>

            <form onSubmit={handleSubmit}>

                <div>

                    <label>Select Doctor</label>

                    <br />

                    <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            -- Select Doctor --
                        </option>

                        {doctors.map((doctor) => (

                            <option
                                key={doctor._id}
                                value={doctor._id}
                            >
                                {doctor.name} - {doctor.specialization}
                            </option>

                        ))}

                    </select>

                </div>

                <br />

                <div>

                    <label>Date</label>

                    <br />

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />

                </div>

                <br />

                <div>

                    <label>Start Time</label>

                    <br />

                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />

                </div>

                <br />

                <div>

                    <label>End Time</label>

                    <br />

                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />

                </div>

                <br />

                <div>

                    <label>Maximum Patients</label>

                    <br />

                    <input
                        type="number"
                        name="maxPatients"
                        value={formData.maxPatients}
                        onChange={handleChange}
                        min="1"
                        placeholder="Example: 10"
                        required
                    />

                </div>

                <br />

                <button type="submit">
                    Create Slot
                </button>

            </form>

            {message && (
                <p>{message}</p>
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

export default AdminAddSlot;