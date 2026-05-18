const express = require('express');
const { register, login, getUserProfile } = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getUserProfile);

module.exports = router;
