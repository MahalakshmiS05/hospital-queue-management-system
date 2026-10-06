const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot",
        required: true
    },

    tokenNumber: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "PENDING",
            "CONFIRMED",
            "REJECTED",
            "WAITING",
            "CALLED",
            "COMPLETED"
        ],
        default: "PENDING"
    },

    bookingDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);