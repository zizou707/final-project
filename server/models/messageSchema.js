const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId : String ,
    senderId : {type : String, required : true} ,
    authorName :  {type : String, required : true} ,
    messageText : String
},
{
    timestamps : true
})

module.exports = mongoose.model('Message',messageSchema);