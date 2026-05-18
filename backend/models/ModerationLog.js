const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
  result: {
    type: String,
    enum: ['safe', 'flagged', 'blocked'],
    default: 'safe',
  },
  reason: {
    type: String,
    default: null,
  },
  checkedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ModerationLog', moderationLogSchema);
