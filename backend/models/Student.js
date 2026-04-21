const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name:       { type: String, required: [true, 'Name is required'], trim: true },
  prn:        { type: String, required: [true, 'PRN is required'], unique: true, trim: true, uppercase: true },
  email:      { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password:   { type: String, required: [true, 'Password is required'], minlength: 6 },
  department: { type: String, default: 'Computer Engineering' },
  createdAt:  { type: Date, default: Date.now }
});

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with hashed password
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
