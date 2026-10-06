const express = require("express");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");

const router = express.Router();


// ==========================================
// 1. Book Appointment
// ==========================================

router.post("/book", async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            slotId
        } = req.body;

        // Check patient
        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // Check doctor
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Check slot
        const slot = await Slot.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                message: "Slot not found"
            });
        }

        // Check whether slot belongs to doctor
        if (slot.doctorId.toString() !== doctorId) {
            return res.status(400).json({
                message: "This slot does not belong to the selected doctor"
            });
        }

        // Check slot capacity
        if (slot.bookedPatients >= slot.maxPatients) {
            return res.status(400).json({
                message: "This slot is full"
            });
        }

        // Generate token number
        const tokenNumber = slot.bookedPatients + 1;

        // Create appointment
        const appointment = new Appointment({
            patientId,
            doctorId,
            slotId,
            tokenNumber,
            status: "PENDING"
        });

        await appointment.save();

        // Increase booked patient count
        slot.bookedPatients += 1;

        await slot.save();

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to book appointment",
            error: error.message
        });
    }
});


router.get("/patient/:patientId", async (req, res) => {
    try {
        const appointments = await Appointment.find({
            patientId: req.params.patientId
        })
            .populate("doctorId", "name specialization roomNumber")
            .populate("slotId", "date startTime endTime maxPatients");

        res.status(200).json(appointments);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient appointments",
            error: error.message
        });
    }
});


router.get("/patient/:patientId/queue", async (req, res) => {
    try {

        // Find patient's latest active appointment
        const appointment = await Appointment.findOne({
            patientId: req.params.patientId,
            status: {
                $in: ["CONFIRMED", "WAITING", "CALLED"]
            }
        })
            .sort({ bookingDate: -1 })
            .populate("doctorId", "name specialization roomNumber")
            .populate("slotId", "date startTime endTime maxPatients");

        // If no active appointment
        if (!appointment) {
            return res.status(404).json({
                message: "No active appointment found"
            });
        }

        // Count waiting patients before this patient
        const peopleBefore = await Appointment.countDocuments({
            slotId: appointment.slotId._id,
            status: "WAITING",
            tokenNumber: {
                $lt: appointment.tokenNumber
            }
        });

        // Find currently called patient
        const currentPatient = await Appointment.findOne({
            slotId: appointment.slotId._id,
            status: "CALLED"
        })
            .sort({
                tokenNumber: 1
            });

        res.status(200).json({
            appointmentId: appointment._id,
            patientId: appointment.patientId,

            doctor: appointment.doctorId,

            slot: appointment.slotId,

            tokenNumber: appointment.tokenNumber,

            status: appointment.status,

            peopleBefore: peopleBefore,

            currentToken: currentPatient
                ? currentPatient.tokenNumber
                : null
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch queue status",
            error: error.message
        });
    }
});


module.exports = router;