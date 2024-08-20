const Message = require('../models/messageSchema');

// create message

const createMessage = async (req, res) => {
    const {chatId,senderId,authorName,messageText} = req.body;

    const message = new Message({chatId,senderId,authorName,messageText})

   try {
    const response =await message.save()
    res.status(200).json(response)
   } 
   catch (error) {
     console.log(error);
     res.status(500).json(error)
   }
}

// get messages

const getMessages = async (req,res) => {
    const {chatId} = req.params;
    try {
        const messages = await Message.find({chatId})
           res.status(200).json(messages)
       } 
       catch (error) {
         console.log(error);
         res.status(500).json(error)
       }
}

module.exports = {createMessage , getMessages} ;