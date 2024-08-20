const express = require('express');
const { createNotification, getNotifications } = require('../Controllers/notificationsController');


const router = express.Router();

router.post('/:senderId/:recieverId',createNotification);

router.get('/:chatId',getNotifications);


module.exports = router