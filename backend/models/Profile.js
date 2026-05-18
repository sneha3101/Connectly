const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  catchLine: {
    type: String,
    required: true,
  },
  interests: [{
    type: String,
  }],
  visibilityStatus: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', profileSchema);
