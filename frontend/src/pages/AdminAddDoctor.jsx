import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAddDoctor() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        roomNumber: ""
    });

    const [message, setMessage] = useState("");

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
                "http://localhost:5000/api/doctors/add",
                formData
            );

            setMessage(response.data.message);

            setFormData({
                name: "",
                specialization: "",
                roomNumber: ""
            });

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Failed to add doctor"
            );

        }
    };

    return (
        <div>

            <h1>Add Doctor</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Doctor Name</label>
                    <br />

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter doctor name"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Specialization</label>
                    <br />

                    <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="Example: Cardiology"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Room Number</label>
                    <br />

                    <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        placeholder="Example: 101"
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Add Doctor
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

            <br />

            <button onClick={() => navigate("/admin-dashboard")}>
                Back to Admin Dashboard
            </button>

        </div>
    );
}

export default AdminAddDoctor;