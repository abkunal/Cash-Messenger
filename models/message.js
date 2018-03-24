/*  Message Schema and operations on message schema

 */

const mongoose = require("mongoose");


let MessageSchema = mongoose.Schema({
  subject: String,
  content: String,
  from: String,
  to: String,
  time: Date
});

let Message = module.exports = mongoose.model("Message", MessageSchema);

/*  Add a new message into the database

    newMessage: Message
 */
module.exports.addMessage = (newMessage, callback) => {
  newMessage.save(callback);
}

/*  Get all the messages sent to the user with the given username

    username: String
 */
module.exports.getAllMessagesSentToUser = (username, callback) => {
  Message.find({to: username}, {
    subject: 1,
    content: 1,
    from: 1,
    to: 1,
    time: 1,
    _id: 0
  }).exec(callback);
}