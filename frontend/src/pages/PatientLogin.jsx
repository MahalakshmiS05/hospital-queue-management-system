import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function PatientLogin() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();
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
                "http://localhost:5000/api/patients/login",
                formData
            );

            setMessage(response.data.message);
            navigate("/patient-dashboard");

            // Save patient details in browser
            localStorage.setItem(
                "patient",
                JSON.stringify(response.data.patient)
            );

            console.log("Patient:", response.data.patient);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div>

            <h1>Patient Login</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">
                    Login
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

        </div>
    );
}

export default PatientLogin;