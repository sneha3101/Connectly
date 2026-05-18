const express = require('express');
const {
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  getPendingConnections,
} = require('../controllers/connectionController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/send', auth, sendConnectionRequest);
router.post('/accept', auth, acceptConnection);
router.post('/reject', auth, rejectConnection);
router.get('/pending', auth, getPendingConnections);

module.exports = router;
