const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Student = require('../models/Student');

const generateToken = (id) =>
  jwt.sign({ id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── REGISTER ────────────────────────────────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, prn, email, password, department } = req.body;

    if (!name || !prn || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (await Student.findOne({ prn: prn.toUpperCase() })) {
      return res.status(400).json({ message: 'PRN is already registered.' });
    }
    if (await Student.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const student = await Student.create({
      name,
      prn,
      email,
      password,
      department: department || 'Computer Engineering'
    });

    const token = generateToken(student._id);

    res.status(201).json({
      message: 'Registration successful! Welcome to SGMS Elite.',
      token,
      student: {
        id:         student._id,
        name:       student.name,
        prn:        student.prn,
        email:      student.email,
        department: student.department
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { prn, password } = req.body;

    if (!prn || !password) {
      return res.status(400).json({ message: 'PRN and password are required.' });
    }

    const student = await Student.findOne({ prn: prn.toUpperCase() });
    if (!student) {
      return res.status(401).json({ message: 'Invalid PRN or password.' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid PRN or password.' });
    }

    const token = generateToken(student._id);

    res.json({
      message: 'Login successful!',
      token,
      student: {
        id:         student._id,
        name:       student.name,
        prn:        student.prn,
        email:      student.email,
        department: student.department
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
