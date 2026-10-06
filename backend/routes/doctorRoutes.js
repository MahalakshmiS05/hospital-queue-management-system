const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Add Doctor
router.post("/add", async (req, res) => {
    try {
        const {
            name,
            specialization,
            roomNumber
        } = req.body;

        const doctor = new Doctor({
            name,
            specialization,
            roomNumber
        });

        await doctor.save();

        res.status(201).json({
            message: "Doctor added successfully",
            doctor
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add doctor",
            error: error.message
        });
    }
});

// Get all doctors
router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find();

        res.status(200).json(doctors);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctors",
            error: error.message
        });
    }
});

module.exports = router;