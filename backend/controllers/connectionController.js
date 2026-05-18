const Connection = require('../models/Connection');
const Chat = require('../models/Chat');

// Send connection request
const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    const connection = new Connection({
      senderId,
      receiverId,
      status: 'pending',
    });

    await connection.save();

    res.status(201).json({
      message: 'Connection request sent',
      connection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending connection request', error: error.message });
  }
};

// Accept connection request
const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const userId = req.userId;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    if (connection.receiverId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    connection.status = 'accepted';
    connection.updatedAt = new Date();
    await connection.save();

    // Create a chat between the two users
    let chat = await Chat.findOne({
      users: { $all: [connection.senderId, connection.receiverId] },
    });

    if (!chat) {
      chat = new Chat({
        users: [connection.senderId, connection.receiverId],
      });
      await chat.save();
    }

    res.json({
      message: 'Connection accepted',
      connection,
      chatId: chat._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error accepting connection', error: error.message });
  }
};

// Reject connection request
const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.body;
    const userId = req.userId;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    if (connection.receiverId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    connection.status = 'rejected';
    connection.updatedAt = new Date();
    await connection.save();

    res.json({
      message: 'Connection rejected',
      connection,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rejecting connection', error: error.message });
  }
};

// Get pending connections
const getPendingConnections = async (req, res) => {
  try {
    const userId = req.userId;

    const connections = await Connection.find({
      receiverId: userId,
      status: 'pending',
    })
      .populate('senderId', 'alias interests isOnline')
      .sort({ createdAt: -1 });

    res.json({ connections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching pending connections', error: error.message });
  }
};

module.exports = {
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  getPendingConnections,
};
