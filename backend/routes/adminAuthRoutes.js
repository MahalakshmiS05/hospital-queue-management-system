const express = require("express");
const Admin = require("../models/Admin");

const router = express.Router();

// Admin Login
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {

            return res.status(404).json({
                message: "Admin not found"
            });

        }

        if (admin.password !== password) {

            return res.status(401).json({
                message: "Incorrect password"
            });

        }

        res.status(200).json({

            message: "Admin login successful",

            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }

        });

    } catch (error) {

        res.status(500).json({
            message: "Admin login failed",
            error: error.message
        });

    }

});

module.exports = router;