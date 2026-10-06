const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();

// Patient Registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, age, gender, password } = req.body;

        // Check whether email already exists
        const existingPatient = await Patient.findOne({ email });

        if (existingPatient) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Create new patient
        const patient = new Patient({
            name,
            email,
            phone,
            age,
            gender,
            password
        });

        await patient.save();

        res.status(201).json({
            message: "Patient registered successfully",
            patient
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

module.exports = router;
// Patient Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find patient by email
        const patient = await Patient.findOne({ email });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // Check password
        if (patient.password !== password) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        res.status(200).json({
            message: "Login successful",
            patient: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                age: patient.age,
                gender: patient.gender
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});