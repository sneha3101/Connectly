const express = require('express');
const { upsertProfile, getProfile, getAllPublicProfiles } = require('../controllers/profileController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/upsert', auth, upsertProfile);
router.get('/:userId', auth, getProfile);
router.get('/', auth, getAllPublicProfiles);

module.exports = router;
