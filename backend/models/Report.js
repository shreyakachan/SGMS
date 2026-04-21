const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    type: String,
    description: String,
    isAnonymous: Boolean,
    email: String,
    trackingId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);