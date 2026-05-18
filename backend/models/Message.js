const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'voice'],
    default: 'text',
  },
  messageText: {
    type: String,
    default: '',
  },
  audioUrl: {
    type: String,
    default: null,
  },
  audioMimeType: {
    type: String,
    default: null,
  },
  audioDuration: {
    type: Number,
    default: null,
  },
  messageStatus: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent',
  },
  isModerated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for chat and timestamp for efficient querying
messageSchema.index({ chatId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
