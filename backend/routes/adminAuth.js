const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─── REGISTER ────────────────────────────────────────────────────────────────
// POST /api/admin/register
// Requires adminSecret in body — protects against unauthorized admin creation
router.post('/register', async (req, res) => {
  try {
    console.log("BODY DATA:", req.body);
    const { name, email, password, role, department, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret) {
      return res.status(400).json({ message: 'All fields including the admin code are required.' });
    }

    // Verify the secret code
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid admin registration code. Contact your system administrator.' });
    }

    if (await Admin.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role:       role || 'faculty',
      department: department || 'General'
    });

    const token = generateToken(admin._id, admin.role);

    res.status(201).json({
      message: 'Admin account created successfully!',
      token,
      admin: {
        id:         admin._id,
        name:       admin.name,
        email:      admin.email,
        role:       admin.role,
        department: admin.department
      }
    });
  } catch (err) {
    console.error('Admin register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(admin._id, admin.role);

    res.json({
      message: 'Login successful!',
      token,
      admin: {
        id:         admin._id,
        name:       admin.name,
        email:      admin.email,
        role:       admin.role,
        department: admin.department
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
