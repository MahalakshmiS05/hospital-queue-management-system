import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (
        <div style={{
            textAlign: "center",
            padding: "50px"
        }}>

            <h1>Hospital Queue Management System</h1>

            <h2>Welcome to Our Hospital</h2>

            <br />

            <div>
                <h2>👤 Patient</h2>

                <button onClick={() => navigate("/login")}>
                    Patient Login
                </button>

                {" "}

                <button onClick={() => navigate("/register")}>
                    Patient Register
                </button>
            </div>

            <br />

            <hr />

            <br />

            <div>
                <h2>🔐 Admin</h2>

                <button onClick={() => navigate("/admin-login")}>
                    Admin Login
                </button>
            </div>

        </div>
    );
}

export default Home;