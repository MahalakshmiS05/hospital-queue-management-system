const express = require("express");
const Slot = require("../models/Slot");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Add Slot
router.post("/add", async (req, res) => {
    try {
        const {
            doctorId,
            date,
            startTime,
            endTime,
            maxPatients
        } = req.body;

        // Check whether doctor exists
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Create slot
        const slot = new Slot({
            doctorId,
            date,
            startTime,
            endTime,
            maxPatients
        });

        await slot.save();

        res.status(201).json({
            message: "Slot added successfully",
            slot
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add slot",
            error: error.message
        });
    }
});

// Get slots for a doctor
router.get("/doctor/:doctorId", async (req, res) => {
    try {
        const slots = await Slot.find({
            doctorId: req.params.doctorId
        });

        res.status(200).json(slots);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch slots",
            error: error.message
        });
    }
});

module.exports = router;