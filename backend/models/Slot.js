const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    date: {
        type: String,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    maxPatients: {
        type: Number,
        required: true
    },

    bookedPatients: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Slot", slotSchema);