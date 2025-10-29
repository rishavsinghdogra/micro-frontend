const express = require('express');
const { getRoomMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/:roomId', getRoomMessages);

module.exports = router;