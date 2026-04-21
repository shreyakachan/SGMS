const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// ✅ POST - Save report
router.post('/', async (req, res) => {
    try {
        console.log("BODY RECEIVED:", req.body); // 👈 MUST print

        const report = new Report(req.body);
        await report.save();

        console.log("SAVED TO DB"); // 👈 confirm save

        res.status(201).json({ message: "Saved successfully" });
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET - Get all reports
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;