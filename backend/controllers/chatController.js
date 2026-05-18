const Chat = require('../models/Chat');
const Message = require('../models/Message');
const ModerationLog = require('../models/ModerationLog');
const { checkMessageSafety } = require('../utils/moderationUtils');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const voiceUploadDir = path.join(__dirname, '..', 'uploads', 'voice-notes');

const saveVoiceNote = async (audioData) => {
  const match = /^data:(audio\/[a-z0-9.+-]+(?:;[a-z0-9=.+-]+)*);base64,(.+)$/i.exec(audioData || '');

  if (!match) {
    throw new Error('Invalid voice note format');
  }

  const [, rawAudioMimeType, base64Audio] = match;
  const audioMimeType = rawAudioMimeType.split(';')[0].toLowerCase();
  const extension = audioMimeType.includes('webm') ? 'webm'
    : audioMimeType.includes('mp4') ? 'mp4'
      : audioMimeType.includes('mpeg') ? 'mp3'
        : 'ogg';
  const audioBuffer = Buffer.from(base64Audio, 'base64');

  if (audioBuffer.length > 5 * 1024 * 1024) {
    throw new Error('Voice note is too large');
  }

  await fs.promises.mkdir(voiceUploadDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${extension}`;
  const filePath = path.join(voiceUploadDir, filename);
  await fs.promises.writeFile(filePath, audioBuffer);

  return {
    audioMimeType,
    audioUrl: `/uploads/voice-notes/${filename}`,
  };
};

// Get chat list for user
const getChatList = async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await Chat.find({ users: userId })
      .populate('users', 'alias isOnline')
      .sort({ updatedAt: -1 });

    res.json({ chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
};

// Get chat messages
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { skip = 0, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messages = await Message.find({ chatId })
      .populate('senderId', 'alias')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Clear all messages in a chat for the authenticated user
const clearChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    const chat = await Chat.findOne({ _id: chatId, users: userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const result = await Message.deleteMany({ chatId });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: null,
      lastMessageTime: null,
      updatedAt: new Date(),
    });

    res.json({ message: 'Chat history cleared', deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error clearing chat history', error: error.message });
  }
};

// Search messages in a chat
const searchMessages = async (req, res) => {
  try {
    const { chatId, query } = req.query;

    const messages = await Message.find({
      chatId,
      messageText: { $regex: query, $options: 'i' },
    })
      .populate('senderId', 'alias')
      .sort({ createdAt: -1 });

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching messages', error: error.message });
  }
};

// Save message and perform moderation
const saveMessage = async (req, res) => {
  try {
    const {
      chatId,
      receiverId,
      messageText = '',
      messageType = 'text',
      audioData,
      audioDuration,
    } = req.body;
    const senderId = req.userId;
    const trimmedText = messageText.trim();

    if (messageType === 'text' && !trimmedText) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    let voiceNote = {};

    if (messageType === 'voice') {
      if (!audioData) {
        return res.status(400).json({ message: 'Voice note audio is required' });
      }

      voiceNote = await saveVoiceNote(audioData);
    }

    // Check message safety
    const safetyCheck = messageType === 'text'
      ? checkMessageSafety(trimmedText)
      : { isSafe: true, reason: null };

    const message = new Message({
      chatId,
      senderId,
      receiverId,
      messageType,
      messageText: messageType === 'text' ? trimmedText : 'Voice note',
      audioUrl: voiceNote.audioUrl,
      audioMimeType: voiceNote.audioMimeType,
      audioDuration: audioDuration || null,
      messageStatus: 'sent',
      isModerated: !safetyCheck.isSafe,
    });

    await message.save();

    if (messageType === 'text') {
      // Log moderation result
      const modLog = new ModerationLog({
        messageId: message._id,
        result: safetyCheck.isSafe ? 'safe' : 'flagged',
        reason: safetyCheck.reason,
      });

      await modLog.save();
    }

    // Update chat's last message
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: messageType === 'voice' ? 'Voice note' : trimmedText.substring(0, 100),
      lastMessageTime: new Date(),
      updatedAt: new Date(),
    });

    await message.populate('senderId', 'alias');

    res.status(201).json({
      message,
      moderation: {
        isSafe: safetyCheck.isSafe,
        reason: safetyCheck.reason,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving message', error: error.message });
  }
};

module.exports = {
  getChatList,
  getChatMessages,
  clearChatMessages,
  searchMessages,
  saveMessage,
};
