const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();


router.get("/appointments/pending", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            status: "PENDING"
        })
            .populate("patientId", "name email phone")
            .populate("doctorId", "name specialization roomNumber")
            .populate("slotId", "date startTime endTime maxPatients");

        res.status(200).json(appointments);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch pending appointments",
            error: error.message
        });
    }
});


// ==========================================
// 2. Confirm Appointment
// ==========================================

router.put("/appointments/:appointmentId/confirm", async (req, res) => {
    try {
        const appointment = await Appointment.findById(
            req.params.appointmentId
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending appointments can be confirmed"
            });
        }

        appointment.status = "CONFIRMED";

        await appointment.save();

        res.status(200).json({
            message: "Appointment confirmed successfully",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to confirm appointment",
            error: error.message
        });
    }
});


// ==========================================
// 3. Reject Appointment
// ==========================================

router.put("/appointments/:appointmentId/reject", async (req, res) => {
    try {
        const appointment = await Appointment.findById(
            req.params.appointmentId
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending appointments can be rejected"
            });
        }

        appointment.status = "REJECTED";

        await appointment.save();

        res.status(200).json({
            message: "Appointment rejected successfully",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reject appointment",
            error: error.message
        });
    }
});


// ==========================================
// 4. Move Appointment to Waiting Queue
// ==========================================

router.put("/appointments/:appointmentId/waiting", async (req, res) => {
    try {
        const appointment = await Appointment.findById(
            req.params.appointmentId
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "CONFIRMED") {
            return res.status(400).json({
                message: "Only confirmed appointments can enter the waiting queue"
            });
        }

        appointment.status = "WAITING";

        await appointment.save();

        res.status(200).json({
            message: "Patient added to waiting queue",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add patient to queue",
            error: error.message
        });
    }
});


// ==========================================
// 5. Call Next Patient
// ==========================================

router.put("/slots/:slotId/call-next", async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            slotId: req.params.slotId,
            status: "WAITING"
        }).sort({
            tokenNumber: 1
        });

        if (!appointment) {
            return res.status(404).json({
                message: "No patients are waiting in this queue"
            });
        }

        appointment.status = "CALLED";

        await appointment.save();

        res.status(200).json({
            message: "Next patient called successfully",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to call next patient",
            error: error.message
        });
    }
});


// ==========================================
// 6. Complete Appointment
// ==========================================

router.put("/appointments/:appointmentId/complete", async (req, res) => {
    try {
        const appointment = await Appointment.findById(
            req.params.appointmentId
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "CALLED") {
            return res.status(400).json({
                message: "Only called appointments can be completed"
            });
        }

        appointment.status = "COMPLETED";

        await appointment.save();

        res.status(200).json({
            message: "Appointment completed successfully",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to complete appointment",
            error: error.message
        });
    }
});


// ==========================================
// Export Router
// ==========================================
// Get Active Queue Appointments
router.get("/appointments/active", async (req, res) => {

    try {

        const appointments = await Appointment.find({
            status: {
                $in: ["CONFIRMED", "WAITING", "CALLED"]
            }
        })
            .populate("patientId", "name email phone")
            .populate("doctorId", "name specialization roomNumber")
            .populate("slotId", "date startTime endTime maxPatients");

        res.status(200).json(appointments);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch active appointments",
            error: error.message
        });

    }

});

// Get Active Queue Appointments
router.get("/appointments/active", async (req, res) => {

    try {

        const appointments = await Appointment.find({
            status: {
                $in: ["CONFIRMED", "WAITING", "CALLED"]
            }
        })
            .populate("patientId", "name email phone")
            .populate("doctorId", "name specialization roomNumber")
            .populate("slotId", "date startTime endTime maxPatients");

        res.status(200).json(appointments);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch active appointments",
            error: error.message
        });

    }

});

module.exports = router;