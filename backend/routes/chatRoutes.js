const express = require('express');
const {
  getChatList,
  getChatMessages,
  clearChatMessages,
  searchMessages,
  saveMessage,
} = require('../controllers/chatController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/list', auth, getChatList);
router.get('/:chatId/messages', auth, getChatMessages);
router.post('/:chatId/clear', auth, clearChatMessages);
router.delete('/:chatId/messages', auth, clearChatMessages);
router.get('/search', auth, searchMessages);
router.post('/message', auth, saveMessage);

module.exports = router;
