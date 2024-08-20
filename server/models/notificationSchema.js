const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    chatId : String,
    senderId : String ,
    recieverId : String,
    message : String ,
    isRead : Boolean,
    date : Date ,
},
{
    timestamps : true
})

module.exports = mongoose.model('Notification',notificationSchema);