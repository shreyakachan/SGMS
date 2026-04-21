const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title:       { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'], trim: true },
  department:  { type: String, default: 'Academic Affairs' },
  status:      { type: String, enum: ['Pending', 'Under Review', 'Resolved', 'Closed'], default: 'Pending' },
  priority:    { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  adminNote:   { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

complaintSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
