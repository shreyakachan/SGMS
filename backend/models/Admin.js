const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name:       { type: String, required: [true, 'Name is required'], trim: true },
  email:      { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password:   { type: String, required: [true, 'Password is required'], minlength: 6 },
  role:       { type: String, enum: ['faculty', 'super_admin'], default: 'faculty' },
  department: { type: String, default: 'General' },
  createdAt:  { type: Date, default: Date.now }
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
