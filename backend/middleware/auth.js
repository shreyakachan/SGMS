const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin   = require('../models/Admin');

// Extract bearer token from header
const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

// Protect student routes
exports.protectStudent = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Access denied. Please log in.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'student') return res.status(403).json({ message: 'Student access required.' });

    const student = await Student.findById(decoded.id).select('-password');
    if (!student) return res.status(401).json({ message: 'Account not found.' });

    req.user     = student;
    req.userRole = 'student';
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
};

// Protect admin / faculty routes
exports.protectAdmin = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Access denied. Please log in.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!['faculty', 'super_admin'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ message: 'Admin account not found.' });

    req.user     = admin;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
};

// Flexible auth — works for both students and admins
exports.flexAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Access denied. Please log in.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'student') {
      const student = await Student.findById(decoded.id).select('-password');
      if (!student) return res.status(401).json({ message: 'Account not found.' });
      req.user     = student;
      req.userRole = 'student';
    } else if (['faculty', 'super_admin'].includes(decoded.role)) {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) return res.status(401).json({ message: 'Admin account not found.' });
      req.user     = admin;
      req.userRole = decoded.role;
    } else {
      return res.status(403).json({ message: 'Unknown role.' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
};
