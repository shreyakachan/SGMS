const express   = require('express');
const router    = express.Router();
const Complaint = require('../models/Complaint');
const { protectStudent, protectAdmin, flexAuth } = require('../middleware/auth');

// ─── GET ALL / OWN COMPLAINTS ─────────────────────────────────────────────────
// GET /api/complaints
// Admin → all complaints | Student → own complaints only
router.get('/', flexAuth, async (req, res) => {
  try {
    const filter = req.userRole === 'student' ? { student: req.user._id } : {};

    const complaints = await Complaint.find(filter)
      .populate('student', 'name prn department email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error('Fetch complaints error:', err);
    res.status(500).json({ message: 'Error fetching complaints.' });
  }
});

// ─── GET STATS ────────────────────────────────────────────────────────────────
// GET /api/complaints/stats
router.get('/stats', flexAuth, async (req, res) => {
  try {
    const filter = req.userRole === 'student' ? { student: req.user._id } : {};

    const [total, resolved, pending, underReview, closed] = await Promise.all([
      Complaint.countDocuments(filter),
      Complaint.countDocuments({ ...filter, status: 'Resolved' }),
      Complaint.countDocuments({ ...filter, status: 'Pending' }),
      Complaint.countDocuments({ ...filter, status: 'Under Review' }),
      Complaint.countDocuments({ ...filter, status: 'Closed' })
    ]);

    res.json({ total, resolved, pending, underReview, closed });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats.' });
  }
});

// ─── CREATE COMPLAINT ─────────────────────────────────────────────────────────
// POST /api/complaints
router.post('/', protectStudent, async (req, res) => {
  try {
    const { title, description, department } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      department: department || 'Academic Affairs',
      student:    req.user._id,
      status:     'Pending'
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('student', 'name prn department email');

    res.status(201).json({
      message: 'Complaint filed successfully! Our team will review it shortly.',
      complaint: populated
    });
  } catch (err) {
    console.error('Create complaint error:', err);
    res.status(500).json({ message: 'Error filing complaint.' });
  }
});

// ─── UPDATE STATUS (Admin Only) ───────────────────────────────────────────────
// PATCH /api/complaints/:id/status
router.patch('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { status, adminNote, priority } = req.body;

    const validStatuses = ['Pending', 'Under Review', 'Resolved', 'Closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const update = { updatedAt: Date.now() };
    if (status)    update.status    = status;
    if (adminNote) update.adminNote = adminNote;
    if (priority)  update.priority  = priority;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).populate('student', 'name prn department email');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });

    res.json({ message: 'Complaint updated successfully!', complaint });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Error updating complaint.' });
  }
});

// ─── DELETE COMPLAINT (Admin Only) ───────────────────────────────────────────
// DELETE /api/complaints/:id
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' });
    res.json({ message: 'Complaint deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting complaint.' });
  }
});

module.exports = router;
