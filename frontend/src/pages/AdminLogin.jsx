import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
                "http://localhost:5000/api/admin/auth/login",
                formData
            );

            setMessage(response.data.message);

            localStorage.setItem(
                "admin",
                JSON.stringify(response.data.admin)
            );

            navigate("/admin-dashboard");

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Admin login failed"
            );

        }
    };

    return (
        <div>

            <h1>Admin Login</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <br />

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>

                    <br />

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Admin Login
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

        </div>
    );
}

export default AdminLogin;