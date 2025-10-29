const express = require('express');
const { getRooms, createRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getRooms);
router.post('/', createRoom);

module.exports = router;